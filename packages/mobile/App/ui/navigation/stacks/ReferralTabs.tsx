import React, { ReactElement, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Routes } from '/helpers/routes';
import { StackHeader } from '/components/StackHeader';
import { createTopTabNavigator } from '/components/TopTabNavigator';
import { BaseAppProps } from '/interfaces/BaseAppProps';
import { joinNames } from '/helpers/user';
import { ReferralFormStack } from './ReferralFormStack';
import { ErrorBoundary } from '~/ui/components/ErrorBoundary';
import { ReduxStoreProps } from '~/ui/interfaces/ReduxStoreProps';
import { PatientStateProps } from '~/ui/store/ducks/patient';
import { ReferralHistoryScreen } from '~/ui/navigation/screens/referrals/ReferralHistoryScreen';

const Tabs = createTopTabNavigator();

export const ReferralTabs = ({ navigation }: BaseAppProps): ReactElement => {
  const { selectedPatient } = useSelector(
    (state: ReduxStoreProps): PatientStateProps => state.patient,
  );
  const goBack = useCallback(() => {
    navigation.goBack();
  }, []);

  return (
    <ErrorBoundary>
      <StackHeader
        title="Referrals"
        subtitle={joinNames(selectedPatient)}
        onGoBack={goBack}
      />
      <Tabs.Navigator swipeEnabled={false}>
        <Tabs.Screen
          initialParams={{
            selectedPatient,
          }}
          options={{
            title: 'REFER PATIENT',
          }}
          name={Routes.HomeStack.ReferralStack.ReferralList.Index}
          component={ReferralFormStack}
        />
        <Tabs.Screen
          options={{
            title: 'VIEW REFERRALS',
          }}
          name={Routes.HomeStack.ReferralStack.ViewHistory.Index}
          component={ReferralHistoryScreen}
        />
      </Tabs.Navigator>
    </ErrorBoundary>
  );
};
