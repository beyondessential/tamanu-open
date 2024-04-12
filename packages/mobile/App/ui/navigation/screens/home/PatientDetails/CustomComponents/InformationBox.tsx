import React, { ReactElement } from 'react';
import { StyledText, StyledView, StyledViewProps } from '/styled/common';
import { Orientation, screenPercentageToDP } from '/helpers/screen';
import { theme } from '/styled/theme';

interface InformationBoxProps extends StyledViewProps {
  title: string;
  info: string;
}
export const InformationBox = ({
  title,
  info,
  ...props
}: InformationBoxProps): ReactElement => (
  <StyledView {...props}>
    <StyledText
      fontSize={screenPercentageToDP(1.7, Orientation.Height)}
      fontWeight={500}
      color={theme.colors.TEXT_DARK}
    >
      {title}
    </StyledText>
    <StyledText
      marginTop={5}
      fontSize={screenPercentageToDP(1.94, Orientation.Height)}
      color={theme.colors.TEXT_MID}
    >
      {info}
    </StyledText>
  </StyledView>
);
