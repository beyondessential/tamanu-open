import React, { ReactElement, useCallback } from 'react';
import { FlatList } from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { FullView, StyledText, StyledView } from '/styled/common';
import { compose } from 'redux';
import { theme } from '/styled/theme';
import { MenuOptionButton } from '/components/MenuOptionButton';
import { Separator } from '/components/Separator';
import { Routes } from '/helpers/routes';
import { StackHeader } from '/components/StackHeader';
import { withPatient } from '/containers/Patient';
import { IPatient, SurveyTypes } from '~/types';
import { joinNames } from '/helpers/user';
import { useBackendEffect } from '~/ui/hooks';
import { ErrorScreen } from '~/ui/components/ErrorScreen';
import { Survey } from '~/models/Survey';
import { useAuth } from '~/ui/contexts/AuthContext';
import { Orientation, screenPercentageToDP } from '~/ui/helpers/screen';
import { VisibilityStatus } from '~/visibilityStatuses';

type SurveyListScreenParams = {
  SurveyListScreen: {
    programId: string;
    programName: string;
  };
};

type SurveyListScreenRouteProps = RouteProp<SurveyListScreenParams, 'SurveyListScreen'>;

type SurveyListScreenProps = {
  route: SurveyListScreenRouteProps;
  selectedPatient: IPatient;
};

const Screen = ({ selectedPatient, route }: SurveyListScreenProps): ReactElement => {
  const navigation = useNavigation();
  const { programId, programName } = route.params;
  const { ability } = useAuth();

  const [surveys, error] = useBackendEffect(({ models }) =>
    models.Survey.find({
      relations: ['program'],
      where: {
        surveyType: SurveyTypes.Programs,
        program: { id: programId },
        visibilityStatus: VisibilityStatus.Current,
      },
      order: {
        name: 'ASC',
      },
    }),
  );

  const filteredSurveys = surveys?.filter(survey => survey.shouldShowInList(ability));

  const goBack = useCallback(() => {
    navigation.goBack();
  }, []);

  const onNavigateToSurvey = (survey: Survey): void => {
    navigation.navigate(Routes.HomeStack.ProgramStack.ProgramTabs.SurveyTabs.AddDetails, {
      surveyId: survey.id,
      selectedPatient,
      surveyType: survey.surveyType,
    });
  };

  return (
    <FullView>
      <StackHeader title={joinNames(selectedPatient)} onGoBack={goBack} />
      {error ? (
        <ErrorScreen error={error} />
      ) : (
        <FullView>
          <StyledView
            paddingLeft={screenPercentageToDP('4.86', Orientation.Width)}
            paddingTop={screenPercentageToDP('1.76', Orientation.Height)}
            paddingBottom={screenPercentageToDP('1.76', Orientation.Height)}
            minHeight={screenPercentageToDP('7.7', Orientation.Height)}
          >
            <StyledText
              fontWeight={500}
              color={theme.colors.TEXT_SUPER_DARK}
              fontSize={screenPercentageToDP('2.7', Orientation.Height)}
            >
              {programName}
            </StyledText>
          </StyledView>
          <Separator />
          <FlatList
            style={{
              flex: 1,
              width: '100%',
              height: '100%',
              backgroundColor: theme.colors.BACKGROUND_GREY,
              paddingTop: 5,
            }}
            showsVerticalScrollIndicator={false}
            data={filteredSurveys}
            keyExtractor={(item): string => item.id}
            renderItem={({ item }): ReactElement => (
              <MenuOptionButton
                key={item.id}
                title={item.name}
                onPress={(): void => onNavigateToSurvey(item)}
                textProps={{ fontWeight: 400, color: theme.colors.TEXT_SUPER_DARK }}
                arrowForwardIconProps={{ size: 16, fill: theme.colors.TEXT_DARK }}
              />
            )}
            ItemSeparatorComponent={() => <Separator paddingLeft="5%" width="95%" />}
          />
        </FullView>
      )}
    </FullView>
  );
};

export const SurveyListScreen = compose(withPatient)(Screen);
