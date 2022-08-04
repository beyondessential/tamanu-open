import { Sequelize } from 'sequelize';
import { SYNC_DIRECTIONS } from 'shared/constants';
import { Model } from './Model';

export class Facility extends Model {
  static init({ primaryKey, ...options }) {
    super.init(
      {
        id: primaryKey,
        code: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        email: Sequelize.STRING,
        contactNumber: Sequelize.STRING,
        streetAddress: Sequelize.STRING,
        cityTown: Sequelize.STRING,
        division: Sequelize.STRING,
        type: Sequelize.STRING,
      },
      {
        ...options,
        syncConfig: { syncDirection: SYNC_DIRECTIONS.PULL_ONLY },
        indexes: [
          { unique: true, fields: ['code'] },
          { unique: true, fields: ['name'] },
        ],
      },
    );
  }

  static initRelations(models) {
    this.hasMany(models.Department, {
      foreignKey: 'facilityId',
    });
    this.hasMany(models.Location, {
      foreignKey: 'facilityId',
    });
    this.hasMany(models.UserFacility, {
      foreignKey: 'facilityId',
    });

    this.belongsToMany(models.User, {
      through: 'UserFacility',
    });
  }
}