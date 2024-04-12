import React from 'react';
import { NavigationProp } from '@react-navigation/native';

import { DateField } from '../../DateField/DateField';
import { TextField } from '../../TextField/TextField';
import { Checkbox } from '../../Checkbox';
import { CurrentUserField } from '../../CurrentUserField/CurrentUserField';
import { Field } from '../FormField';
import { LocationField } from '../../LocationField';
import { INJECTION_SITE_OPTIONS, ReferenceDataType } from '~/types';
import { AutocompleteModalField } from '../../AutocompleteModal/AutocompleteModalField';
import { Dropdown, SuggesterDropdown } from '../../Dropdown';
import { Suggester } from '~/ui/helpers/suggester';
import { useFacility } from '~/ui/contexts/FacilityContext';
import { useBackend } from '~/ui/hooks';
import { TranslatedText, TranslatedTextElement } from '../../Translations/TranslatedText';

const InjectionSiteDropdown = ({ value, label, onChange, selectPlaceholderText }): JSX.Element => (
  <Dropdown
    value={value}
    options={INJECTION_SITE_OPTIONS.map(o => ({ label: o, value: o }))}
    onChange={onChange}
    label={label}
    selectPlaceholderText={selectPlaceholderText}
  />
);

interface LabelledFieldProps {
  label?: TranslatedTextElement;
  required?: boolean;
}

interface NavigationFieldProps {
  navigation: NavigationProp<any>;
}

export const DateGivenField = ({
  label = <TranslatedText stringId="vaccine.form.dateGiven.label" fallback="Date given" />,
  required = true,
  min
}: LabelledFieldProps): JSX.Element => (
  <Field component={DateField} name="date" label={label} required={required} min={min} />
);

export const BatchField = (): JSX.Element => (
  <Field
    component={TextField}
    name="batch"
    label={<TranslatedText stringId="vaccine.form.batch.label" fallback="Batch" />}
    labelFontSize="14"
    placeholder="Batch number"
  />
);

export const InjectionSiteField = (): JSX.Element => (
  <Field
    component={InjectionSiteDropdown}
    name="injectionSite"
    label={<TranslatedText stringId="vaccine.form.injectionSite.label" fallback="Injection site" />}
    selectPlaceholderText="Select"
  />
);

export const NotGivenReasonField = (): JSX.Element => (
  <Field
    component={SuggesterDropdown}
    name="notGivenReasonId"
    label={<TranslatedText stringId="vaccine.form.reason.label" fallback="Reason" />}
    selectPlaceholderText="Select"
    referenceDataType={ReferenceDataType.VaccineNotGivenReason}
  />
);

export const VaccineLocationField = ({ navigation }: NavigationFieldProps): JSX.Element => (
  <LocationField navigation={navigation} required />
);

export const DepartmentField = ({ navigation }: NavigationFieldProps): JSX.Element => {
  const { models } = useBackend();
  const { facilityId } = useFacility();

  const departmentSuggester = new Suggester(models.Department, {
    where: {
      facility: facilityId,
    },
  });

  return (
    <Field
      component={AutocompleteModalField}
      navigation={navigation}
      suggester={departmentSuggester}
      name="departmentId"
      label={<TranslatedText stringId="general.form.department.label" fallback="Department" />}
      placeholder="Search..."
      required
    />
  );
};

export const GivenByField = ({
  label = <TranslatedText stringId="vaccine.form.givenBy.label" fallback="Given by" />,
}: LabelledFieldProps): JSX.Element => (
  <Field component={TextField} label={label} name="givenBy" labelFontSize="14" />
);

export const RecordedByField = (): JSX.Element => (
  <CurrentUserField
    label={<TranslatedText stringId="vaccine.form.recordedBy.label" fallback="Recorded by" />}
    name="recorderId"
    labelFontSize="14"
  />
);

export const ConsentField = (): JSX.Element => (
  <Field
    component={Checkbox}
    name="consent"
    label={<TranslatedText stringId="vaccine.form.consent.label" fallback="Consent" />}
    text={
      <TranslatedText
        stringId="vaccine.form.consent.text"
        fallback="Do you have consent from the recipient/parent/guardian to give this vaccine and record in Tamanu?"
      />
    }
    required
  />
);

export const ConsentGivenByField = (): JSX.Element => (
  <Field
    component={TextField}
    name="consentGivenBy"
    label={
      <TranslatedText stringId="vaccine.form.consentGivenBy.label" fallback="Consent given by" />
    }
    placeholder="Consent given by"
    labelFontSize="14"
  />
);
