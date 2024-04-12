import React, { useEffect } from 'react';
import { useFormikContext } from 'formik';
import { NavigationProp } from '@react-navigation/native';

import { StyledView } from '/styled/common';
import { Field } from './Forms/FormField';
import { AutocompleteModalField } from './AutocompleteModal/AutocompleteModalField';
import { Suggester } from '~/ui/helpers/suggester';
import { useFacility } from '~/ui/contexts/FacilityContext';
import { useBackend } from '~/ui/hooks';
import { TranslatedText } from './Translations/TranslatedText';

interface LocationFieldProps {
  navigation: NavigationProp<any>;
  required?: boolean;
}

export const LocationField: React.FC<LocationFieldProps> = ({ navigation, required = false }) => {
  const { values, setValues } = useFormikContext();
  const { models } = useBackend();
  const { facilityId } = useFacility();

  const locationGroupSuggester = new Suggester(models.LocationGroup, {
    where: {
      facility: facilityId,
    },
  });

  const locationSuggester = new Suggester(models.Location, {
    where: {
      facility: facilityId,
      locationGroup: values.locationGroupId,
    },
  });

  useEffect(() => {
    if (values.locationId && !values.locationGroupId) {
      (async (): Promise<void> => {
        const location = await models.Location.findOne(values.locationId);
        const newValues = { ...values, locationGroupId: location.locationGroupId };
        setValues(newValues);
      })();
    }
  }, [values.locationId]);

  const handleChangeLocationGroup = () => {
    // reset location value when changing the parent location group
    const newValues = { ...values };
    delete newValues.locationId;
    setValues(newValues);
  };

  return (
    <StyledView>
      <Field
        component={AutocompleteModalField}
        navigation={navigation}
        suggester={locationGroupSuggester}
        name="locationGroupId"
        label={<TranslatedText stringId="general.form.area.label" fallback="Area" />}
        placeholder="Search..."
        required={required}
        onChange={handleChangeLocationGroup}
      />

      <Field
        component={AutocompleteModalField}
        navigation={navigation}
        suggester={locationSuggester}
        name="locationId"
        label={<TranslatedText stringId="general.form.location.label" fallback="Location" />}
        placeholder="Search..."
        disabled={!values.locationGroupId}
        required={required}
      />
    </StyledView>
  );
};
