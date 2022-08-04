import { Sequelize } from 'sequelize';
import moment from 'moment';
import config from 'config';

import { ENCOUNTER_TYPES, ENCOUNTER_TYPE_VALUES, NOTE_TYPES } from 'shared/constants';
import { InvalidOperationError } from 'shared/errors';

import { initSyncForModelNestedUnderPatient } from './sync';
import { Model } from './Model';

export class Encounter extends Model {
  static init({ primaryKey, hackToSkipEncounterValidation, ...options }) {
    let validate = {};
    if (!hackToSkipEncounterValidation) {
      validate = {
        mustHaveValidEncounterType() {
          if (!this.deletedAt && !ENCOUNTER_TYPE_VALUES.includes(this.encounterType)) {
            throw new InvalidOperationError('An encounter must have a valid encounter type.');
          }
        },
        mustHavePatient() {
          if (!this.deletedAt && !this.patientId) {
            throw new InvalidOperationError('An encounter must have a patient.');
          }
        },
        mustHaveDepartment() {
          if (!this.deletedAt && !this.departmentId) {
            throw new InvalidOperationError('An encounter must have a department.');
          }
        },
        mustHaveLocation() {
          if (!this.deletedAt && !this.locationId) {
            throw new InvalidOperationError('An encounter must have a location.');
          }
        },
        mustHaveExaminer() {
          if (!this.deletedAt && !this.examinerId) {
            throw new InvalidOperationError('An encounter must have an examiner.');
          }
        },
      };
    }
    const nestedSyncConfig = initSyncForModelNestedUnderPatient(this, 'encounter');
    const syncConfig = {
      includedRelations: [
        'administeredVaccines',
        'surveyResponses',
        'surveyResponses.answers',
        'diagnoses',
        'medications',
        'labRequests',
        'labRequests.tests',
        'labRequests.notes',
        'imagingRequests',
        'imagingRequests.notes',
        'procedures',
        'initiatedReferrals',
        'completedReferrals',
        'vitals',
        'discharge',
        'triages',
        'triages.notes',
        'invoice',
        'invoice.invoiceLineItems',
        'invoice.invoicePriceChangeItems',
        'documents',
        'notes',
      ],
      ...nestedSyncConfig,
      channelRoutes: [
        ...nestedSyncConfig.channelRoutes,
        {
          route: 'labRequest/all/encounter',
          mustMatchRecord: false,
          queryFromParams: () => ({
            where: {},
            include: [
              {
                association: 'labRequests',
                required: true,
                duplicating: false,
                attributes: [],
              },
            ],
          }),
        },
        {
          route: 'scheduledVaccine/:scheduledVaccineId/encounter',
          mustMatchRecord: false,
          queryFromParams: ({ scheduledVaccineId }) => {
            if (typeof scheduledVaccineId !== 'string') {
              throw new Error(
                `Encounter queryFromParams: expected scheduledVaccineId to be a string, got ${scheduledVaccineId}`,
              );
            }
            return {
              where: {},
              include: {
                association: 'administeredVaccines',
                required: true,
                duplicating: false,
                attributes: [],
                where: { scheduledVaccineId },
              },
            };
          },
        },
      ],
      getChannels: async patientId => {
        // query patient channels and localisation in parallel
        const [nestedChannels, localisation] = await Promise.all([
          nestedSyncConfig.getChannels(patientId),
          this.sequelize.models.UserLocalisationCache.getLocalisation({
            include: {
              association: 'user',
              required: true,
              where: {
                email: config.sync.email,
              },
            },
          }),
        ]);

        // patient channels
        const channels = [...nestedChannels];

        // lab requests
        if (config.sync.syncAllLabRequests) {
          channels.push('labRequest/all/encounter');
        }

        // scheduled vaccines
        const scheduledVaccineIdsToSync =
          localisation?.sync?.syncAllEncountersForTheseScheduledVaccines || [];
        for (const scheduledVaccineId of scheduledVaccineIdsToSync) {
          channels.push(`scheduledVaccine/${scheduledVaccineId}/encounter`);
        }

        return channels;
      },
    };
    super.init(
      {
        id: primaryKey,
        encounterType: Sequelize.STRING(31),
        startDate: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        endDate: Sequelize.DATE,
        reasonForEncounter: Sequelize.TEXT,
        deviceId: Sequelize.TEXT,
      },
      {
        ...options,
        validate,
        syncConfig,
      },
    );
  }

  static getFullReferenceAssociations() {
    return [
      'vitals',
      'department',
      'examiner',
      {
        association: 'location',
        include: ['facility'],
      },
    ];
  }

  static initRelations(models) {
    this.hasOne(models.Discharge, {
      foreignKey: 'encounterId',
      as: 'discharge',
    });

    this.hasOne(models.Invoice, {
      foreignKey: 'encounterId',
      as: 'invoice',
    });

    this.belongsTo(models.Patient, {
      foreignKey: 'patientId',
      as: 'patient',
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

    this.hasMany(models.SurveyResponse, {
      foreignKey: 'encounterId',
      as: 'surveyResponses',
    });

    this.hasMany(models.Referral, {
      foreignKey: 'initiatingEncounterId',
      as: 'initiatedReferrals',
    });
    this.hasMany(models.Referral, {
      foreignKey: 'completingEncounterId',
      as: 'completedReferrals',
    });

    this.hasMany(models.AdministeredVaccine, {
      foreignKey: 'encounterId',
      as: 'administeredVaccines',
    });

    this.hasMany(models.EncounterDiagnosis, {
      foreignKey: 'encounterId',
      as: 'diagnoses',
    });

    this.hasMany(models.EncounterMedication, {
      foreignKey: 'encounterId',
      as: 'medications',
    });

    this.hasMany(models.LabRequest, {
      foreignKey: 'encounterId',
      as: 'labRequests',
    });

    this.hasMany(models.ImagingRequest, {
      foreignKey: 'encounterId',
      as: 'imagingRequests',
    });

    this.hasMany(models.Procedure, {
      foreignKey: 'encounterId',
      as: 'procedures',
    });

    this.hasMany(models.Vitals, {
      foreignKey: 'encounterId',
      as: 'vitals',
    });

    this.hasMany(models.Triage, {
      foreignKey: 'encounterId',
      as: 'triages',
    });

    this.hasMany(models.DocumentMetadata, {
      foreignKey: 'encounterId',
      as: 'documents',
    });

    this.belongsTo(models.ReferenceData, {
      foreignKey: 'patientBillingTypeId',
      as: 'patientBillingType',
    });

    this.hasMany(models.Note, {
      foreignKey: 'recordId',
      as: 'notes',
      constraints: false,
      scope: {
        recordType: this.name,
      },
    });

    // this.hasMany(models.Procedure);
    // this.hasMany(models.Report);
  }

  static checkNeedsAutoDischarge({ encounterType, startDate, endDate }) {
    return (
      encounterType === ENCOUNTER_TYPES.CLINIC &&
      moment(startDate).isBefore(new Date(), 'day') &&
      !endDate
    );
  }

  static getAutoDischargeEndDate({ startDate }) {
    return moment(startDate)
      .endOf('day')
      .toDate();
  }

  static sanitizeForSyncServer(values) {
    // if the encounter is for an outpatient and started before today, it should be closed
    if (this.checkNeedsAutoDischarge(values)) {
      return { ...values, endDate: this.getAutoDischargeEndDate(values) };
    }
    return values;
  }

  async addSystemNote(content) {
    const note = await this.createNote({
      noteType: NOTE_TYPES.SYSTEM,
      content,
    });

    return note;
  }

  async getLinkedTriage() {
    const { Triage } = this.sequelize.models;
    return Triage.findOne({
      where: {
        encounterId: this.id,
      },
    });
  }

  async onDischarge(endDate, note) {
    await this.addSystemNote(note || `Discharged patient.`);
    await this.closeTriage(endDate);
  }

  async onEncounterProgression(newEncounterType) {
    await this.addSystemNote(`Changed type from ${this.encounterType} to ${newEncounterType}`);
    await this.closeTriage(new Date());
  }

  async closeTriage(endDate) {
    const triage = await this.getLinkedTriage();
    if (triage) {
      await triage.update({
        closedTime: endDate,
      });
    }
  }

  async dischargeWithDischarger(discharger, endDate) {
    if (this.endDate) throw new Error(`Encounter ${this.id} already discharged`);

    const { Discharge } = this.sequelize.models;
    await Discharge.create({
      encounterId: this.id,
      dischargerId: discharger.id,
    });
    await this.update({ endDate });
  }

  async update(data) {
    const { Department, Location } = this.sequelize.models;

    const updateEncounter = async () => {
      if (data.endDate && !this.endDate) {
        await this.onDischarge(data.endDate, data.dischargeNote);
      }

      if (data.patientId && data.patientId !== this.patientId) {
        throw new InvalidOperationError("An encounter's patient cannot be changed");
      }

      if (data.encounterType && data.encounterType !== this.encounterType) {
        await this.onEncounterProgression(data.encounterType);
      }

      if (data.locationId && data.locationId !== this.locationId) {
        const oldLocation = await Location.findOne({ where: { id: this.locationId } });
        const newLocation = await Location.findOne({ where: { id: data.locationId } });
        if (!newLocation) {
          throw new InvalidOperationError('Invalid location specified');
        }
        await this.addSystemNote(
          `Changed location from ${oldLocation.name} to ${newLocation.name}`,
        );
      }

      if (data.departmentId && data.departmentId !== this.departmentId) {
        const oldDepartment = await Department.findOne({ where: { id: this.departmentId } });
        const newDepartment = await Department.findOne({ where: { id: data.departmentId } });
        if (!newDepartment) {
          throw new InvalidOperationError('Invalid department specified');
        }
        await this.addSystemNote(
          `Changed department from ${oldDepartment.name} to ${newDepartment.name}`,
        );
      }

      return super.update(data);
    };

    if (this.sequelize.isInsideTransaction()) {
      return updateEncounter();
    }

    // If the update is not already in a transaction, wrap it in one
    // Having nested transactions can cause bugs in postgres so only conditionally wrap
    return this.sequelize.transaction(async () => {
      await updateEncounter();
    });
  }
}
