import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  BeforeUpdate,
  BeforeInsert,
  RelationId,
} from 'typeorm/browser';

import {
  ISurveyResponse,
  IProgramDataElement,
  ISurveyScreenComponent,
  EncounterType,
} from '~/types';

import {
  getStringValue,
  getResultValue,
  isCalculated,
  FieldTypes,
} from '~/ui/helpers/fields';

import { runCalculations } from '~/ui/helpers/calculations';

import { BaseModel } from './BaseModel';
import { Survey } from './Survey';
import { Encounter } from './Encounter';
import { SurveyResponseAnswer } from './SurveyResponseAnswer';
import { Referral } from './Referral';
import { Patient } from './Patient';
import { PatientAdditionalData } from './PatientAdditionalData';

@Entity('survey_response')
export class SurveyResponse extends BaseModel implements ISurveyResponse {
  @Column({ nullable: true })
  startTime?: Date;

  @Column({ nullable: true })
  endTime?: Date;

  @Column({ default: 0, nullable: true })
  result?: number;

  @Column({ default: '', nullable: true })
  resultText?: string;

  @ManyToOne(() => Survey, survey => survey.responses)
  survey: Survey;

  @RelationId(({ survey }) => survey)
  surveyId: string;

  @ManyToOne(() => Encounter, encounter => encounter.surveyResponses)
  encounter: Encounter;

  @RelationId(({ encounter }) => encounter)
  encounterId: string;

  @OneToMany(() => Referral, referral => referral.surveyResponse)
  referral: Referral;

  @OneToMany(() => SurveyResponseAnswer, answer => answer.response)
  answers: SurveyResponseAnswer[];

  @BeforeInsert()
  @BeforeUpdate()
  async markEncounterForUpload() {
    await this.markParentForUpload(Encounter, 'encounter');
  }

  static async getFullResponse(surveyId: string) {
    const repo = this.getRepository();
    const response = await repo.findOne(surveyId, {
      relations: ['survey', 'encounter', 'encounter.patient'],
    });
    const questions = await response.survey.getComponents();
    const answers = await SurveyResponseAnswer.getRepository().find({
      where: {
        response: response.id,
      },
      relations: ['dataElement'],
    });

    return {
      ...response,
      questions: [...questions],
      answers: [...answers],
    };
  }

  static async submit(
    patientId: string,
    userId: string,
    surveyData: ISurveyResponse & {
      encounterReason: string;
      components: ISurveyScreenComponent[];
    },
    values: object,
    setNote: (note: string) => void = () => null,
  ): Promise<SurveyResponse> {
    const {
      surveyId,
      encounterReason,
      components,
      ...otherData
    } = surveyData;

    try {
      setNote('Creating encounter...');
      const encounter = await Encounter.getOrCreateCurrentEncounter(patientId, userId, {
        startDate: new Date(),
        endDate: new Date(),
        encounterType: EncounterType.SurveyResponse,
        reasonForEncounter: encounterReason,
      });

      const calculatedValues = runCalculations(components, values);
      const finalValues = { ...values, ...calculatedValues };

      const {
        result,
        resultText,
      } = getResultValue(components, finalValues);

      setNote('Creating response object...');
      const responseRecord: SurveyResponse = await SurveyResponse.createAndSaveOne({
        encounter: encounter.id,
        survey: surveyId,
        startTime: Date.now(),
        endTime: Date.now(),
        result,
        resultText,
        ...otherData,
      });

      setNote('Attaching answers...');

      // these will store values to write to patient records following submission
      const patientRecordValues = {};
      const patientAdditionalDataValues = {};

      // TODO: this should just look at the field name and decide; there will never be overlap
      const isAdditionalDataField = (questionConfig) => questionConfig.writeToPatient?.isAdditionalDataField;

      for (const a of Object.entries(finalValues)) {
        const [dataElementCode, value] = a;
        const component = components.find(c => c.dataElement.code === dataElementCode);
        if (!component) {
          // better to fail entirely than save partial data
          throw new Error(`no screen component for code: ${dataElementCode}, cannot match to data element`);
        }
        const { dataElement } = component;

        if (isCalculated(dataElement.type) && value !== 0 && !value) {
          // calculated values will always be in the answer object - but we
          // shouldn't save null answers
          continue;
        }

        if (dataElement.type === FieldTypes.PATIENT_DATA) {
          const questionConfig = component.getConfigObject();
          const fieldName = questionConfig.writeToPatient?.fieldName;
          if (fieldName) {
            if (isAdditionalDataField(questionConfig)) {
              patientAdditionalDataValues[fieldName] = value;
            } else {
              patientRecordValues[fieldName] = value;
            }
          }
        }

        const body = getStringValue(dataElement.type, value);

        setNote(`Attaching answer for ${dataElement.id}...`);
        await SurveyResponseAnswer.createAndSaveOne({
          dataElement: dataElement.id,
          body,
          response: responseRecord.id,
        });
      }
      setNote('Done');

      // Save values to database records
      if (Object.keys(patientRecordValues).length) {
        await Patient.updateValues(patientId, patientRecordValues);
      }
      if (Object.keys(patientAdditionalDataValues).length) {
        await PatientAdditionalData.updateForPatient(patientId, patientAdditionalDataValues);
      }

      return responseRecord;
    } catch (e) {
      setNote(`Error: ${e.message} (${JSON.stringify(e)})`);

      return null;
    }
  }

  static async getForPatient(patientId: string, surveyId: string): Promise<SurveyResponse[]> {
    return this.getRepository()
      .createQueryBuilder('survey_response')
      .leftJoinAndSelect('survey_response.encounter', 'encounter')
      .leftJoinAndSelect('survey_response.survey', 'survey')
      .where('encounter.patientId = :patientId', { patientId })
      .andWhere('survey.id = :surveyId', { surveyId: surveyId.toLowerCase() })
      .orderBy('survey_response.endTime', 'DESC')
      .getMany();
  }
}
