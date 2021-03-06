import React from 'react';
import PropTypes from 'prop-types';
import * as yup from 'yup';

import styled from 'styled-components';

import { AVPU_OPTIONS } from 'shared/constants';
import { Form, Field, DateField, NumberField, SelectField } from '../components/Field';
import { FormGrid } from '../components/FormGrid';
import { ConfirmCancelRow } from '../components/ButtonRow';


const BloodPressureFieldsContainer = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  grid-gap: 0.5rem;
`;

export class VitalsForm extends React.PureComponent {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
  };

  renderForm = ({ submitForm }) => {
    const { onCancel } = this.props;
    return (
      <FormGrid columns={2}>
        <Field name="dateRecorded" label="Date recorded" component={DateField} />
        <div />
        <Field name="height" label="Height (cm)" component={NumberField} />
        <Field name="weight" label="Weight (kg)" component={NumberField} />
        <BloodPressureFieldsContainer>
          <Field name="sbp" label="SBP" component={NumberField} />
          <Field name="dbp" label="DBP" component={NumberField} />
        </BloodPressureFieldsContainer>
        <Field name="heartRate" label="Heart rate" component={NumberField} />
        <Field name="respiratoryRate" label="Respiratory rate" component={NumberField} />
        <Field name="temperature" label="Temperature (ºC)" component={NumberField} />
        <Field name="svo2" label="SvO2 (%)" component={NumberField} />
        <Field name="avpu" label="AVPU" component={SelectField} options={AVPU_OPTIONS} />
        <ConfirmCancelRow confirmText="Record" onConfirm={submitForm} onCancel={onCancel} />
      </FormGrid>
    );
  };

  render() {
    const { onSubmit, editedObject } = this.props;
    return (
      <Form
        onSubmit={onSubmit}
        render={this.renderForm}
        initialValues={{
          dateRecorded: new Date(),
          ...editedObject,
        }}
        validationSchema={yup.object().shape({
          dateRecorded: yup.date().required(),
          height: yup.number(),
          weight: yup.number(),
          sbp: yup.number(),
          dbp: yup.number(),
          heartRate: yup.number(),
          respiratoryRate: yup.number(),
          temperature: yup.number(),
          svo2: yup.number(),
          avpu: yup.string(),
        })}
        validate={values => {
          const errors = {};

          if (!Object.values(values).some(x => x && typeof x === 'number')) {
            errors.form = 'At least one recording must be entered.';
          }

          return errors;
        }}
      />
    );
  }
}
