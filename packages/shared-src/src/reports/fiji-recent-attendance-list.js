import { Op } from 'sequelize';
import moment from 'moment';
import { DIAGNOSIS_CERTAINTY } from 'shared/constants';
import { getAgeFromDate } from 'shared/utils/date';
import { generateReportFromQueryData } from './utilities';

const FIELD_TO_TITLE = {
  firstName: 'First name',
  lastName: 'Last name',
  displayId: 'Patient ID',
  age: 'Age',
  sex: 'Gender',
  ethnicity: 'Ethnicity',
  contactPhone: 'Contact number',
  subdivision: 'Subdivision',
  medicalArea: 'Medical Area',
  nursingZone: 'Nursing Zone',
  clinician: 'Clinician',
  dateOfAttendance: 'Date of attendance',
  department: 'Department',
  location: 'Location',
  reasonForAttendance: 'Reason for attendance',
  primaryDiagnosis: 'Primary diagnosis',
  otherDiagnoses: 'Other diagnoses',
};

const reportColumnTemplate = Object.entries(FIELD_TO_TITLE).map(([key, title]) => ({
  title,
  accessor: data => data[key],
}));

const parametersToEncounterSqlWhere = parameters =>
  Object.entries(parameters)
    .filter(([, val]) => val)
    .reduce((where, [key, value]) => {
      const newWhere = { ...where };
      switch (key) {
        case 'village':
          newWhere['$patient.village_id$'] = value;
          break;
        case 'diagnosis':
          newWhere['$diagnoses.diagnosis_id$'] = value;
          break;
        case 'fromDate':
          if (!newWhere.startDate) {
            newWhere.startDate = {};
          }
          newWhere.startDate[Op.gte] = moment(value).startOf('day');
          break;
        case 'toDate':
          if (!newWhere.startDate) {
            newWhere.startDate = {};
          }
          newWhere.startDate[Op.lte] = moment(value).endOf('day');
          break;
        default:
          break;
      }
      return newWhere;
    }, {});

const getEncounters = async (models, parameters) => {
  const encounters = await models.Encounter.findAll({
    attributes: ['startDate', 'reasonForEncounter', 'id'],
    include: [
      {
        model: models.Patient,
        as: 'patient',
        attributes: ['firstName', 'lastName', 'displayId', 'dateOfBirth', 'sex', 'id'],
        include: [
          {
            model: models.PatientAdditionalData,
            as: 'additionalData',
            include: ['ethnicity', 'medicalArea', 'nursingZone'],
          },
          'village',
        ],
      },
      {
        model: models.EncounterDiagnosis,
        as: 'diagnoses',
        include: ['Diagnosis'],
        attributes: ['certainty', 'isPrimary'],
        where: {
          certainty: {
            [Op.notIn]: [DIAGNOSIS_CERTAINTY.DISPROVEN, DIAGNOSIS_CERTAINTY.ERROR],
          },
        },
        required: false,
      },
      'examiner',
      'department',
      'location',
    ],
    where: parametersToEncounterSqlWhere(parameters),
    order: [['startDate', 'ASC']],
  });

  return encounters.map(convertModelToPlainObject);
};

const convertModelToPlainObject = model => model.get({ plain: true });

const getAllDiagnoses = async (models, encounters) => {
  const newEncounters = [];

  for (const encounter of encounters) {
    newEncounters.push({
      ...encounter,
      diagnoses: await models.EncounterDiagnosis.findAll({
        include: ['Diagnosis'],
        attributes: ['certainty', 'isPrimary'],
        where: {
          certainty: {
            [Op.notIn]: [DIAGNOSIS_CERTAINTY.DISPROVEN, DIAGNOSIS_CERTAINTY.ERROR],
          },
          encounterId: encounter.id,
        },
        raw: true,
        nest: true,
      }),
    });
  }
  return newEncounters;
};

const stringifyDiagnoses = (diagnoses = []) =>
  diagnoses.map(({ Diagnosis, certainty }) => `${Diagnosis.name}: ${certainty}`).join(', ');

const transformDataPoint = encounter => {
  const { patient, examiner, diagnoses } = encounter;

  const patientAdditionalData = patient.additionalData?.[0];

  const primaryDiagnoses = diagnoses.filter(({ isPrimary }) => isPrimary);
  const otherDiagnoses = diagnoses.filter(({ isPrimary }) => !isPrimary);

  return {
    firstName: patient.firstName,
    lastName: patient.lastName,
    displayId: patient.displayId,
    age: getAgeFromDate(patient.dateOfBirth),
    sex: patient.sex,
    ethnicity: patientAdditionalData?.ethnicity?.name,
    contactPhone: patientAdditionalData?.primaryContactNumber,
    subdivision: patient.village?.name,
    medicalArea: patientAdditionalData?.medicalArea?.name,
    nursingZone: patientAdditionalData?.nursingZone?.name,
    clinician: examiner?.displayName,
    dateOfAttendance: moment(encounter.startDate).format('DD-MM-YYYY'),
    department: encounter.department?.name,
    location: encounter.location?.name,
    reasonForAttendance: encounter.reasonForEncounter,
    primaryDiagnosis: stringifyDiagnoses(primaryDiagnoses),
    otherDiagnoses: stringifyDiagnoses(otherDiagnoses),
  };
};

export const dataGenerator = async ({ models }, parameters = {}) => {
  let encounters = await getEncounters(models, parameters);
  if (parameters.diagnosis) {
    encounters = await getAllDiagnoses(models, encounters);
  }

  const reportData = encounters.map(transformDataPoint);
  return generateReportFromQueryData(reportData, reportColumnTemplate);
};

export const permission = 'Encounter';
