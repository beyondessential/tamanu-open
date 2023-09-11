import { useQuery } from '@tanstack/react-query';
import { useApi, isErrorUnknownAllow404s } from '../index';

export const useVitalsSurvey = () => {
  const api = useApi();
  return useQuery(['survey', { type: 'vitals' }], () =>
    api.get(`survey/vitals`, {}, { isErrorUnknown: isErrorUnknownAllow404s }),
  );
};
