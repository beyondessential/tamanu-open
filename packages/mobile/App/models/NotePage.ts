import { Entity, Column, OneToMany } from 'typeorm/browser';

import { JoinTable } from 'typeorm';
import { getCurrentDateTimeString } from '~/ui/helpers/date';
import { DateStringColumn } from './DateColumns';
import { ISO9075_DATE_SQLITE_DEFAULT } from './columnDefaults';

import { ID, INoteItem, INotePage, NoteRecordType, NoteType, DateString } from '~/types';
import { SYNC_DIRECTIONS } from './types';

import { BaseModel } from './BaseModel';
import { NoteItem } from './NoteItem';

@Entity('notePage')
export class NotePage extends BaseModel implements INotePage {
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

  @OneToMany(() => NoteItem, noteItem => noteItem.notePage)
  noteItems: INoteItem[];

  static async createForRecord(
    { recordId, recordType, noteType, content, author },
  ): Promise<NotePage> {
    const notePage = await NotePage.createAndSaveOne<NotePage>({
      recordId,
      recordType,
      noteType,
      date: getCurrentDateTimeString(),
    });

    await NoteItem.createAndSaveOne({
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
