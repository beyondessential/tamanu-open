import React from 'react';
import { CustomisableSearchBar } from './CustomisableSearchBar';
import { useSuggester } from '../../api';
import { AutocompleteField, DisplayIdField, LocalisedField } from '../Field';

export const ImmunisationSearchBar = ({ onSearch }) => {
  const villageSuggester = useSuggester('village');

  return (
    <CustomisableSearchBar
      title="Search for Patients"
      onSearch={onSearch}
      staticValues={{ displayIdExact: true }}
    >
      <DisplayIdField />
      <LocalisedField name="firstName" />
      <LocalisedField name="lastName" />
      <LocalisedField name="villageId" component={AutocompleteField} suggester={villageSuggester} />
      <LocalisedField name="vaccinationStatus" defaultLabel="Vaccination Status" />
    </CustomisableSearchBar>
  );
};
