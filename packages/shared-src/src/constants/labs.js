export const LAB_REQUEST_STATUSES = {
  RECEPTION_PENDING: 'reception_pending',
  RESULTS_PENDING: 'results_pending',
  TO_BE_VERIFIED: 'to_be_verified',
  VERIFIED: 'verified',
  PUBLISHED: 'published',
  CANCELLED: 'cancelled',
  DELETED: 'deleted',
  ENTERED_IN_ERROR: 'entered-in-error',
};

export const LAB_REQUEST_STATUS_CONFIG = {
  [LAB_REQUEST_STATUSES.RECEPTION_PENDING]: {
    label: 'Reception pending',
    color: '#D10580',
  },
  [LAB_REQUEST_STATUSES.RESULTS_PENDING]: {
    label: 'Results pending',
    color: '#CB6100',
  },
  [LAB_REQUEST_STATUSES.TO_BE_VERIFIED]: {
    label: 'To be verified',
    color: '#BD9503',
  },
  [LAB_REQUEST_STATUSES.VERIFIED]: {
    label: 'Verified',
    color: '#1172D1',
  },
  [LAB_REQUEST_STATUSES.PUBLISHED]: {
    label: 'Published',
    color: '#19934E',
  },
  [LAB_REQUEST_STATUSES.CANCELLED]: {
    label: 'Cancelled',
    color: '#444444',
  },
  [LAB_REQUEST_STATUSES.DELETED]: {
    label: 'Deleted',
    color: '#444444',
  },
  [LAB_REQUEST_STATUSES.ENTERED_IN_ERROR]: {
    label: 'Entered in error',
    color: '#F76853',
    background: '#FFCEC7',
  },
  unknown: {
    label: 'Unknown',
    color: '#444444',
  },
};

export const LAB_TEST_STATUSES = LAB_REQUEST_STATUSES;

export const LAB_TEST_RESULT_TYPES = {
  FREE_TEXT: 'FreeText',
  NUMBER: 'Number',
  SELECT: 'Select',
};
