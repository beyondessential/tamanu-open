import supertest from 'supertest';
import Chance from 'chance';
import http from 'http';

import { seedDepartments, seedFacilities, seedLocations, seedLabTests } from 'shared/demoData';

import { createApp } from 'lan/app/createApp';
import { initDatabase, closeDatabase } from 'lan/app/database';
import { getToken } from 'lan/app/middleware/auth';

import { toMatchTabularReport } from './toMatchTabularReport';
import { allSeeds } from './seed';
import { deleteAllTestIds } from './setupUtilities';

import { SyncManager } from '../app/sync/SyncManager';
import { WebRemote } from '../app/sync/WebRemote';

jest.mock('../app/sync/WebRemote');
jest.mock('../app/utils/uploadAttachment');

const chance = new Chance();

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

export async function createTestContext() {
  const dbResult = await initDatabase();
  const { models, sequelize } = dbResult;

  // do NOT time out during create context
  jest.setTimeout(1000 * 60 * 60 * 24);

  // sync db and remove old test data
  await sequelize.sync();
  await deleteAllTestIds(dbResult);

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

  const expressApp = createApp(dbResult);
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

  jest.setTimeout(30 * 1000); // more generous than the default 5s but not crazy

  const remote = new WebRemote();

  const context = { baseApp, sequelize, models, remote };

  context.syncManager = new SyncManager(context);

  const close = async () => {
    await new Promise(resolve => appServer.close(resolve));
    await closeDatabase();
  };

  return { ...context, close };
}
