import supertest from 'supertest';
import Chance from 'chance';

import { createApp } from 'lan/app/createApp';
import { initDatabase } from 'lan/app/database';
import { getToken } from 'lan/app/middleware/auth';

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
  });
}

export function createTestContext() {
  const dbResult = initDatabase({
    testMode: true,
  });
  const { models, sequelize } = dbResult;

  const expressApp = createApp(dbResult);

  const baseApp = supertest(expressApp);

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

  return { baseApp, sequelize, models };
}
