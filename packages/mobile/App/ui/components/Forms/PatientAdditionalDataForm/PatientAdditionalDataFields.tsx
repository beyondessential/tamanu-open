import React, { ReactElement } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyledView } from '/styled/common';
import { theme } from '/styled/theme';
import { Button } from '../../Button';
import { TextField } from '../../TextField/TextField';
import { Dropdown } from '~/ui/components/Dropdown';
import { useLocalisation } from '~/ui/contexts/LocalisationContext';
import { LocalisedField } from '~/ui/components/Forms/LocalisedField';
import { AutocompleteModalField } from '~/ui/components/AutocompleteModal/AutocompleteModalField';
import { Routes } from '~/ui/helpers/routes';
import { useBackend } from '~/ui/hooks';

import {
  plainFields,
  selectFields,
  selectFieldsOptions,
  relationIdFields,
  relationIdFieldsProperties,
  getSuggester,
} from './helpers';

const PlainField = ({ fieldName }): ReactElement => (
  // Outter styled view to momentarily add distance between fields
  <StyledView key={fieldName} paddingTop={15}>
    <LocalisedField name={fieldName} component={TextField} />
  </StyledView>
);

const SelectField = ({ fieldName }): ReactElement => (
  <LocalisedField
    key={fieldName}
    name={fieldName}
    options={selectFieldsOptions[fieldName]}
    component={Dropdown}
  />
);

const RelationField = ({ fieldName }): ReactElement => {
  const { models } = useBackend();
  const { getString } = useLocalisation();
  const navigation = useNavigation();
  const { type, placeholder } = relationIdFieldsProperties[fieldName];
  const localisedPlaceholder = getString(`fields.${fieldName}.longLabel`, placeholder);
  const suggester = getSuggester(models, type);

  return (
    <LocalisedField
      key={fieldName}
      component={AutocompleteModalField}
      placeholder={`Search for ${localisedPlaceholder}`}
      navigation={navigation}
      suggester={suggester}
      modalRoute={Routes.Autocomplete.Modal}
      name={fieldName}
    />
  );
};

function getComponentForField(fieldName: string): React.FC<{ fieldName: string}> {
  if (plainFields.includes(fieldName)) {
    return PlainField;
  }
  if (selectFields.includes(fieldName)) {
    return SelectField;
  }
  if (relationIdFields.includes(fieldName)) {
    return RelationField;
  }
  // Shouldn't happen
  throw new Error(`Unexpected field ${fieldName} for patient additional data.`);
}

export const PatientAdditionalDataFields = ({
  handleSubmit,
  isSubmitting,
  fields,
}): ReactElement => (
  <StyledView justifyContent="space-between">
    {fields.map(fieldName => {
      const Component = getComponentForField(fieldName);
      return <Component fieldName={fieldName} key={fieldName} />;
    })}
    <Button
      backgroundColor={theme.colors.PRIMARY_MAIN}
      onPress={handleSubmit}
      loadingAction={isSubmitting}
      buttonText="Save"
      marginTop={10}
    />
  </StyledView>
);
