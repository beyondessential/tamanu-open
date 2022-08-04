import { Sequelize } from 'sequelize';
import { DIAGNOSIS_CERTAINTY, DIAGNOSIS_CERTAINTY_VALUES } from '../constants';
import { Model } from './Model';

export class EncounterDiagnosis extends Model {
  static init({ primaryKey, ...options }) {
    super.init(
      {
        id: primaryKey,

        certainty: {
          type: Sequelize.STRING,
          defaultValue: DIAGNOSIS_CERTAINTY.SUSPECTED,
          isIn: DIAGNOSIS_CERTAINTY_VALUES, // application-level validation, not db-level
        },
        isPrimary: Sequelize.BOOLEAN,
        date: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW,
        },
      },
      {
        ...options,
        validate: {
          mustHaveDiagnosis() {
            if (!this.diagnosisId) {
              throw new Error('An encounter diagnosis must be attached to a diagnosis.');
            }
          },
          mustHaveEncounter() {
            if (!this.encounterId) {
              throw new Error('An encounter diagnosis must be attached to an encounter.');
            }
          },
        },
      },
    );
  }

  static initRelations(models) {
    this.belongsTo(models.Encounter, {
      foreignKey: 'encounterId',
    });
    this.belongsTo(models.ReferenceData, {
      foreignKey: 'diagnosisId',
      as: 'Diagnosis',
    });
  }

  static getListReferenceAssociations() {
    return ['Diagnosis'];
  }
}
