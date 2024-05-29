import React, { ReactElement } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Routes } from '~/ui/helpers/routes';
import { PatientDetailsScreen } from '~/ui/navigation/screens/home/PatientDetails/Screen';
import { AddPatientIssueScreen } from '~/ui/navigation/screens/home/PatientDetails/AddPatientIssue';
import { EditPatientScreen } from '~/ui/navigation/screens/home/PatientDetails/EditPatient';
import { EditPatientAdditionalDataScreen } from '~/ui/navigation/screens/home/PatientDetails/EditPatientAdditionalData';
import { ErrorBoundary } from '~/ui/components/ErrorBoundary';
import { ReminderContactScreen } from '../screens/home/PatientDetails/ReminderContacts';
import { AddReminderContactScreen } from '../screens/home/PatientDetails/AddReminderContact';
import { ReminderContactQRScreen } from '../screens/home/PatientDetails/ReminderContactQR';
import { ReminderContactProvider } from '~/ui/contexts/ReminderContactContext';

const Stack = createStackNavigator();

export const PatientDetailsStack = (): ReactElement => (
  <ErrorBoundary>
    <ReminderContactProvider>
      <Stack.Navigator headerMode="none">
        <Stack.Screen
          name={Routes.HomeStack.PatientDetailsStack.Index}
          component={PatientDetailsScreen}
        />
        <Stack.Screen
          name={Routes.HomeStack.PatientDetailsStack.AddPatientIssue}
          component={AddPatientIssueScreen}
        />
        <Stack.Screen
          name={Routes.HomeStack.PatientDetailsStack.EditPatient}
          component={EditPatientScreen}
        />
        <Stack.Screen
          name={Routes.HomeStack.PatientDetailsStack.EditPatientAdditionalData}
          component={EditPatientAdditionalDataScreen}
        />
        <Stack.Screen
          name={Routes.HomeStack.PatientDetailsStack.ReminderContacts}
          component={ReminderContactScreen}
        />
        <Stack.Screen
          name={Routes.HomeStack.PatientDetailsStack.AddReminderContact}
          component={AddReminderContactScreen}
        />
        <Stack.Screen
          name={Routes.HomeStack.PatientDetailsStack.ReminderContactQR}
          component={ReminderContactQRScreen}
        />
      </Stack.Navigator>
    </ReminderContactProvider>
  </ErrorBoundary>
);
