import { PATIENT_DETAIL_LAYOUTS } from '@tamanu/constants';

import {
  CambodiaPatientFieldLayout,
  CambodiaPrimaryDetailsLayout,
  CambodiaSecondaryDetailsLayout,
} from './layouts/cambodia/CambodiaLayout';
import {
  GenericPatientFieldLayout,
  GenericPrimaryDetailsLayout,
  GenericSecondaryDetailsLayout,
} from './layouts/generic/GenericLayout';
import { useLocalisation } from '../../contexts/Localisation';

const LAYOUT_COMPONENTS = {
  [PATIENT_DETAIL_LAYOUTS.GENERIC]: {
    PrimaryDetails: GenericPrimaryDetailsLayout,
    SecondaryDetails: GenericSecondaryDetailsLayout,
    PatientFields: GenericPatientFieldLayout,
  },
  [PATIENT_DETAIL_LAYOUTS.CAMBODIA]: {
    PrimaryDetails: CambodiaPrimaryDetailsLayout,
    SecondaryDetails: CambodiaSecondaryDetailsLayout,
    PatientFields: CambodiaPatientFieldLayout,
  },
};

export const useLayoutComponents = () => {
  const { getLocalisation } = useLocalisation();
  const layout = getLocalisation('layouts.patientDetails') || PATIENT_DETAIL_LAYOUTS.GENERIC;
  return LAYOUT_COMPONENTS[layout];
};
