import { Sequelize } from 'sequelize';
import { SYNC_DIRECTIONS } from 'shared/constants';
import { parseOrNull } from 'shared/utils/parse-or-null';
import { Model } from './Model';

export class ProgramDataElement extends Model {
  static init({ primaryKey, ...options }) {
    super.init(
      {
        id: primaryKey,
        code: Sequelize.STRING,
        name: Sequelize.STRING,
        indicator: Sequelize.STRING,
        defaultText: Sequelize.STRING,
        defaultOptions: Sequelize.TEXT,
        type: Sequelize.STRING(31),
      },
      {
        ...options,
        indexes: [{ unique: true, fields: ['code'] }],
        syncConfig: { syncDirection: SYNC_DIRECTIONS.PULL_ONLY },
      },
    );
  }

  forResponse() {
    const { defaultOptions, ...values } = this.dataValues;
    return {
      ...values,
      defaultOptions: parseOrNull(defaultOptions),
    };
  }
}
