import React from 'react';
import * as yup from 'yup';
import { getCurrentDateTimeString } from '@tamanu/shared/utils/dateTime';
import { useSuggester } from '../api';
import { foreignKey } from '../utils/validation';

import {
  AutocompleteField,
  DateField,
  Field,
  Form,
  NumberField,
  TextField,
} from '../components/Field';
import { FormGrid } from '../components/FormGrid';
import { FormSubmitCancelRow } from '../components/ButtonRow';
import { FORM_TYPES } from '../constants';
import { TranslatedText } from '../components/Translation/TranslatedText';

export const InvoicePriceChangeItemForm = ({
  actionText,
  onSubmit,
  onCancel,
  invoicePriceChangeItem,
}) => {
  const practitionerSuggester = useSuggester('practitioner');

  return (
    <Form
      onSubmit={onSubmit}
      render={({ submitForm }) => (
        <FormGrid>
          <Field
            name="date"
            label={<TranslatedText stringId="general.date.label" fallback="Date" />}
            required
            component={DateField}
            saveDateAsString
          />
          <Field
            name="description"
            label={
              <TranslatedText
                stringId="invoice.modal.priceChange.description.label"
                fallback="Details"
              />
            }
            required
            component={TextField}
          />
          <Field
            name="orderedById"
            label={
              <TranslatedText
                stringId="invoice.modal.priceChange.orderedBy.label"
                fallback="Ordered by"
              />
            }
            required
            component={AutocompleteField}
            suggester={practitionerSuggester}
          />
          <Field
            name="percentageChange"
            label={
              <TranslatedText
                stringId="invoice.modal.priceChange.percentageChange.label"
                fallback="Discount/markup % (-/+)"
              />
            }
            required
            component={NumberField}
          />
          <FormSubmitCancelRow
            confirmText={actionText}
            onConfirm={submitForm}
            onCancel={onCancel}
          />
        </FormGrid>
      )}
      initialValues={{
        date: getCurrentDateTimeString(),
        ...invoicePriceChangeItem,
      }}
      formType={invoicePriceChangeItem ? FORM_TYPES.EDIT_FORM : FORM_TYPES.CREATE_FORM}
      validationSchema={yup.object().shape({
        description: foreignKey().translatedLabel(
          <TranslatedText
            stringId="invoice.modal.priceChange.description.label"
            fallback="Details"
          />,
        ),
        orderedById: foreignKey().translatedLabel(
          <TranslatedText
            stringId="invoice.modal.priceChange.orderedBy.label"
            fallback="Ordered by"
          />,
        ),
        date: yup
          .date()
          .required()
          .translatedLabel(<TranslatedText stringId="general.date.label" fallback="Date" />),
        percentageChange: yup
          .number()
          .required()
          .translatedLabel(
            <TranslatedText
              stringId="invoice.modal.priceChange.validation.percentageChange.path"
              fallback="Percentage change"
            />,
          ),
      })}
    />
  );
};
