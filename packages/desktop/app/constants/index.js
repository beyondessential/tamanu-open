import moment from 'moment';
import { padStart, capitalize } from 'lodash';

import { createValueIndex } from 'shared/utils/valueIndex';
import {
  ENCOUNTER_TYPES,
  IMAGING_REQUEST_STATUS_TYPES,
  NOTE_TYPES,
  APPOINTMENT_TYPES,
  APPOINTMENT_STATUSES,
  REFERRAL_STATUSES,
  INVOICE_STATUSES,
  INVOICE_PAYMENT_STATUSES,
  PATIENT_REGISTRY_TYPES,
  BIRTH_DELIVERY_TYPES,
  BIRTH_TYPES,
  PLACE_OF_BIRTH_TYPES,
  ATTENDANT_OF_BIRTH_TYPES,
  LAB_REQUEST_STATUSES,
} from 'shared/constants';

import {
  medicationIcon,
  administrationIcon,
  radiologyIcon,
  scheduleIcon,
  patientIcon,
} from './images';

export const MUI_SPACING_UNIT = 8;

export const DISPLAY_ID_PLACEHOLDER = '-TMP-';

export const PREGNANCY_PROGRAM_ID = 'program-pregnancy';

export const REALM_DATE_FORMAT = 'YYYY-MM-DD@HH:MM:SS';

export const DB_OBJECTS_MAX_DEPTH = {
  PATIENT_MAIN: 10,
  ENCOUNTER_MAIN: 7,
};

// Should only be colours that are defined as constants in Figma
// (with the exception of searchTintColor)
export const Colors = {
  primary: '#326699',
  primaryDark: '#2f4358',
  secondary: '#ffcc24',
  alert: '#f76853',
  orange: '#f17f16',
  safe: '#47ca80',
  darkestText: '#444444',
  darkText: '#666666',
  midText: '#888888',
  softText: '#b8b8b8',
  outline: '#dedede',
  softOutline: '#ebebeb',
  background: '#f3f5f7',
  white: '#ffffff',
  offWhite: '#fafafa',
  brightBlue: '#67A6E3',
  searchTintColor: '#d2dae3',
  hoverGrey: '#f3f5f7',
};

export const MAX_AUTO_COMPLETE_ITEMS = {
  DIAGNOSES: 10,
};

export const LAB_REQUEST_COLORS = {
  [LAB_REQUEST_STATUSES.RECEPTION_PENDING]: '#faa',
  [LAB_REQUEST_STATUSES.RESULTS_PENDING]: '#aaf',
  [LAB_REQUEST_STATUSES.TO_BE_VERIFIED]: '#caf',
  [LAB_REQUEST_STATUSES.VERIFIED]: '#5af',
  [LAB_REQUEST_STATUSES.PUBLISHED]: '#afa',
  unknown: '#333',
};

export const IMAGING_REQUEST_COLORS = {
  [IMAGING_REQUEST_STATUS_TYPES.PENDING]: '#faa',
  [IMAGING_REQUEST_STATUS_TYPES.COMPLETED]: '#afa',
  [IMAGING_REQUEST_STATUS_TYPES.IN_PROGRESS]: '#aaf',
  unknown: '#333',
};

export const REFERRAL_STATUS_LABELS = {
  [REFERRAL_STATUSES.PENDING]: 'Pending',
  [REFERRAL_STATUSES.CANCELLED]: 'Cancelled',
  [REFERRAL_STATUSES.COMPLETED]: 'Completed',
};

export const columnStyle = {
  backgroundColor: Colors.white,
  height: '60px',
  color: Colors.primaryDark,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export const columnStyleSlim = {
  backgroundColor: Colors.white,
  height: '40px',
  color: Colors.primaryDark,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export const headerStyle = {
  backgroundColor: Colors.searchTintColor,
};

export const dateFormat = 'L'; // 06/09/2014, swap mm and dd based on locale
export const dateTimeFormat = 'YYYY-MM-DD hh:mm A';

export const dateFormatText = 'Do MMM YYYY';

export const momentSimpleCalender = {
  sameDay: '[Today]',
  nextDay: '[Tomorrow]',
  nextWeek: null,
  lastDay: '[Yesterday]',
  lastWeek: null,
  sameElse: null,
};

export const timeFormat = 'hh:mm a';

// Generate time picker select options
export const timeSelectOptions = {
  hours: [],
  minutes: [],
};

const startOfDay = moment().startOf('day');
for (let i = 0; i <= 23; i += 1) {
  timeSelectOptions.hours.push({
    value: i,
    label: startOfDay.add(i > 0 ? 1 : 0, 'hours').format('hh A'),
  });
}
for (let i = 0; i <= 59; i += 1) {
  timeSelectOptions.minutes.push({
    value: i,
    label: padStart(i, 2, '0'),
  });
}

export const getDifferenceDate = (today, target) => {
  const difference = moment.duration(moment(today).diff(moment(target)));
  return difference.humanize();
};

export const medicationStatuses = {
  COMPLETED: 'Completed',
  FULFILLED: 'Fulfilled',
  REQUESTED: 'Requested',
};

export const locationOptions = [
  {
    value: 'australian-capital-territory',
    label: 'Australian Capital Territory',
    className: 'State-ACT',
  },
  { value: 'new-south-wales', label: 'New South Wales', className: 'State-NSW' },
  { value: 'victoria', label: 'Victoria', className: 'State-Vic' },
  { value: 'queensland', label: 'Queensland', className: 'State-Qld' },
  { value: 'western-australia', label: 'Western Australia', className: 'State-WA' },
  { value: 'south-australia', label: 'South Australia', className: 'State-SA' },
  { value: 'tasmania', label: 'Tasmania', className: 'State-Tas' },
  { value: 'northern-territory', label: 'Northern Territory', className: 'State-NT' },
];

export const reportOptions = [
  { value: 'detailedAdmissions', label: 'Admissions Detail', className: 'State-ACT' },
  { value: 'admissions', label: 'Admissions Summary', className: 'State-NSW' },
  { value: 'diagnostic', label: 'Diagnostic Testing', className: 'State-Vic' },
  { value: 'detailedDischarges', label: 'Discharges Detail', className: 'State-Qld' },
  { value: 'discharges', label: 'Discharges Summary', className: 'State-WA' },
  { value: 'detailedProcedures', label: 'Procedures Detail', className: 'State-SA' },
  { value: 'procedures', label: 'Procedures Summary', className: 'State-Tas' },
  { value: 'status', label: 'Patient Status', className: 'State-NT' },
  { value: 'patientDays', label: 'Total Patient Days', className: 'State-NT' },
  { value: 'detailedPatientDays', label: 'Total Patient Days (Detailed)', className: 'State-NT' },
  { value: 'encounter', label: 'Encounter', className: 'State-NT' },
];

export const diagnosisCertaintyOptions = [
  { value: 'emergency', label: 'ED Diagnosis', triageOnly: true },
  { value: 'suspected', label: 'Suspected' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'disproven', label: 'Disproven', editOnly: true },
  { value: 'error', label: 'Recorded in error', editOnly: true },
];

export const CERTAINTY_OPTIONS_BY_VALUE = createValueIndex(diagnosisCertaintyOptions);

export const nonEmergencyDiagnosisCertaintyOptions = diagnosisCertaintyOptions.filter(
  x => x.value !== CERTAINTY_OPTIONS_BY_VALUE.emergency.value,
);

export const noteTypes = [
  { value: NOTE_TYPES.TREATMENT_PLAN, label: 'Treatment plan' },
  { value: 'medical', label: 'Medical' },
  { value: 'surgical', label: 'Surgical' },
  { value: 'nursing', label: 'Nursing' },
  { value: 'dietary', label: 'Dietary' },
  { value: 'pharmacy', label: 'Pharmacy' },
  { value: 'physiotherapy', label: 'Physiotherapy' },
  { value: 'social', label: 'Social welfare' },
  { value: 'discharge', label: 'Discharge planning' },
  { value: NOTE_TYPES.OTHER, label: 'Other' },
  { value: NOTE_TYPES.SYSTEM, label: 'System', hideFromDropdown: true },
];

export const encounterOptions = [
  { value: ENCOUNTER_TYPES.ADMISSION, label: 'Hospital admission', image: medicationIcon },
  {
    value: ENCOUNTER_TYPES.TRIAGE,
    label: 'Triage',
    image: patientIcon,
    triageFlowOnly: true,
  },
  { value: ENCOUNTER_TYPES.CLINIC, label: 'Clinic', image: administrationIcon },
  { value: ENCOUNTER_TYPES.IMAGING, label: 'Imaging', image: radiologyIcon, hideFromMenu: true },
  {
    value: ENCOUNTER_TYPES.EMERGENCY,
    label: 'Emergency short stay',
    image: scheduleIcon,
    hideFromMenu: true,
  },
  {
    value: ENCOUNTER_TYPES.OBSERVATION,
    label: 'Active ED patient',
    image: patientIcon,
    triageFlowOnly: true,
    hideFromMenu: true,
  },
  {
    value: ENCOUNTER_TYPES.SURVEY_RESPONSE,
    label: 'Survey response',
    image: patientIcon,
    hideFromMenu: true,
  },
];

export const ENCOUNTER_OPTIONS_BY_VALUE = createValueIndex(encounterOptions);

export const operativePlanStatuses = {
  PLANNED: 'planned',
  DROPPED: 'dropped',
  COMPLETED: 'completed',
};

export const operativePlanStatusList = Object.values(operativePlanStatuses).map(status => ({
  value: status,
  label: capitalize(status),
}));

export const bloodOptions = [
  { value: 'A+', label: 'A+' },
  { value: 'A-', label: 'A-' },
  { value: 'AB-', label: 'AB-' },
  { value: 'AB+', label: 'AB+' },
  { value: 'B+', label: 'B+' },
  { value: 'B-', label: 'B-' },
  { value: 'O+', label: 'O+' },
  { value: 'O-', label: 'O-' },
];

export const sexOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

export const titleOptions = [
  { value: 'Mr', label: 'Mr' },
  { value: 'Mrs', label: 'Mrs' },
  { value: 'Ms', label: 'Ms' },
  { value: 'Miss', label: 'Miss' },
  { value: 'Dr', label: 'Dr' },
  { value: 'Sr', label: 'Sr' },
  { value: 'Sn', label: 'Sn' },
];

export const socialMediaOptions = [
  { value: 'Facebook', label: 'Facebook' },
  { value: 'Instagram', label: 'Instagram' },
  { value: 'LinkedIn', label: 'LinkedIn' },
  { value: 'Twitter', label: 'Twitter' },
  { value: 'Viber', label: 'Viber' },
  { value: 'WhatsApp', label: 'WhatsApp' },
];

export const maritalStatusOptions = [
  { value: 'Defacto', label: 'De facto' },
  { value: 'Married', label: 'Married' },
  { value: 'Single', label: 'Single' },
  { value: 'Widow', label: 'Widow' },
  { value: 'Divorced', label: 'Divorced' },
  { value: 'Separated', label: 'Separated' },
  { value: 'Unknown', label: 'Unknown' },
];

export const educationalAttainmentOptions = [
  { value: 'No formal schooling', label: 'No formal schooling' },
  { value: 'Less than primary school', label: 'Less than primary school' },
  { value: 'Primary school completed', label: 'Primary school completed' },
  { value: 'Sec school completed', label: 'Sec school completed' },
  { value: 'High school completed', label: 'High school completed' },
  { value: 'University completed', label: 'University completed' },
  { value: 'Post grad completed', label: 'Post grad completed' },
];

export const SEX_VALUE_INDEX = createValueIndex(sexOptions);

export const pregnancyOutcomes = [
  { value: '', label: 'N/A' },
  { value: 'liveBirth', label: 'Live Birth' },
  { value: 'stillBirth', label: 'Still Birth' },
  { value: 'fetalDeath', label: 'Fetal Death' },
];

export const REPORT_TYPES = {
  PIE_CHART: 'pie-chart',
  BAR_CHART: 'bar-chart',
  LINE_CHART: 'line-graph',
  RAW: 'raw',
  TABLE: 'table',
};

export const LOCAL_STORAGE_KEYS = {
  HOST: 'host',
  TOKEN: 'apiToken',
  LOCALISATION: 'localisation',
  SERVER: 'server',
  REMEMBER_EMAIL: 'remember-email',
  PERMISSIONS: 'permissions',
};

export const appointmentTypeOptions = Object.values(APPOINTMENT_TYPES).map(type => ({
  label: type,
  value: type,
}));

export const appointmentStatusOptions = Object.values(APPOINTMENT_STATUSES).map(status => ({
  label: status,
  value: status,
}));

export const ALPHABET_FOR_ID =
  // this is absolutely fine and the concat isn't useless
  // eslint-disable-next-line no-useless-concat
  'ABCDEFGH' + /* I */ 'JK' + /* L */ 'MN' + /* O */ 'PQRSTUVWXYZ' + /* 01 */ '23456789';

export const INVOICE_STATUS_OPTIONS = [
  { label: 'Cancelled', value: INVOICE_STATUSES.CANCELLED },
  { label: 'In progress', value: INVOICE_STATUSES.IN_PROGRESS },
  { label: 'Finalised', value: INVOICE_STATUSES.FINALISED },
];

export const INVOICE_STATUS_LABELS = {
  [INVOICE_STATUSES.CANCELLED]: 'Cancelled',
  [INVOICE_STATUSES.IN_PROGRESS]: 'In progress',
  [INVOICE_STATUSES.FINALISED]: 'Finalised',
};

export const INVOICE_STATUS_COLORS = {
  [INVOICE_STATUSES.CANCELLED]: '#FFCC24',
  [INVOICE_STATUSES.IN_PROGRESS]: '#F76853',
  [INVOICE_STATUSES.FINALISED]: '#47CA80',
};

export const INVOICE_PAYMENT_STATUS_LABELS = {
  [INVOICE_PAYMENT_STATUSES.UNPAID]: 'Unpaid',
  [INVOICE_PAYMENT_STATUSES.PAID]: 'Paid',
};

export const INVOICE_PAYMENT_STATUS_OPTIONS = [
  { label: 'Unpaid', value: INVOICE_PAYMENT_STATUSES.UNPAID },
  { label: 'Paid', value: INVOICE_PAYMENT_STATUSES.PAID },
];

export const BIRTH_DELIVERY_TYPE_OPTIONS = [
  { value: BIRTH_DELIVERY_TYPES.NORMAL_VAGINAL_DELIVERY, label: 'Normal vaginal delivery' },
  { value: BIRTH_DELIVERY_TYPES.BREECH, label: 'Breech' },
  { value: BIRTH_DELIVERY_TYPES.EMERGENCY_C_SECTION, label: 'Emergency C-section' },
  { value: BIRTH_DELIVERY_TYPES.ELECTIVE_C_SECTION, label: 'Elective C-section' },
  { value: BIRTH_DELIVERY_TYPES.VACUUM_EXTRACTION, label: 'Vacuum extraction' },
  { value: BIRTH_DELIVERY_TYPES.FORCEPS, label: 'Forceps' },
  { value: BIRTH_DELIVERY_TYPES.OTHER, label: 'Other' },
];

export const BIRTH_TYPE_OPTIONS = [
  { value: BIRTH_TYPES.SINGLE, label: 'Single' },
  { value: BIRTH_TYPES.PLURAL, label: 'Plural' },
];

export const PLACE_OF_BIRTH_OPTIONS = [
  { value: PLACE_OF_BIRTH_TYPES.HEALTH_FACILITY, label: 'Health facility' },
  { value: PLACE_OF_BIRTH_TYPES.HOME, label: 'Home' },
  { value: PLACE_OF_BIRTH_TYPES.OTHER, label: 'Other' },
];

export const ATTENDANT_OF_BIRTH_OPTIONS = [
  { value: ATTENDANT_OF_BIRTH_TYPES.DOCTOR, label: 'Doctor' },
  { value: ATTENDANT_OF_BIRTH_TYPES.MIDWIFE, label: 'Midwife' },
  { value: ATTENDANT_OF_BIRTH_TYPES.NURSE, label: 'Nurse' },
  {
    value: ATTENDANT_OF_BIRTH_TYPES.TRADITIONAL_BIRTH_ATTENDANT,
    label: 'Traditional birth attendant',
  },
  { value: ATTENDANT_OF_BIRTH_TYPES.OTHER, label: 'Other' },
];

export const PATIENT_REGISTRY_OPTIONS = [
  { value: PATIENT_REGISTRY_TYPES.NEW_PATIENT, label: 'Create new patient' },
  { value: PATIENT_REGISTRY_TYPES.BIRTH_REGISTRY, label: 'Register birth' },
];
