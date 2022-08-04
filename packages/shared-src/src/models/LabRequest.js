import { Sequelize } from 'sequelize';
import { InvalidOperationError } from 'shared/errors';

import { LAB_REQUEST_STATUSES, NOTE_TYPES } from 'shared/constants';
import { Model } from './Model';
import { dateTimeType } from './dateTimeType';
import { getCurrentDateTimeString } from '../utils/dateTime';

export class LabRequest extends Model {
  static init({ primaryKey, ...options }) {
    super.init(
      {
        id: primaryKey,
        sampleTime: {
          ...dateTimeType('sampleTime'),
          allowNull: false,
          defaultValue: getCurrentDateTimeString,
        },
        // Legacy column has historical date time data as a backup
        sampleTimeLegacy: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW,
        },
        requestedDate: {
          ...dateTimeType('requestedDate'),
          allowNull: false,
          defaultValue: getCurrentDateTimeString,
        },
        // Legacy column has historical date time data as a backup
        requestedDateLegacy: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW,
        },
        specimenAttached: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        },

        urgent: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        },

        status: {
          type: Sequelize.STRING,
          defaultValue: LAB_REQUEST_STATUSES.RECEPTION_PENDING,
        },

        senaiteId: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        sampleId: {
          type: Sequelize.STRING,
          allowNull: true,
        },

        displayId: {
          type: Sequelize.STRING,
          allowNull: false,
        },
      },
      options,
    );
  }

  static createWithTests(data) {
    return this.sequelize.transaction(async () => {
      const { labTestTypeIds = [] } = data;
      if (!labTestTypeIds.length) {
        throw new InvalidOperationError('A request must have at least one test');
      }

      const base = await this.create(data);

      // then create tests
      const { LabTest } = this.sequelize.models;

      await Promise.all(
        labTestTypeIds.map(t =>
          LabTest.create({
            labTestTypeId: t,
            labRequestId: base.id,
          }),
        ),
      );

      return base;
    });
  }

  async addLabNote(content) {
    await this.createNote({
      noteType: NOTE_TYPES.OTHER,
      content,
    });
  }

  static initRelations(models) {
    this.belongsTo(models.User, {
      foreignKey: 'requestedById',
      as: 'requestedBy',
    });

    this.belongsTo(models.Encounter, {
      foreignKey: 'encounterId',
      as: 'encounter',
    });

    this.belongsTo(models.ReferenceData, {
      foreignKey: 'labTestCategoryId',
      as: 'category',
    });

    this.belongsTo(models.ReferenceData, {
      foreignKey: 'labTestPriorityId',
      as: 'priority',
    });

    this.belongsTo(models.ReferenceData, {
      foreignKey: 'labTestLaboratoryId',
      as: 'laboratory',
    });

    this.hasMany(models.LabTest, {
      foreignKey: 'labRequestId',
      as: 'tests',
    });

    this.hasMany(models.CertificateNotification, {
      foreignKey: 'labRequestId',
      as: 'certificate_notification',
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

  static getListReferenceAssociations() {
    return ['requestedBy', 'category', 'priority', 'laboratory'];
  }

  getTests() {
    return this.sequelize.models.LabTest.findAll({
      where: { labRequestId: this.id },
    });
  }
}
