import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { ReduxStoreProps } from '/interfaces/ReduxStoreProps';
import { PatientStateProps } from '/store/ducks/patient';
import { useBackend, useBackendEffect } from '~/ui/hooks';
import { ErrorScreen } from '/components/ErrorScreen';
import { LoadingScreen } from '/components/LoadingScreen';
import { authUserSelector } from '/helpers/selectors';
import { SurveyTypes } from '~/types';
import { getCurrentDateTimeString } from '/helpers/date';
import { SurveyForm } from '/components/Forms/SurveyForm';
import { VitalsDataElements } from '/helpers/constants';

const validate = (values: object): object => {
  const errors: { form?: string } = {};

  if (Object.values(values).every(x => x === '' || x === null)) {
    errors.form = 'At least one recording must be entered.';
  }
  return errors;
};

interface VitalsFormProps {
  onAfterSubmit: () => void;
}

export const VitalsForm: React.FC<VitalsFormProps> = ({ onAfterSubmit }) => {
  const { models } = useBackend();
  const user = useSelector(authUserSelector);
  const [note, setNote] = useState('');

  const { selectedPatient } = useSelector(
    (state: ReduxStoreProps): PatientStateProps => state.patient,
  );
  const [vitalsSurvey, error] = useBackendEffect(({ models: m }) => m.Survey.getVitalsSurvey());

  if (error) {
    return <ErrorScreen error={error} />;
  }

  if (!vitalsSurvey) {
    return <LoadingScreen />;
  }

  const { id, name, components, dateComponent } = vitalsSurvey;

  const onSubmit = async (values: any): Promise<void> => {
    const responseRecord = await models.SurveyResponse.submit(
      selectedPatient.id,
      user.id,
      {
        surveyId: id,
        components,
        surveyType: SurveyTypes.Vitals,
        encounterReason: `Survey response for ${name}`,
      },
      { ...values, [dateComponent.dataElement.code]: getCurrentDateTimeString() },
      setNote,
    );

    if (responseRecord) {
      onAfterSubmit();
    }
  };

  // On mobile, date is programmatically submitted
  const visibleComponents = components.filter(
    c => c.dataElementId !== VitalsDataElements.dateRecorded,
  );

  return (
    <SurveyForm
      patient={selectedPatient}
      note={note}
      components={visibleComponents}
      onSubmit={onSubmit}
      validate={validate}
    />
  );
};
