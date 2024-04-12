import React, { ReactElement, useCallback, useRef } from 'react';
import { StyledView } from '/styled/common';
import { Form } from '../Form';
import { FormScreenView } from '/components/Forms/FormScreenView';
import { PatientAdditionalDataFields } from './PatientAdditionalDataFields';
import {
  getInitialAdditionalValues,
  getInitialCustomValues,
  patientAdditionalDataValidationSchema,
} from './helpers';
import { PatientAdditionalData } from '~/models/PatientAdditionalData';
import { PatientFieldValue } from '~/models/PatientFieldValue';
import { Routes } from '~/ui/helpers/routes';
import { additionalDataSections } from '~/ui/helpers/additionalData';
import { SubmitButton } from '../SubmitButton';
import { TranslatedText } from '/components/Translations/TranslatedText';

export const PatientAdditionalDataForm = ({
  patientId,
  additionalData,
  navigation,
  sectionTitle,
  isCustomFields,
  customSectionFields,
  customPatientFieldValues,
}): ReactElement => {
  const scrollViewRef = useRef();
  // After save/update, the model will mark itself for upload and the
  // patient for sync (see beforeInsert and beforeUpdate decorators).
  const onCreateOrEditAdditionalData = useCallback(
    async values => {
      if (isCustomFields) {
        await Promise.all(
          Object.keys(values || {}).map(definitionId =>
            PatientFieldValue.updateOrCreateForPatientAndDefinition(
              patientId,
              definitionId,
              values[definitionId],
            ),
          ),
        );
      } else {
        await PatientAdditionalData.updateForPatient(patientId, values);
      }
      // Navigate back to patient details
      navigation.navigate(Routes.HomeStack.PatientDetailsStack.Index);
    },
    [navigation, isCustomFields],
  );

  // Get the actual additional data section object
  const section = isCustomFields
    ? {
        fields: customSectionFields.map(({ id, name, fieldType, options }) => ({
          id,
          name,
          fieldType,
          options,
        })),
      }
    : additionalDataSections.find(({ title }) => title === sectionTitle);
  const { fields } = section;

  return (
    <Form
      initialValues={
        isCustomFields
          ? getInitialCustomValues(customPatientFieldValues, fields)
          : getInitialAdditionalValues(additionalData, fields)
      }
      validationSchema={patientAdditionalDataValidationSchema}
      onSubmit={onCreateOrEditAdditionalData}
    >
      {(): ReactElement => (
        <FormScreenView scrollViewRef={scrollViewRef}>
          <StyledView justifyContent="space-between">
            <PatientAdditionalDataFields
              fields={fields}
              isCustomFields={isCustomFields}
              showMandatory={false}
            />
            <SubmitButton buttonText={<TranslatedText stringId="general.action.save" fallback="Save" />} marginTop={10} />
          </StyledView>
        </FormScreenView>
      )}
    </Form>
  );
};
