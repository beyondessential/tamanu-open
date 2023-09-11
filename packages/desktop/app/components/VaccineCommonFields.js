import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Divider from '@material-ui/core/Divider';
import { CheckCircleRounded } from '@material-ui/icons';

import {
  INJECTION_SITE_OPTIONS,
  VACCINE_CATEGORY_OPTIONS,
  VACCINE_CATEGORIES,
} from 'shared/constants';

import { OuterLabelFieldWrapper } from './Field/OuterLabelFieldWrapper';
import {
  Field,
  TextField,
  AutocompleteField,
  DateField,
  RadioField,
  SelectField,
  CheckField,
  LocalisedLocationField,
} from './Field';
import { ConfirmCancelRow } from './ButtonRow';
import { useSuggester } from '../api';
import { useAuth } from '../contexts/Auth';
import { Colors } from '../constants';

export const FullWidthCol = styled.div`
  grid-column: 1/-1;
`;

export const StyledDivider = styled(Divider)`
  grid-column: 1/-1;
`;

export const VerticalDivider = styled(Divider)`
  height: 50px;
  margin-left: 5px;
`;

const VACCINE_FIELD_CATEGORY_OPTIONS = [
  ...VACCINE_CATEGORY_OPTIONS.filter(o => o.value !== VACCINE_CATEGORIES.OTHER),
  {
    value: VACCINE_CATEGORIES.OTHER,
    label: 'Other',
    leftOptionalElement: <VerticalDivider orientation="vertical" />,
    style: { marginLeft: '15px' },
  },
];

export const CategoryField = ({ setCategory, setVaccineLabel, resetForm }) => (
  <FullWidthCol>
    <Field
      name="category"
      label="Category"
      component={RadioField}
      options={VACCINE_FIELD_CATEGORY_OPTIONS}
      onChange={e => {
        setCategory(e.target.value);
        setVaccineLabel(null);
        resetForm();
      }}
      required
    />
  </FullWidthCol>
);

export const VaccineLabelField = ({ vaccineOptions, setVaccineLabel }) => (
  <Field
    name="vaccineLabel"
    label="Vaccine"
    component={SelectField}
    options={vaccineOptions}
    onChange={e => setVaccineLabel(e.target.value)}
    required
  />
);

export const BatchField = () => <Field name="batch" label="Batch" component={TextField} />;

export const VaccineDateField = ({ label, required = true }) => (
  <Field name="date" label={label} component={DateField} required={required} saveDateAsString />
);

export const InjectionSiteField = () => (
  <Field
    name="injectionSite"
    label="Injection site"
    component={SelectField}
    options={Object.values(INJECTION_SITE_OPTIONS).map(site => ({
      label: site,
      value: site,
    }))}
  />
);

export const LocationField = () => (
  <Field
    name="locationId"
    component={LocalisedLocationField}
    enableLocationStatus={false}
    required
  />
);

export const DepartmentField = () => {
  const departmentSuggester = useSuggester('department', {
    baseQueryParameters: { filterByFacility: true },
  });
  return (
    <Field
      name="departmentId"
      label="Department"
      required
      component={AutocompleteField}
      suggester={departmentSuggester}
    />
  );
};

export const GivenByField = ({ label = 'Given by' }) => (
  <Field name="givenBy" label={label} component={TextField} />
);

export const GivenByCountryField = () => {
  const countrySuggester = useSuggester('country');

  return (
    <Field
      name="givenBy"
      label="Country"
      component={AutocompleteField}
      suggester={countrySuggester}
      required
      allowFreeTextForExistingValue
    />
  );
};

export const RecordedByField = () => {
  const { currentUser } = useAuth();

  return (
    <Field
      disabled
      name="recorderId"
      label="Recorded by"
      component={SelectField}
      options={[
        {
          label: currentUser.displayName,
          value: currentUser.id,
        },
      ]}
      value={currentUser.id}
    />
  );
};

export const ConsentField = ({ label }) => (
  <FullWidthCol>
    <OuterLabelFieldWrapper label="Consent" style={{ marginBottom: '5px' }} required />
    <Field name="consent" label={label} component={CheckField} required />
  </FullWidthCol>
);

export const ConsentGivenByField = () => (
  <Field name="consentGivenBy" label="Consent given by" component={TextField} />
);

export const AdministeredVaccineScheduleField = ({ schedules }) => {
  const [scheduleOptions, setScheduledOptions] = useState([]);
  useEffect(() => {
    const options =
      schedules?.map(s => ({
        value: s.scheduledVaccineId,
        label: s.schedule,
        icon: s.administered ? <CheckCircleRounded style={{ color: Colors.safe }} /> : null,
        disabled: s.administered,
      })) || [];
    setScheduledOptions(options);
  }, [schedules]);

  return (
    scheduleOptions.length > 0 && (
      <FullWidthCol>
        <Field
          name="scheduledVaccineId"
          label="Schedule"
          component={RadioField}
          options={scheduleOptions}
          required
          autofillSingleAvailableOption
        />
      </FullWidthCol>
    )
  );
};

export const VaccineNameField = () => (
  <Field name="vaccineName" label="Vaccine name" component={TextField} required />
);

export const VaccineBrandField = () => (
  <Field name="vaccineBrand" label="Vaccine brand" component={TextField} />
);

export const DiseaseField = () => <Field name="disease" label="Disease" component={TextField} />;

export const ConfirmCancelRowField = ({ onConfirm, onCancel, editMode = false }) => (
  <ConfirmCancelRow
    onConfirm={onConfirm}
    onCancel={onCancel}
    confirmText={editMode ? 'Save' : undefined}
  />
);
