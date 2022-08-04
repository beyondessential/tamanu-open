import React from 'react';
import { theme } from '/styled/theme';
import * as Icons from '../Icons';
import {
  StyledView,
  RowView,
  StyledTouchableOpacity,
  StyledText,
} from '/styled/common';
import { Orientation, screenPercentageToDP } from '/helpers/screen';

export interface CardHeaderProps {
  name: string;
  code: string;
  schedule: string;
  onCloseModal: () => void;
  onEditDetails: () => void;
}

export const VaccineCardHeader = ({
  name,
  code,
  schedule,
  onCloseModal,
  onEditDetails,
}: CardHeaderProps): JSX.Element => (
  <StyledView
    background={theme.colors.PRIMARY_MAIN}
    height={screenPercentageToDP('15.79', Orientation.Height)}
  >
    <RowView justifyContent="space-between" alignItems="center">
      <StyledTouchableOpacity
        paddingTop={screenPercentageToDP(2.43, Orientation.Height)}
        paddingLeft={screenPercentageToDP(2.43, Orientation.Height)}
        paddingRight={screenPercentageToDP(2.43, Orientation.Height)}
        paddingBottom={screenPercentageToDP(2.43, Orientation.Height)}
        onPress={onCloseModal}
      >
        <Icons.CrossIcon
          size={screenPercentageToDP(2.18, Orientation.Height)}
        />
      </StyledTouchableOpacity>
      <StyledTouchableOpacity
        onPress={onEditDetails}
        paddingTop={screenPercentageToDP(2.43, Orientation.Height)}
        paddingLeft={screenPercentageToDP(2.43, Orientation.Height)}
        paddingRight={screenPercentageToDP(2.43, Orientation.Height)}
        paddingBottom={screenPercentageToDP(2.43, Orientation.Height)}
      >
        <StyledText
          textDecorationLine="underline"
          color={theme.colors.WHITE}
          fontSize={screenPercentageToDP('1.59', Orientation.Height)}
        >
          Edit Details
        </StyledText>
      </StyledTouchableOpacity>
    </RowView>
    <RowView
      paddingLeft={screenPercentageToDP(2.43, Orientation.Height)}
      paddingRight={screenPercentageToDP(2.43, Orientation.Height)}
      justifyContent="space-between"
      alignItems="center"
    >
      <StyledView>
        <StyledText
          fontWeight="bold"
          color={theme.colors.WHITE}
          fontSize={screenPercentageToDP(2.55, Orientation.Height)}
        >
          {name}
        </StyledText>
        <StyledText
          color={theme.colors.SECONDARY_MAIN}
          fontSize={screenPercentageToDP(1.944, Orientation.Height)}
        >
          {code}
        </StyledText>
      </StyledView>
      <StyledText
        fontWeight={500}
        color={theme.colors.WHITE}
        fontSize={screenPercentageToDP(1.822, Orientation.Height)}
      >
        {schedule}
      </StyledText>
    </RowView>
  </StyledView>
);
