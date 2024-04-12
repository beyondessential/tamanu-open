import { Column, Entity, ManyToOne, RelationId } from 'typeorm/browser';

import {
  DateTimeString,
  IPatientProgramRegistrationCondition,
  ID,
  IPatient,
  IProgramRegistry,
  IUser,
  IProgramRegistryCondition,
} from '~/types';
import { BaseModel } from './BaseModel';
import { SYNC_DIRECTIONS } from './types';
import { ProgramRegistry } from './ProgramRegistry';
import { Patient } from './Patient';
import { User } from './User';
import { DateTimeStringColumn } from './DateColumns';
import { ProgramRegistryCondition } from './ProgramRegistryCondition';

@Entity('patient_program_registration_condition')
export class PatientProgramRegistrationCondition extends BaseModel
  implements IPatientProgramRegistrationCondition {
  static syncDirection = SYNC_DIRECTIONS.BIDIRECTIONAL;

  id: ID;
  @DateTimeStringColumn()
  date: DateTimeString;

  // TODO: enum, see how it's implemented after this project is completed:
  // https://linear.app/bes/issue/EPI-554/deletion-data-tasks
  @Column({ nullable: true })
  deletionStatus?: string;
  @DateTimeStringColumn()
  deletionDate?: DateTimeString;

  // Relations
  @ManyToOne(() => ProgramRegistry)
  programRegistry: IProgramRegistry;
  @RelationId(({ programRegistry }) => programRegistry)
  programRegistryId: ID;

  @ManyToOne(() => Patient)
  patient: IPatient;
  @RelationId(({ patient }) => patient)
  patientId: ID;

  @ManyToOne(
    () => ProgramRegistryCondition,
    ({ patientProgramRegistrationConditions }) => patientProgramRegistrationConditions,
    { nullable: true },
  )
  programRegistryCondition?: IProgramRegistryCondition;

  @RelationId(({ programRegistryCondition }) => programRegistryCondition)
  programRegistryConditionId?: ID;

  @ManyToOne(() => User, undefined, { nullable: true })
  clinician?: IUser;
  @RelationId(({ clinician }) => clinician)
  clinicianId?: ID;

  @ManyToOne(() => User, undefined, { nullable: true })
  deletionClinician?: IUser;
  @RelationId(({ deletionClinician }) => deletionClinician)
  deletionClinicianId?: ID;

  static async findForRegistryAndPatient(programRegistryId: string, patientId: string) {
    const conditionsRepository = this.getRepository();
    const conditions = await conditionsRepository
      .createQueryBuilder('condition')
      .where('condition.programRegistryId = :programRegistryId', { programRegistryId })
      .andWhere('condition.patientId = :patientId', { patientId })
      .andWhere('condition.deletionStatus IS NULL')
      .leftJoinAndSelect('condition.programRegistryCondition', 'programRegistryCondition')
      .getMany();
    return conditions;
  }
  static getTableNameForSync(): string {
    return 'patient_program_registration_conditions';
  }
}
