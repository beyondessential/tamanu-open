import { Column, Entity, OneToMany } from 'typeorm/browser';

import { getCurrentDateTimeString } from '~/ui/helpers/date';
import { DateStringColumn } from './DateColumns';
import { ISO9075_DATE_SQLITE_DEFAULT } from './columnDefaults';

import { DateString, ID, ILegacyNoteItem, ILegacyNotePage, NoteRecordType, NoteType } from '~/types';
import { SYNC_DIRECTIONS } from './types';

import { BaseModel } from './BaseModel';
import { LegacyNoteItem } from './LegacyNoteItem';

@Entity('notePage')
export class LegacyNotePage extends BaseModel implements ILegacyNotePage {
  static syncDirection = SYNC_DIRECTIONS.BIDIRECTIONAL;

  @Column({ type: 'varchar', nullable: false })
  noteType: NoteType;

  @DateStringColumn({ nullable: false, default: ISO9075_DATE_SQLITE_DEFAULT })
  date: DateString;

  @Column({ type: 'varchar', nullable: false })
  recordType: NoteRecordType;

  // Note: we can't create an OOM relation here as the recordId
  // could refer to several different models
  @Column({ type: 'varchar', nullable: false })
  recordId: ID;

  @OneToMany(() => LegacyNoteItem, noteItem => noteItem.notePage)
  noteItems: ILegacyNoteItem[];

  static async createForRecord(
    { recordId, recordType, noteType, content, author },
  ): Promise<LegacyNotePage> {
    const notePage = await LegacyNotePage.createAndSaveOne<LegacyNotePage>({
      recordId,
      recordType,
      noteType,
      date: getCurrentDateTimeString(),
    });

    await LegacyNoteItem.createAndSaveOne({
      notePage: notePage.id,
      content,
      date: getCurrentDateTimeString(),
      author,
    });

    return notePage;
  }

  static getTableNameForSync(): string {
    return 'note_pages';
  }
}
