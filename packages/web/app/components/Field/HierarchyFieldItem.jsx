import React, { useEffect, useMemo } from 'react';
import { useApi } from '../../api';
import { AutocompleteField } from './AutocompleteField';
import { LocalisedField } from './LocalisedField';
import { useFormikContext } from 'formik';
import { Suggester } from '../../utils/suggester';

export const HierarchyFieldItem = ({ isFirstLevel, relationType, parentId, fieldData }) => {
  const api = useApi();
  const { setFieldValue, dirty } = useFormikContext();

  const suggester = useMemo(() => {
    return new Suggester(api, fieldData.referenceType, {
      enable: isFirstLevel || !!parentId,
      baseQueryParameters: !isFirstLevel && { parentId, relationType },
    });
  }, [api, fieldData.referenceType, isFirstLevel, parentId, relationType]);

  // Clear the value of the field when the parent field changes
  useEffect(() => {
    // Don't clear the value unless the form has been edited
    if (!dirty) return;
    setFieldValue(fieldData.name, undefined);
  }, [fieldData.name, parentId, setFieldValue]);

  return (
    <LocalisedField
      component={AutocompleteField}
      suggester={suggester}
      disabled={!isFirstLevel && !parentId}
      {...fieldData}
    />
  );
};
