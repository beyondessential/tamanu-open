import React, { ReactElement, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { theme } from '/styled/theme';
import { formatStringDate } from '/helpers/date';
import { StyledView, StyledText, FullView } from '/styled/common';
import { SurveyResultBadge } from '/components/SurveyResultBadge';
import { ArrowForwardIcon } from '/components/Icons';
import { DateFormats } from '~/ui/helpers/constants';

const SensitiveResponseLabel = (): ReactElement => (
  <StyledText
    color={theme.colors.DISABLED_GREY}
    fontSize={13}
    fontWeight="bold"
  >
    Sensitive - not viewable
  </StyledText>
);

export const SurveyResponseLink = ({
  surveyResponse,
  detailsRouteName,
  backgroundColor = theme.colors.WHITE,
}): ReactElement => {
  const navigation = useNavigation();

  if (!surveyResponse) {
    return null;
  }
  const { survey, endTime = '', resultText } = surveyResponse;
  const { isSensitive } = survey;

  const showResponseDetails = useCallback(
    (): void => {
      if (!isSensitive) {
        navigation.navigate(detailsRouteName, {
          surveyResponseId: surveyResponse.id,
        });
      }
    },
    [isSensitive, navigation, surveyResponse],
  );

  return (
    <TouchableOpacity onPress={showResponseDetails}>
      <StyledView
        height={60}
        justifyContent="space-between"
        flexDirection="column"
        padding={8}
        background={backgroundColor}
      >
        <StyledView
          minHeight={40}
          paddingLeft={16}
          paddingRight={16}
          justifyContent="space-between"
          alignItems="center"
          flexDirection="row"
        >
          <FullView>
            <StyledText
              marginBottom="5"
              fontWeight="bold"
              color={isSensitive ? theme.colors.DISABLED_GREY : theme.colors.TEXT_SUPER_DARK}
            >
              {survey.name}
            </StyledText>
            <StyledView
              justifyContent="space-between"
              alignItems="center"
              flexDirection="row"
            >
              <StyledText
                color={isSensitive ? theme.colors.DISABLED_GREY : theme.colors.TEXT_MID}
                fontSize={13}
                fontWeight="bold"
              >
                {formatStringDate(endTime, DateFormats.DATE_AND_TIME)}
              </StyledText>
              {isSensitive ? <SensitiveResponseLabel /> : null}
            </StyledView>
          </FullView>
          {!isSensitive && resultText ? <SurveyResultBadge resultText={resultText} /> : null}
          {!isSensitive ? <ArrowForwardIcon size={15} fill={theme.colors.TEXT_SOFT} /> : null}
        </StyledView>
      </StyledView>
    </TouchableOpacity>
  );
};
