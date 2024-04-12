import React from 'react';
import { useSelector } from 'react-redux';
import { ReduxStoreProps } from '/interfaces/ReduxStoreProps';
import { PatientStateProps } from '/store/ducks/patient';
import { useBackend, useBackendEffect } from '~/ui/hooks';
import { ErrorScreen } from '/components/ErrorScreen';
import { FullView, StyledText } from '~/ui/styled/common';
import { theme } from '/styled/theme';
import { LoadingScreen } from '/components/LoadingScreen';
import { authUserSelector } from '/helpers/selectors';
import { SurveyTypes } from '~/types';
import { getCurrentDateTimeString } from '/helpers/date';
import { SurveyForm } from '/components/Forms/SurveyForm';
import { VitalsDataElements } from '/helpers/constants';
import { useCurrentScreen } from '~/ui/hooks/useCurrentScreen';

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
  const { currentScreenIndex, setCurrentScreenIndex } = useCurrentScreen();

  const { selectedPatient } = useSelector(
    (state: ReduxStoreProps): PatientStateProps => state.patient,
  );
  const [vitalsSurvey, vitalsError, isVitalsLoading] = useBackendEffect(({ models: m }) =>
    m.Survey.getVitalsSurvey({ includeAllVitals: false }),
  );
  const [patientAdditionalData, padError, isPadLoading] = useBackendEffect(
    ({ models: m }) =>
      m.PatientAdditionalData.getRepository().findOne({
        patient: selectedPatient.id,
      }),
    [selectedPatient.id],
  );

  const error = vitalsError || padError;
  const isLoading = isVitalsLoading || isPadLoading;
  if (error) {
    return <ErrorScreen error={error} />;
  }
  if (isLoading) {
    return <LoadingScreen />;
  }
  if (!vitalsSurvey) {
    return (
      <FullView>
        <StyledText fontWeight="bold">Error:</StyledText>
        <StyledText paddingLeft="12px" color={theme.colors.ALERT}>
          Vitals survey could not be found
        </StyledText>
      </FullView>
    );
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
        encounterReason: `Form response for ${name}`,
      },
      { ...values, [dateComponent.dataElement.code]: getCurrentDateTimeString() },
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
      patientAdditionalData={patientAdditionalData}
      components={visibleComponents}
      onSubmit={onSubmit}
      validate={validate}
      setCurrentScreenIndex={setCurrentScreenIndex}
      currentScreenIndex={currentScreenIndex}
    />
  );
};
