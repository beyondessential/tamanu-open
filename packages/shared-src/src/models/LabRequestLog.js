import { Sequelize } from 'sequelize';

import { LAB_REQUEST_STATUSES, SYNC_DIRECTIONS } from 'shared/constants';
import { Model } from './Model';

const LAB_REQUEST_STATUS_VALUES = Object.values(LAB_REQUEST_STATUSES);

/** Holds a record of a lab requests status at a specific point in time */
export class LabRequestLog extends Model {
  static init({ primaryKey, ...options }) {
    super.init(
      {
        id: primaryKey,
        status: Sequelize.ENUM(LAB_REQUEST_STATUS_VALUES),
      },
      {
        ...options,
        syncConfig: {
          syncDirection: SYNC_DIRECTIONS.BIDIRECTIONAL,
          channelRoutes: [
            {
              route: 'labRequest/:labRequestId/log',
              params: [{ name: 'labRequestId' }],
            },
          ],
          getChannels: async () =>
            this.sequelize.models.LabRequest.findAll({
              where: {},
              attributes: ['id'],
            }).map(lr => `labRequest/${lr.id}/log`),
        },
      },
    );
  }

  static initRelations(models) {
    this.belongsTo(models.LabRequest, {
      foreignKey: 'labRequestId',
      as: 'labRequest',
    });

    this.belongsTo(models.User, {
      foreignKey: 'updatedById',
      as: 'updatedBy',
    });
  }

  static getListReferenceAssociations() {
    return ['labRequest', 'updatedBy'];
  }
}
