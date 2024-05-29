import React from 'react';
import PropTypes from 'prop-types';
import * as yup from 'yup';
import { getCurrentDateTimeString } from '@tamanu/shared/utils/dateTime';

import { AutocompleteField, DateField, Field, Form, TextField, SuggesterSelectField } from '../components/Field';
import { FormGrid } from '../components/FormGrid';
import { FormSubmitCancelRow } from '../components/ButtonRow';
import { foreignKey } from '../utils/validation';
import { FORM_TYPES } from '../constants';
import { TranslatedText } from '../components/Translation/TranslatedText';
import { useTranslation } from '../contexts/Translation';

export const AllergyForm = ({
  onSubmit,
  editedObject,
  onCancel,
  practitionerSuggester,
  allergySuggester,
}) => {
  const { getTranslation } = useTranslation();
  return (
    <Form
      onSubmit={onSubmit}
      render={({ submitForm }) => (
        <FormGrid columns={1}>
          <Field
            name="allergyId"
            label={
              <TranslatedText stringId="allergies.allergyName.label" fallback="Allergy name" />
            }
            component={AutocompleteField}
            suggester={allergySuggester}
            required
          />
          <Field
            name="reactionId"
            label={<TranslatedText stringId="general.reaction.label" fallback="Reaction" />}
            component={SuggesterSelectField}
            endpoint="reaction"
          />
          <Field
            name="recordedDate"
            label={
              <TranslatedText stringId="general.recordedDate.label" fallback="Date recorded" />
            }
            component={DateField}
            saveDateAsString
            required
          />
          <Field
            name="practitionerId"
            label={
              <TranslatedText
                stringId="general.localisedField.clinician.label.short"
                fallback="Clinician"
              />
            }
            component={AutocompleteField}
            suggester={practitionerSuggester}
          />
          <Field
            name="note"
            label={<TranslatedText stringId="general.notes.label" fallback="Notes" />}
            component={TextField}
          />
          <FormSubmitCancelRow
            onCancel={onCancel}
            onConfirm={submitForm}
            confirmText={
              editedObject ? (
                <TranslatedText stringId="general.action.save" fallback="Save" />
              ) : (
                <TranslatedText stringId="general.action.add" fallback="Add" />
              )
            }
          />
        </FormGrid>
      )}
      initialValues={{
        recordedDate: getCurrentDateTimeString(),
        ...editedObject,
      }}
      formType={editedObject ? FORM_TYPES.EDIT_FORM : FORM_TYPES.CREATE_FORM}
      validationSchema={yup.object().shape({
        allergyId: foreignKey(
          getTranslation('validation.rule.mustSelectAllergy', 'An allergy must be selected'),
        ),
        recordedDate: yup
          .date()
          .required()
          .translatedLabel(
            <TranslatedText stringId="general.recordedDate.label" fallback="Date recorded" />,
          ),
      })}
    />
  );
};

AllergyForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  editedObject: PropTypes.shape({}),
};

AllergyForm.defaultProps = {
  editedObject: null,
};
