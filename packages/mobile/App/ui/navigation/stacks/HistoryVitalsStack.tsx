import React, { ReactElement, useCallback } from 'react';
import { NavigationProp } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Routes } from '/helpers/routes';
import {
  FullView,
} from '/styled/common';
import { compose } from 'redux';
import { HistoryVitalsTabs } from './HistoryVitalsTabs';
import { ErrorBoundary } from '/components/ErrorBoundary';
import { BaseAppProps } from '/interfaces/BaseAppProps';
import { withPatient } from '~/ui/containers/Patient';
import { StackHeader } from '~/ui/components/StackHeader';
import { joinNames } from '~/ui/helpers/user';

const Stack = createStackNavigator();

interface HistoryVitalsStackProps extends BaseAppProps{
  navigation: NavigationProp<any>;
}

const TabNavigator = ({
  navigation,
  selectedPatient,
}: HistoryVitalsStackProps): ReactElement => {
  const goBack = useCallback(() => {
    navigation.goBack();
  }, []);

  const navigateToPatientActions = useCallback(() => {
    navigation.navigate(Routes.HomeStack.PatientActions);
  }, []);
  return (
    <ErrorBoundary>
      <FullView>
        <StackHeader
          title="History"
          subtitle={joinNames(selectedPatient)}
          onGoBack={goBack}
          onRightSideIconTap={navigateToPatientActions}
        />
        <Stack.Navigator headerMode="none">
          <Stack.Screen
            name={Routes.HomeStack.HistoryVitalsStack.Index}
            component={HistoryVitalsTabs}
          />
        </Stack.Navigator>
      </FullView>
    </ErrorBoundary>
  );
};

export const HistoryVitalsStack = compose(withPatient)(TabNavigator);
