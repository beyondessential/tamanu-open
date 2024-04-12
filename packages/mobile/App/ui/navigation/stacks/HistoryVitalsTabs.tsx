import React, { ReactElement } from 'react';
import { Routes } from '/helpers/routes';
import { createTopTabNavigator } from '/components/TopTabNavigator';
import { VisitsScreen } from '../screens/historyvitals/tabs/VisitsScreen';
import { VaccinesScreen } from '../screens/historyvitals/tabs/VaccinesScreen';
import { TranslatedText } from '~/ui/components/Translations/TranslatedText';

const Tabs = createTopTabNavigator();

export const HistoryVitalsTabs = (): ReactElement => (
  <Tabs.Navigator swipeEnabled={false}>
    <Tabs.Screen
      options={{
        title: () => (
          <TranslatedText stringId="patient.history.visits.title" fallback="VISITS" uppercase />
        ),
      }}
      name={Routes.HomeStack.HistoryVitalsStack.HistoryVitalsTabs.Visits}
      component={VisitsScreen}
    />
    <Tabs.Screen
      options={{
        title: () => (
          <TranslatedText stringId="patient.history.vaccines.title" fallback="VACCINES" uppercase />
        ),
      }}
      name={Routes.HomeStack.HistoryVitalsStack.HistoryVitalsTabs.Vaccines}
      component={VaccinesScreen}
    />
  </Tabs.Navigator>
);
