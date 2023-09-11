import React, { ReactElement } from 'react';
import { theme } from '/styled/theme';
import { FlatList } from 'react-native';

import { SurveyResponseScreenProps } from '../../../../../interfaces/Screens/ProgramsStack/SurveyResponseScreen';
import { Routes } from '../../../../../helpers/routes';
import { ErrorScreen } from '../../../../../components/ErrorScreen';
import { LoadingScreen } from '../../../../../components/LoadingScreen';
import { Separator } from '../../../../../components/Separator';
import { SurveyResponseLink } from '../../../../../components/SurveyResponseLink';

import { useBackendEffect } from '../../../../../hooks';

export const ProgramViewHistoryScreen = ({
  route,
  navigation,
}: SurveyResponseScreenProps): ReactElement => {
  const { surveyId, selectedPatient, latestResponseId } = route.params;

  // use latestResponseId to ensure that we refresh when
  // a new survey is submitted (as this tab can be mounted while
  // it isn't active)
  const [responses, error] = useBackendEffect(
    ({ models }) => {
      if (!navigation.isFocused) {
        // always show the loading screen when in background
        // (ie, it will be what's shown when the user navigates
        // to this tab). We don't want to load & render all the
        // responses as it causes performance issues.
        return null;
      }

      return models.SurveyResponse.getForPatient(
        selectedPatient.id,
        surveyId,
      );
    },
    [navigation.isFocused, latestResponseId],
  );

  if (error) {
    return <ErrorScreen error={error} />;
  }

  if (!responses) {
    return <LoadingScreen />;
  }

  return (
    <FlatList
      style={{
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: theme.colors.BACKGROUND_GREY,
      }}
      showsVerticalScrollIndicator={false}
      data={responses}
      keyExtractor={(item): string => item.id}
      renderItem={({ item, index }): ReactElement => (
        <SurveyResponseLink
          backgroundColor={
            index % 2 ? theme.colors.BACKGROUND_GREY : theme.colors.WHITE
          }
          surveyResponse={item}
          detailsRouteName={Routes.HomeStack.ProgramStack.SurveyResponseDetailsScreen}
        />
      )}
      ItemSeparatorComponent={Separator}
    />
  );
};
