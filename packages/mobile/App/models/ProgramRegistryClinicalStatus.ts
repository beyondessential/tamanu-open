import { Entity, ManyToOne, RelationId, Column, OneToMany } from 'typeorm/browser';

import { ID, IProgramRegistryClinicalStatus } from '~/types';
import { BaseModel } from './BaseModel';
import { SYNC_DIRECTIONS } from './types';
import { VisibilityStatus } from '~/visibilityStatuses';
import { PatientProgramRegistration } from './PatientProgramRegistration';
import { ProgramRegistry } from './ProgramRegistry';

@Entity('program_registry_clinical_status')
export class ProgramRegistryClinicalStatus extends BaseModel
  implements IProgramRegistryClinicalStatus {
  static syncDirection = SYNC_DIRECTIONS.BIDIRECTIONAL;

  @Column({ nullable: false })
  code: string;

  @Column({ nullable: false })
  name: string;

  @Column({ type: 'varchar', default: VisibilityStatus.Current, nullable: true })
  visibilityStatus?: VisibilityStatus;

  @Column({ nullable: true })
  color?: string;

  @ManyToOne(() => ProgramRegistry)
  programRegistry: ProgramRegistry;
  @RelationId(({ programRegistry }) => programRegistry)
  programRegistryId: ID;

  @OneToMany<PatientProgramRegistration>(
    () => PatientProgramRegistration,
    ({ programRegistryClinicalStatus }) => programRegistryClinicalStatus,
  )
  patientProgramRegistrations: PatientProgramRegistration[];

  static getTableNameForSync(): string {
    return 'program_registry_clinical_statuses';
  }
}
