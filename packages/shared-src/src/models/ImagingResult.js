import { Sequelize, DataTypes } from 'sequelize';

import { InvalidOperationError } from 'shared/errors';
import { SYNC_DIRECTIONS } from 'shared/constants';

import { Model } from './Model';
import { buildEncounterLinkedSyncFilter } from './buildEncounterLinkedSyncFilter';
import { dateTimeType } from './dateTimeTypes';
import { getCurrentDateTimeString } from '../utils/dateTime';

export class ImagingResult extends Model {
  static init(options) {
    super.init(
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          primaryKey: true,
          defaultValue: Sequelize.fn('uuid_generate_v4'),
        },
        visibilityStatus: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: 'current',
        },
        completedAt: dateTimeType('completedAt', {
          allowNull: false,
          defaultValue: getCurrentDateTimeString,
        }),
        description: {
          type: DataTypes.TEXT,
        },
        externalCode: DataTypes.TEXT,
      },
      {
        ...options,
        syncDirection: SYNC_DIRECTIONS.BIDIRECTIONAL,
        validate: {
          mustHaveImagingRequest() {
            if (!this.imagingRequestId) {
              throw new InvalidOperationError(
                'An imaging result must be associated with an imaging request.',
              );
            }
          },
        },
      },
    );
  }

  static getListReferenceAssociations() {
    return ['request', 'completedBy'];
  }

  static initRelations(models) {
    this.belongsTo(models.ImagingRequest, {
      foreignKey: 'imagingRequestId',
      as: 'request',
    });

    this.belongsTo(models.User, {
      foreignKey: 'completedById',
      as: 'completedBy',
    });
  }

  static buildSyncFilter(patientIds) {
    if (patientIds.length === 0) {
      return null;
    }
    return buildEncounterLinkedSyncFilter([this.tableName, 'imaging_requests', 'encounters']);
  }
}
