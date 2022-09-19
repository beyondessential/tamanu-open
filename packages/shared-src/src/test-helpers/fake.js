import { random, sample } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import Chance from 'chance';
import {
  DIAGNOSIS_CERTAINTY_VALUES,
  ENCOUNTER_TYPE_VALUES,
  IMAGING_REQUEST_STATUS_TYPES,
  PROGRAM_DATA_ELEMENT_TYPE_VALUES,
  REFERENCE_TYPE_VALUES,
  VISIBILITY_STATUSES,
} from 'shared/constants';
import { toDateTimeString, toDateString } from '../utils/dateTime';

const chance = new Chance();

export function fakeStringFields(prefix, fields) {
  return fields.reduce(
    (obj, field) => ({
      ...obj,
      [field]: prefix + field,
    }),
    {},
  );
}

export function fakeScheduledVaccine(prefix = 'test-') {
  const id = uuidv4();
  return {
    weeksFromBirthDue: random(0, 1000),
    weeksFromLastVaccinationDue: null,
    index: random(0, 50),
    vaccineId: null,
    visibilityStatus: VISIBILITY_STATUSES.CURRENT,
    ...fakeStringFields(`${prefix}scheduledVaccine_${id}_`, [
      'id',
      'category',
      'label',
      'schedule',
    ]),
  };
}

export function fakeSurvey(prefix = 'test-') {
  const id = uuidv4();
  return {
    programId: null,
    surveyType: 'programs',
    isSensitive: false,
    ...fakeStringFields(`${prefix}survey_${id}_`, ['id', 'code', 'name']),
  };
}

export function fakeSurveyScreenComponent(prefix = 'test-') {
  const id = uuidv4();
  return {
    surveyId: null,
    dataElementId: null,
    screenIndex: random(0, 100),
    componentIndex: random(0, 100),
    options: '{"foo":"bar"}',
    calculation: '',
    ...fakeStringFields(`${prefix}surveyScreenComponent_${id}_`, [
      'id',
      'text',
      'visibilityCriteria',
      'validationCriteria',
      'detail',
      'config',
    ]),
  };
}

export function fakeProgramDataElement(prefix = 'test-') {
  const id = uuidv4();
  return {
    type: sample(PROGRAM_DATA_ELEMENT_TYPE_VALUES),
    ...fakeStringFields(`${prefix}programDataElement_${id}_`, [
      'id',
      'code',
      'name',
      'indicator',
      'defaultText',
      'defaultOptions',
    ]),
  };
}

export function fakeReferenceData(prefix = 'test-') {
  const id = uuidv4();
  return {
    type: sample(REFERENCE_TYPE_VALUES),
    visibilityStatus: VISIBILITY_STATUSES.CURRENT,
    ...fakeStringFields(`${prefix}referenceData_${id}_`, ['id', 'name', 'code']),
  };
}

export function fakeUser(prefix = 'test-') {
  const id = uuidv4();
  return fakeStringFields(`${prefix}user_${id}_`, ['id', 'email', 'displayName', 'role']);
}

export function fakeProgram(prefix = 'test-') {
  const id = uuidv4();
  return fakeStringFields(`${prefix}program_${id})_`, ['id', 'name', 'code']);
}

export function fakeAdministeredVaccine(prefix = 'test-', scheduledVaccineId) {
  const id = uuidv4();
  return {
    encounterId: null,
    scheduledVaccineId,
    date: new Date(random(0, Date.now())),
    ...fakeStringFields(`${prefix}administeredVaccine_${id}_`, ['id', 'batch', 'status', 'reason']),
  };
}

export function fakeEncounter(prefix = 'test-') {
  const id = uuidv4();
  return {
    deviceId: null,
    surveyResponses: [],
    administeredVaccines: [],
    encounterType: sample(ENCOUNTER_TYPE_VALUES),
    startDate: new Date(random(0, Date.now())),
    endDate: new Date(random(0, Date.now())),
    ...fakeStringFields(`${prefix}encounter_${id}_`, ['id', 'reasonForEncounter']),
  };
}

export function fakeSurveyResponse(prefix = 'test-') {
  const id = uuidv4();
  return {
    answers: [],
    encounterId: null,
    surveyId: null,
    startTime: new Date(random(0, Date.now())),
    endTime: new Date(random(0, Date.now())),
    result: Math.random() * 100,
    ...fakeStringFields(`${prefix}surveyResponse_${id}_`, ['id']),
  };
}

export function fakeSurveyResponseAnswer(prefix = 'test-') {
  const id = uuidv4();
  return {
    dataElementId: null,
    responseId: null,
    ...fakeStringFields(`${prefix}surveyResponseAnswer_${id}_`, ['id', 'name', 'body']),
  };
}

export function fakeEncounterDiagnosis(prefix = 'test-') {
  const id = uuidv4();
  return {
    certainty: sample(DIAGNOSIS_CERTAINTY_VALUES),
    date: new Date(random(0, Date.now())),
    isPrimary: sample([true, false]),
    encounterId: null,
    diagnosisId: null,
    ...fakeStringFields(`${prefix}encounterDiagnosis_${id}_`, ['id']),
  };
}

export function fakeEncounterMedication(prefix = 'test-') {
  const id = uuidv4();
  return {
    date: new Date(random(0, Date.now())),
    endDate: new Date(random(0, Date.now())),
    qtyMorning: random(0, 10),
    qtyLunch: random(0, 10),
    qtyEvening: random(0, 10),
    qtyNight: random(0, 10),
    ...fakeStringFields(`${prefix}encounterMedication_${id}_`, [
      'id',
      'prescription',
      'note',
      'indication',
      'route',
    ]),
  };
}

const fakeDate = () => new Date(random(0, Date.now()));
const fakeString = (model, { fieldName }, id) => `${model.name}.${fieldName}.${id}`;
const fakeDateTimeString = () => toDateTimeString(fakeDate());
const fakeDateString = () => toDateString(fakeDate());
const fakeInt = () => random(0, 10);
const fakeFloat = () => Math.random() * 1000;
const fakeBool = () => sample([true, false]);
const FIELD_HANDLERS = {
  'TIMESTAMP WITH TIME ZONE': fakeDate,
  DATETIME: fakeDate,
  date_time_string: fakeDateTimeString, // custom type used for datetime string storage
  date_string: fakeDateString, // custom type used for date string storage
  'VARCHAR(19)': fakeDateString, // VARCHAR(19) are used for date string storage
  'VARCHAR(255)': fakeString,
  'VARCHAR(31)': (...args) => fakeString(...args).slice(0, 31),
  TEXT: fakeString,
  INTEGER: fakeInt,
  FLOAT: fakeFloat,
  'TINYINT(1)': fakeBool,
  BOOLEAN: fakeBool,
  ENUM: (model, { type }) => sample(type.values),
};

const IGNORED_FIELDS = [
  'createdAt',
  'updatedAt',
  'deletedAt',
  'pushedAt',
  'pulledAt',
  'markedForPush',
  'markedForSync',
  'isPushing',
];

const MODEL_SPECIFIC_OVERRIDES = {
  Facility: () => ({
    email: chance.email(),
    contactNumber: chance.phone(),
    streetAddress: `${chance.natural({ max: 999 })} ${chance.street()}`,
    cityTown: chance.city(),
    division: chance.province({ full: true }),
    type: chance.pickone(['hospital', 'clinic']),
    visibilityStatus: VISIBILITY_STATUSES.CURRENT,
  }),
  ImagingRequest: () => ({
    status: chance.pickone(Object.values(IMAGING_REQUEST_STATUS_TYPES)),
  }),
  Patient: () => {
    const sex = chance.pickone(['male', 'female', 'other']);
    let nameGender;
    if (sex === 'male' || sex === 'female') {
      nameGender = sex;
    }
    return {
      displayId: chance.hash({ length: 8 }),
      sex,
      firstName: chance.first({ gender: nameGender }),
      middleName: chance.first({ gender: nameGender }),
      lastName: chance.last(),
      culturalName: chance.first({ gender: nameGender }),
      dateOfDeath: null,
      email: chance.email(),
    };
  },
  PatientAdditionalData: () => ({
    placeOfBirth: chance.city(),
    bloodType: chance.pickone(['O', 'A', 'B', 'AB']) + chance.pickone(['+', '-']),
    primaryContactNumber: chance.phone(),
    secondaryContactNumber: chance.phone(),
    maritalStatus: chance.pickone([
      'Single',
      'Married',
      'Widowed',
      'Divorced',
      'Separated',
      'De Facto',
    ]),
    cityTown: chance.city(),
    streetVillage: chance.street(),
    educationalLevel: chance.pickone([
      'None',
      'Primary',
      'High School',
      'Bachelors',
      'Masters',
      'PhD.',
    ]),
    socialMedia: `@${chance.word()}`,
    title: chance.prefix(),
    birthCertificate: `BC${chance.natural({ min: 1000000, max: 9999999 })}`,
    drivingLicense: `L${chance.natural({ min: 100000, max: 999999 })}`,
    passport: chance.character() + chance.natural({ min: 10000000, max: 99999999 }).toString(),
    emergencyContactName: chance.name(),
    emergencyContactNumber: chance.phone(),
  }),
  PatientDeathData: () => {
    const options = ['yes', 'no', 'unknown', null];
    return {
      wasPregnant: sample(options),
      pregnancyContributed: sample(options),
      recentSurgery: sample(options),
      stillborn: sample(options),
    };
  },
  User: () => ({
    email: chance.email(),
    displayName: chance.name(),
    role: 'practitioner',
  }),
  Survey: () => ({
    isSensitive: false,
  }),
  Encounter: () => ({
    encounterType: sample(ENCOUNTER_TYPE_VALUES),
  }),
};

export const fake = (model, passedOverrides = {}) => {
  const id = uuidv4();
  const record = {};
  const modelOverridesFn = MODEL_SPECIFIC_OVERRIDES[model.name];
  const modelOverrides = modelOverridesFn ? modelOverridesFn() : {};
  const overrides = { ...modelOverrides, ...passedOverrides };
  const overrideFields = Object.keys(overrides);

  for (const [name, attribute] of Object.entries(model.tableAttributes)) {
    const { type, fieldName } = attribute;

    if (overrideFields.includes(fieldName)) {
      record[name] = overrides[fieldName];
    } else if (attribute.references) {
      // null out id fields
      record[name] = null;
    } else if (IGNORED_FIELDS.includes(fieldName)) {
      // ignore metadata fields
    } else if (FIELD_HANDLERS[type]) {
      record[name] = FIELD_HANDLERS[type](model, attribute, id);
    } else {
      // if you hit this error, you probably need to add a new field handler or a model-specific override
      throw new Error(`Could not fake field ${model.name}.${name} of type ${type}`);
    }
  }
  return record;
};
