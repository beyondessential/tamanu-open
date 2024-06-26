import config from 'config';
import { Op, Sequelize } from 'sequelize';

import { ENCOUNTER_TYPES, SYNC_DIRECTIONS } from '@tamanu/constants';
import { InvalidOperationError } from '../errors';

import { Model } from './Model';
import { buildEncounterLinkedSyncFilter } from './buildEncounterLinkedSyncFilter';
import { dateTimeType } from './dateTimeTypes';

export class Triage extends Model {
  static init({ primaryKey, ...options }) {
    super.init(
      {
        id: primaryKey,
        arrivalTime: dateTimeType('arrivalTime'),
        triageTime: dateTimeType('triageTime'),
        closedTime: dateTimeType('closedTime'),
        score: Sequelize.TEXT,
      },
      { syncDirection: SYNC_DIRECTIONS.BIDIRECTIONAL, ...options },
    );
  }

  static initRelations(models) {
    this.belongsTo(models.Encounter, {
      foreignKey: 'encounterId',
      as: 'encounter',
    });

    this.belongsTo(models.User, {
      as: 'Practitioner',
      foreignKey: 'practitionerId',
    });

    this.belongsTo(models.ReferenceData, {
      foreignKey: 'chiefComplaintId',
    });

    this.belongsTo(models.ReferenceData, {
      foreignKey: 'secondaryComplaintId',
    });

    this.belongsTo(models.ReferenceData, {
      foreignKey: 'arrivalModeId',
      as: 'arrivalMode',
    });

    this.hasMany(models.Note, {
      foreignKey: 'recordId',
      as: 'notes',
      constraints: false,
      scope: {
        recordType: this.name,
      },
    });
  }

  static buildPatientSyncFilter(patientIds) {
    if (patientIds.length === 0) {
      return null;
    }
    return buildEncounterLinkedSyncFilter([this.tableName, 'encounters']);
  }

  static async create(data) {
    const { Department, Encounter, ReferenceData } = this.sequelize.models;

    const existingEncounter = await Encounter.findOne({
      where: {
        endDate: {
          [Op.is]: null,
        },
        patientId: data.patientId,
      },
    });

    if (existingEncounter) {
      throw new InvalidOperationError("Can't triage a patient that has an existing encounter");
    }

    const reasons = await Promise.all(
      [data.chiefComplaintId, data.secondaryComplaintId].map(x => ReferenceData.findByPk(x)),
    );

    const reasonsText = reasons
      .filter(x => x)
      .map(x => x.name)
      .join(' and ');
    const reasonForEncounter = `Presented at emergency department with ${reasonsText}`;

    let { departmentId } = data;
    if (!departmentId) {
      const department = await Department.findOne({
        where: { name: 'Emergency', facilityId: config.serverFacilityId },
      });

      if (!department) {
        throw new Error('Cannot find Emergency department for current facility');
      }

      // eslint-disable-next-line require-atomic-updates
      departmentId = department.id;
    }

    return this.sequelize.transaction(async () => {
      const encounter = await Encounter.create({
        encounterType: ENCOUNTER_TYPES.TRIAGE,
        startDate: data.triageTime,
        reasonForEncounter,
        patientId: data.patientId,
        departmentId,
        locationId: data.locationId,
        examinerId: data.practitionerId,
        actorId: data.actorId,
      });

      return super.create({
        ...data,
        encounterId: encounter.id,
      });
    });
  }
}
