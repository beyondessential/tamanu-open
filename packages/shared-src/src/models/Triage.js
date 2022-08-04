import { ENCOUNTER_TYPES } from 'shared/constants';
import { Sequelize, Op } from 'sequelize';
import { InvalidOperationError } from 'shared/errors';
import { Model } from './Model';

export class Triage extends Model {
  static init({ primaryKey, ...options }) {
    super.init(
      {
        id: primaryKey,

        arrivalTime: Sequelize.DATE,
        triageTime: Sequelize.DATE,
        closedTime: Sequelize.DATE,

        score: Sequelize.TEXT,
      },
      options,
    );
  }

  static initRelations(models) {
    this.belongsTo(models.Encounter, {
      foreignKey: 'encounterId',
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

    this.hasMany(models.Note, {
      foreignKey: 'recordId',
      as: 'notes',
      constraints: false,
      scope: {
        recordType: this.name,
      },
    });
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

    const department = await Department.findOne({ where: { name: 'Emergency' } });

    return this.sequelize.transaction(async () => {
      const encounter = await Encounter.create({
        encounterType: ENCOUNTER_TYPES.TRIAGE,
        startDate: data.triageTime || new Date(),
        reasonForEncounter,
        patientId: data.patientId,
        departmentId: data.departmentId || department.dataValues.id,
        locationId: data.locationId,
        examinerId: data.practitionerId,
      });

      return super.create({
        ...data,
        encounterId: encounter.id,
      });
    });
  }
}
