import React, { ReactElement } from 'react';
import { Root } from 'popup-ui';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { PersistGate } from 'redux-persist/integration/react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { persistor, store } from '../../store/index';
import { AuthProvider } from '../../contexts/AuthContext';
import { FacilityProvider } from '../../contexts/FacilityContext';
import { LocalisationProvider } from '../../contexts/LocalisationContext';
import { TranslationProvider } from '../../contexts/TranslationContext';
import { Core } from './Core';
import { DetectIdleLayer } from './DetectIdleLayer';

export const RootStack = (): ReactElement => {
  const navigationRef = React.useRef<NavigationContainerRef>(null);
  return (
    <SafeAreaProvider>
      <Root>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <NavigationContainer ref={navigationRef}>
              <LocalisationProvider>
                <TranslationProvider>
                  <AuthProvider navRef={navigationRef}>
                    <FacilityProvider>
                      <DetectIdleLayer>
                        <Core />
                      </DetectIdleLayer>
                    </FacilityProvider>
                  </AuthProvider>
                </TranslationProvider>
              </LocalisationProvider>
            </NavigationContainer>
          </PersistGate>
        </Provider>
      </Root>
    </SafeAreaProvider>
  );
};
