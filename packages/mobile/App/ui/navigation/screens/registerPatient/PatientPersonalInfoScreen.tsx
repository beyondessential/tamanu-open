import React, { ReactElement, useCallback } from 'react';
import { StatusBar } from 'react-native';
import { FullView } from '/styled/common';
import { Header } from './CommonComponents/Header';
import { PatientPersonalInfoForm } from '/components/Forms/NewPatientForm/PatientPersonalInfoForm';
import { theme } from '/styled/theme';
import { Routes } from '/helpers/routes';
import { PatientPersonalInfoScreenProps } from '../../../interfaces/screens/RegisterPatientStack/PatientPersonalInfoScreen';
import { PatientSectionHeader } from '~/ui/components/Forms/NewPatientForm/PatientSectionHeader';
import { TranslatedText } from '~/ui/components/Translations/TranslatedText';

export const PatientPersonalInfoScreen = ({
  navigation,
}: PatientPersonalInfoScreenProps): ReactElement => {
  const onGoBack = useCallback(() => {
    navigation.navigate(Routes.HomeStack.HomeTabs.Index);
  }, []);

  return (
    <FullView background={theme.colors.BACKGROUND_GREY}>
      <StatusBar barStyle="light-content" />
      <Header onGoBack={onGoBack} />
      <PatientSectionHeader
        name={
          <TranslatedText
            stringId="patient.register.heading.general"
            fallback="General Information"
          />
        }
      />
      <PatientPersonalInfoForm />
    </FullView>
  );
};
