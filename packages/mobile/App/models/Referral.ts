import { Column, Entity, getConnection, ManyToOne, RelationId } from 'typeorm/browser';
import { BaseModel } from './BaseModel';
import { GenericFormValues, ICreateSurveyResponse, IReferral } from '~/types';
import { Encounter } from './Encounter';
import { SurveyResponse } from './SurveyResponse';
import { SYNC_DIRECTIONS } from './types';

@Entity('referral')
export class Referral extends BaseModel implements IReferral {
  static syncDirection = SYNC_DIRECTIONS.BIDIRECTIONAL;

  @Column({ nullable: true })
  referredFacility?: string;

  @ManyToOne(
    () => Encounter,
    encounter => encounter.initiatedReferrals,
  )
  initiatingEncounter: Encounter;
  @RelationId(({ initiatingEncounter }) => initiatingEncounter)
  initiatingEncounterId: string;

  @ManyToOne(
    () => Encounter,
    encounter => encounter.completedReferrals,
  )
  completingEncounter: Encounter;
  @RelationId(({ completingEncounter }) => completingEncounter)
  completingEncounterId: string;

  @ManyToOne(
    () => SurveyResponse,
    surveyResponse => surveyResponse.referral,
  )
  surveyResponse: SurveyResponse;
  @RelationId(({ surveyResponse }) => surveyResponse)
  surveyResponseId: string;

  static async submit(
    patientId: string,
    userId: string,
    surveyData: ICreateSurveyResponse,
    values: GenericFormValues,
    setNote: (note: string) => void = (): void => null,
  ): Promise<Referral> {
    // typeORM is extremely unhappy if you take away this
    // transactionalEntityManager param even if it's unused.
    return getConnection().transaction(async () => {
      const response = await SurveyResponse.submit(patientId, userId, surveyData, values, setNote);
      const referralRecord: Referral = await Referral.createAndSaveOne({
        initiatingEncounter: response.encounter,
        surveyResponse: response.id,
      });

      return referralRecord;
    });
  }

  static async getForPatient(patientId: string): Promise<Referral[]> {
    return this.getRepository()
      .createQueryBuilder('referral')
      .leftJoin('referral.initiatingEncounter', 'initiatingEncounter')
      .leftJoinAndSelect('referral.surveyResponse', 'surveyResponse')
      .leftJoinAndSelect('surveyResponse.survey', 'survey')
      .leftJoinAndSelect('surveyResponse.answers', 'answers')
      .leftJoinAndSelect('answers.dataElement', 'dataElement')
      .withDeleted() // Include both soft-deleted 'dataElement' and 'surveyScreenComponent':
      .leftJoinAndSelect(
        'dataElement.surveyScreenComponent',
        'surveyScreenComponent',
        'surveyScreenComponent.dataElementId = dataElement.id and surveyScreenComponent.surveyId = survey.id',
      )
      .where('initiatingEncounter.patientId = :patientId', { patientId })
      .orderBy({
        'surveyResponse.endTime': 'DESC',
        'surveyScreenComponent.screenIndex': 'ASC',
        'surveyScreenComponent.componentIndex': 'ASC',
      })
      .getMany();
  }
}
