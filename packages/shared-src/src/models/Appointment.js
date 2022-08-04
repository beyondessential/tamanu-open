import { Sequelize } from 'sequelize';
import { APPOINTMENT_TYPES, APPOINTMENT_STATUSES } from 'shared/constants';
import { Model } from './Model';

export class Appointment extends Model {
  static init({ primaryKey, ...options }) {
    super.init(
      {
        id: primaryKey,
        startTime: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        endTime: Sequelize.DATE,
        type: {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: APPOINTMENT_TYPES.STANDARD,
        },
        status: {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: APPOINTMENT_STATUSES.CONFIRMED,
        },
      },
      { ...options },
    );
  }

  static getListReferenceAssociations() {
    return [{ association: 'patient', include: ['village'] }, 'clinician', 'location'];
  }

  static initRelations(models) {
    this.belongsTo(models.Patient, {
      as: 'patient',
      foreignKey: 'patientId',
    });

    this.belongsTo(models.User, {
      as: 'clinician',
      foreignKey: 'clinicianId',
    });

    this.belongsTo(models.Location, {
      as: 'location',
      foreignKey: 'locationId',
    });
  }
}
