import React, { useEffect, useMemo, useState } from 'react';
import { PropTypes } from 'prop-types';
import * as yup from 'yup';

import { SETTING_KEYS, VACCINE_CATEGORIES, VACCINE_RECORDING_TYPES } from '@tamanu/constants';
import { getCurrentDateTimeString } from '@tamanu/shared/utils/dateTime';

import { FORM_TYPES, REQUIRED_INLINE_ERROR_MESSAGE } from '../constants';
import { Form } from '../components/Field';
import { ErrorMessage } from '../components/ErrorMessage';
import { LoadingIndicator } from '../components/LoadingIndicator';
import {
  VACCINE_GIVEN_INITIAL_VALUES,
  VACCINE_GIVEN_VALIDATION_SCHEMA,
  VaccineGivenForm,
} from './VaccineGivenForm';
import { VaccineNotGivenForm } from './VaccineNotGivenForm';
import { usePatientCurrentEncounter } from '../api/queries';
import { useVaccinationSettings } from '../api/queries/useVaccinationSettings';
import { useAuth } from '../contexts/Auth';
import { TranslatedText } from '../components/Translation/TranslatedText';
import { useLocalisation } from '../contexts/Localisation';
import { usePatientData } from '../api/queries/usePatientData';
import { isBefore, parse } from 'date-fns';

const validateGivenElsewhereRequiredField = (status, givenElsewhere) =>
  (status === VACCINE_RECORDING_TYPES.GIVEN && !givenElsewhere) ||
  status === VACCINE_RECORDING_TYPES.NOT_GIVEN; // If NOT_GIVEN then do not care about givenElsewhere

const BASE_VACCINE_SCHEME_VALIDATION = yup.object().shape({
  date: yup
    .string()
    .when(['status', 'givenElsewhere'], {
      is: validateGivenElsewhereRequiredField,
      then: yup.string().required(REQUIRED_INLINE_ERROR_MESSAGE),
      otherwise: yup.string().nullable(),
    })
    .when(['status'], {
      is: VACCINE_RECORDING_TYPES.GIVEN,
      then: schema =>
        schema.test('min', 'Date cannot be prior to patient date of birth', (value, context) => {
          if (!value) return true;
          const format = 'yyyy-MM-dd';
          const minDate = parse(context.parent?.patientData?.dateOfBirth, format, new Date());
          const date = parse(value, format, new Date());
          if (isBefore(date, minDate)) {
            return false;
          }
          return true;
        }),
    }),
  locationId: yup.string().when(['status', 'givenElsewhere'], {
    is: validateGivenElsewhereRequiredField,
    then: yup.string().required(REQUIRED_INLINE_ERROR_MESSAGE),
    otherwise: yup.string().nullable(),
  }),
  departmentId: yup.string().when(['status', 'givenElsewhere'], {
    is: validateGivenElsewhereRequiredField,
    then: yup.string().required(REQUIRED_INLINE_ERROR_MESSAGE),
    otherwise: yup.string().nullable(),
  }),
});

export const NEW_RECORD_VACCINE_SCHEME_VALIDATION = BASE_VACCINE_SCHEME_VALIDATION.shape({
  category: yup.string().required(REQUIRED_INLINE_ERROR_MESSAGE),
  vaccineLabel: yup.string().when('category', {
    is: categoryValue => !!categoryValue && categoryValue !== VACCINE_CATEGORIES.OTHER,
    then: yup.string().required(REQUIRED_INLINE_ERROR_MESSAGE),
    otherwise: yup.string().nullable(),
  }),
  vaccineName: yup.string().when('category', {
    is: VACCINE_CATEGORIES.OTHER,
    then: yup.string().required(REQUIRED_INLINE_ERROR_MESSAGE),
    otherwise: yup.string().nullable(),
  }),
  scheduledVaccineId: yup.string().when('category', {
    is: categoryValue => categoryValue !== VACCINE_CATEGORIES.OTHER,
    then: yup.string().required(REQUIRED_INLINE_ERROR_MESSAGE),
    otherwise: yup.string().nullable(),
  }),
});

export const VaccineForm = ({
  onCancel,
  onSubmit,
  editMode = false,
  currentVaccineRecordValues,
  patientId,
  getScheduledVaccines,
  vaccineRecordingType,
}) => {
  const { getLocalisation } = useLocalisation();
  const [vaccineOptions, setVaccineOptions] = useState([]);
  const [category, setCategory] = useState(
    currentVaccineRecordValues?.vaccineName ? VACCINE_CATEGORIES.OTHER : VACCINE_CATEGORIES.ROUTINE,
  );
  const [vaccineLabel, setVaccineLabel] = useState();

  const { data: patientData } = usePatientData(patientId);
  const {
    data: currentEncounter,
    isLoading: isLoadingCurrentEncounter,
    error: currentEncounterError,
  } = usePatientCurrentEncounter(patientId);
  const {
    data: vaccinationDefaults = {},
    isLoading: isLoadingVaccinationDefaults,
    error: vaccinationDefaultsError,
  } = useVaccinationSettings(SETTING_KEYS.VACCINATION_DEFAULTS);

  const selectedVaccine = useMemo(() => vaccineOptions.find(v => v.label === vaccineLabel), [
    vaccineLabel,
    vaccineOptions,
  ]);

  const { currentUser } = useAuth();

  useEffect(() => {
    if (!editMode) {
      const fetchScheduledVaccines = async () => {
        if (!category || category === VACCINE_CATEGORIES.OTHER) {
          setVaccineOptions([]);
          return;
        }
        const availableScheduledVaccines = await getScheduledVaccines({ category });
        setVaccineOptions(
          availableScheduledVaccines.map(vaccine => ({
            label: vaccine.label,
            value: vaccine.label,
            schedules: vaccine.schedules,
          })),
        );
      };

      fetchScheduledVaccines();
    }
  }, [category, getScheduledVaccines, editMode]);

  if (isLoadingCurrentEncounter || isLoadingVaccinationDefaults) {
    return <LoadingIndicator />;
  }

  if (currentEncounterError || vaccinationDefaultsError) {
    return (
      <ErrorMessage
        title={<TranslatedText stringId="vaccine.loadError" fallback="Cannot load vaccine form" />}
        errorMessage={currentEncounterError?.message || vaccinationDefaultsError?.message}
      />
    );
  }

  const baseSchemeValidation = editMode
    ? BASE_VACCINE_SCHEME_VALIDATION
    : NEW_RECORD_VACCINE_SCHEME_VALIDATION;

  const vaccineConsentEnabled = getLocalisation('features.enableVaccineConsent');

  const initialValues = !editMode
    ? {
        status: vaccineRecordingType,
        category,
        date: getCurrentDateTimeString(),
        locationGroupId: !currentEncounter
          ? vaccinationDefaults.data?.locationGroupId
          : currentEncounter.location?.locationGroup?.id,
        locationId: !currentEncounter
          ? vaccinationDefaults.data?.locationId
          : currentEncounter.location?.id,
        departmentId: !currentEncounter
          ? vaccinationDefaults.data?.departmentId
          : currentEncounter.department?.id,
        ...(vaccineRecordingType === VACCINE_RECORDING_TYPES.GIVEN
          ? VACCINE_GIVEN_INITIAL_VALUES
          : {}),
        patientData,
      }
    : {
        ...currentVaccineRecordValues,
        ...(currentVaccineRecordValues.circumstanceIds
          ? { circumstanceIds: JSON.stringify(currentVaccineRecordValues.circumstanceIds) }
          : {}),
        patientData,
      };

  return (
    <Form
      onSubmit={async data => onSubmit({ ...data, category })}
      showInlineErrorsOnly
      initialValues={initialValues}
      formType={editMode ? FORM_TYPES.EDIT_FORM : FORM_TYPES.CREATE_FORM}
      validationSchema={baseSchemeValidation.shape({
        ...(vaccineRecordingType === VACCINE_RECORDING_TYPES.GIVEN &&
          VACCINE_GIVEN_VALIDATION_SCHEMA(vaccineConsentEnabled)),
      })}
      render={({ submitForm, resetForm, setErrors, values, setValues }) => (
        <VaccineFormComponent
          vaccineRecordingType={vaccineRecordingType}
          submitForm={submitForm}
          resetForm={resetForm}
          setErrors={setErrors}
          editMode={editMode}
          values={values}
          setValues={setValues}
          vaccineLabel={vaccineLabel}
          vaccineOptions={vaccineOptions}
          category={category}
          setCategory={setCategory}
          setVaccineLabel={setVaccineLabel}
          schedules={selectedVaccine?.schedules}
          onCancel={onCancel}
          currentUser={currentUser}
          vaccineConsentEnabled={vaccineConsentEnabled}
          initialValues={initialValues}
        />
      )}
    />
  );
};

const VaccineFormComponent = ({
  vaccineRecordingType,
  submitForm,
  resetForm,
  setErrors,
  values,
  setValues,
  patientId,
  initialValues,
  ...props
}) => {
  const { setCategory, setVaccineLabel, editMode } = props;
  useEffect(() => {
    // Reset the entire form values when switching between GIVEN and NOT_GIVEN tab
    resetForm({ values: initialValues });
    if (!editMode) {
      setCategory(VACCINE_CATEGORIES.ROUTINE);
    }
    setVaccineLabel(null);
    // we strictly only want to reset the form values when vaccineRecordingType is changed
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vaccineRecordingType]);

  return vaccineRecordingType === VACCINE_RECORDING_TYPES.GIVEN ? (
    <VaccineGivenForm
      {...props}
      resetForm={resetForm}
      setErrors={setErrors}
      submitForm={submitForm}
      values={values}
      patientId={patientId}
      setValues={setValues}
    />
  ) : (
    <VaccineNotGivenForm {...props} resetForm={resetForm} submitForm={submitForm} />
  );
};

VaccineForm.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  patientId: PropTypes.string.isRequired,
  getScheduledVaccines: PropTypes.func.isRequired,
  vaccineRecordingType: PropTypes.string.isRequired,
};
