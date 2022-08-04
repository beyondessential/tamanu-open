import { Sequelize } from 'sequelize';
import { SYNC_DIRECTIONS } from 'shared/constants';
import { InvalidOperationError } from 'shared/errors';
import { Model } from './Model';

export class Location extends Model {
  static init({ primaryKey, ...options }) {
    const validate = {
      mustHaveFacility() {
        if (!this.deletedAt && !this.facilityId) {
          throw new InvalidOperationError('A location must have a facility.');
        }
      },
    };
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
      },
      {
        ...options,
        validate,
        syncConfig: { syncDirection: SYNC_DIRECTIONS.PULL_ONLY },
        indexes: [{ unique: true, fields: ['code'] }],
      },
    );
  }

  static initRelations(models) {
    this.hasMany(models.Encounter, {
      foreignKey: 'locationId',
    });

    this.hasMany(models.Procedure, {
      foreignKey: 'locationId',
    });

    this.hasMany(models.ImagingRequest, {
      foreignKey: 'locationId',
    });

    this.belongsTo(models.Facility, {
      foreignKey: 'facilityId',
      as: 'facility',
    });
  }
}
