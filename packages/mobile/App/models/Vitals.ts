import { Entity, Column, ManyToOne, RelationId, BeforeInsert, BeforeUpdate } from 'typeorm/browser';
import { BaseModel } from './BaseModel';
import { AVPUType, IVitals, DetectedPresenceType, UrineNitritesType, UrineProteinType } from '../types/IVitals';
import { Encounter } from './Encounter';

@Entity('vitals')
export class Vitals extends BaseModel implements IVitals {
  @Column()
  dateRecorded: Date;

  @Column({ type: 'int', nullable: true })
  weight?: number;

  @Column({ type: 'int', nullable: true })
  height?: number;

  @Column({ type: 'int', nullable: true })
  sbp?: number;

  @Column({ type: 'int', nullable: true })
  dbp?: number;

  @Column({ type: 'int', nullable: true })
  heartRate?: number;

  @Column({ type: 'int', nullable: true })
  respiratoryRate?: number;

  @Column({ type: 'int', nullable: true })
  temperature?: number;

  @Column({ type: 'int', nullable: true })
  spO2?: number;

  @Column({ type: 'varchar', nullable: true })
  avpu?: AVPUType;

  @Column({ type: 'int', nullable: true })
  gcs?: number;

  @Column({ type: 'int', nullable: true })
  hemoglobin?: number;

  @Column({ type: 'int', nullable: true })
  fastingBloodGlucose?: number;

  @Column({ type: 'int', nullable: true })
  urinePh?: number;

  @Column({ type: 'varchar', nullable: true })
  urineLeukocytes?: DetectedPresenceType;

  @Column({ type: 'varchar', nullable: true })
  urineNitrites?: UrineNitritesType;

  @Column({ type: 'int', nullable: true })
  urobilinogen?: number;

  @Column({ type: 'varchar', nullable: true })
  urineProtein?: UrineProteinType;

  @Column({ type: 'varchar', nullable: true })
  bloodInUrine?: DetectedPresenceType;

  @Column({ type: 'int', nullable: true })
  urineSpecificGravity?: number;

  @Column({ type: 'varchar', nullable: true })
  urineKetone?: DetectedPresenceType;

  @Column({ type: 'varchar', nullable: true })
  urineBilirubin?: DetectedPresenceType;

  @Column({ type: 'int', nullable: true })
  urineGlucose?: number;

  @ManyToOne(() => Encounter)
  encounter: Encounter;
  @RelationId(({ encounter }) => encounter)
  encounterId?: string;

  @BeforeInsert()
  @BeforeUpdate()
  async markEncounterForUpload() {
    await this.markParentForUpload(Encounter, 'encounter');
  }

  static async getForPatient(patientId: string): Promise<Vitals[]> {
    return this.getRepository()
      .createQueryBuilder('vitals')
      .leftJoin('vitals.encounter', 'encounter')
      .where('encounter.patient = :patient', { patient: patientId })
      .getMany();
  }
}
