// function sleep(milliseconds) {
//   return new Promise(resolve => {
//     setTimeout(resolve, milliseconds);
//   });
// }
const getSortedData = (
  list = [],
  options = { page: 0, orderBy: '', order: 'asc', rowsPerPage: 10 },
) => {
  const sortedData =
    options.order && options.orderBy
      ? list.sort(({ [options.orderBy]: a }, { [options.orderBy]: b }) => {
          if (typeof a === 'string') {
            return options.order === 'asc' ? a.localeCompare(b) : b.localeCompare(a);
          }
          return options.order === 'asc' ? a - b : b - a;
        })
      : list;
  const startIndex = options.page * options.rowsPerPage || 0;
  const endIndex = startIndex + options.rowsPerPage ? options.rowsPerPage : sortedData.length;
  return {
    data: sortedData.slice(startIndex, endIndex),
    count: list.length,
  };
};
const mockSurvey = {
  id: 'program-tbprogram-tbfollowup',
  code: 'tbfollowup',
  name: 'TB Follow Up',
  surveyType: 'programs',
  isSensitive: false,
  updatedAtSyncTick: '-999',
  createdAt: '2023-09-27T22:21:03.107Z',
  updatedAt: '2023-09-27T22:21:03.107Z',
  programId: 'program-tbprogram',
  components: [
    {
      id: 'program-tbprogram-tbfollowup-PHTBFU001',
      screenIndex: 0,
      componentIndex: 0,
      text: '',
      visibilityCriteria: '',
      validationCriteria: '',
      detail: '',
      config: '{"source": "program-samoapubhealth-phtbcasesurvey"}',
      calculation: '',
      updatedAtSyncTick: '-999',
      createdAt: '2023-09-27T22:21:03.178Z',
      updatedAt: '2023-09-27T22:21:03.178Z',
      surveyId: 'program-tbprogram-tbfollowup',
      dataElementId: 'pde-PHTBFU001',
      dataElement: {
        id: 'pde-PHTBFU001',
        code: 'PHTBFU001',
        name: 'Initial screening survey',
        indicator: null,
        defaultText: 'Initial screening survey',
        visualisationConfig: '',
        type: 'SurveyLink',
        updatedAtSyncTick: '-999',
        createdAt: '2023-09-27T22:21:02.898Z',
        updatedAt: '2023-09-27T22:21:02.898Z',
        defaultOptions: null,
      },
      options: null,
    },
    {
      id: 'program-tbprogram-tbfollowup-PHTBFU0001a',
      screenIndex: 0,
      componentIndex: 0,
      text: '',
      visibilityCriteria: '',
      validationCriteria: '',
      detail: '',
      config: '{"source": "program-samoapubhealth-phtbcasesurvey2"}',
      calculation: '',
      updatedAtSyncTick: '-999',
      createdAt: '2023-09-27T22:21:03.178Z',
      updatedAt: '2023-09-27T22:21:03.178Z',
      surveyId: 'program-tbprogram-tbfollowup',
      dataElementId: 'pde-PHTBFU001a',
      dataElement: {
        id: 'pde-PHTBFU001a',
        code: 'PHTBFU001a',
        name: 'Registration status',
        indicator: null,
        defaultText: 'Registration status',
        visualisationConfig: '',
        type: 'Select',
        updatedAtSyncTick: '-999',
        createdAt: '2023-09-27T22:21:02.898Z',
        updatedAt: '2023-09-27T22:21:02.898Z',
        defaultOptions: { active: 'active', inactive: 'inactive' },
      },
      options: null,
    },
    {
      id: 'program-tbprogram-tbfollowup-PHTBFU0010',
      screenIndex: 0,
      componentIndex: 0,
      text: '',
      visibilityCriteria: '',
      validationCriteria: '',
      detail: '',
      config:
        '{"column": "educationalLevel", "writeToPatient": { "fieldName": "educationalLevel" }}',
      calculation: '',
      updatedAtSyncTick: '-999',
      createdAt: '2023-09-27T22:21:03.178Z',
      updatedAt: '2023-09-27T22:21:03.178Z',
      surveyId: 'program-tbprogram-tbfollowup',
      dataElementId: 'pde-PHTBFU001',
      dataElement: {
        id: 'pde-PHTBFU001',
        code: 'PHTBFU001',
        name: 'Educational Level',
        indicator: null,
        defaultText: 'Educational Level',
        visualisationConfig: '',
        type: 'PatientData',
        updatedAtSyncTick: '-999',
        createdAt: '2023-09-27T22:21:02.898Z',
        updatedAt: '2023-09-27T22:21:02.898Z',
        defaultOptions: null,
      },
      options: null,
    },
    {
      id: 'program-tbprogram-tbfollowup-PHTBFU001a',
      screenIndex: 0,
      componentIndex: 1,
      text: '',
      visibilityCriteria: '',
      validationCriteria: '',
      detail: '',
      config:
        '{"source":"Village", "column": "registrationCurrentlyAtVillage", "writeToPatient": { "fieldName": "registrationCurrentlyAtVillage" }}',
      calculation: '',
      updatedAtSyncTick: '-999',
      createdAt: '2023-09-27T22:21:03.178Z',
      updatedAt: '2023-09-27T22:21:03.178Z',
      surveyId: 'program-tbprogram-tbfollowup',
      dataElementId: 'pde-PHTBFU001a',
      dataElement: {
        id: 'pde-PHTBFU001a',
        code: 'PHTBFU001a',
        name: 'Current village',
        indicator: null,
        defaultText: 'Current village',
        visualisationConfig: '',
        type: 'Autocomplete',
        updatedAtSyncTick: '-999',
        createdAt: '2023-09-27T22:21:02.898Z',
        updatedAt: '2023-09-27T22:21:02.898Z',
        defaultOptions: null,
      },
      options: null,
    },
    {
      id: 'program-tbprogram-tbfollowup-PHTBFU013a',
      screenIndex: 0,
      componentIndex: 18,
      text: '',
      visibilityCriteria: '',
      validationCriteria: '',
      detail: '',
      config:
        '{"source":"ProgramRegistryClinicalStatus","column": "registrationClinicalStatus", "writeToPatient": { "fieldName": "registrationClinicalStatus" }}',
      calculation: '',
      updatedAtSyncTick: '-999',
      createdAt: '2023-09-27T22:21:03.178Z',
      updatedAt: '2023-09-27T22:21:03.178Z',
      surveyId: 'program-tbprogram-tbfollowup',
      dataElementId: 'pde-PHTBFU013a',
      dataElement: {
        id: 'pde-PHTBFU013a',
        code: 'PHTBFU013a',
        name: 'Clinical status',
        indicator: null,
        defaultText: 'Clinical status',
        visualisationConfig: '',
        type: 'Autocomplete',
        updatedAtSyncTick: '-999',
        createdAt: '2023-09-27T22:21:02.898Z',
        updatedAt: '2023-09-27T22:21:02.898Z',
        defaultOptions: null,
      },
      options: null,
    },
    {
      id: 'program-tbprogram-tbfollowup-PHTBFU014',
      screenIndex: 0,
      componentIndex: 19,
      text: '',
      visibilityCriteria: '',
      validationCriteria: '',
      detail: '',
      config: '',
      calculation: '',
      updatedAtSyncTick: '-999',
      createdAt: '2023-09-27T22:21:03.178Z',
      updatedAt: '2023-09-27T22:21:03.178Z',
      surveyId: 'program-tbprogram-tbfollowup',
      dataElementId: 'pde-PHTBFU014',
      dataElement: {
        id: 'pde-PHTBFU014',
        code: 'PHTBFU014',
        name: 'Comments',
        indicator: null,
        defaultText: 'Comments',
        visualisationConfig: '',
        type: 'FreeText',
        updatedAtSyncTick: '-999',
        createdAt: '2023-09-27T22:21:02.898Z',
        updatedAt: '2023-09-27T22:21:02.898Z',
        defaultOptions: null,
      },
      options: null,
    },
  ],
};
export const programRegistriesForInfoPaneList = [
  {
    id: '1e25e8d1-a2b4-4bfa-9670-9f6b689e8af7',
    registrationStatus: 'active',
    clinicalStatus: {
      name: 'Low risk',
      color: 'green',
    },
    programRegistry: {
      id: 'programRegistry-HepatitisBProgramRegistry',
      name: 'Hepatitis B',
    },
  },
];

export const patient = { id: 'patient_id' };
export const programRegistry1 = {
  id: '1',
  name: 'Hepatitis B',
  currentlyAtType: 'facility',
};
export const programRegistry2 = {
  id: '2',
  name: 'Pneomonia',
  currentlyAtType: 'facility',
};
export const programRegistry3 = {
  id: '3',
  name: 'Diabetis',
  currentlyAtType: 'village',
};

export const programRegistries = {
  data: [
    {
      id: '1e25e8d1-a2b4-4bfa-9670-9f6b689e8af7',
      date: '2023-10-16 23:14:22',
      registrationStatus: 'active',
      updatedAtSyncTick: '68824',
      createdAt: '2023-10-16T17:14:32.304Z',
      updatedAt: '2023-10-16T17:14:32.304Z',
      clinicianId: '90153d22-78e8-4ae9-8cfb-63c42946e833',
      patientId: '19324abf-b485-4184-8537-0a7fe4be1d0b',
      programRegistryId: 'programRegistry-HepatitisBProgramRegistry',
      clinicalStatusId: 'prClinicalStatus-LowRisk',
      facilityId: 'facility-ColonialWarMemorialDivisionalHospital',
      clinicalStatus: {
        id: 'prClinicalStatus-LowRisk',
        code: 'LowRisk',
        name: 'Low risk',
        color: 'green',
        visibilityStatus: 'current',
        updatedAtSyncTick: '-999',
        createdAt: '2023-09-26T06:53:03.872Z',
        updatedAt: '2023-09-26T06:53:03.872Z',
        programRegistryId: 'programRegistry-HepatitisBProgramRegistry',
      },
      programRegistry: {
        id: 'programRegistry-HepatitisBProgramRegistry',
        code: 'HepatitisBProgramRegistry',
        name: 'Hepatitis B',
        currentlyAtType: 'facility',
        visibilityStatus: 'current',
        updatedAtSyncTick: '-999',
        createdAt: '2023-09-26T06:53:03.814Z',
        updatedAt: '2023-09-26T06:53:03.814Z',
        programId: 'program-samoancdscreening',
      },
    },
    {
      id: '0fde6fbb-26a1-4258-b2ca-204d584a985f',
      date: '2023-10-29 21:33:09',
      registrationStatus: 'active',
      updatedAtSyncTick: '92156',
      createdAt: '2023-10-29T15:33:19.959Z',
      updatedAt: '2023-10-29T15:33:19.959Z',
      clinicianId: '90153d22-78e8-4ae9-8cfb-63c42946e833',
      patientId: '19324abf-b485-4184-8537-0a7fe4be1d0b',
      programRegistryId: 'programRegistry-tbprogramregistry',
      clinicalStatusId: 'prClinicalStatus-cured',
      facilityId: 'facility-ColonialWarMemorialDivisionalHospital',
      clinicalStatus: {
        id: 'prClinicalStatus-cured',
        code: 'cured',
        name: 'Cured',
        color: '19934E',
        visibilityStatus: 'current',
        updatedAtSyncTick: '-999',
        createdAt: '2023-09-27T22:21:03.033Z',
        updatedAt: '2023-09-27T22:21:03.033Z',
        programRegistryId: 'programRegistry-tbprogramregistry',
      },
      programRegistry: {
        id: 'programRegistry-tbprogramregistry',
        code: 'tbprogramregistry',
        name: 'TB Program Registry',
        currentlyAtType: 'village',
        visibilityStatus: 'current',
        updatedAtSyncTick: '-999',
        createdAt: '2023-09-27T22:21:02.971Z',
        updatedAt: '2023-09-27T22:21:02.971Z',
        programId: 'program-tbprogram',
      },
    },
  ],
};

export const programRegistryConditions = [
  { id: '1', name: 'Diabetes' },
  { id: '2', name: 'Hypertension' },
  { id: '3', name: 'Low pressure' },
  { id: '4', name: 'Migrain' },
  { id: '5', name: 'Joint pain' },
  { id: '6', name: 'Skin itching' },
  { id: '7', name: 'Tuberculosis of lung, bacteriologically and historically negative' },
];

export const programRegistryStatusHistories = [
  {
    id: '1',
    registrationStatus: 'active',
    clinicalStatusId: '1',
    clinicalStatus: {
      id: '1',
      name: 'Low risk',
      color: 'green',
    },
    clinicianId: '1',
    clinician: {
      id: '1',
      displayName: 'Tareq The First',
    },
    date: '2023-08-28T02:40:16.237Z',
    registrationDate: '2023-08-28T02:40:16.237Z',
  },
  {
    id: '2',
    registrationStatus: 'active',
    clinicalStatusId: '2',
    clinicalStatus: {
      id: '2',
      name: 'Needs review',
      color: 'yellow',
    },
    clinicianId: '2',
    clinician: {
      id: '2',
      displayName: 'Aziz',
    },
    date: '2023-08-28T02:40:16.237Z',
    registrationDate: '2023-08-28T02:40:16.237Z',
  },
  {
    id: '3',
    registrationStatus: 'active',
    clinicalStatusId: '3',
    clinicalStatus: {
      id: '3',
      name: 'Critical',
      color: 'red',
    },
    clinicianId: '3',
    clinician: {
      id: '3',
      displayName: 'Torun',
    },
    date: '2023-08-28T02:40:16.237Z',
    registrationDate: '2023-08-28T02:40:16.237Z',
  },
  {
    id: '4',
    registrationStatus: 'active',
    clinicalStatusId: '4',
    clinicalStatus: {
      id: '4',
      name: 'Needs review',
      color: 'yellow',
    },
    clinicianId: '4',
    clinician: {
      id: '4',
      displayName: 'Taslim',
    },
    date: '2023-08-28T02:40:16.237Z',
    registrationDate: '2023-08-28T02:40:16.237Z',
  },
  {
    id: '5',
    registrationStatus: 'active',
    clinicalStatusId: '5',
    clinicalStatus: {
      id: '5',
      name: 'Low risk',
      color: 'green',
    },
    clinicianId: '5',
    clinician: {
      id: '5',
      displayName: 'Tareq',
    },
    date: '2023-08-28T02:40:16.237Z',
    registrationDate: '2023-08-28T02:40:16.237Z',
  },
  {
    id: '6',
    registrationStatus: 'active',
    clinicalStatusId: '6',
    clinicalStatus: {
      id: '6',
      name: 'Needs review',
      color: 'yellow',
    },
    clinicianId: '6',
    clinician: {
      id: '6',
      displayName: 'Aziz',
    },
    date: '2023-08-28T02:40:16.237Z',
    registrationDate: '2023-08-28T02:40:16.237Z',
  },
];

export const programRegistryFormHistory = [
  {
    id: 1,
    endTime: '2023-09-07 15:54:00',
    userId: '10',
    user: {
      displayName: 'Hyacinthie',
    },
    surveyId: '100000',
    survey: {
      name: 'Engineering',
    },
    result: '9851',
    resultText: '9851',
  },
  {
    id: 2,
    endTime: '2023-09-07 15:54:00',
    userId: '20',
    user: {
      displayName: 'Mame',
    },
    surveyId: '200000',
    survey: {
      name: 'Marketing',
    },
    result: '1160',
    resultText: '1160',
  },
  {
    id: 3,
    endTime: '2023-09-07 15:54:00',
    userId: '30',
    user: {
      displayName: 'Orland',
    },
    surveyId: '300000',
    survey: {
      name: 'Product Management',
    },
    result: '3634',
    resultText: '3634',
  },
  {
    id: 4,
    endTime: '2023-09-07 15:54:00',
    userId: '40',
    user: {
      displayName: 'Noell',
    },
    surveyId: '400000',
    survey: {
      name: 'Engineering',
    },
    result: '8025',
    resultText: '8025',
  },
  {
    id: 5,
    endTime: '2023-09-07 15:54:00',
    userId: '50',
    user: {
      displayName: 'Hinda',
    },
    surveyId: '500000',
    survey: {
      name: 'Services',
    },
    result: '9631',
    resultText: '9631',
  },
  {
    id: 6,
    endTime: '2023-09-07 15:54:00',
    userId: '60',
    user: {
      displayName: 'Abbey',
    },
    surveyId: '600000',
    survey: {
      name: 'Marketing',
    },
    result: '6816',
    resultText: '6816',
  },
  {
    id: 7,
    endTime: '2023-09-07 15:54:00',
    userId: '70',
    user: {
      displayName: 'Ginelle',
    },
    surveyId: '700000',
    survey: {
      name: 'Human Resources',
    },
    result: '4687',
    resultText: '4687',
  },
];

export const facilities = [
  { id: '1', name: 'Hospital 1' },
  { id: '2', name: 'Hospital 2' },
];

export const villages = [
  { id: 'village-1', name: 'Village 1' },
  { id: 'village-2', name: 'Village 2' },
];

export const practitioners = [
  { id: 'test-user-id', name: 'Test user id' },
  { id: '2', name: 'Test user id 2' },
];

export const clinicalStatusList = [
  { id: '1', name: 'Low risk', color: 'green' },
  { id: '2', name: 'Needs review', color: 'yellow' },
  { id: '3', name: 'Critical', color: 'red' },
];

export const programRegistrysurveys = {
  count: 2,
  data: [
    {
      id: 'program-tbprogram-tbfollowup',
      code: 'tbfollowup',
      name: 'TB Follow Up',
      surveyType: 'programs',
      isSensitive: false,
      updatedAtSyncTick: '-999',
      createdAt: '2023-09-27T22:21:03.107Z',
      updatedAt: '2023-09-27T22:21:03.107Z',
      programId: 'program-tbprogram',
    },
    {
      id: 'program-tbprogram-tbcaseform',
      code: 'tbcaseform',
      name: 'Confirmed TB Form',
      surveyType: 'programs',
      isSensitive: false,
      updatedAtSyncTick: '-999',
      createdAt: '2023-09-27T22:21:03.107Z',
      updatedAt: '2023-09-27T22:21:03.107Z',
      programId: 'program-tbprogram',
    },
  ],
};

export const patientAdditionalData = {
  id: '19324abf-b485-4184-8537-0a7fe4be1d0b',
  patientId: 'patient_id',
  placeOfBirth: '247813',
  bloodType: 'A+',
  primaryContactNumber: '247813',
  secondaryContactNumber: 'Daddy Antonini',
  maritalStatus: 'Married',
  cityTown: '247813',
  streetVillage: '247813',
  educationalLevel: 'High school completed',
  socialMedia: 'Twitter',
  title: 'Mr',
  birthCertificate: 'BC247813',
  drivingLicense: 'DL247813',
  passport: 'PP247813',
  emergencyContactName: '247813',
  emergencyContactNumber: '247813',
  updatedAtByField: {
    id: 500664,
    birth_certificate: 500664,
    driving_license: 500664,
    passport: 500664,
    patient_id: 500664,
    primary_contact_number: 500664,
    secondary_contact_number: 500664,
    emergency_contact_name: 500664,
    emergency_contact_number: 500664,
    place_of_birth: 500664,
    title: 500664,
    blood_type: 500664,
    marital_status: 500664,
    educational_level: 500664,
    social_media: 500664,
    religion_id: 500664,
    patient_billing_type_id: 500664,
    country_of_birth_id: 500664,
    nationality_id: 500664,
    ethnicity_id: 500664,
    occupation_id: 500664,
    city_town: 500664,
    street_village: 500664,
    country_id: 500664,
    division_id: 500664,
    subdivision_id: 500664,
    medical_area_id: 500664,
    nursing_zone_id: 500664,
    settlement_id: 500664,
  },
  updatedAtSyncTick: '-999',
  createdAt: '2023-08-18T01:06:03.724Z',
  updatedAt: '2023-08-18T01:06:03.724Z',
  nationalityId: 'nationality-Andorra',
  countryId: 'country-Andorra',
  divisionId: 'division-Eastern',
  subdivisionId: 'subdivision-Ba',
  medicalAreaId: 'medicalArea-Beqa',
  nursingZoneId: 'nursingZone-Bagasau',
  settlementId: 'settlement-ats',
  ethnicityId: 'ethnicity-Fiji',
  occupationId: 'occupation-CivilServant',
  religionId: 'religion-Christian',
  patientBillingTypeId: 'patientBillingType-local',
  countryOfBirthId: 'country-Andorra',
  countryOfBirth: {
    id: 'country-Andorra',
    code: 'Andorra',
    type: 'country',
    name: 'Andorra',
    visibilityStatus: 'current',
    updatedAtSyncTick: '-999',
    createdAt: '2023-07-21T02:14:08.902Z',
    updatedAt: '2023-07-21T02:14:08.902Z',
  },
  nationality: {
    id: 'nationality-Andorra',
    code: 'Andorra',
    type: 'nationality',
    name: 'Andorra',
    visibilityStatus: 'current',
    updatedAtSyncTick: '-999',
    createdAt: '2023-07-21T02:14:08.902Z',
    updatedAt: '2023-07-21T02:14:08.902Z',
  },
  country: {
    id: 'country-Andorra',
    code: 'Andorra',
    type: 'country',
    name: 'Andorra',
    visibilityStatus: 'current',
    updatedAtSyncTick: '-999',
    createdAt: '2023-07-21T02:14:08.902Z',
    updatedAt: '2023-07-21T02:14:08.902Z',
  },
};

export const patientProgramRegistration = {
  id: '1e25e8d1-a2b4-4bfa-9670-9f6b689e8af7',
  programRegistryId: 'programRegistry-HepatitisBProgramRegistry',
  programRegistry: {
    id: 'programRegistry-HepatitisBProgramRegistry',
    name: 'Hepatitis B',
    program: {
      id: 'program-samoancdscreening',
      name: 'Hepatitis B',
    },
    currentlyAt: 'facility',
  },
  facilityId: 'Facility1',
  facility: {
    id: 'Facility1',
    name: 'Facility 1',
  },
  villageId: 'Village1',
  village: {
    id: 'Village1',
    name: 'Village 1',
  },
  patientDisplayId: '12341341',
  patientId: 'patient_id',
  patient: {
    id: 'patient_id',
    name: 'Tareq',
    firstName: 'Tareq',
    lastName: 'Aziz',
    dateOfBirth: '1989-11-09T02:40:16.237Z',
    village: 'Village 1',
    sex: 'M',
  },
  clinicianId: '213123',
  clinician: {
    id: '213123',
    displayName: 'Alaister',
  },
  registeringFacilityId: 'registering_facility_id',
  registeringFacility: {
    id: 'registering_facility_id',
    code: 'registring_facitlity',
    name: 'Hospital 1',
  },
  facitlityId: 'facitliId',
  facitlity: {
    id: 'facitliId',
    name: 'Facility A',
  },
  clinicalStatusId: '1',
  clinicalStatus: {
    id: '1',
    code: 'low_risk',
    name: 'Low risk',
    color: 'green',
  },
  registrationStatus: 'active',
  date: '2023-08-28T02:40:16.237Z',
  removedById: '213123',
  dateRemoved: '2023-08-28T02:40:16.237Z',
  removedBy: {
    id: '213123',
    displayName: 'Alaister',
  },
  conditions: programRegistryConditions,
};

export const dummyApi = {
  get: async (endpoint, options) => {
    // console.log(endpoint, options);
    // await sleep(500);
    switch (endpoint) {
      case 'programRegistry/1':
        return programRegistry1;

      case 'programRegistry/2':
        return programRegistry2;

      case 'programRegistry/3':
        return programRegistry3;

      case 'programRegistry/1/conditions':
      case 'programRegistry/programRegistry-HepatitisBProgramRegistry/conditions':
        return programRegistryConditions;

      case 'patient/patient_id/additionalData':
      case 'patient/test-patient/additionalData':
        return patientAdditionalData;

      // GET patientProgramRestration Status change Histories
      case 'patient/patient_id/programRegistration/1e25e8d1-a2b4-4bfa-9670-9f6b689e8af7/clinicalStatuses':
        return getSortedData(programRegistryStatusHistories, options);

      case 'patient/patient_id/programRegistration':
        return programRegistries;

      case 'patient/patient_id/programResponses?programId=program-samoancdscreening':
      case '/patient/test-patient/programResponses':
        return getSortedData(programRegistryFormHistory, options);

      case `patient/programRegistration/1e25e8d1-a2b4-4bfa-9670-9f6b689e8af7/conditions`:
        return [
          ...programRegistryConditions,
          ...programRegistryConditions.map(x => ({ ...x, id: x.id + 1 })),
        ];

      case 'program/program-samoancdscreening/surveys':
        return programRegistrysurveys;

      case 'suggestions/programRegistryClinicalStatus':
        return clinicalStatusList;

      case 'suggestions/facility':
        return facilities;

      case 'suggestions/village':
        return villages;

      case 'suggestions/practitioner':
        return practitioners;

      case 'suggestions/programRegistry':
        return programRegistries.data;

      case 'suggestions/survey':
        // this needs to be done in the backend
        return programRegistryFormHistory.map(x => ({ id: x.id.toString(), name: x.survey.name }));

      // TEMP: below there are undefined parameters because this api sometimes depends
      // on browser query params, this is temporary for testing purpose
      case 'patient/patient_id/programRegistration/1e25e8d1-a2b4-4bfa-9670-9f6b689e8af7':
      case 'patient/undefined/programRegistration/1e25e8d1-a2b4-4bfa-9670-9f6b689e8af7':
      case 'patient/test-patient/programRegistration/undefined':
      case 'patient/undefined/programRegistration/undefined':
        return patientProgramRegistration;
      case 'patient/undefined/programRegistration/undefined/survey/undefined':
      case 'patient/patient_id/programRegistration/1e25e8d1-a2b4-4bfa-9670-9f6b689e8af7/survey/survey_id':
        return mockSurvey;
      case 'patientProgramRegistration':
        return {
          data: [
            patientProgramRegistration,
            {
              ...patientProgramRegistration,
              isDeceased: true,
              id: patientProgramRegistration.id + 1,
            },
          ],
        };
    }
  },
};
