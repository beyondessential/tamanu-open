import config from 'config';
import {
  TupaiaApiClient,
  BasicAuthHandler,
  LOCALHOST_BASE_URLS,
  DEV_BASE_URLS,
  PRODUCTION_BASE_URLS,
} from '@tupaia/api-client';

export const createTupaiaApiClient = () => {
  if (!config.tupaiaApiClient?.auth) {
    throw new Error('Must specify tupaiaApiClient.auth in config');
  }

  const { username, password } = config.tupaiaApiClient.auth;

  if (!username || !password) throw new Error('Username and password required');

  const auth = new BasicAuthHandler(username, password);

  let baseUrls = null;

  const { environment } = config.tupaiaApiClient;
  switch (environment) {
    case 'dev':
      baseUrls = DEV_BASE_URLS;
      break;
    case 'local':
      baseUrls = LOCALHOST_BASE_URLS;
      break;
    case 'production':
      baseUrls = PRODUCTION_BASE_URLS;
      break;
    default:
      throw new Error('Must specify a valid tupaiaApiClient.environment');
  }

  return new TupaiaApiClient(auth, baseUrls);
};

export const translateReportDataToSurveyResponses = (surveyId, reportData) => {
  const [headerRow, ...dataRows] = reportData;
  const translated = [];
  for (const dataRow of dataRows) {
    const translatedRow = {
      survey_id: surveyId,
      answers: {},
    };
    for (let i = 0; i < headerRow.length; i++) {
      const columnTitle = headerRow[i];
      if (['entity_code', 'timestamp', 'start_time', 'end_time'].includes(columnTitle)) {
        translatedRow[columnTitle] = dataRow[i];
      } else if (dataRow[i] !== null) {
        // non-null signifies an answer
        translatedRow.answers[columnTitle] = dataRow[i];
      }
    }
    translated.push(translatedRow);
  }
  return translated;
};
