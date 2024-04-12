import { Sequelize } from 'sequelize';

import { SYNC_DIRECTIONS } from '@tamanu/constants';
import { Model } from './Model';
import { dateTimeType } from './dateTimeTypes';
import { getCurrentDateTimeString } from '../utils/dateTime';
import { buildEncounterLinkedSyncFilter } from './buildEncounterLinkedSyncFilter';

export class EncounterHistory extends Model {
  static init({ primaryKey, ...options }) {
    super.init(
      {
        id: primaryKey,
        encounterType: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        changeType: {
          type: Sequelize.STRING,
        },
        date: dateTimeType('date', {
          allowNull: false,
          defaultValue: getCurrentDateTimeString,
        }),
      },
      {
        ...options,
        tableName: 'encounter_history',
        syncDirection: SYNC_DIRECTIONS.BIDIRECTIONAL,
      },
    );
  }

  static initRelations(models) {
    this.belongsTo(models.Encounter, {
      foreignKey: 'encounterId',
      as: 'encounter',
    });

    this.belongsTo(models.User, {
      foreignKey: 'examinerId',
      as: 'examiner',
    });

    this.belongsTo(models.Location, {
      foreignKey: 'locationId',
      as: 'location',
    });

    this.belongsTo(models.Department, {
      foreignKey: 'departmentId',
      as: 'department',
    });

    this.belongsTo(models.User, {
      foreignKey: 'actorId',
      as: 'actor',
    });
  }

  static async createSnapshot(encounter, { actorId, changeType, submittedTime }) {
    return EncounterHistory.create({
      encounterId: encounter.id,
      encounterType: encounter.encounterType,
      locationId: encounter.locationId,
      departmentId: encounter.departmentId,
      examinerId: encounter.examinerId,
      actorId,
      changeType,
      date: submittedTime || getCurrentDateTimeString(),
    });
  }

  static buildPatientSyncFilter(patientIds) {
    if (patientIds.length === 0) {
      return null;
    }
    return buildEncounterLinkedSyncFilter([this.tableName, 'encounters']);
  }
}
