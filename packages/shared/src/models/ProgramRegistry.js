import { Sequelize } from 'sequelize';
import { CURRENTLY_AT_TYPES, SYNC_DIRECTIONS, VISIBILITY_STATUSES } from '@tamanu/constants';
import { InvalidOperationError } from '../errors';
import { Model } from './Model';

export class ProgramRegistry extends Model {
  static init({ primaryKey, ...options }) {
    super.init(
      {
        id: primaryKey,
        code: {
          type: Sequelize.TEXT,
          allowNull: false,
          unique: true,
        },
        name: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        currentlyAtType: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        visibilityStatus: {
          type: Sequelize.TEXT,
          defaultValue: VISIBILITY_STATUSES.CURRENT,
        },
      },
      {
        ...options,
        syncDirection: SYNC_DIRECTIONS.PULL_FROM_CENTRAL,
        validate: {
          mustHaveValidCurrentlyAtType() {
            const values = Object.values(CURRENTLY_AT_TYPES);
            if (!values.includes(this.currentlyAtType)) {
              throw new InvalidOperationError(
                `The currentlyAtType must be one of ${values.join(', ')}`,
              );
            }
          },
        },
      },
    );
  }

  static initRelations(models) {
    this.belongsTo(models.Program, {
      foreignKey: 'programId',
      as: 'program',
    });

    this.hasMany(models.ProgramRegistryClinicalStatus, {
      foreignKey: 'programRegistryId',
      as: 'clinicalStatuses',
    });

    this.hasMany(models.PatientProgramRegistration, {
      foreignKey: 'programRegistryId',
      as: 'patientProgramRegistrations',
    });

    this.hasMany(models.PatientProgramRegistrationCondition, {
      foreignKey: 'programRegistryId',
      as: 'patientProgramRegistrationConditions',
    });
  }

  static buildSyncFilter() {
    return null; // syncs everywhere
  }
}
