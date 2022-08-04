import { Sequelize } from 'sequelize';
import { InvalidOperationError } from 'shared/errors';
import { PROGRAM_DATA_ELEMENT_TYPES } from 'shared/constants';
import { Model } from './Model';
import { runCalculations } from '../utils/calculations';
import { getStringValue, getResultValue } from '../utils/fields';

async function createPatientIssues(models, questions, patientId) {
  const issueQuestions = questions.filter(
    q => q.dataElement.type === PROGRAM_DATA_ELEMENT_TYPES.PATIENT_ISSUE,
  );
  for (const question of issueQuestions) {
    const { config: configString } = question;
    const config = JSON.parse(configString) || {};
    if (!config.issueNote || !config.issueType) {
      throw new InvalidOperationError(`Ill-configured PatientIssue with config: ${configString}`);
    }
    await models.PatientIssue.create({
      patientId,
      type: config.issueType,
      note: config.issueNote,
    });
  }
}

async function writeToPatientFields(models, questions, answers, patientId) {
  // these will store values to write to patient records following submission
  const patientRecordValues = {};
  const patientAdditionalDataValues = {};

  const writeQuestions = questions.filter(
    q => q.dataElement.type === PROGRAM_DATA_ELEMENT_TYPES.PATIENT_DATA,
  );
  for (const question of writeQuestions) {
    const { dataElement, config: configString } = question;
    const config = JSON.parse(configString) || {};

    const { fieldName, isAdditionalDataField } = config.writeToPatient || {};
    if (!fieldName) {
      throw new Error('No fieldName defined for writeToPatient config');
    }

    const value = answers[dataElement.id];
    if (isAdditionalDataField) {
      patientAdditionalDataValues[fieldName] = value;
    } else {
      patientRecordValues[fieldName] = value;
    }
  }

  // Save values to database records
  const { Patient, PatientAdditionalData } = models;
  if (Object.keys(patientRecordValues).length) {
    await Patient.update(patientRecordValues, { where: { id: patientId } });
  }
  if (Object.keys(patientAdditionalDataValues).length) {
    const pad = await PatientAdditionalData.getOrCreateForPatient(patientId);
    await pad.update(patientAdditionalDataValues);
  }
}

async function handleSurveyResponseActions(models, questions, actions, answers, patientId) {
  const activeQuestions = questions.filter(q => actions[q.dataElementId]);
  await createPatientIssues(models, activeQuestions, patientId);
  await writeToPatientFields(models, activeQuestions, answers, patientId);
}

export class SurveyResponse extends Model {
  static init({ primaryKey, ...options }) {
    super.init(
      {
        id: primaryKey,

        startTime: { type: Sequelize.DATE, allowNull: true },
        endTime: { type: Sequelize.DATE, allowNull: true },
        result: { type: Sequelize.FLOAT, allowNull: true },
        resultText: { type: Sequelize.TEXT, allowNull: true },
      },
      options,
    );
  }

  static initRelations(models) {
    this.belongsTo(models.Survey, {
      foreignKey: 'surveyId',
      as: 'survey',
    });

    this.belongsTo(models.Encounter, {
      foreignKey: 'encounterId',
      as: 'encounter',
    });

    this.hasMany(models.SurveyResponseAnswer, {
      foreignKey: 'responseId',
      as: 'answers',
    });

    this.hasOne(models.Referral, {
      foreignKey: 'surveyResponseId',
      as: 'referral',
    });
  }

  static async getSurveyEncounter({ encounterId, patientId, reasonForEncounter, ...responseData }) {
    const { Encounter } = this.sequelize.models;

    if (encounterId) {
      return Encounter.findByPk(encounterId);
    }

    if (!patientId) {
      throw new InvalidOperationError(
        'A survey response must have an encounter or patient ID attached',
      );
    }

    // find open encounter
    const openEncounter = await Encounter.findOne({
      where: {
        patientId,
        endDate: null,
      },
    });

    if (openEncounter) {
      return openEncounter;
    }

    const { departmentId, examinerId, locationId } = responseData;

    // need to create a new encounter
    return Encounter.create({
      patientId,
      encounterType: 'surveyResponse',
      reasonForEncounter,
      departmentId,
      examinerId,
      locationId,
      startDate: Date.now(),
      endDate: Date.now(),
    });
  }

  static async createWithAnswers(data) {
    if (!this.sequelize.isInsideTransaction()) {
      throw new Error('SurveyResponse.createWithAnswers must always run inside a transaction!');
    }
    const { models } = this.sequelize;
    const { answers, actions = {}, surveyId, patientId, encounterId, ...responseData } = data;

    // ensure survey exists
    const survey = await models.Survey.findByPk(surveyId);
    if (!survey) {
      throw new InvalidOperationError(`Invalid survey ID: ${surveyId}`);
    }

    const questions = await models.SurveyScreenComponent.getComponentsForSurvey(surveyId);

    const calculatedAnswers = runCalculations(questions, answers);
    const finalAnswers = {
      ...answers,
      ...calculatedAnswers,
    };

    const { result, resultText } = getResultValue(questions, answers);

    const encounter = await this.getSurveyEncounter({
      encounterId,
      patientId,
      reasonForEncounter: `Survey response for ${survey.name}`,
      ...responseData,
    });
    const record = await SurveyResponse.create({
      patientId,
      surveyId,
      encounterId: encounter.id,
      result,
      resultText,
      // put responseData last to allow for user to override
      // resultText by including it in the data
      // this is used by reports test where the resultText
      // is included in the payload
      ...responseData,
    });

    const findDataElement = id => {
      const component = questions.find(c => c.dataElement.id === id);
      if (!component) return null;
      return component.dataElement;
    };

    // create answer records
    for (const a of Object.entries(finalAnswers)) {
      const [dataElementId, value] = a;
      const dataElement = findDataElement(dataElementId);
      if (!dataElement) {
        throw new Error(`no data element for question: ${dataElementId}`);
      }
      const body = getStringValue(dataElement.type, value);
      await models.SurveyResponseAnswer.create({
        dataElementId: dataElement.id,
        body,
        responseId: record.id,
      });
    }

    await handleSurveyResponseActions(
      models,
      questions,
      actions,
      finalAnswers,
      encounter.patientId,
    );

    return record;
  }
}
