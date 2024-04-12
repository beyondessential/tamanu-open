import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { push } from 'connected-react-router';
import { Launch } from '@material-ui/icons';
import { Colors, LOCAL_STORAGE_KEYS } from '../constants';
import { LogoDark } from '../components';
import { splashImages } from '../constants/images';
import { LoginForm } from '../forms/LoginForm';
import { ResetPasswordForm } from '../forms/ResetPasswordForm';
import { ChangePasswordForm } from '../forms/ChangePasswordForm';
import {
  changePassword,
  clearPatient,
  login,
  requestPasswordReset,
  restartPasswordResetFlow,
  validateResetCode,
} from '../store';
import { useApi } from '../api';
import { SyncHealthNotificationComponent } from '../components/SyncHealthNotification';
import { Typography } from '@material-ui/core';
import { getBrandId } from '../utils';

import { TranslatedText } from '../components/Translation/TranslatedText';
const { REMEMBER_EMAIL } = LOCAL_STORAGE_KEYS;

const Container = styled.div`
  display: flex;
  height: 100vh;
  justify-content: flex-start;
  align-items: center;
`;

const LoginSplashImage = styled.div`
  max-width: 50vw;
  width: 50vw;
  height: inherit;
  background-image: url(${props => splashImages[props.brandId]});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center right;
`;

const LoginContainer = styled.div`
  position: relative;
  padding: 30px 0 70px 0;
  width: 50vw;
  min-width: 500px;
  height: inherit;
  border-radius: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${Colors.white};
`;

const LogoContainer = styled.div`
  text-align: center;
  position: fixed;
  top: 25px;
  left: 25px;
  :hover {
    cursor: pointer;
  }
`;

const SupportDesktopLink = styled.a`
  position: absolute;
  bottom: 25px;
  left: 25px;
  margin-top: 4px;
  font-weight: 400;
  font-size: 9px;
  line-height: 15px;
  text-decoration: underline;
  color: ${Colors.darkestText};
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    font-weight: bold;
  }
`;

const LoginFormContainer = styled.div`
  max-width: 400px;
  width: 100%;
  padding-top: 40px;
`;

const DesktopVersionText = styled(Typography)`
  font-size: 9px;
  color: ${Colors.midText};
  position: absolute;
  bottom: 15px;
  right: 20px;
`;

export const LoginView = () => {
  const api = useApi();
  const dispatch = useDispatch();
  const loginError = useSelector(state => state.auth.error);
  const requestPasswordResetError = useSelector(state => state.auth.resetPassword.error);
  const requestPasswordResetSuccess = useSelector(state => state.auth.resetPassword.success);
  const resetPasswordEmail = useSelector(state => state.auth.resetPassword.lastEmailUsed);
  const changePasswordError = useSelector(state => state.auth.changePassword.error);
  const changePasswordSuccess = useSelector(state => state.auth.changePassword.success);
  const { agentVersion } = api;

  const rememberEmail = localStorage.getItem(REMEMBER_EMAIL);

  const [screen, setScreen] = useState('login');

  // TODO: This is a temp fix to get the support desk URL into the app. It will be updated in the settings project
  // const supportUrl = getLocalisation('supportDeskUrl');
  const supportUrl = 'https://bes-support.zendesk.com/hc/en-us';
  const isSupportUrlLoaded = !!supportUrl;

  const submitLogin = async data => {
    const { email, password, rememberMe } = data;

    // If a different user logs in, reset patient state and navigate to index
    if (email !== api.user?.email) {
      dispatch(clearPatient());
      dispatch(push('/'));
    }

    if (rememberMe) {
      localStorage.setItem(REMEMBER_EMAIL, email);
    } else {
      localStorage.removeItem(REMEMBER_EMAIL);
    }

    await dispatch(login(email, password));
    dispatch(restartPasswordResetFlow());
  };

  const brandId = getBrandId();

  return (
    <Container>
      <LoginContainer>
        <SyncHealthNotificationComponent />
        <LogoContainer
          onClick={() => {
            window.location.reload();
            dispatch(restartPasswordResetFlow());
          }}
        >
          <LogoDark size="140px" />
        </LogoContainer>
        <LoginFormContainer>
          {screen === 'login' && (
            <LoginForm
              onSubmit={submitLogin}
              errorMessage={loginError}
              rememberEmail={rememberEmail}
              onNavToResetPassword={() => {
                setScreen('resetPassword');
                dispatch(restartPasswordResetFlow());
              }}
            />
          )}
          {screen === 'resetPassword' && (
            <>
              <ResetPasswordForm
                onSubmit={({ email }) => dispatch(requestPasswordReset(email))}
                onRestartFlow={() => dispatch(restartPasswordResetFlow())}
                errorMessage={requestPasswordResetError}
                success={requestPasswordResetSuccess}
                initialEmail={rememberEmail}
                resetPasswordEmail={resetPasswordEmail}
                onNavToChangePassword={() => setScreen('changePassword')}
                onNavToLogin={() => setScreen('login')}
              />
            </>
          )}
          {screen === 'changePassword' && (
            <ChangePasswordForm
              onSubmit={data => dispatch(changePassword(data))}
              onRestartFlow={() => dispatch(restartPasswordResetFlow())}
              errorMessage={changePasswordError}
              success={changePasswordSuccess}
              email={resetPasswordEmail}
              onNavToLogin={() => {
                setScreen('login');
              }}
              onNavToResetPassword={() => setScreen('resetPassword')}
              onValidateResetCode={data => dispatch(validateResetCode(data))}
            />
          )}
        </LoginFormContainer>
        {isSupportUrlLoaded && (
          <SupportDesktopLink href={supportUrl} target="_blank" rel="noreferrer">
            <TranslatedText stringId="externalLink.supportCentre" fallback="Support centre" />
            <Launch style={{ marginLeft: '3px', fontSize: '12px' }} />
          </SupportDesktopLink>
        )}
        <DesktopVersionText>
          <TranslatedText stringId="login.version" fallback="Version" /> {agentVersion}
        </DesktopVersionText>
      </LoginContainer>
      <LoginSplashImage brandId={brandId} />
    </Container>
  );
};
