import { Sequelize } from 'sequelize';
import { Model } from './Model';

export class PatientAllergy extends Model {
  static init({ primaryKey, ...options }) {
    super.init(
      {
        id: primaryKey,
        note: Sequelize.STRING,
        recordedDate: { type: Sequelize.DATE, defaultValue: Sequelize.NOW, allowNull: false },
      },
      options,
    );
  }

  static initRelations(models) {
    this.belongsTo(models.Patient, { foreignKey: 'patientId' });
    this.belongsTo(models.User, { foreignKey: 'practitionerId' });
    this.belongsTo(models.ReferenceData, { foreignKey: 'allergyId', as: 'allergy' });
  }

  static getListReferenceAssociations() {
    return ['allergy'];
  }
}
