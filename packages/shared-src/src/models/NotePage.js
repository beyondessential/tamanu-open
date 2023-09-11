import { DataTypes } from 'sequelize';
import { log } from 'shared/services/logging';
import {
  NOTE_RECORD_TYPE_VALUES,
  NOTE_TYPE_VALUES,
  SYNC_DIRECTIONS,
  VISIBILITY_STATUSES,
} from 'shared/constants';

import { Model } from './Model';
import { NoteItem } from './NoteItem';
import { buildNotePageLinkedSyncFilter } from './buildNoteLinkedSyncFilter';
import { dateTimeType } from './dateTimeTypes';
import { getCurrentDateTimeString } from '../utils/dateTime';

export class NotePage extends Model {
  static init({ primaryKey, ...options }) {
    super.init(
      {
        id: {
          ...primaryKey,
          type: DataTypes.UUID,
        },
        noteType: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        recordType: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        date: dateTimeType('date', {
          allowNull: false,
          defaultValue: getCurrentDateTimeString,
        }),
        visibilityStatus: {
          type: DataTypes.TEXT,
          defaultValue: VISIBILITY_STATUSES.CURRENT,
        },
      },
      {
        ...options,
        syncDirection: SYNC_DIRECTIONS.BIDIRECTIONAL,
        validate: {
          mustHaveValidRelationType() {
            if (!NOTE_RECORD_TYPE_VALUES.includes(this.recordType)) {
              throw new Error(`NotePage: Must have a valid record type (got ${this.recordType})`);
            }
          },
          mustHaveValidType() {
            if (!NOTE_TYPE_VALUES.includes(this.noteType)) {
              throw new Error(`NotePage: Must have a valid note type (got ${this.noteType})`);
            }
          },
        },
      },
    );
  }

  static initRelations(models) {
    NOTE_RECORD_TYPE_VALUES.forEach(modelName => {
      this.belongsTo(models[modelName], {
        foreignKey: 'recordId',
        as: `${modelName.charAt(0).toLowerCase()}${modelName.slice(1)}`, // lower case first letter
        constraints: false,
      });
    });

    this.hasMany(models.NoteItem, {
      foreignKey: 'notePageId',
      as: 'noteItems',
      constraints: false,
    });
  }

  /**
   * This is a util method that combines the NotePage instance with its single associated NoteItem.
   * This method should only be used for records that always only have 1 note item attached it.
   * Eg: LabRequest, PatientCarePlan
   * @param {*} models
   * @returns
   */
  async getCombinedNoteObject(models) {
    const noteItem = await models.NoteItem.findOne({
      include: [
        { model: models.User, as: 'author' },
        { model: models.User, as: 'onBehalfOf' },
      ],
      where: {
        notePageId: this.id,
      },
    });

    if (!noteItem) {
      log.warn(`Cannot find note item of note page '${this.id}'`);
      return null;
    }

    return {
      ...noteItem.toJSON(),
      id: this.id,
      recordType: this.recordType,
      recordId: this.recordId,
      noteType: this.noteType,
    };
  }

  static async createForRecord(recordId, recordType, noteType, content, authorId) {
    const notePage = await NotePage.create({
      recordId,
      recordType,
      noteType,
      date: getCurrentDateTimeString(),
    });

    await NoteItem.create({
      notePageId: notePage.id,
      content,
      date: getCurrentDateTimeString(),
      authorId,
    });

    return notePage;
  }

  async getParentRecord(options) {
    if (!this.recordType) {
      return null;
    }
    const parentGetter = `get${this.recordType}`;
    return this[parentGetter](options);
  }

  static buildSyncFilter = buildNotePageLinkedSyncFilter;
}
