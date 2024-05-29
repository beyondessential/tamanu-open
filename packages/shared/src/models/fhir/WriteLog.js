import { Sequelize } from 'sequelize';
import jp from 'jsonpath';

import {
  HTTP_BODY_DATA_PATHS,
  SCRUBBED_DATA_MESSAGE,
  SYNC_DIRECTIONS,
} from '@tamanu/constants';
import { Model } from '../Model';

export class FhirWriteLog extends Model {
  static init(options) {
    super.init(
      {
        id: {
          type: Sequelize.UUID,
          allowNull: false,
          defaultValue: Sequelize.fn('uuid_generate_v4'),
          primaryKey: true,
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW,
        },
        verb: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        url: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        body: {
          type: Sequelize.JSONB,
          allowNull: false,
          defaultValue: {},
        },
        headers: {
          type: Sequelize.JSONB,
          allowNull: false,
          defaultValue: {},
        },
      },
      {
        ...options,
        syncDirection: SYNC_DIRECTIONS.DO_NOT_SYNC,
        schema: 'logs',
        tableName: 'fhir_writes',
        timestamps: false,
      },
    );
  }

  static initRelations(models) {
    this.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'userId',
      allowNull: true,
    });
  }

  /**
   * @param {import('express').Request} req
   */
  static fromRequest(req) {
    const scrubbedBody = scrubber(JSON.stringify(req.body));
    return this.create({
      verb: req.method,
      url: req.originalUrl,
      body: scrubbedBody,
      headers: filterHeaders(req.headers),
      userId: req.user?.id,
    });
  }
}

/**
 * @param {import('express').Request['headers']} headers
 */
function filterHeaders(headers) {
  return Object.fromEntries(
    Object.entries(headers).filter(
      ([key]) =>
        key.startsWith('if-') ||
        key.startsWith('x-') ||
        ['accept', 'client-timezone', 'content-type', 'prefer', 'user-agent'].includes(key),
    ),
  );
}

/**
 * @param {import('express').Request['body']} body JSON String
*/
function scrubber(body) {
  const newBody = JSON.parse(body); // we don't want to change the original request
  return Object.values(HTTP_BODY_DATA_PATHS).reduce(
    (currentBody, path) => {
      jp.apply(currentBody, path, () => SCRUBBED_DATA_MESSAGE);
      return currentBody;
    },
    newBody,
  );
}
