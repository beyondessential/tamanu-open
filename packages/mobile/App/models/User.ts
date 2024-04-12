import { Column, Entity, Index, OneToMany } from 'typeorm/browser';
import { BaseModel } from './BaseModel';
import { Referral } from './Referral';
import { IUser } from '~/types';
import { AdministeredVaccine } from './AdministeredVaccine';
import { Note } from './Note';
import { LabRequest } from './LabRequest';
import { VitalLog } from './VitalLog';
import { SYNC_DIRECTIONS } from './types';
import { VisibilityStatus } from '../visibilityStatuses';

@Entity('user')
export class User extends BaseModel implements IUser {
  static syncDirection = SYNC_DIRECTIONS.PULL_FROM_CENTRAL;
  
  @Column()
  displayId: string;

  @Index()
  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  localPassword?: string;

  // eslint-react gets confused by displayName.
  // eslint-disable-next-line react/static-property-placement
  @Column()
  displayName: string;

  @Column()
  role: string;

  @OneToMany(() => Referral, (referral) => referral.practitioner)
  referrals: Referral[];

  @OneToMany(() => LabRequest, (labRequest) => labRequest.requestedBy)
  labRequests: LabRequest[];

  @OneToMany(() => LabRequest, (labRequest) => labRequest.collectedBy)
  collectedLabRequests: LabRequest[];

  @OneToMany(() => AdministeredVaccine, (administeredVaccine) => administeredVaccine.recorder)
  recordedVaccines: AdministeredVaccine[];

  @OneToMany(() => Note, note => note.author)
  authoredNotes: Note[];

  @OneToMany(() => Note, note => note.onBehalfOf)
  onBehalfOfNotes: Note[];

  @OneToMany(() => VitalLog, vitalLog => vitalLog.recordedBy)
  recordedVitalLogs: VitalLog[];

  @Column({ default: VisibilityStatus.Current })
  visibilityStatus: string;

  static excludedSyncColumns: string[] = [...BaseModel.excludedSyncColumns, 'localPassword'];
}
