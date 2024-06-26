import React, { ReactElement } from 'react';
import { theme } from '/styled/theme';
import { RowView, StyledSafeAreaView, StyledText, StyledTouchableOpacity } from '/styled/common';
import { ArrowLeftIcon } from '/components/Icons';
import { Orientation, screenPercentageToDP } from '/helpers/screen';
import { TranslatedText } from '~/ui/components/Translations/TranslatedText';

type HeaderProps = {
  onGoBack: () => void;
};

export const Header = ({ onGoBack }: HeaderProps): ReactElement => (
  <StyledSafeAreaView background={theme.colors.PRIMARY_MAIN}>
    <RowView height={70}>
      <StyledTouchableOpacity
        onPress={onGoBack}
        padding={screenPercentageToDP(2.46, Orientation.Height)}
      >
        <ArrowLeftIcon
          height={screenPercentageToDP(2.43, Orientation.Height)}
          width={screenPercentageToDP(2.43, Orientation.Height)}
          fill="white"
        />
      </StyledTouchableOpacity>
      <RowView
        position="absolute"
        alignItems="center"
        justifyContent="center"
        width="100%"
        zIndex={-1}
        height={50}
      >
        <StyledText color={theme.colors.WHITE} fontSize={16}>
          <TranslatedText stringId="patient.register.title" fallback="Register New Patient" />
        </StyledText>
      </RowView>
    </RowView>
  </StyledSafeAreaView>
);
