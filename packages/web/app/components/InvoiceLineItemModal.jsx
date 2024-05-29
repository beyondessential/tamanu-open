import React, { useCallback } from 'react';
import * as yup from 'yup';
import { getCurrentDateTimeString } from '@tamanu/shared/utils/dateTime';
import { useApi } from '../api';
import { Suggester } from '../utils/suggester';
import { foreignKey } from '../utils/validation';
import { FormModal } from './FormModal';
import { AutocompleteField, DateField, Field, Form, NumberField } from './Field';
import { FormGrid } from './FormGrid';
import { FormSubmitCancelRow } from './ButtonRow';
import { FORM_TYPES } from '../constants';
import { TranslatedText } from './Translation/TranslatedText';

export const InvoiceLineItemModal = ({
  title,
  actionText,
  open,
  onClose,
  onSaved,
  invoiceId,
  invoiceLineItem,
}) => {
  const api = useApi();
  const invoiceLineTypeSuggester = new Suggester(api, 'invoiceLineTypes');
  const practitionerSuggester = new Suggester(api, 'practitioner');

  const createOrUpdateLineItem = useCallback(
    async data => {
      const invoiceLineItemData = {
        ...data,
        percentageChange: data.percentageChange ? data.percentageChange / 100 : undefined,
      };

      if (invoiceLineItem) {
        await api.put(`invoices/${invoiceId}/lineItems/${invoiceLineItem.id}`, invoiceLineItemData);
      } else {
        await api.post(`invoices/${invoiceId}/lineItems`, invoiceLineItemData);
      }
      onSaved();
    },
    [invoiceId, invoiceLineItem, api, onSaved],
  );

  const initialValues = invoiceLineItem
    ? {
        ...invoiceLineItem,
        price: invoiceLineItem.invoiceLineType.price,
        percentageChange:
          invoiceLineItem.percentageChange && invoiceLineItem.percentageChange * 100,
      }
    : {
        dateGenerated: getCurrentDateTimeString(),
      };

  return (
    <FormModal width="md" title={title} open={open} onClose={onClose}>
      <Form
        onSubmit={createOrUpdateLineItem}
        render={({ submitForm }) => (
          <FormGrid>
            <Field
              name="dateGenerated"
              label={<TranslatedText stringId="general.date.label" fallback="Date" />}
              required
              component={DateField}
              saveDateAsString
            />
            <Field
              name="invoiceLineTypeId"
              label={
                <TranslatedText
                  stringId="invoice.modal.addInvoice.details.label"
                  fallback="Details"
                />
              }
              required
              component={AutocompleteField}
              suggester={invoiceLineTypeSuggester}
            />
            <Field
              name="orderedById"
              label={
                <TranslatedText
                  stringId="invoice.modal.addInvoice.orderedBy.label"
                  fallback="Ordered by"
                />
              }
              required
              component={AutocompleteField}
              suggester={practitionerSuggester}
            />
            <Field
              name="price"
              label={
                <TranslatedText
                  stringId="invoice.modal.addInvoice.price.label"
                  fallback="Price ($)"
                />
              }
              required
              disabled
              component={NumberField}
            />
            <Field
              name="percentageChange"
              label={
                <TranslatedText
                  stringId="invoice.modal.addInvoice.percentageChange.label"
                  fallback="Discount/markup % (-/+)"
                />
              }
              component={NumberField}
            />
            <FormSubmitCancelRow
              confirmText={actionText}
              onConfirm={submitForm}
              onCancel={onClose}
            />
          </FormGrid>
        )}
        initialValues={initialValues}
        formType={invoiceLineItem ? FORM_TYPES.EDIT_FORM : FORM_TYPES.CREATE_FORM}
        validationSchema={yup.object().shape({
          invoiceLineTypeId: foreignKey().translatedLabel(
            <TranslatedText stringId="invoice.modal.addInvoice.details.label" fallback="Details" />,
          ),
          orderedById: foreignKey().translatedLabel(
            <TranslatedText
              stringId="invoice.modal.addInvoice.orderedBy.label"
              fallback="Ordered by"
            />,
          ),
          dateGenerated: yup
            .date()
            .required()
            .translatedLabel(<TranslatedText stringId="general.date.label" fallback="Date" />),
          percentageChange: yup
            .number()
            .translatedLabel(
              <TranslatedText
                stringId="invoice.modal.addInvoice.validation.percentageChange.path"
                fallback="Percentage change"
              />,
            ),
        })}
      />
    </FormModal>
  );
};
