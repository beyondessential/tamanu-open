import { subDays } from 'date-fns';
import { groupBy } from 'lodash';
import { Op } from 'sequelize';
import moment from 'moment';
import { LAB_REQUEST_STATUSES, LAB_REQUEST_STATUS_LABELS } from '../../constants';
import { generateReportFromQueryData } from '../utilities';
import { transformAnswers } from '../utilities/transformAnswers';

const WILLIAM_HOROTO_IDS = [
  'f4a0e3f0-54da-4fc9-a73e-1b72c9ca92a5', // Kiribati
  '4d719b6f-af55-42ac-99b3-5a27cadaab2b', // Palau
  '2d574680-e0fc-4956-a37e-121ccb434995', // Fiji
  'e8a51fc9-28fd-4284-8d00-9ef87bd8d855', // Nauru // TFAI897159
  'c11229a7-b95c-4416-a3ad-560cd75d8f21', // Nauru // RQCO669542
  'cebdd9a4-2744-4ad2-9919-98dc0b15464c', // Dev - for testing purposes
];

const YIELD_EVERY_N_LOOPS = 100;

const yieldControl = () => new Promise(resolve => setTimeout(resolve, 20));

const parametersToLabTestSqlWhere = parameters => {
  const defaultWhereClause = {
    '$labRequest.lab_test_category_id$': ['labTestCategory-COVID', 'labTestCategory-COVIDRAT'],
    '$labRequest.status$': {
      [Op.ne]: LAB_REQUEST_STATUSES.DELETED,
    },
    '$labRequest->encounter->patient.id$': {
      [Op.notIn]: WILLIAM_HOROTO_IDS,
    },
  };

  if (!parameters || !Object.keys(parameters).length) {
    return defaultWhereClause;
  }

  const whereClause = Object.entries(parameters)
    .filter(([, val]) => val)
    .reduce((where, [key, value]) => {
      const newWhere = { ...where };
      switch (key) {
        case 'village':
          newWhere['$labRequest->encounter->patient.village_id$'] = value;
          break;
        case 'labTestLaboratory':
          newWhere['$labRequest.lab_test_laboratory_id$'] = value;
          break;
        default:
          break;
      }
      return newWhere;
    }, defaultWhereClause);

  return whereClause;
};

const parametersToSurveyResponseSqlWhere = (parameters, { surveyId }) => {
  const defaultWhereClause = {
    '$surveyResponse.survey_id$': surveyId,
  };

  if (!parameters || !Object.keys(parameters).length) {
    return defaultWhereClause;
  }

  const whereClause = Object.entries(parameters)
    .filter(([, val]) => val)
    .reduce((where, [key, value]) => {
      const newWhere = { ...where };
      switch (key) {
        case 'village':
          newWhere['$surveyResponse->encounter->patient.village_id$'] = value;
          break;
        default:
          break;
      }
      return newWhere;
    }, defaultWhereClause);

  return whereClause;
};

const getLabTests = async (models, parameters) =>
  models.LabTest.findAll({
    include: [
      {
        model: models.LabRequest,
        as: 'labRequest',
        include: [
          {
            model: models.Encounter,
            as: 'encounter',
            include: [
              {
                model: models.Patient,
                as: 'patient',
                include: [
                  {
                    model: models.PatientAdditionalData,
                    as: 'additionalData',
                    include: ['ethnicity', 'nationality'],
                  },
                  'village',
                ],
              },
              {
                model: models.Location,
                as: 'location',
                include: ['facility'],
              },
            ],
          },
          { model: models.ReferenceData, as: 'category' },
          { model: models.ReferenceData, as: 'priority' },
          { model: models.ReferenceData, as: 'laboratory' },
          { model: models.User, as: 'requestedBy' },
        ],
      },
      {
        model: models.ReferenceData,
        as: 'labTestMethod',
      },
      {
        model: models.LabTestType,
        as: 'labTestType',
      },
    ],
    where: parametersToLabTestSqlWhere(parameters),
    order: [['date', 'ASC']],
    raw: true,
    nest: true,
  });

const getFijiCovidAnswers = async (models, parameters, { surveyId, dateFormat }) => {
  // Use the latest survey responses per patient above to get the corresponding answers
  const answers = await models.SurveyResponseAnswer.findAll({
    where: parametersToSurveyResponseSqlWhere(parameters, { surveyId }),
    include: [
      {
        model: models.SurveyResponse,
        as: 'surveyResponse',
        include: [
          {
            model: models.Encounter,
            as: 'encounter',
            // patient is only necessary if a village is specified
            ...(parameters.village
              ? {
                  include: [
                    {
                      model: models.Patient,
                      as: 'patient',
                    },
                  ],
                }
              : {}),
          },
        ],
        order: [['end_time', 'ASC']],
      },
    ],
    raw: true,
    nest: true,
  });

  const components = await models.SurveyScreenComponent.getComponentsForSurvey(surveyId);

  const transformedAnswers = await transformAnswers(models, answers, components, {
    dateFormat,
  });

  return transformedAnswers;
};

// Find latest survey response within date range using the answers.
const getLatestPatientAnswerInDateRange = (
  transformedAnswersByPatientAndDataElement,
  currentlabTestDate,
  nextLabTestDate,
  patientId,
  dataElementId,
) => {
  const patientTransformedAnswers =
    transformedAnswersByPatientAndDataElement[`${patientId}|${dataElementId}`];

  if (!patientTransformedAnswers) {
    return undefined;
  }

  const sortedLatestToOldestAnswers = patientTransformedAnswers.sort((a1, a2) =>
    moment(a2.responseEndTime).diff(moment(a1.responseEndTime)),
  );

  const latestAnswer = sortedLatestToOldestAnswers.find(a =>
    moment(a.responseEndTime).isBetween(
      currentlabTestDate,
      nextLabTestDate,
      undefined,
      '[)', // '[)' means currentLabTestDate <= surveyResponse.endTime < nextLabTestDate
    ),
  );

  return latestAnswer?.body;
};

const getLabTestRecords = async (
  labTests,
  transformedAnswers,
  parameters,
  { surveyQuestionCodes, dateFormat },
) => {
  const transformedAnswersByPatientAndDataElement = groupBy(
    transformedAnswers,
    a => `${a.patientId}|${a.dataElementId}`,
  );

  // Group the lab tests by patient so that we can determine the correct sample collection form for each lab request
  // For example, If a patient have 3 lab requests (1st on July 1st, 2nd on July 10th and 3rd on July 15th).
  // For the first request, it should pick the latest sample collection form from July 1st - 9th
  // For the second request, it should pick the latest sample collection forms from July 10th - 14th
  // For the third request, it should pick the latest sample collection form from July 15th onwards.
  const labTestsByPatientId = groupBy(
    labTests,
    labTest => labTest?.labRequest?.encounter?.patientId,
  );

  const results = [];
  let totalLoops = 0;

  for (const [patientId, patientLabTests] of Object.entries(labTestsByPatientId)) {
    // lab tests were already sorted by 'date' ASC in the sql.
    for (let i = 0; i < patientLabTests.length; i++) {
      totalLoops++;
      if (totalLoops % YIELD_EVERY_N_LOOPS === 0) {
        await yieldControl();
      }

      const labTest = patientLabTests[i];
      const currentLabTestDate = moment(labTest.date).startOf('day');

      // Get all lab tests regardless and filter fromDate and toDate in memory
      // to ensure that we have the date range from current lab test to the next lab test correctly.
      if (
        parameters.fromDate &&
        currentLabTestDate.isBefore(moment(parameters.fromDate).startOf('day'))
      ) {
        continue;
      }

      if (parameters.toDate && currentLabTestDate.isAfter(moment(parameters.toDate).endOf('day'))) {
        continue;
      }

      const nextLabTest = patientLabTests[i + 1];
      let nextLabTestDate;

      if (nextLabTest) {
        const { date: nextLabTestTimestamp } = nextLabTest;
        // if next lab test not on the same date (next one on a different date,
        // startOf('day') to exclude the next date when comparing range later
        if (!currentLabTestDate.isSame(nextLabTestTimestamp, 'day')) {
          nextLabTestDate = moment(nextLabTestTimestamp).startOf('day');
        } else {
          // if next lab test on the same date, just use its raw timestamp
          nextLabTestDate = moment(nextLabTestTimestamp);
        }
      } else {
        // use current time if there's no next lab test
        nextLabTestDate = moment();
      }

      const { labRequest } = labTest;
      const encounter = labRequest?.encounter;
      const patient = encounter?.patient;
      const village = patient?.village?.name;
      const patientAdditionalData = patient?.additionalData?.[0];

      const formatDate = date => (date ? moment(date).format(dateFormat) : '');

      const labTestRecord = {
        firstName: patient?.firstName,
        lastName: patient?.lastName,
        dob: formatDate(patient?.dateOfBirth),
        sex: patient?.sex,
        patientId: patient?.displayId,
        village,
        labRequestId: labRequest?.displayId,
        labRequestType: labRequest?.category?.name,
        labTestType: labTest?.labTestType?.name,
        status: LAB_REQUEST_STATUS_LABELS[labRequest?.status] || labRequest?.status,
        result: labTest.result,
        requestedBy: labRequest?.requestedBy?.displayName,
        submittedDate: formatDate(labTest.date),
        requestedDate: formatDate(labRequest.requestedDate),
        testingDate: formatDate(labTest.completedDate),
        testingTime: labTest.completedDate ? moment(labTest.completedDate).format('LTS') : '',
        priority: labRequest?.priority?.name,
        testingLaboratory: labRequest?.laboratory?.name,
        laboratoryOfficer: labTest?.laboratoryOfficer,
        labTestMethod: labTest?.labTestMethod?.name,
        additionalDataEthnicity: patientAdditionalData?.ethnicity?.name,
        additionalDataNationality: patientAdditionalData?.nationality?.name,
        additionalDataPassportNumber: patientAdditionalData?.passport,
        sampleTime: labRequest?.sampleTime,
        facilityName: encounter?.location?.facility?.name,
      };
      Object.entries(surveyQuestionCodes).forEach(([key, dataElement]) => {
        labTestRecord[key] = getLatestPatientAnswerInDateRange(
          transformedAnswersByPatientAndDataElement,
          currentLabTestDate,
          nextLabTestDate,
          patientId,
          dataElement,
        );
      });

      results.push(labTestRecord);
    }
  }

  return results;
};

export const baseDataGenerator = async (
  { models },
  parameters = {},
  { surveyId, reportColumnTemplate, surveyQuestionCodes, dateFormat = 'YYYY/MM/DD' },
) => {
  const labTests = await getLabTests(models, parameters);
  const transformedAnswers = await getFijiCovidAnswers(models, parameters, {
    surveyId,
    dateFormat,
  });
  const reportData = await getLabTestRecords(labTests, transformedAnswers, parameters, {
    surveyQuestionCodes,
    dateFormat,
  });

  return generateReportFromQueryData(reportData, reportColumnTemplate);
};

export const permission = 'LabTest';
