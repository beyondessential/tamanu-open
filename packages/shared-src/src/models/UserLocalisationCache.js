import { Sequelize } from 'sequelize';
import { Model } from './Model';

export class UserLocalisationCache extends Model {
  static init({ primaryKey, ...options }) {
    super.init(
      {
        id: primaryKey,
        localisation: {
          type: Sequelize.STRING,
          allowNull: false,
        },
      },
      options,
    );
  }

  static initRelations(models) {
    this.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
  }

  static async getLocalisation(options) {
    const localisationCache = await this.findOne(options);
    if (!localisationCache) {
      return null;
    }
    return JSON.parse(localisationCache.localisation);
  }
}
