import React, { ReactElement } from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
// helpers
import { Routes } from '/helpers/routes';
// Screens
import { IntroScreen } from '../screens/signup/Intro';
import { RegisterAccountStep1Container } from '../screens/signup/RegisterAccountScreenStep1';
import { RegisterAccountStep2Container } from '../screens/signup/RegisterAccountScreenStep2';
import { RegisterAccountStep3Container } from '../screens/signup/RegisterAccountScreenStep3';
import { SignIn } from '../screens/signup/SignIn';
/*
import { ResetPassword } from '../screens/signup/ResetPassword';
import { ChangePassword } from '../screens/signup/ChangePassword';
*/
// Contexts
import { RegisterAccountProvider } from '../../contexts/RegisterAccountContext';

const Stack = createStackNavigator();

const TransitionStyle = TransitionPresets.SlideFromRightIOS;

export const SignUpStack = (): ReactElement => (
  <RegisterAccountProvider>
    <Stack.Navigator headerMode="none">
      <Stack.Screen
        name={Routes.SignUpStack.Intro}
        component={IntroScreen}
        options={TransitionStyle}
      />
      <Stack.Screen
        name={Routes.SignUpStack.RegisterAccountStep1}
        component={RegisterAccountStep1Container}
      />
      <Stack.Screen
        name={Routes.SignUpStack.RegisterAccountStep2}
        component={RegisterAccountStep2Container}
      />
      <Stack.Screen
        name={Routes.SignUpStack.RegisterAccountStep3}
        component={RegisterAccountStep3Container}
      />
      <Stack.Screen 
        name={Routes.SignUpStack.SignIn} 
        component={SignIn} options={TransitionStyle} 
      />
      {/*
      <Stack.Screen
        name={Routes.SignUpStack.ResetPassword}
        component={ResetPassword}
        options={TransitionStyle}
      />
      <Stack.Screen
        name={Routes.SignUpStack.ChangePassword}
        component={ChangePassword}
        options={TransitionStyle}
      />
      */}
    </Stack.Navigator>
  </RegisterAccountProvider>
);
