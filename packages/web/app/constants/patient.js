import { PATIENT_REGISTRY_TYPES } from '@tamanu/constants';

export const PATIENT_STATUS = {
  INPATIENT: 'Inpatient',
  OUTPATIENT: 'Outpatient',
  EMERGENCY: 'Emergency',
  DECEASED: 'Deceased',
};

export const PATIENT_REGISTRY_LABELS = {
  [PATIENT_REGISTRY_TYPES.NEW_PATIENT]: 'Create new patient',
  [PATIENT_REGISTRY_TYPES.BIRTH_REGISTRY]: 'Register birth',
};

export const PATIENT_REGISTRY_OPTIONS = [
  {
    value: PATIENT_REGISTRY_TYPES.NEW_PATIENT,
    label: PATIENT_REGISTRY_LABELS[PATIENT_REGISTRY_TYPES.NEW_PATIENT],
  },
  {
    value: PATIENT_REGISTRY_TYPES.BIRTH_REGISTRY,
    label: PATIENT_REGISTRY_LABELS[PATIENT_REGISTRY_TYPES.BIRTH_REGISTRY],
  },
];

export const BLOOD_TYPES = {
  A_POSITIVE: 'A+',
  A_NEGATIVE: 'A-',
  AB_NEGATIVE: 'AB-',
  AB_POSITIVE: 'AB+',
  B_POSITIVE: 'B+',
  B_NEGATIVE: 'B-',
  O_POSITIVE: 'O+',
  O_NEGATIVE: 'O-',
};

export const BLOOD_LABELS = {
  [BLOOD_TYPES.A_POSITIVE]: 'A+',
  [BLOOD_TYPES.A_NEGATIVE]: 'A-',
  [BLOOD_TYPES.AB_NEGATIVE]: 'AB-',
  [BLOOD_TYPES.AB_POSITIVE]: 'AB+',
  [BLOOD_TYPES.B_POSITIVE]: 'B+',
  [BLOOD_TYPES.B_NEGATIVE]: 'B-',
  [BLOOD_TYPES.O_POSITIVE]: 'O+',
  [BLOOD_TYPES.O_NEGATIVE]: 'O-',
};

export const BLOOD_OPTIONS = [
  { value: BLOOD_TYPES.A_POSITIVE, label: BLOOD_LABELS[BLOOD_TYPES.A_POSITIVE] },
  { value: BLOOD_TYPES.A_NEGATIVE, label: BLOOD_LABELS[BLOOD_TYPES.A_NEGATIVE] },
  { value: BLOOD_TYPES.AB_NEGATIVE, label: BLOOD_LABELS[BLOOD_TYPES.AB_NEGATIVE] },
  { value: BLOOD_TYPES.AB_POSITIVE, label: BLOOD_LABELS[BLOOD_TYPES.AB_POSITIVE] },
  { value: BLOOD_TYPES.B_POSITIVE, label: BLOOD_LABELS[BLOOD_TYPES.B_POSITIVE] },
  { value: BLOOD_TYPES.B_NEGATIVE, label: BLOOD_LABELS[BLOOD_TYPES.B_NEGATIVE] },
  { value: BLOOD_TYPES.O_POSITIVE, label: BLOOD_LABELS[BLOOD_TYPES.O_POSITIVE] },
  { value: BLOOD_TYPES.O_NEGATIVE, label: BLOOD_LABELS[BLOOD_TYPES.O_NEGATIVE] },
];

export const TITLES = {
  MR: 'Mr',
  MRS: 'Mrs',
  MS: 'Ms',
  MISS: 'Miss',
  DR: 'Dr',
  SR: 'Sr',
  SN: 'Sn',
};

export const TITLE_LABELS = {
  [TITLES.MR]: 'Mr',
  [TITLES.MRS]: 'Mrs',
  [TITLES.MS]: 'Ms',
  [TITLES.MISS]: 'Miss',
  [TITLES.DR]: 'Dr',
  [TITLES.SR]: 'Sr',
  [TITLES.SN]: 'Sn',
};

export const TITLE_OPTIONS = [
  { value: TITLES.MR, label: TITLE_LABELS[TITLES.MR] },
  { value: TITLES.MRS, label: TITLE_LABELS[TITLES.MRS] },
  { value: TITLES.MS, label: TITLE_LABELS[TITLES.MS] },
  { value: TITLES.MISS, label: TITLE_LABELS[TITLES.MISS] },
  { value: TITLES.DR, label: TITLE_LABELS[TITLES.DR] },
  { value: TITLES.SR, label: TITLE_LABELS[TITLES.SR] },
  { value: TITLES.SN, label: TITLE_LABELS[TITLES.SN] },
];

export const SOCIAL_MEDIA_TYPES = {
  FACEBOOK: 'Facebook',
  INSTAGRAM: 'Instagram',
  LINKEDIN: 'LinkedIn',
  TWITTER: 'Twitter',
  VIBER: 'Viber',
  WHATSAPP: 'WhatsApp',
};

export const SOCIAL_MEDIA_LABELS = {
  [SOCIAL_MEDIA_TYPES.FACEBOOK]: 'Facebook',
  [SOCIAL_MEDIA_TYPES.INSTAGRAM]: 'Instagram',
  [SOCIAL_MEDIA_TYPES.LINKEDIN]: 'LinkedIn',
  [SOCIAL_MEDIA_TYPES.TWITTER]: 'Twitter',
  [SOCIAL_MEDIA_TYPES.VIBER]: 'Viber',
  [SOCIAL_MEDIA_TYPES.WHATSAPP]: 'WhatsApp',
};

export const SOCIAL_MEDIA_OPTIONS = [
  { value: SOCIAL_MEDIA_TYPES.FACEBOOK, label: SOCIAL_MEDIA_LABELS[SOCIAL_MEDIA_TYPES.FACEBOOK] },
  { value: SOCIAL_MEDIA_TYPES.INSTAGRAM, label: SOCIAL_MEDIA_LABELS[SOCIAL_MEDIA_TYPES.INSTAGRAM] },
  { value: SOCIAL_MEDIA_TYPES.LINKEDIN, label: SOCIAL_MEDIA_LABELS[SOCIAL_MEDIA_TYPES.LINKEDIN] },
  { value: SOCIAL_MEDIA_TYPES.TWITTER, label: SOCIAL_MEDIA_LABELS[SOCIAL_MEDIA_TYPES.TWITTER] },
  { value: SOCIAL_MEDIA_TYPES.VIBER, label: SOCIAL_MEDIA_LABELS[SOCIAL_MEDIA_TYPES.VIBER] },
  { value: SOCIAL_MEDIA_TYPES.WHATSAPP, label: SOCIAL_MEDIA_LABELS[SOCIAL_MEDIA_TYPES.WHATSAPP] },
];

export const EDUCATIONAL_ATTAINMENT_TYPES = {
  NO_FORMAL_SCHOOLING: 'No formal schooling',
  LESS_THAN_PRIMARY_SCHOOL: 'Less than primary school',
  PRIMARY_SCHOOL_COMPLETED: 'Primary school completed',
  SEC_SCHOOL_COMPLETED: 'Sec school completed',
  HIGH_SCHOOL_COMPLETED: 'High school completed',
  UNIVERSITY_COMPLETED: 'University completed',
  POST_GRAD_COMPLETED: 'Post grad completed',
};

export const EDUCATIONAL_ATTAINMENT_LABELS = {
  [EDUCATIONAL_ATTAINMENT_TYPES.NO_FORMAL_SCHOOLING]: 'No formal schooling',
  [EDUCATIONAL_ATTAINMENT_TYPES.LESS_THAN_PRIMARY_SCHOOL]: 'Less than primary school',
  [EDUCATIONAL_ATTAINMENT_TYPES.PRIMARY_SCHOOL_COMPLETED]: 'Primary school completed',
  [EDUCATIONAL_ATTAINMENT_TYPES.SEC_SCHOOL_COMPLETED]: 'Sec school completed',
  [EDUCATIONAL_ATTAINMENT_TYPES.HIGH_SCHOOL_COMPLETED]: 'High school completed',
  [EDUCATIONAL_ATTAINMENT_TYPES.UNIVERSITY_COMPLETED]: 'University completed',
  [EDUCATIONAL_ATTAINMENT_TYPES.POST_GRAD_COMPLETED]: 'Post grad completed',
};

export const EDUCATIONAL_ATTAINMENT_OPTIONS = [
  {
    value: EDUCATIONAL_ATTAINMENT_TYPES.NO_FORMAL_SCHOOLING,
    label: EDUCATIONAL_ATTAINMENT_LABELS[EDUCATIONAL_ATTAINMENT_TYPES.NO_FORMAL_SCHOOLING],
  },
  {
    value: EDUCATIONAL_ATTAINMENT_TYPES.LESS_THAN_PRIMARY_SCHOOL,
    label: EDUCATIONAL_ATTAINMENT_LABELS[EDUCATIONAL_ATTAINMENT_TYPES.LESS_THAN_PRIMARY_SCHOOL],
  },
  {
    value: EDUCATIONAL_ATTAINMENT_TYPES.PRIMARY_SCHOOL_COMPLETED,
    label: EDUCATIONAL_ATTAINMENT_LABELS[EDUCATIONAL_ATTAINMENT_TYPES.PRIMARY_SCHOOL_COMPLETED],
  },
  {
    value: EDUCATIONAL_ATTAINMENT_TYPES.SEC_SCHOOL_COMPLETED,
    label: EDUCATIONAL_ATTAINMENT_LABELS[EDUCATIONAL_ATTAINMENT_TYPES.SEC_SCHOOL_COMPLETED],
  },
  {
    value: EDUCATIONAL_ATTAINMENT_TYPES.HIGH_SCHOOL_COMPLETED,
    label: EDUCATIONAL_ATTAINMENT_LABELS[EDUCATIONAL_ATTAINMENT_TYPES.HIGH_SCHOOL_COMPLETED],
  },
  {
    value: EDUCATIONAL_ATTAINMENT_TYPES.UNIVERSITY_COMPLETED,
    label: EDUCATIONAL_ATTAINMENT_LABELS[EDUCATIONAL_ATTAINMENT_TYPES.UNIVERSITY_COMPLETED],
  },
  {
    value: EDUCATIONAL_ATTAINMENT_TYPES.POST_GRAD_COMPLETED,
    label: EDUCATIONAL_ATTAINMENT_LABELS[EDUCATIONAL_ATTAINMENT_TYPES.POST_GRAD_COMPLETED],
  },
];