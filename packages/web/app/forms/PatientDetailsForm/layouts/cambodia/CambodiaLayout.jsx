import React from 'react';
import styled from 'styled-components';
import {
  PATIENT_FIELD_DEFINITION_TYPES,
  PATIENT_REGISTRY_TYPES,
  SETTING_KEYS,
} from '@tamanu/constants';
import { getCurrentDateTimeString } from '@tamanu/shared/utils/dateTime';
import { Colors } from '../../../../constants';
import { LocalisedField, TextField, DateField, RadioField, FormGrid } from '../../../../components';
import {
  PatientDetailsHeading,
  SecondaryDetailsFormGrid,
  SecondaryDetailsGroup,
} from '../../PatientDetailsCommonElements';
import { CambodiaLocationFields } from './patientFields/CambodiaLocationFields';
import { CambodiaContactFields } from './patientFields/CambodiaContactFields';
import { CambodiaIdentificationFields } from './patientFields/CambodiaIdentificationFields';
import { CambodiaPersonalFields } from './patientFields/CambodiaPersonalFields';
import { GenericBirthFields } from '../generic/patientFields/GenericBirthFields';
import { PatientField, PatientFieldsGroup } from '../../PatientFields';
import { TranslatedText } from '../../../../components/Translation/TranslatedText';
import { ReminderContactSection } from '../../../../components/ReminderContact/ReminderContactSection';
import { useSettings } from '../../../../contexts/Settings';

const FATHERS_FIRST_NAME_DEFINITION_ID = 'fieldDefinition-fathersFirstName';

const CAMBODIA_CORE_FIELD_CATEGORY_ID = 'fieldCategory-cambodiaCorePatientFields';

export const CambodiaPrimaryDetailsLayout = ({
  sexOptions,
  isRequiredPatientData,
  isDetailsForm = false,
}) => {
  const { getSetting } = useSettings();
  const isReminderContactEnabled = getSetting(SETTING_KEYS.FEATURES_REMINDER_CONTACT_ENABLED);

  return (
    <>
      <PatientDetailsHeading>
        <TranslatedText
          stringId="patient.detail.subheading.general"
          fallback="General information"
        />
        {isReminderContactEnabled && isDetailsForm && <ReminderContactSection />}
      </PatientDetailsHeading>
      <FormGrid>
        <LocalisedField
          name="lastName"
          label={
            <TranslatedText stringId="general.localisedField.lastName.label" fallback="Last name" />
          }
          component={TextField}
          required
        />
        <LocalisedField
          name="firstName"
          label={
            <TranslatedText
              stringId="general.localisedField.firstName.label"
              fallback="First name"
            />
          }
          component={TextField}
          required
        />
        <LocalisedField
          name="dateOfBirth"
          label={
            <TranslatedText
              stringId="general.localisedField.dateOfBirth.label"
              fallback="Date of birth"
            />
          }
          max={getCurrentDateTimeString()}
          component={DateField}
          required
          saveDateAsString
        />
        <LocalisedField
          name="sex"
          label={<TranslatedText stringId="general.localisedField.sex.label" fallback="Sex" />}
          component={RadioField}
          options={sexOptions}
          required
        />
        <LocalisedField
          name="culturalName"
          label={
            <TranslatedText
              stringId="cambodiaPatientDetails.mothersFirstName.label"
              fallback="Mother's first name"
            />
          }
          component={TextField}
          required={isRequiredPatientData('culturalName')}
        />
        <PatientField
          definition={{
            name: (
              <TranslatedText
                stringId="cambodiaPatientDetails.fathersFirstName.label"
                fallback="Father's first name"
              />
            ),
            definitionId: FATHERS_FIRST_NAME_DEFINITION_ID,
            fieldType: PATIENT_FIELD_DEFINITION_TYPES.STRING,
          }}
        />
      </FormGrid>
    </>
  );
};

const BorderFormGrid = styled(SecondaryDetailsFormGrid)`
  border: 1px solid ${Colors.outline};
  border-radius: 3px;
  padding: 1rem 1.5rem 2rem;
  margin-top: -1rem;
`;

export const CambodiaSecondaryDetailsLayout = ({ values = {}, patientRegistryType, className }) => {
  return (
    <div className={className}>
      <SecondaryDetailsGroup>
        {patientRegistryType === PATIENT_REGISTRY_TYPES.BIRTH_REGISTRY && (
          <>
            <PatientDetailsHeading>
              <TranslatedText
                stringId="patient.detail.subheading.birthDetails"
                fallback="Birth details"
              />
            </PatientDetailsHeading>
            <SecondaryDetailsFormGrid>
              <GenericBirthFields registeredBirthPlace={values.registeredBirthPlace} />
            </SecondaryDetailsFormGrid>
          </>
        )}
        <PatientDetailsHeading>
          <TranslatedText
            stringId="patient.detail.subheading.currentAddress"
            fallback="Current address"
          />
        </PatientDetailsHeading>
        <BorderFormGrid>
          <CambodiaLocationFields />
        </BorderFormGrid>
        <PatientDetailsHeading>
          <TranslatedText
            stringId="patient.detail.subheading.contactInformation"
            fallback="Contact information"
          />
        </PatientDetailsHeading>
        <SecondaryDetailsFormGrid>
          <CambodiaContactFields />
        </SecondaryDetailsFormGrid>

        <PatientDetailsHeading>
          <TranslatedText
            stringId="patient.detail.subheading.identificationInformation"
            fallback="Identification information"
          />
        </PatientDetailsHeading>
        <SecondaryDetailsFormGrid>
          <CambodiaIdentificationFields patientRegistryType={patientRegistryType} />
        </SecondaryDetailsFormGrid>

        <PatientDetailsHeading>
          <TranslatedText
            stringId="patient.detail.subheading.personalInformation"
            fallback="Personal information"
          />
        </PatientDetailsHeading>
        <SecondaryDetailsFormGrid>
          <CambodiaPersonalFields patientRegistryType={patientRegistryType} />
        </SecondaryDetailsFormGrid>
      </SecondaryDetailsGroup>
    </div>
  );
};

export const CambodiaPatientFieldLayout = ({ fieldDefinitions, fieldValues }) => {
  const filteredDefinitions = fieldDefinitions.filter(
    field => field.categoryId !== CAMBODIA_CORE_FIELD_CATEGORY_ID,
  );
  return <PatientFieldsGroup fieldDefinitions={filteredDefinitions} fieldValues={fieldValues} />;
};
