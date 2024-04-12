import { createValueIndex } from '@tamanu/shared/utils/valueIndex';
import { DIAGNOSIS_CERTAINTY } from '@tamanu/constants';

export const DIAGNOSIS_CERTAINTY_LABELS = {
  [DIAGNOSIS_CERTAINTY.EMERGENCY]: 'ED Diagnosis',
  [DIAGNOSIS_CERTAINTY.SUSPECTED]: 'Suspected',
  [DIAGNOSIS_CERTAINTY.CONFIRMED]: 'Confirmed',
  [DIAGNOSIS_CERTAINTY.DISPROVEN]: 'Disproven',
  [DIAGNOSIS_CERTAINTY.RECORDED_IN_ERROR]: 'Recorded in error',
};

export const DIAGNOSIS_CERTAINTY_OPTIONS = [
  {
    value: DIAGNOSIS_CERTAINTY.EMERGENCY,
    label: DIAGNOSIS_CERTAINTY_LABELS[DIAGNOSIS_CERTAINTY.EMERGENCY],
    triageOnly: true,
  },
  {
    value: DIAGNOSIS_CERTAINTY.SUSPECTED,
    label: DIAGNOSIS_CERTAINTY_LABELS[DIAGNOSIS_CERTAINTY.SUSPECTED],
  },
  {
    value: DIAGNOSIS_CERTAINTY.CONFIRMED,
    label: DIAGNOSIS_CERTAINTY_LABELS[DIAGNOSIS_CERTAINTY.CONFIRMED],
  },
  {
    value: DIAGNOSIS_CERTAINTY.DISPROVEN,
    label: DIAGNOSIS_CERTAINTY_LABELS[DIAGNOSIS_CERTAINTY.DISPROVEN],
    editOnly: true,
  },
  {
    value: DIAGNOSIS_CERTAINTY.RECORDED_IN_ERROR,
    label: DIAGNOSIS_CERTAINTY_LABELS[DIAGNOSIS_CERTAINTY.RECORDED_IN_ERROR],
    editOnly: true,
  },
];

export const CERTAINTY_OPTIONS_BY_VALUE = createValueIndex(DIAGNOSIS_CERTAINTY_OPTIONS);