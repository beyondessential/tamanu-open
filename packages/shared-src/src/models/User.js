import { hash } from 'bcrypt';
import { Sequelize } from 'sequelize';
import { SYNC_DIRECTIONS } from 'shared/constants';
import { Model } from './Model';

const DEFAULT_SALT_ROUNDS = 10;

export class User extends Model {
  static SALT_ROUNDS = DEFAULT_SALT_ROUNDS;

  static hashPassword(pw) {
    return hash(pw, User.SALT_ROUNDS ?? DEFAULT_SALT_ROUNDS);
  }

  forResponse() {
    const { password, ...otherValues } = this.dataValues;
    return otherValues;
  }

  async setPassword(pw) {
    this.password = await User.hashPassword(pw);
  }

  static async sanitizeForInsert(values) {
    const { password, ...otherValues } = values;
    if (!password) return values;

    return { ...otherValues, password: await User.hashPassword(password) };
  }

  static async update(values, ...args) {
    const sanitizedValues = await this.sanitizeForInsert(values);
    return super.update(sanitizedValues, ...args);
  }

  static async create(values, ...args) {
    const sanitizedValues = await this.sanitizeForInsert(values);
    return super.create(sanitizedValues, ...args);
  }

  static async bulkCreate(records, ...args) {
    const sanitizedRecords = await Promise.all(records.map(r => this.sanitizeForInsert(r)));
    return super.bulkCreate(sanitizedRecords, ...args);
  }

  static async upsert(values, ...args) {
    const sanitizedValues = await this.sanitizeForInsert(values);
    return super.upsert(sanitizedValues, ...args);
  }

  static init({ primaryKey, ...options }) {
    super.init(
      {
        id: primaryKey,
        email: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        },
        password: Sequelize.STRING,
        displayName: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        role: {
          type: Sequelize.STRING,
          defaultValue: 'practitioner',
          allowNull: false,
        },
      },
      {
        ...options,
        defaultScope: {
          attributes: { exclude: ['password'] },
        },
        scopes: {
          withPassword: {
            attributes: { include: ['password'] },
          },
        },
        indexes: [{ fields: ['email'] }],
        syncConfig: { syncDirection: SYNC_DIRECTIONS.PULL_ONLY },
        hooks: {
          async beforeUpdate(user) {
            if (user.changed('password')) {
              // eslint-disable-next-line no-param-reassign
              user.password = await User.hashPassword(user.password);
            }
          },
        },
      },
    );
  }

  static initRelations(models) {
    this.hasMany(models.Discharge, {
      foreignKey: 'dischargerId',
      as: 'discharges',
    });

    this.hasMany(models.ImagingRequest, {
      foreignKey: 'completedById',
    });

    this.belongsToMany(models.Facility, {
      through: 'UserFacility',
    });
  }
}
