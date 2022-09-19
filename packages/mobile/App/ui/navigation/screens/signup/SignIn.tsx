import React, { FunctionComponent, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { Platform, KeyboardAvoidingView, StatusBar, Linking } from 'react-native';
import {
  StyledView,
  StyledSafeAreaView,
  FullView,
  RowView,
  StyledTouchableOpacity,
  StyledText,
} from '/styled/common';
import { CrossIcon, UserIcon } from '/components/Icons';
import { Orientation, screenPercentageToDP } from '/helpers/screen';
import { theme } from '/styled/theme';
import { SignInForm } from '/components/Forms/SignInForm';
import { SignInProps } from '/interfaces/Screens/SignUp/SignInProps';
import { Routes } from '/helpers/routes';
import { ModalInfo } from '/components/ModalInfo';
import { authSelector } from '/helpers/selectors';
import { OutdatedVersionError } from '~/services/error';
import { useFacility } from '~/ui/contexts/FacilityContext';

interface ModalContent {
  message: string;
  buttonPrompt?: string;
  buttonUrl?: string;
}

export const SignIn: FunctionComponent<any> = ({ navigation }: SignInProps) => {
  const authState = useSelector(authSelector);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState<ModalContent>({ message: '' });

  const onNavigateToForgotPassword = useCallback(() => {
    console.log('onNavigateToForgotPassword...');
    navigation.navigate(Routes.SignUpStack.ResetPassword);
  }, []);

  const onChangeModalVisibility = useCallback((isVisible: boolean) => {
    setModalVisible(isVisible);
  }, []);

  const showErrorModal = useCallback((content: ModalContent) => {
    setModalContent(content);
    onChangeModalVisibility(true);
  }, []);

  const onFollowPrompt = useCallback(() => {
    Linking.openURL(modalContent.buttonUrl);
  }, [modalContent.buttonUrl]);

  const { facilityId } = useFacility();

  return (
    <FullView background={theme.colors.PRIMARY_MAIN}>
      <StatusBar barStyle="light-content" />
      <ModalInfo
        onVisibilityChange={onChangeModalVisibility}
        message={modalContent.message}
        buttonPrompt={modalContent.buttonPrompt}
        onFollowPrompt={onFollowPrompt}
        isVisible={modalVisible}
      />
      <StyledSafeAreaView>
        <KeyboardAvoidingView behavior="position">
          <RowView
            width="100%"
            justifyContent="flex-end"
            position="absolute"
            top={Platform.OS === 'ios' ? 30 : 0}
          >
            <StyledTouchableOpacity
              onPress={(): void => navigation.navigate(Routes.SignUpStack.Intro)}
              padding={screenPercentageToDP(2.43, Orientation.Height)}
            >
              <CrossIcon
                height={screenPercentageToDP(2.43, Orientation.Height)}
                width={screenPercentageToDP(2.43, Orientation.Height)}
              />
            </StyledTouchableOpacity>
          </RowView>
          <StyledView
            width="100%"
            alignItems="center"
            marginTop={screenPercentageToDP(7.29, Orientation.Height)}
            marginBottom={screenPercentageToDP(14.7, Orientation.Height)}
          >
            <UserIcon
              height={screenPercentageToDP(7.29, Orientation.Height)}
              width={screenPercentageToDP(7.29, Orientation.Height)}
              fill={theme.colors.SECONDARY_MAIN}
            />
            <StyledText
              marginTop={screenPercentageToDP('2.43', Orientation.Height)}
              fontSize={screenPercentageToDP('2.55', Orientation.Height)}
              color={theme.colors.WHITE}
              fontWeight="bold"
            >
              Sign in
            </StyledText>
          </StyledView>
          <SignInForm
            onError={(error: Error): void => {
              if (error instanceof OutdatedVersionError) {
                showErrorModal({
                  message: error.message,
                  buttonPrompt: 'Update',
                  buttonUrl: error.updateUrl,
                });
              } else {
                showErrorModal({ message: error.message });
              }
            }}
            onSuccess={(): void => {
              if (!facilityId) {
                navigation.navigate(Routes.SignUpStack.SelectFacility);
              } else if (authState.isFirstTime) {
                navigation.navigate(Routes.HomeStack.Index);
              } else {
                navigation.navigate(Routes.HomeStack.Index, {
                  screen: Routes.HomeStack.HomeTabs.Index,
                });
              }
            }}
          />
          <StyledTouchableOpacity onPress={onNavigateToForgotPassword}>
            <StyledText
              width="100%"
              textAlign="center"
              marginTop={screenPercentageToDP('2.43', Orientation.Height)}
              marginBottom={screenPercentageToDP('4.86', Orientation.Height)}
              fontSize={screenPercentageToDP('1.57', Orientation.Height)}
              color={theme.colors.SECONDARY_MAIN}
            >
              Forgot your password?
            </StyledText>
          </StyledTouchableOpacity>
        </KeyboardAvoidingView>
      </StyledSafeAreaView>
    </FullView>
  );
};
