export const HTTP_METHOD_TO_ACTION = {
  GET: 'read',
  POST: 'create',
  PUT: 'update',
  PATCH: 'update',
  DELETE: 'delete',
};

export const SYNC_ACTIONS = {
  SAVE: 'save',
  REMOVE: 'remove',
  WIPE: 'wipe',
};

export const SYNC_MODES = {
  ON: true,
  OFF: false,
  REMOTE_TO_LOCAL: 'remote_to_local',
  LOCAL_TO_REMOTE: 'local_to_remote',
};

export const DISPLAY_ID_PLACEHOLDER = '-TMP-';

export const ENVIRONMENT_TYPE = {
  SERVER: 'server',
  LAN: 'lan',
  DESKTOP: 'desktop',
};

export const LAB_REQUEST_STATUSES = {
  RECEPTION_PENDING: 'reception_pending',
  RESULTS_PENDING: 'results_pending',
  TO_BE_VERIFIED: 'to_be_verified',
  VERIFIED: 'verified',
  PUBLISHED: 'published',
  DELETED: 'deleted',
};

export const LAB_REQUEST_STATUS_LABELS = {
  [LAB_REQUEST_STATUSES.RECEPTION_PENDING]: 'Reception pending',
  [LAB_REQUEST_STATUSES.RESULTS_PENDING]: 'Results pending',
  [LAB_REQUEST_STATUSES.TO_BE_VERIFIED]: 'To be verified',
  [LAB_REQUEST_STATUSES.VERIFIED]: 'Verified',
  [LAB_REQUEST_STATUSES.PUBLISHED]: 'Published',
};

export const LAB_TEST_STATUSES = LAB_REQUEST_STATUSES;

export const NOTE_TYPES = {
  SYSTEM: 'system',
  OTHER: 'other',
  TREATMENT_PLAN: 'treatmentPlan',
  AREA_TO_BE_IMAGED: 'areaToBeImaged',
  RESULT_DESCRIPTION: 'resultDescription',
};

export const PATIENT_ISSUE_TYPES = {
  ISSUE: 'issue',
  WARNING: 'warning',
};

export const ENCOUNTER_TYPES = {
  ADMISSION: 'admission',
  CLINIC: 'clinic',
  IMAGING: 'imaging',
  EMERGENCY: 'emergency',
  OBSERVATION: 'observation',
  TRIAGE: 'triage',
  SURVEY_RESPONSE: 'surveyResponse',
};

export const ENCOUNTER_TYPE_VALUES = Object.values(ENCOUNTER_TYPES);

export const MEDICATION_STATUSES = {
  COMPLETED: 'Completed',
  FULFILLED: 'Fulfilled',
  REQUESTED: 'Requested',
};

export const OPERATION_PLAN_STATUSES = {
  PLANNED: 'Planned',
  DROPPED: 'Dropped',
  COMPLETED: 'Completed',
};

export const IMAGING_REQUEST_STATUS_TYPES = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
};

export const AVPU_OPTIONS = [
  { value: 'alert', label: 'Alert' },
  { value: 'verbal', label: 'Verbal' },
  { value: 'pain', label: 'Pain' },
  { value: 'unresponsive', label: 'Unresponsive' },
];

export const REFERENCE_TYPES = {
  ICD10: 'icd10',
  ALLERGY: 'allergy',
  CONDITION: 'condition',
  DRUG: 'drug',
  TRIAGE_REASON: 'triageReason',
  PROCEDURE_TYPE: 'procedureType',
  IMAGING_TYPE: 'imagingType',
  LAB_TEST_CATEGORY: 'labTestCategory',
  LAB_TEST_TYPE: 'labTestType',
  LAB_TEST_PRIORITY: 'labTestPriority',
  LAB_TEST_LABORATORY: 'labTestLaboratory',
  LAB_TEST_METHOD: 'labTestMethod',
  VACCINE: 'vaccine',
  VILLAGE: 'village',
  CARE_PLAN: 'carePlan',
  ETHNICITY: 'ethnicity',
  NATIONALITY: 'nationality',
  COUNTRY: 'country',
  DIVISION: 'division',
  SUBDIVISION: 'subdivision',
  MEDICAL_AREA: 'medicalArea',
  NURSING_ZONE: 'nursingZone',
  SETTLEMENT: 'settlement',
  OCCUPATION: 'occupation',
  SEX: 'sex',
  PLACE_OF_BIRTH: 'placeOfBirth',
  MARITAL_STATUS: 'maritalStatus',
  RELIGION: 'religion',
  FAMILY_RELATION: 'familyRelation',
  PATIENT_TYPE: 'patientType',
  BLOOD_TYPE: 'bloodType',
  SOCIAL_MEDIA_PLATFORM: 'socialMediaPlatform',
  PATIENT_BILLING_TYPE: 'patientBillingType',
  MANUFACTURER: 'manufacturer',
};

export const REFERENCE_TYPE_VALUES = Object.values(REFERENCE_TYPES);

// for explanation of types, see
// https://docs.google.com/spreadsheets/d/1qwfw1AOED7WiElOCJwt_VHo_JaDhr6ZIiJMqjRCXajQ/edit#gid=1797422705
export const PROGRAM_DATA_ELEMENT_TYPES = {
  TEXT: 'FreeText',
  MULTILINE: 'Multiline',
  RADIO: 'Radio',
  SELECT: 'Select',
  MULTI_SELECT: 'MultiSelect',
  AUTOCOMPLETE: 'Autocomplete',
  DATE: 'Date',
  SUBMISSION_DATE: 'SubmissionDate',
  INSTRUCTION: 'Instruction',
  NUMBER: 'Number',
  BINARY: 'Binary',
  CHECKBOX: 'Checkbox',
  CALCULATED: 'CalculatedQuestion',
  CONDITION: 'ConditionQuestion',
  RESULT: 'Result',
  SURVEY_ANSWER: 'SurveyAnswer',
  SURVEY_RESULT: 'SurveyResult',
  SURVEY_LINK: 'SurveyLink',
  PHOTO: 'Photo',
  PATIENT_DATA: 'PatientData',
  USER_DATA: 'UserData',
  PATIENT_ISSUE: 'PatientIssue',
};
export const PROGRAM_DATA_ELEMENT_TYPE_VALUES = Object.values(PROGRAM_DATA_ELEMENT_TYPES);

export const ACTION_DATA_ELEMENT_TYPES = [
  PROGRAM_DATA_ELEMENT_TYPES.PATIENT_ISSUE,
  PROGRAM_DATA_ELEMENT_TYPES.PATIENT_DATA,
];

export const REPORT_REQUEST_STATUSES = {
  RECEIVED: 'Received',
  PROCESSING: 'Processing',
  PROCESSED: 'Processed',
  ERROR: 'Error',
};

export const REPORT_REQUEST_STATUS_VALUES = Object.values(REPORT_REQUEST_STATUSES);

export const DIAGNOSIS_CERTAINTY = {
  SUSPECTED: 'suspected',
  CONFIRMED: 'confirmed',
  EMERGENCY: 'emergency',
  DISPROVEN: 'disproven',
  ERROR: 'error',
};

export const DIAGNOSIS_CERTAINTY_VALUES = Object.values(DIAGNOSIS_CERTAINTY);

export const PATIENT_COMMUNICATION_CHANNELS = {
  EMAIL: 'Email',
  SMS: 'Sms',
  WHATSAPP: 'WhatsApp',
};

export const PATIENT_COMMUNICATION_CHANNELS_VALUES = Object.values(PATIENT_COMMUNICATION_CHANNELS);

export const PATIENT_COMMUNICATION_TYPES = {
  REFERRAL_CREATED: 'Referral created',
  CERTIFICATE: 'Certificate',
};

export const PATIENT_COMMUNICATION_TYPES_VALUES = Object.values(PATIENT_COMMUNICATION_TYPES);

export const SURVEY_TYPES = {
  PROGRAMS: 'programs',
  REFERRAL: 'referral',
  OBSOLETE: 'obsolete',
};

export const COMMUNICATION_STATUSES = {
  QUEUED: 'Queued',
  PROCESSED: 'Processed',
  SENT: 'Sent',
  ERROR: 'Error',
  DELIVERED: 'Delivered',
  BAD_FORMAT: 'Bad Format',
};

export const COMMUNICATION_STATUSES_VALUES = Object.values(COMMUNICATION_STATUSES);

export const SYNC_DIRECTIONS = {
  DO_NOT_SYNC: 'do_not_sync',
  PUSH_ONLY: 'push_only',
  PULL_ONLY: 'pull_only',
  BIDIRECTIONAL: 'bidirectional',
};

export const SYNC_DIRECTIONS_VALUES = Object.values(SYNC_DIRECTIONS);

// these are arbitrary, the only thing that matters is they are shared between desktop and lan
export const DISCOVERY_PORT = 53391;
export const DISCOVERY_MAGIC_STRING = 'ee671721-9d4d-4e0e-b231-81872206a735';

export const VERSION_COMPATIBILITY_ERRORS = {
  LOW: 'Client version too low',
  HIGH: 'Client version too high',
};

export const VACCINE_CATEGORIES = {
  ROUTINE: 'Routine',
  CATCHUP: 'Catchup',
  CAMPAIGN: 'Campaign',
};

export const VACCINE_CATEGORIES_VALUES = Object.values(VACCINE_CATEGORIES);

export const INJECTION_SITE_OPTIONS = {
  LEFT_ARM: 'Left arm',
  RIGHT_ARM: 'Right arm',
  LEFT_THIGH: 'Left thigh',
  RIGHT_THIGH: 'Right thigh',
  ORAL: 'Oral',
  OTHER: 'Other',
};

export const APPOINTMENT_TYPES = {
  STANDARD: 'Standard',
  EMERGENCY: 'Emergency',
  SPECIALIST: 'Specialist',
  OTHER: 'Other',
};

export const APPOINTMENT_STATUSES = {
  CONFIRMED: 'Confirmed',
  ARRIVED: 'Arrived',
  NO_SHOW: 'No-show',
  CANCELLED: 'Cancelled',
};

export const REFERRAL_STATUSES = {
  PENDING: 'pending',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
};

// Size in bytes
export const DOCUMENT_SIZE_LIMIT = 10000000;

export const ICAO_DOCUMENT_TYPES = {
  PROOF_OF_TESTING: {
    DOCTYPE: 'NT',
    JSON: 'icao.test',
  },
  PROOF_OF_VACCINATION: {
    DOCTYPE: 'NV',
    JSON: 'icao.vacc',
  },
};

export const EUDCC_CERTIFICATE_TYPES = {
  VACCINATION: 'v',
  TEST: 't',
  RECOVERY: 'r',
};

export const EUDCC_SCHEMA_VERSION = '1.3.0';

export const X502_OIDS = {
  COMMON_NAME: '2.5.4.3',
  COUNTRY_NAME: '2.5.4.6',
  BASIC_CONSTRAINTS: '2.5.29.19',
  KEY_USAGE: '2.5.29.15',
  PRIVATE_KEY_USAGE_PERIOD: '2.5.29.16', // "PKUP"
  EXTENDED_KEY_USAGE: '2.5.29.37', // "EKU"
  KEY_IDENTIFIER: '2.5.29.14', // "SKI"
  AUTHORITY_KEY_IDENTIFIER: '2.5.29.35', // "AKI"
  DOCUMENT_TYPE: '2.23.136.1.1.6.2',
  EKU_VDS_NC: '2.23.136.1.1.14.2',
  EKU_EU_DCC_TEST: '1.3.6.1.4.1.1847.2021.1.1',
  EKU_EU_DCC_VACCINATION: '1.3.6.1.4.1.1847.2021.1.2',
  EKU_EU_DCC_RECOVERY: '1.3.6.1.4.1.1847.2021.1.3',
};

export const INVOICE_STATUSES = {
  CANCELLED: 'cancelled',
  IN_PROGRESS: 'in_progress',
  FINALISED: 'finalised',
};

export const INVOICE_PAYMENT_STATUSES = {
  UNPAID: 'unpaid',
  PAID: 'paid',
};

export const INVOICE_LINE_TYPES = {
  PROCEDURE_TYPE: 'procedureType',
  IMAGING_TYPE: 'imagingType',
  LAB_TEST_TYPE: 'labTestType',
  ADDITIONAL: 'additionalInvoiceLine',
};

export const INVOICE_LINE_TYPE_LABELS = {
  [INVOICE_LINE_TYPES.PROCEDURE_TYPE]: 'Procedure',
  [INVOICE_LINE_TYPES.IMAGING_TYPE]: 'Imaging',
  [INVOICE_LINE_TYPES.LAB_TEST_TYPE]: 'Lab test',
  [INVOICE_LINE_TYPES.ADDITIONAL]: 'Additional',
};

export const INVOICE_LINE_ITEM_STATUSES = {
  ACTIVE: 'active',
  DELETED: 'deleted',
};

export const INVOICE_PRICE_CHANGE_TYPES = {
  PATIENT_BILLING_TYPE: 'patientBillingType',
};

export const INVOICE_PRICE_CHANGE_TYPE_LABELS = {
  [INVOICE_PRICE_CHANGE_TYPES.PATIENT_BILLING_TYPE]: 'Patient Type',
};

export const INVOICE_PRICE_CHANGE_ITEM_STATUSES = {
  ACTIVE: 'active',
  DELETED: 'deleted',
};

export const CERTIFICATE_NOTIFICATION_STATUSES = {
  QUEUED: 'Queued',
  PROCESSED: 'Processed',
  ERROR: 'Error',
  IGNORE: 'Ignore',
};

export const VACCINE_STATUS = {
  UNKNOWN: 'UNKNOWN',
  GIVEN: 'GIVEN',
  NOT_GIVEN: 'NOT_GIVEN',
  SCHEDULED: 'SCHEDULED',
  MISSED: 'MISSED',
  DUE: 'DUE',
  UPCOMING: 'UPCOMING',
  OVERDUE: 'OVERDUE',
  RECORDED_IN_ERROR: 'RECORDED_IN_ERROR',
};

export const SERVER_TYPES = {
  LAN: 'Tamanu LAN Server',
  META: 'Tamanu Metadata Server',
  SYNC: 'Tamanu Sync Server',
};

export const ISO9075_FORMAT = 'YYYY-MM-DD HH:mm:ss';
export const ISO9075_FORMAT_LENGTH = ISO9075_FORMAT.length;
