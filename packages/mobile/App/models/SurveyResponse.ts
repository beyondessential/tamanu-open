import { Column, Entity, ManyToOne, OneToMany, RelationId } from 'typeorm/browser';

import { EncounterType, ICreateSurveyResponse, ISurveyResponse } from '~/types';

import {
  FieldTypes,
  getResultValue,
  getStringValue,
  getPatientDataDbLocation,
} from '~/ui/helpers/fields';

import { runCalculations } from '~/ui/helpers/calculations';
import { getCurrentDateTimeString } from '~/ui/helpers/date';

import { BaseModel } from './BaseModel';
import { Survey } from './Survey';
import { Encounter } from './Encounter';
import { ProgramRegistry } from './ProgramRegistry';
import { SurveyResponseAnswer } from './SurveyResponseAnswer';
import { Referral } from './Referral';
import { Patient } from './Patient';
import { PatientAdditionalData } from './PatientAdditionalData';
import { VitalLog } from './VitalLog';
import { SYNC_DIRECTIONS } from './types';
import { DateTimeStringColumn } from './DateColumns';
import { PatientProgramRegistration } from './PatientProgramRegistration';
import { VisibilityStatus } from '../visibilityStatuses';

type RecordValuesByModel = {
  Patient?: Record<string, string>;
  PatientAdditionalData?: Record<string, string>;
  PatientProgramRegistration?: Record<string, string>;
};

const getFieldsToWrite = (questions, answers): RecordValuesByModel => {
  const recordValuesByModel = {};

  const patientDataQuestions = questions.filter(
    q => q.dataElement.type === FieldTypes.PATIENT_DATA,
  );
  for (const question of patientDataQuestions) {
    const config = question.getConfigObject();
    const { dataElement } = question;

    if (!config.writeToPatient) {
      // this is just a question that's reading patient data, not writing it
      continue;
    }

    const { fieldName: configFieldName } = config.writeToPatient || {};
    if (!configFieldName) {
      throw new Error('No fieldName defined for writeToPatient config');
    }

    const value = answers[dataElement.code];
    const { modelName, fieldName } = getPatientDataDbLocation(configFieldName);
    if (!modelName) {
      throw new Error(`Unknown fieldName: ${configFieldName}`);
    }
    if (!recordValuesByModel[modelName]) recordValuesByModel[modelName] = {};
    recordValuesByModel[modelName][fieldName] = value;
  }
  return recordValuesByModel;
};

/**
 * DUPLICATED IN shared/models/SurveyResponse.js
 * Please keep in sync
 */
async function writeToPatientFields(
  questions,
  answers,
  patientId,
  surveyId,
  userId,
  submittedTime,
) {
  const valuesByModel = getFieldsToWrite(questions, answers);

  if (valuesByModel.Patient) {
    await Patient.updateValues(patientId, valuesByModel.Patient);
  }

  if (valuesByModel.PatientAdditionalData) {
    await PatientAdditionalData.updateForPatient(patientId, valuesByModel.PatientAdditionalData);
  }

  if (valuesByModel.PatientProgramRegistration) {
    const { programId } = await Survey.findOne({ id: surveyId });
    const { id: programRegistryId } = await ProgramRegistry.findOne({
      where: { program: { id: programId }, visibilityStatus: VisibilityStatus.Current },
    });
    if (!programRegistryId) {
      throw new Error('No program registry configured for the current form');
    }
    await PatientProgramRegistration.appendRegistration(patientId, programRegistryId, {
      date: submittedTime,
      ...valuesByModel.PatientProgramRegistration,
      clinicianId: valuesByModel.PatientProgramRegistration.clinicianId || userId,
    });
  }
}

@Entity('survey_response')
export class SurveyResponse extends BaseModel implements ISurveyResponse {
  static syncDirection = SYNC_DIRECTIONS.BIDIRECTIONAL;

  @DateTimeStringColumn({ nullable: true })
  startTime?: string;

  @DateTimeStringColumn({ nullable: true })
  endTime?: string;

  @Column({ default: 0, nullable: true })
  result?: number;

  @Column({ default: '', nullable: true })
  resultText?: string;

  @ManyToOne(
    () => Survey,
    survey => survey.responses,
  )
  survey: Survey;

  @RelationId(({ survey }) => survey)
  surveyId: string;

  @ManyToOne(
    () => Encounter,
    encounter => encounter.surveyResponses,
  )
  encounter: Encounter;

  @RelationId(({ encounter }) => encounter)
  encounterId: string;

  @OneToMany(
    () => Referral,
    referral => referral.surveyResponse,
  )
  referral: Referral;

  @OneToMany(
    () => SurveyResponseAnswer,
    answer => answer.response,
  )
  answers: SurveyResponseAnswer[];

  static async getFullResponse(surveyId: string) {
    const repo = this.getRepository();
    const response = await repo.findOne(surveyId, {
      relations: ['survey', 'encounter', 'encounter.patient'],
    });
    const questions = await response.survey.getComponents({ includeAllVitals: true });
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
    surveyData: ICreateSurveyResponse,
    values: object,
    setNote: (note: string) => void = () => null,
  ): Promise<SurveyResponse> {
    const { surveyId, encounterReason, components, ...otherData } = surveyData;

    try {
      setNote('Creating encounter...');
      const encounter = await Encounter.getOrCreateCurrentEncounter(patientId, userId, {
        startDate: getCurrentDateTimeString(),
        endDate: getCurrentDateTimeString(),
        encounterType: EncounterType.SurveyResponse,
        reasonForEncounter: encounterReason,
      });

      const calculatedValues = runCalculations(components, values);
      const finalValues = { ...values, ...calculatedValues };

      const { result, resultText } = getResultValue(components, finalValues);

      setNote('Creating response object...');
      const responseRecord: SurveyResponse = await SurveyResponse.createAndSaveOne({
        encounter: encounter.id,
        survey: surveyId,
        startTime: getCurrentDateTimeString(),
        endTime: getCurrentDateTimeString(),
        result,
        resultText,
        ...otherData,
      });

      setNote('Attaching answers...');

      // figure out if its a vital survey response
      let vitalsSurvey;
      try {
        vitalsSurvey = await Survey.getVitalsSurvey({ includeAllVitals: false });
      } catch (e) {
        console.error(`Errored while trying to get vitals survey: ${e}`);
      }

      // use optional chaining because vitals survey might not exist
      const isVitalSurvey = surveyId === vitalsSurvey?.id;

      for (const a of Object.entries(finalValues)) {
        const [dataElementCode, value] = a;
        const component = components.find(c => c.dataElement.code === dataElementCode);
        if (!component) {
          // better to fail entirely than save partial data
          throw new Error(
            `no screen component for code: ${dataElementCode}, cannot match to data element`,
          );
        }
        const { dataElement } = component;

        const body = getStringValue(dataElement.type, value);
        // Don't create null answers
        if (body === null) {
          continue;
        }

        setNote(`Attaching answer for ${dataElement.id}...`);
        const answerRecord = await SurveyResponseAnswer.createAndSaveOne({
          dataElement: dataElement.id,
          body,
          response: responseRecord.id,
        });

        if (!isVitalSurvey || body === '') continue;
        setNote(`Attaching initial vital log for ${answerRecord.id}...`);
        await VitalLog.createAndSaveOne({
          date: responseRecord.endTime,
          newValue: body,
          recordedBy: userId,
          answer: answerRecord.id,
        });
      }
      setNote('Writing patient data');

      await writeToPatientFields(
        components,
        finalValues,
        patientId,
        surveyId,
        userId,
        responseRecord.endTime,
      );

      setNote('Done');

      return responseRecord;
    } catch (e) {
      setNote(`Error: ${e.message} (${JSON.stringify(e)})`);

      return null;
    }
  }

  static async getForPatient(patientId: string, surveyId?: string): Promise<SurveyResponse[]> {
    const query = this.getRepository()
      .createQueryBuilder('survey_response')
      .leftJoinAndSelect('survey_response.encounter', 'encounter')
      .leftJoinAndSelect('survey_response.survey', 'survey')
      .where('encounter.patientId = :patientId', { patientId })
      .orderBy('survey_response.endTime', 'DESC')
      .take(80);

    if (surveyId) {
      query.andWhere('survey.id = :surveyId', { surveyId: surveyId.toLowerCase() });
    }

    return query.getMany();
  }
}
