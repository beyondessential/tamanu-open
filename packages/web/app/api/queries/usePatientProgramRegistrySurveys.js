import { useQuery } from '@tanstack/react-query';
import { useApi } from '../useApi';

export const usePatientProgramRegistrySurveys = (
  patientId,
  programRegistryId,
  surveyId,
  fetchOptions,
) => {
  const api = useApi();
  return useQuery(['PatientProgramRegistrySurveys', programRegistryId, surveyId], () =>
    api.get(`survey/${surveyId}`, fetchOptions),
  );
};
