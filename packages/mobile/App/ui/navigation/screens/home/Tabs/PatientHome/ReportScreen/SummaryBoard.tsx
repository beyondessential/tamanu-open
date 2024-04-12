import React, { FC } from 'react';
import { Orientation, screenPercentageToDP } from '../../../../../../helpers/screen';
import { FullView, RowView, StyledText } from '../../../../../../styled/common';
import { theme } from '../../../../../../styled/theme';
import { TranslatedText } from '~/ui/components/Translations/TranslatedText';

export type SummaryInfo = {
  encounterDate: string;
  totalEncounters: number;
  totalSurveys: number;
};

type Props = {
  todayData: SummaryInfo;
};
export const SummaryBoard: FC<Props> = ({ todayData }) => (
  <RowView
    width={screenPercentageToDP(90.02, Orientation.Width)}
    background={theme.colors.WHITE}
    height={screenPercentageToDP(13.36, Orientation.Height)}
    alignSelf="center"
  >
    <FullView justifyContent="center" alignItems="center">
      <StyledText
        color={theme.colors.TEXT_DARK}
        fontSize={screenPercentageToDP(3.4, Orientation.Height)}
        fontWeight="bold"
      >
        {todayData?.totalEncounters || '0'}
      </StyledText>
      <StyledText
        color={theme.colors.TEXT_MID}
        fontSize={screenPercentageToDP(1.7, Orientation.Height)}
      >
        <TranslatedText
          stringId="report.summary.poepleAttended.text"
          fallback="People attended today"
        />
      </StyledText>
    </FullView>
    <FullView justifyContent="center" alignItems="center">
      <StyledText
        color={theme.colors.TEXT_DARK}
        fontSize={screenPercentageToDP(3.4, Orientation.Height)}
        fontWeight="bold"
      >
        {todayData?.totalSurveys || 0}
      </StyledText>
      <StyledText
        color={theme.colors.TEXT_MID}
        fontSize={screenPercentageToDP(1.7, Orientation.Height)}
      >
        <TranslatedText
          stringId="report.summary.screeningsCompleted.text"
          fallback="Screenings completed today"
        />
      </StyledText>
    </FullView>
  </RowView>
);
