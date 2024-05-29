import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import * as yup from 'yup';
import { VISIBILITY_STATUSES, VITALS_DATA_ELEMENT_IDS } from '@tamanu/constants';
import { getCurrentDateTimeString } from '@tamanu/shared/utils/dateTime';
import { Form, FormSubmitCancelRow, ModalLoader } from '../components';
import { SurveyScreen } from '../components/Surveys';
import { combineQueries } from '../api/combineQueries';
import { usePatientAdditionalDataQuery, useVitalsSurveyQuery } from '../api/queries';
import { getFormInitialValues, getValidationSchema } from '../utils';
import { ForbiddenErrorModalContents } from '../components/ForbiddenErrorModal';
import { Modal } from '../components/Modal';
import { ErrorMessage } from '../components/ErrorMessage';
import { useAuth } from '../contexts/Auth';
import { useEncounter } from '../contexts/Encounter';
import { TranslatedText } from '../components/Translation/TranslatedText';
import { useTranslation } from '../contexts/Translation';

export const VitalsForm = React.memo(({ patient, onSubmit, onClose, encounterType }) => {
  const { getTranslation } = useTranslation();
  const {
    data: [vitalsSurvey, patientAdditionalData],
    isLoading,
    isError,
    error,
  } = combineQueries([useVitalsSurveyQuery(), usePatientAdditionalDataQuery(patient.id)]);
  const { encounter } = useEncounter();
  const { components = [] } = vitalsSurvey || {};
  const currentComponents = components
    .filter(c => c.visibilityStatus === VISIBILITY_STATUSES.CURRENT)
    .map(c =>
      c.dataElementId === VITALS_DATA_ELEMENT_IDS.dateRecorded
        ? { ...c, validationCriteria: JSON.stringify({ mandatory: true }) }
        : c,
    );
  const validationSchema = useMemo(
    () =>
      getValidationSchema({ components: currentComponents }, getTranslation, {
        encounterType: encounterType || encounter?.encounterType,
      }).concat(
        yup.object().shape({
          [VITALS_DATA_ELEMENT_IDS.dateRecorded]: yup
            .date()
            .translatedLabel(
              <TranslatedText stringId="general.recordedDate.label" fallback="Date recorded" />,
            )
            .required(),
        }),
      ),
    [currentComponents, encounter?.encounterType, encounterType, getTranslation],
  );
  const { ability } = useAuth();
  const canCreateVitals = ability.can('create', 'Vitals');

  if (isLoading) {
    return <ModalLoader />;
  }

  if (!canCreateVitals) {
    return (
      <Modal title="Permission required" open onClose={onClose}>
        <ForbiddenErrorModalContents onConfirm={onClose} confirmText="Close" />
      </Modal>
    );
  }

  if (isError) {
    return (
      <ErrorMessage
        title="Error: Cannot load vitals form"
        errorMessage="Please contact an administrator to ensure the Vitals form is configured correctly."
        error={error}
      />
    );
  }

  const handleSubmit = async data => onSubmit({ survey: vitalsSurvey, ...data });

  return (
    <Form
      onSubmit={handleSubmit}
      showInlineErrorsOnly
      validateOnChange
      validateOnBlur
      validationSchema={validationSchema}
      initialValues={{
        [VITALS_DATA_ELEMENT_IDS.dateRecorded]: getCurrentDateTimeString(),
        ...getFormInitialValues(currentComponents, patient, patientAdditionalData),
      }}
      validate={values => {
        if (
          Object.entries(values)
            .filter(([name]) => name !== VITALS_DATA_ELEMENT_IDS.dateRecorded)
            .every(([, value]) => value === '' || value === null || value === undefined)
        ) {
          return { form: 'At least one recording must be entered.' };
        }

        return {};
      }}
      render={({ submitForm, values, setFieldValue }) => (
        <SurveyScreen
          allComponents={currentComponents}
          patient={patient}
          cols={2}
          values={values}
          setFieldValue={setFieldValue}
          submitButton={
            <FormSubmitCancelRow
              confirmText={<TranslatedText stringId="general.action.record" fallback="Record" />}
              onConfirm={submitForm}
              onCancel={onClose}
            />
          }
          encounterType={encounterType}
        />
      )}
    />
  );
});

VitalsForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  patient: PropTypes.object.isRequired,
};
