import React, { ReactElement, ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import { List } from 'react-native-paper';
import { format } from 'date-fns';

import { FieldTypes } from '../../../helpers/fields';
import { Routes } from '../../../helpers/routes';
import { DateFormats } from '../../../helpers/constants';
import { ISurveyResponse } from '../../../../types';
import { useBackendEffect } from '../../../hooks';
import { ErrorScreen } from '../../../components/ErrorScreen';
import { StyledScrollView, StyledText } from '../../../styled/common';
import { SurveyResponseLink } from '../../../components/SurveyResponseLink';
import { ReduxStoreProps } from '../../../interfaces/ReduxStoreProps';
import { PatientStateProps } from '../../../store/ducks/patient';
import { theme } from '../../../styled/theme';

export const ReferralHistoryScreen = (): ReactElement => {
  const { selectedPatient } = useSelector(
    (state: ReduxStoreProps): PatientStateProps => state.patient,
  );
  const isFocused = useIsFocused();
  const [referrals, error] = useBackendEffect(
    ({ models }) => models.Referral.getForPatient(selectedPatient.id),
    [isFocused],
  );

  if (error) {
    return <ErrorScreen error={error} />;
  }
  if (!referrals) {
    return null;
  }
  return (
    <StyledScrollView>
      <List.Section>
        {referrals.map(({ surveyResponse }) => {
          const { survey, answers, startTime } = surveyResponse;

          return (
            <List.Accordion
              key={`${survey.id}-${startTime}`}
              title={`${survey.name} (${format(startTime, DateFormats.DDMMYY)})`}
              left={(props): ReactElement => (
                <List.Icon {...props} icon="clipboard-plus-outline" />
              )}
            >
              {answers.map((answer) => (
                <List.Item
                  key={answer.id}
                  title={answer.dataElement.defaultText}
                  description={(): ReactNode => {
                    const { dataElement, body } = answer;
                    const [
                      programResponse,
                      programResponseError,
                    ] = useBackendEffect(
                      async ({ models }): Promise<ISurveyResponse> => {
                        if (dataElement.type !== FieldTypes.SURVEY_LINK) {
                          return null;
                        }
                        return models.SurveyResponse.getFullResponse(body);
                      },
                      [body],
                    );
                    if (dataElement.type !== FieldTypes.SURVEY_LINK) {
                      return <StyledText color={theme.colors.TEXT_DARK}>{body}</StyledText>;
                    }
                    if (programResponseError) {
                      throw programResponseError;
                    }
                    return (
                      <SurveyResponseLink
                        surveyResponse={programResponse}
                        detailsRouteName={
                          Routes.HomeStack.ReferralStack.ViewHistory
                            .SurveyResponseDetailsScreen
                        }
                      />
                    );
                  }}
                />
              ))}
            </List.Accordion>
          );
        })}
      </List.Section>
    </StyledScrollView>
  );
};
