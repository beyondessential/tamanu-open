import { Sequelize } from 'sequelize';
import { SYNC_DIRECTIONS } from 'shared/constants';
import { Model } from './Model';

export class Attachment extends Model {
  static init({ primaryKey, ...options }) {
    super.init(
      {
        id: primaryKey,
        type: Sequelize.TEXT,
        size: Sequelize.INTEGER,
        data: Sequelize.BLOB,
      },
      {
        ...options,
        syncConfig: { syncDirection: SYNC_DIRECTIONS.DO_NOT_SYNC },
      },
    );
  }

  static sanitizeForSyncServer({ data, ...restOfValues }) {
    return { ...restOfValues, data: Buffer.from(data, 'base64') };
  }
}
