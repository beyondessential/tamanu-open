import { keyBy, groupBy, uniqWith, isEqual } from 'lodash';
import { Op } from 'sequelize';
import moment from 'moment';
import { generateReportFromQueryData } from './utilities';
import { transformAnswers } from './utilities/transformAnswers';

const parametersToSurveyResponseSqlWhere = (parameters, surveyIds) => {
  const defaultWhereClause = {
    '$surveyResponse.survey_id$': surveyIds,
  };

  if (!parameters || !Object.keys(parameters).length) {
    return defaultWhereClause;
  }

  const whereClause = Object.entries(parameters)
    .filter(([, val]) => val)
    .reduce((where, [key, value]) => {
      const newWhere = { ...where };
      switch (key) {
        case 'fromDate':
          if (!newWhere['$surveyResponse.end_time$']) {
            newWhere['$surveyResponse.end_time$'] = {};
          }
          newWhere['$surveyResponse.end_time$'][Op.gte] = value;
          break;
        case 'toDate':
          if (!newWhere['$surveyResponse.end_time$']) {
            newWhere['$surveyResponse.end_time$'] = {};
          }
          newWhere['$surveyResponse.end_time$'][Op.lte] = value;
          break;
        default:
          break;
      }
      return newWhere;
    }, defaultWhereClause);

  return whereClause;
};

const getAnswers = async (models, parameters, surveyIds) =>
  models.SurveyResponseAnswer.findAll({
    where: {
      ...parametersToSurveyResponseSqlWhere(parameters, surveyIds),
      body: {
        [Op.not]: '',
      },
    },
    include: [
      {
        model: models.SurveyResponse,
        as: 'surveyResponse',
        include: [
          {
            model: models.Encounter,
            as: 'encounter',
            include: [
              {
                model: models.Patient,
                as: 'patient',
              },
            ],
          },
        ],
      },
    ],
    order: [[{ model: models.SurveyResponse, as: 'surveyResponse' }, 'end_time', 'ASC']],
  });

const getPerPatientPerDateAnswerKey = (patientId, dataElementId, responseDate) =>
  `${patientId}|${dataElementId}|${responseDate}`;

const getPerPatientAnswerKey = (patientId, dataElementId) => `${patientId}|${dataElementId}`;

const getLatestAnswerPerGroup = groupedTransformAnswers => {
  const results = {};
  for (const [key, groupedAnswers] of Object.entries(groupedTransformAnswers)) {
    const sortedLatestToOldestAnswers = groupedAnswers.sort((a1, a2) =>
      moment(a2.responseEndTime).diff(moment(a1.responseEndTime)),
    );
    results[key] = sortedLatestToOldestAnswers[0]?.body;
  }
  return results;
};

const getLatestAnswerPerPatient = answers => {
  const groupedAnswers = groupBy(answers, a =>
    getPerPatientAnswerKey(a.patientId, a.dataElementId),
  );
  return getLatestAnswerPerGroup(groupedAnswers);
};

const getLatestAnswerPerPatientPerDate = answers => {
  const groupedAnswers = groupBy(answers, a => {
    const responseDate = moment(a.responseEndTime).format('DD-MM-YYYY');
    return getPerPatientPerDateAnswerKey(a.patientId, a.dataElementId, responseDate);
  });
  return getLatestAnswerPerGroup(groupedAnswers);
};

/**
 * Get patient ids that have answers grouped by the survey response dates.
 * Eg:
 * {
 *    '12-08-2021': [
 *      'PatientID123',
 *      'PatientID456'
 *    ]
 * }
 * @param {*} transformedAnswers
 * @returns
 */
const getPatientIdsByResponseDates = transformedAnswers => {
  // get the unique combo of patientId and responseDate
  const patientIdAndResponseDateHavingAnswers = uniqWith(
    transformedAnswers.map(({ patientId, responseEndTime }) => ({
      patientId,
      responseDate: moment(responseEndTime).format('DD-MM-YYYY'),
    })),
    isEqual,
  );

  // Group the combo objects above by response date
  const groupedPatientIdAndResponseDate = groupBy(
    patientIdAndResponseDateHavingAnswers,
    'patientId',
  );

  // Manipulate the grouped object into so we can iterate through to generate report data
  // {
  //    '12-08-2021': [
  //      'PatientID123',
  //      'PatientID456'
  //    ]
  // }
  const patientIdsHavingAnswersByResponseDates = {};
  for (const [patientId, patientIdAndResponseDateObjects] of Object.entries(
    groupedPatientIdAndResponseDate,
  )) {
    patientIdsHavingAnswersByResponseDates[patientId] = patientIdAndResponseDateObjects.map(
      ({ responseDate }) => responseDate,
    );
  }
  return patientIdsHavingAnswersByResponseDates;
};

export const dataGenerator = async (
  { models },
  parameters = {},
  surveyIds,
  surveyDataElementIdsLatestPerPatient,
  surveyDataElementIdsLatestPerPatientPerDate,
  reportColumnTemplate,
) => {
  const answers = await getAnswers(models, parameters, surveyIds);
  const components = await models.SurveyScreenComponent.getComponentsForSurveys(surveyIds);
  const transformedAnswers = await transformAnswers(models, answers, components);
  const answersForPerPatient = transformedAnswers.filter(a =>
    Object.values(surveyDataElementIdsLatestPerPatient).includes(a.dataElementId),
  );
  const answersForPerPatientPerDate = transformedAnswers.filter(a =>
    Object.values(surveyDataElementIdsLatestPerPatientPerDate).includes(a.dataElementId),
  );
  const latestAnswersPerPatient = getLatestAnswerPerPatient(answersForPerPatient);
  const latestAnswersPerPatientPerDate = getLatestAnswerPerPatientPerDate(
    answersForPerPatientPerDate,
  );
  const patients = answers.map(a => a.surveyResponse?.encounter?.patient);
  const patientById = keyBy(patients, 'id');
  const patientIdsByResponseDates = getPatientIdsByResponseDates(answersForPerPatientPerDate);

  const reportData = [];

  for (const [patientId, surveyResponseDates] of Object.entries(patientIdsByResponseDates)) {
    const patient = patientById[patientId];
    for (const surveyResponseDate of surveyResponseDates) {
      if (!patient) {
        continue;
      }

      const dateOfBirthMoment = patient.dateOfBirth ?? moment(patient.dateOfBirth);
      const dateOfBirth = dateOfBirthMoment ? moment(dateOfBirthMoment).format('DD-MM-YYYY') : '';
      const age = dateOfBirthMoment ? moment().diff(dateOfBirthMoment, 'years') : '';
      const recordData = {
        clientId: patient.displayId,
        gender: patient.sex,
        dateOfBirth,
        age,
      };

      // Get the answers for data elements that we need to show latest PER PATIENT
      Object.entries(surveyDataElementIdsLatestPerPatient).forEach(([key, dataElementId]) => {
        recordData[key] =
          latestAnswersPerPatient[
            getPerPatientAnswerKey(patientId, dataElementId, surveyResponseDate)
          ];
      });

      // Get the answers for data elements that we need to show latest PER PATIENT PER DATE
      Object.entries(surveyDataElementIdsLatestPerPatientPerDate).forEach(
        ([key, dataElementId]) => {
          recordData[key] =
            latestAnswersPerPatientPerDate[
              getPerPatientPerDateAnswerKey(patientId, dataElementId, surveyResponseDate)
            ];
        },
      );

      reportData.push(recordData);
    }
  }

  return generateReportFromQueryData(reportData, reportColumnTemplate);
};
