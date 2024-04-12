import React from 'react';
import * as yup from 'yup';
import { getCurrentDateTimeString } from '@tamanu/shared/utils/dateTime';
import { foreignKey } from '../utils/validation';
import { DIAGNOSIS_CERTAINTY_OPTIONS, FORM_TYPES } from '../constants';

import { FormSubmitCancelRow } from '../components/ButtonRow';
import { FormGrid } from '../components/FormGrid';
import {
  AutocompleteField,
  CheckField,
  DateField,
  Field,
  Form,
  SelectField,
} from '../components/Field';
import { useSuggester } from '../api';
import { useLocalisation } from '../contexts/Localisation';
import { TranslatedText } from '../components/Translation/TranslatedText';

export const DiagnosisForm = React.memo(
  ({ isTriage = false, onCancel, onSave, diagnosis, excludeDiagnoses }) => {
    const { getLocalisation } = useLocalisation();

    // don't show the "ED Diagnosis" option if we're just on a regular encounter
    // (unless we're editing a diagnosis with ED certainty already set)
    const certaintyOptions = DIAGNOSIS_CERTAINTY_OPTIONS.filter(x => {
      if (x.editOnly && !(diagnosis && diagnosis.id)) return false;
      if (x.triageOnly && !isTriage) return false;
      return true;
    });
    const defaultCertainty = certaintyOptions[0].value;

    const icd10Suggester = useSuggester('icd10', {
      filterer: icd => !excludeDiagnoses.some(d => d.diagnosisId === icd.id),
    });

    return (
      <Form
        onSubmit={onSave}
        initialValues={{
          date: getCurrentDateTimeString(),
          isPrimary: true,
          certainty: defaultCertainty,
          ...diagnosis,
        }}
        formType={diagnosis ? FORM_TYPES.EDIT_FORM : FORM_TYPES.CREATE_FORM}
        validationSchema={yup.object().shape({
          diagnosisId: foreignKey('Diagnosis must be selected'),
          certainty: yup
            .string()
            .oneOf(certaintyOptions.map(x => x.value))
            .required(),
          date: yup.date().required(),
        })}
        render={({ submitForm }) => (
          <FormGrid>
            <div style={{ gridColumn: '1 / -1' }}>
              <Field
                name="diagnosisId"
                label={getLocalisation(`fields.diagnosis.longLabel`)}
                component={AutocompleteField}
                suggester={icd10Suggester}
                required
              />
            </div>
            <Field
              style={{ gridColumn: '1 / -1' }}
              name="isPrimary"
              label={<TranslatedText stringId="diagnosis.isPrimary.label" fallback="Is primary" />}
              component={CheckField}
            />
            <Field
              name="certainty"
              label={<TranslatedText stringId="diagnosis.certainty.label" fallback="Certainty" />}
              component={SelectField}
              options={certaintyOptions}
              required
              prefix="diagnosis.property.certainty"
            />
            <Field
              name="date"
              label={<TranslatedText stringId="general.date.label" fallback="Date" />}
              component={DateField}
              required
              saveDateAsString
            />
            <FormSubmitCancelRow onConfirm={submitForm} onCancel={onCancel} />
          </FormGrid>
        )}
      />
    );
  },
);
