import { Sequelize } from 'sequelize';
import { REPORT_DB_SCHEMAS, SYNC_DIRECTIONS } from '@tamanu/constants';
import { Model } from './Model';

export class ReportDefinition extends Model {
  static init({ primaryKey, ...options }) {
    super.init(
      {
        id: primaryKey,
        name: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        },
        dbSchema: {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: REPORT_DB_SCHEMAS.REPORTING,
          validate: {
            isIn: [Object.values(REPORT_DB_SCHEMAS)],
          },
        },
      },
      {
        ...options,
        indexes: [{ unique: true, fields: ['name'] }],
        syncDirection: SYNC_DIRECTIONS.BIDIRECTIONAL,
      },
    );
  }

  static initRelations(models) {
    this.hasMany(models.ReportDefinitionVersion, { as: 'versions' });
  }

  static buildSyncFilter() {
    return null; // syncs everywhere
  }
}
