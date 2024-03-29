import React from 'react';
import * as yup from 'yup';
import { LAB_TEST_RESULT_TYPES } from 'shared/constants';
import {
  Form,
  Field,
  NumberField,
  TextField,
  SelectField,
  DateTimeField,
  AutocompleteField,
} from '../components/Field';
import { FormGrid } from '../components/FormGrid';
import { ConfirmCancelRow } from '../components/ButtonRow';
import { capitaliseFirstLetter } from '../utils/capitalise';
import { useSuggester } from '../api';

function getComponentForTest(resultType, options) {
  if (options && options.length) return SelectField;
  if (resultType === LAB_TEST_RESULT_TYPES.FREE_TEXT) return TextField;
  return NumberField;
}

function renderOptions(options) {
  if (!options) return [];

  const trimmed = options.trim();
  if (!trimmed) return [];
  return trimmed
    .split(', ')
    .map(x => x.trim())
    .filter(x => x)
    .map(value => ({
      value,
      label: capitaliseFirstLetter(value),
    }));
}

export const ManualLabResultForm = ({ onSubmit, onClose, labTest, isReadOnly }) => {
  const { resultType, options } = labTest.labTestType;
  const component = getComponentForTest(resultType, options);
  const methodSuggester = useSuggester('labTestMethod');

  return (
    <Form
      onSubmit={onSubmit}
      render={({ submitForm }) => (
        <FormGrid columns={1}>
          <Field
            label="Result"
            name="result"
            required
            component={component}
            options={renderOptions(options)}
            disabled={isReadOnly}
          />
          <Field
            label="Test method"
            name="labTestMethodId"
            placeholder="Search methods"
            component={AutocompleteField}
            suggester={methodSuggester}
            disabled={isReadOnly}
          />
          <Field
            label="Laboratory officer"
            name="laboratoryOfficer"
            component={TextField}
            disabled={isReadOnly}
          />
          <Field
            label="Verification"
            name="verification"
            component={TextField}
            disabled={isReadOnly}
          />
          <Field
            label="Time of test"
            name="completedDate"
            component={DateTimeField}
            disabled={isReadOnly}
            saveDateAsString
          />
          <ConfirmCancelRow
            onConfirm={submitForm}
            onCancel={onClose}
            confirmDisabled={isReadOnly}
          />
        </FormGrid>
      )}
      initialValues={labTest}
      validationSchema={yup.object().shape({
        result: yup.mixed().required(),
      })}
    />
  );
};
