import React from 'react';
import * as yup from 'yup';

import { PATIENT_ISSUE_TYPES } from 'shared/constants';
import { Form, Field, DateField, SelectField, TextField } from '../components/Field';
import { FormGrid } from '../components/FormGrid';
import { ConfirmCancelRow } from '../components/ButtonRow';

const ISSUE_TYPES = [
  { value: PATIENT_ISSUE_TYPES.ISSUE, label: 'Issue' },
  { value: PATIENT_ISSUE_TYPES.WARNING, label: 'Warning' },
];

export const PatientIssueForm = ({ onSubmit, editedObject, onCancel }) => (
  <Form
    onSubmit={onSubmit}
    render={({ submitForm }) => (
      <FormGrid columns={1}>
        <Field name="type" label="Type" component={SelectField} options={ISSUE_TYPES} />
        <Field name="note" label="Notes" component={TextField} multiline rows={2} />
        <Field name="date" label="Date recorded" component={DateField} required />
        <ConfirmCancelRow onCancel={onCancel} onConfirm={submitForm} />
      </FormGrid>
    )}
    initialValues={{
      date: new Date(),
      type: 'issue',
      ...editedObject,
    }}
    validationSchema={yup.object().shape({
      note: yup.string().required(),
      date: yup.date().required(),
    })}
  />
);
