import React, { useCallback, useMemo, ReactElement } from 'react';
import { useSelector } from 'react-redux';

//Components
import {
  StyledSafeAreaView,
  StyledText,
  StyledView,
  CenterView,
} from '../../../styled/common';
import { theme } from '../../../styled/theme';
import { AppIntro1Icon, AppIntro2Icon, AppIntro3Icon } from '../../../components/Icons';
import { StepMarker } from '../../../components/StepMarker';
import { Button } from '../../../components/Button';
//helpers
import { authUserSelector } from '../../../helpers/selectors';
import { screenPercentageToDP, Orientation } from '../../../helpers/screen';
import { disableAndroidBackButton } from '../../../helpers/android';
// Props
import { IntroScreenProps } from '../../../interfaces/Screens/HomeStack/IntroProps';

export interface IntroRouteProps {
  message: string;
  title: string;
  nextRoute: string | '';
  step: number;
}

export const Intro = (props: IntroScreenProps): ReactElement => {
  const { navigation, route } = props;
  const { title, message, step, nextRoute } = route.params;
  const user = useSelector(authUserSelector);

  if (step === 1) {
    disableAndroidBackButton();
  }

  const Icon = useMemo(() => {
    switch (step) {
      case 1:
        return AppIntro1Icon;
      case 2:
        return AppIntro2Icon;
      case 3:
        return AppIntro3Icon;
      default:
        return AppIntro1Icon;
    }
  }, []);

  const onPressButton = useCallback(() => {
    navigation.navigate(nextRoute);
  }, []);

  return (
    <StyledSafeAreaView
      flex={1}
      background={theme.colors.PRIMARY_MAIN}
      alignItems="center"
    >
      <StyledText
        marginTop={screenPercentageToDP('10.9', Orientation.Height)}
        fontSize={screenPercentageToDP(2.55, Orientation.Height)}
        fontWeight="bold"
        color={theme.colors.WHITE}
      >
        Welcome, {user.displayName}!
      </StyledText>
      <StyledView marginTop={screenPercentageToDP('7.17', Orientation.Height)}>
        <Icon
          height={screenPercentageToDP(19.68, Orientation.Height)}
          width={screenPercentageToDP(63.74, Orientation.Width)}
        />
      </StyledView>
      <StyledText
        marginTop={screenPercentageToDP('7.29', Orientation.Height)}
        color={theme.colors.WHITE}
        fontWeight="bold"
        fontSize={screenPercentageToDP('2.18', Orientation.Height)}
      >
        {title}
      </StyledText>
      <StyledText
        marginLeft={screenPercentageToDP('12.16', Orientation.Width)}
        marginRight={screenPercentageToDP('12.16', Orientation.Width)}
        textAlign="center"
        marginTop={screenPercentageToDP('1.21', Orientation.Height)}
        color={theme.colors.WHITE}
        fontSize={screenPercentageToDP(1.94, Orientation.Height)}
      >
        {message}
      </StyledText>
      <CenterView marginTop={screenPercentageToDP(3.07, Orientation.Height)}>
        <StepMarker step={step} />
        <Button
          id={`signin-skip-button-${step}`}
          fontWeight={500}
          marginTop={screenPercentageToDP(3, Orientation.Height)}
          width={screenPercentageToDP(43.79, Orientation.Width)}
          outline
          borderColor={theme.colors.WHITE}
          buttonText="Next"
          onPress={onPressButton}
        />
      </CenterView>
    </StyledSafeAreaView>
  );
};
