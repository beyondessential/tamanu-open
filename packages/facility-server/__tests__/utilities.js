import 'jest-expect-message';
import supertest from 'supertest';
import config from 'config';
import http from 'http';

import {
  createMockReportingSchemaAndRoles,
  seedDepartments,
  seedFacilities,
  seedLabTests,
  seedLocationGroups,
  seedLocations,
} from '@tamanu/shared/demoData';
import { chance, fake, showError } from '@tamanu/shared/test-helpers';

import { createApp } from '../dist/createApp';
import { initReporting } from '../dist/database';
import { getToken } from '../dist/middleware/auth';

import { toMatchTabularReport } from './toMatchTabularReport';
import { allSeeds } from './seed';
import { deleteAllTestIds } from './setupUtilities';

import { FacilitySyncManager } from '../dist/sync/FacilitySyncManager';
import { CentralServerConnection } from '../dist/sync/CentralServerConnection';
import { ApplicationContext } from '../dist/ApplicationContext';

jest.mock('../dist/sync/CentralServerConnection');
jest.mock('../dist/utils/uploadAttachment');

const formatError = response => `

Error details:
${JSON.stringify(response.body.error, null, 2)}
`;

export function extendExpect(expect) {
  expect.extend({
    toBeForbidden(response) {
      const { statusCode } = response;
      const pass = statusCode === 403;
      if (pass) {
        return {
          message: () =>
            `Expected not forbidden (!== 403), got ${statusCode}. ${formatError(response)}`,
          pass,
        };
      }
      return {
        message: () => `Expected forbidden (403), got ${statusCode}. ${formatError(response)}`,
        pass,
      };
    },
    toHaveRequestError(response) {
      const { statusCode } = response;
      const pass = statusCode >= 400 && statusCode < 500 && statusCode !== 403;
      if (pass) {
        return {
          message: () =>
            `Expected no error status code, got ${statusCode}. ${formatError(response)}`,
          pass,
        };
      }
      return {
        message: () => `Expected error status code, got ${statusCode}. ${formatError(response)}`,
        pass,
      };
    },
    toHaveSucceeded(response) {
      const { statusCode } = response;
      const pass = statusCode < 400;
      if (pass) {
        return {
          message: () => `Expected failure status code, got ${statusCode}.`,
          pass,
        };
      }
      return {
        message: () => `Expected success status code, got ${statusCode}. ${formatError(response)}`,
        pass,
      };
    },
    toHaveStatus(response, status) {
      const { statusCode } = response;
      const pass = statusCode === status;
      if (pass) {
        return {
          message: () => `Expected status code ${status}, got ${statusCode}.`,
          pass,
        };
      }
      return {
        message: () =>
          `Expected status code ${status}, got ${statusCode}. ${formatError(response)}`,
        pass,
      };
    },
    toMatchTabularReport(receivedReport, expectedData, options) {
      return toMatchTabularReport(this, receivedReport, expectedData, options);
    },
  });
}

export async function createTestContext({ enableReportInstances } = {}) {
  const context = await new ApplicationContext().init();
  // create mock reporting schema + roles if test requires it
  // init reporting instances for these roles
  if (enableReportInstances) {
    await createMockReportingSchemaAndRoles(context);
    context.reportSchemaStores = await initReporting();
  }

  const { models, sequelize } = context;

  // do NOT time out during create context
  jest.setTimeout(1000 * 60 * 60 * 24);

  await sequelize.migrate('up');

  await showError(deleteAllTestIds(context));

  // populate with reference data
  const tasks = allSeeds
    .map(d => ({ code: d.name, ...d }))
    .map(d => models.ReferenceData.create(d));
  await Promise.all(tasks);

  // Order here is important, as some models depend on others
  await seedLabTests(models);
  await seedFacilities(models);
  await seedDepartments(models);
  await seedLocations(models);
  await seedLocationGroups(models);

  // Create the facility for the current config if it doesn't exist
  const [facility] = await models.Facility.findOrCreate({
    where: {
      id: config.serverFacilityId,
    },
    defaults: {
      code: 'TEST',
      name: 'Test Facility',
    },
  });

  // ensure there's a corresponding local system fact for it too
  await models.LocalSystemFact.set('facilityId', facility.id);

  context.syncManager = new FacilitySyncManager(context);

  const expressApp = createApp(context);
  const appServer = http.createServer(expressApp);
  const baseApp = supertest(appServer);

  baseApp.asUser = async user => {
    const agent = supertest.agent(expressApp);
    const token = await getToken(user, '1d');
    agent.set('authorization', `Bearer ${token}`);
    agent.user = user;
    return agent;
  };

  baseApp.asRole = async role => {
    const newUser = await models.User.create({
      email: chance.email(),
      displayName: chance.name(),
      password: chance.string(),
      role,
    });

    return baseApp.asUser(newUser);
  };

  baseApp.asNewRole = async (permissions = [], roleOverrides = {}) => {
    const { Role, Permission } = models;
    const role = await Role.create(fake(Role), roleOverrides);
    const app = await baseApp.asRole(role.id);
    app.role = role;
    await Permission.bulkCreate(
      permissions.map(([verb, noun, objectId]) => ({
        roleId: role.id,
        userId: app.user.id,
        verb,
        noun,
        objectId,
      })),
    );
    return app;
  };

  jest.setTimeout(30 * 1000); // more generous than the default 5s but not crazy

  const centralServer = new CentralServerConnection({ deviceId: 'test' });

  context.onClose(async () => {
    await new Promise(resolve => { appServer.close(resolve); });
  });

  context.centralServer = centralServer;
  context.baseApp = baseApp;

  return context;
}
