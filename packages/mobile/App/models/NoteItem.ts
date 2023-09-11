import { Entity, Column, ManyToOne, RelationId, BeforeInsert, BeforeUpdate } from 'typeorm/browser';

import { DateTimeStringColumn } from './DateColumns';
import { ISO9075_SQLITE_DEFAULT } from './columnDefaults';

import { ID, INoteItem, INotePage, DateTimeString, IUser } from '~/types';
import { SYNC_DIRECTIONS } from './types';

import { BaseModel } from './BaseModel';
import { User } from './User';
import { NotePage } from './NotePage';

@Entity('noteItem')
export class NoteItem extends BaseModel implements INoteItem {
  static syncDirection = SYNC_DIRECTIONS.BIDIRECTIONAL;

  @DateTimeStringColumn({ nullable: false, default: ISO9075_SQLITE_DEFAULT })
  date: DateTimeString;

  // Content has a default of '' on desktop but also doesn't allow null content
  // I'm going to assume it was a workaround that isn't needed here
  @Column({ type: 'varchar', nullable: false })
  content: string;

  @Column({ type: 'varchar', nullable: true })
  revisedById?: string;

  @ManyToOne(() => NotePage, notePage => notePage.noteItems)
  notePage: INotePage;
  @RelationId(({ notePage }) => notePage)
  notePageId: ID;

  @ManyToOne(() => User, user => user.authoredNoteItems)
  author?: IUser;
  @RelationId(({ author }) => author)
  authorId?: ID;

  @ManyToOne(() => User, user => user.onBehalfOfNoteItems)
  onBehalfOf?: IUser;
  @RelationId(({ onBehalfOf }) => onBehalfOf)
  onBehalfOfId?: ID;

  @BeforeInsert()
  @BeforeUpdate()
  validate(): void {
    if (!this.content) {
      throw new Error('NoteItem: Content must not be empty');
    }
  }

  static getTableNameForSync(): string {
    return 'note_items';
  }
}
