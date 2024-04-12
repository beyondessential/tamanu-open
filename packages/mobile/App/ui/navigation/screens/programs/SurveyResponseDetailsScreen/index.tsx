import React, { ReactElement, useCallback } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

import { FullView, StyledText, StyledView } from '../../../../styled/common';
import { theme } from '../../../../styled/theme';

import { StackHeader } from '../../../../components/StackHeader';
import { formatStringDate } from '../../../../helpers/date';
import { DateFormats } from '../../../../helpers/constants';
import { FieldTypes, getDisplayNameForModel } from '../../../../helpers/fields';
import { SurveyResultBadge } from '../../../../components/SurveyResultBadge';
import { ViewPhotoLink } from '../../../../components/ViewPhotoLink';
import { LoadingScreen } from '../../../../components/LoadingScreen';
import { useBackendEffect } from '../../../../hooks';

const BackendAnswer = ({ question, answer }): ReactElement => {
  const config = JSON.parse(question.config);
  const [refData, error] = useBackendEffect(
    ({ models }) => models[config.source].getRepository().findOne(answer),
    [question],
  );
  if (!refData) {
    return null;
  }
  if (error) {
    console.error(error);
    return <StyledText>{error.message}</StyledText>;
  }
  return (
    <StyledText textAlign="right" color={theme.colors.TEXT_DARK}>
      {getDisplayNameForModel(config.source, refData)}
    </StyledText>
  );
};

function getAnswerText(question, answer): string | number {
  if (answer === null || answer === undefined) return 'N/A';

  switch (question.dataElement.type) {
    case FieldTypes.NUMBER:
    case FieldTypes.MULTILINE:
      return answer;
    case FieldTypes.CALCULATED:
      return typeof answer === 'number' ? answer.toFixed(1) : answer;
    case FieldTypes.TEXT:
    case FieldTypes.SELECT:
    case FieldTypes.RESULT:
    case FieldTypes.RADIO:
    case FieldTypes.CONDITION:
    case FieldTypes.USER_DATA:
    case FieldTypes.PATIENT_DATA:
      return answer || 'N/A';
    case FieldTypes.BINARY:
    case FieldTypes.CHECKBOX:
      return answer.toLowerCase() === 'yes' ? 'Yes' : 'No';
    case FieldTypes.DATE:
    case FieldTypes.SUBMISSION_DATE:
      return formatStringDate(answer, DateFormats.DDMMYY);
    case FieldTypes.PATIENT_ISSUE_GENERATOR:
      return 'PATIENT_ISSUE_GENERATOR';
    case FieldTypes.MULTI_SELECT:
      return JSON.parse(answer).join(', ');
    default:
      console.warn(`Unknown field type: ${question.dataElement.type}`);
      return `?? ${question.dataElement.type}`;
  }
}

const isFromBackend = ({ config, dataElement }): Boolean => {
  // all autocompletes have answers connected to the backend
  if (dataElement.type === FieldTypes.AUTOCOMPLETE) {
    return true;
  }

  // PatientData has some special cases
  // see getComponentForQuestionType in web/app/utils/survey.jsx for source of the following logic
  if (dataElement.type === FieldTypes.PATIENT_DATA) {
    const configObject = config && JSON.parse(config);

    // PatientData specifically can overwrite field type if we are writing back to patient record
    if (configObject?.writeToPatient?.fieldType === 'Autocomplete') {
      return true;
    }

    // if config has a "source", we're displaying a relation, so need to fetch the data from the
    // backend (otherwise the bare id will be displayed)
    if (configObject?.source) {
      return true;
    }
  }

  return false;
};

const renderAnswer = (question, answer): ReactElement => {
  if (isFromBackend(question)) {
    return <BackendAnswer question={question} answer={answer} />;
  }

  switch (question.dataElement.type) {
    case FieldTypes.RESULT:
      return <SurveyResultBadge resultText={answer} />;
    case FieldTypes.PHOTO:
      return <ViewPhotoLink imageId={answer} />;
    default:
      return (
        <StyledText textAlign="right" color={theme.colors.TEXT_DARK}>
          {getAnswerText(question, answer)}
        </StyledText>
      );
  }
};

const AnswerItem = ({ question, answer, index }): ReactElement => (
  <StyledView
    minHeight={40}
    maxWidth="100%"
    justifyContent="space-between"
    flexDirection="row"
    flexGrow={1}
    alignItems="center"
    paddingLeft={16}
    paddingRight={16}
    background={index % 2 ? theme.colors.WHITE : theme.colors.BACKGROUND_GREY}
  >
    <StyledView maxWidth="40%">
      <StyledText fontWeight="bold" color={theme.colors.LIGHT_BLUE}>
        {question.dataElement.name}
      </StyledText>
    </StyledView>
    <StyledView alignItems="flex-end" justifyContent="center" maxWidth="60%">
      {renderAnswer(question, answer)}
    </StyledView>
  </StyledView>
);

export const SurveyResponseDetailsScreen = ({ route }): ReactElement => {
  const navigation = useNavigation();
  const { surveyResponseId } = route.params;

  const goBack = useCallback(() => {
    navigation.goBack();
  }, []);

  const [surveyResponse, error] = useBackendEffect(
    ({ models }) => models.SurveyResponse.getFullResponse(surveyResponseId),
    [surveyResponseId],
  );

  if (error) {
    console.error(error);
    return <StyledText>{error}</StyledText>;
  }

  if (!surveyResponse) {
    return <LoadingScreen />;
  }

  const { encounter, survey, questions, answers } = surveyResponse;
  const { patient } = encounter;

  const attachAnswer = (q): { answer: string; question: any } | null => {
    const answerObject = answers.find(a => a.dataElement.id === q.dataElement.id);
    return {
      question: q,
      answer: (answerObject || null) && answerObject.body,
    };
  };

  const questionToAnswerItem = ({ question, answer }, i): ReactElement => (
    <AnswerItem key={question.id} index={i} question={question} answer={answer} />
  );

  const answerItems = questions
    .filter(q => q.dataElement.name)
    .map(attachAnswer)
    .filter(q => q.answer !== null && q.answer !== '')
    .map(questionToAnswerItem);

  return (
    <FullView>
      <StackHeader
        subtitle={survey.name}
        title={`${patient.firstName} ${patient.lastName}`}
        onGoBack={goBack}
      />
      <ScrollView>{answerItems}</ScrollView>
    </FullView>
  );
};
