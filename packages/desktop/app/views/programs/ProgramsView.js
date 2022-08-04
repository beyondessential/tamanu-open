import React, { useState, useEffect, useCallback } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { useApi } from 'desktop/app/api';

import { SURVEY_TYPES } from 'shared/constants';

import { reloadPatient } from 'desktop/app/store/patient';
import { getCurrentUser } from 'desktop/app/store/auth';

import { SurveyView } from 'desktop/app/views/programs/SurveyView';
import { PatientDisplay } from 'desktop/app/views/programs/PatientDisplay';
import { SurveySelector } from 'desktop/app/views/programs/SurveySelector';
import { FormGrid } from 'desktop/app/components/FormGrid';
import { SelectInput } from 'desktop/app/components/Field/SelectField';
import {
  ProgramsPane,
  ProgramsPaneHeader,
  ProgramsPaneHeading,
} from 'desktop/app/views/programs/ProgramsPane';
import { LoadingIndicator } from 'desktop/app/components/LoadingIndicator';
import { PatientListingView } from 'desktop/app/views';
import { getAnswersFromData, getActionsFromData } from '../../utils';

const SurveyFlow = ({ patient, currentUser }) => {
  const api = useApi();
  const [survey, setSurvey] = useState(null);
  const [programs, setPrograms] = useState(null);
  const [selectedProgramId, setSelectedProgramId] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [surveys, setSurveys] = useState(null);

  useEffect(() => {
    (async () => {
      const { data } = await api.get('program');
      setPrograms(data);
    })();
  }, [api]);

  const setSelectedSurvey = useCallback(
    async id => {
      const response = await api.get(`survey/${encodeURIComponent(id)}`);
      setSurvey(response);
      setStartTime(new Date());
    },
    [api],
  );

  const unsetSurvey = useCallback(() => {
    setSurvey(null);
  }, []);

  const selectProgram = useCallback(
    async event => {
      const programId = event.target.value;
      if (programId === selectedProgramId) {
        return;
      }

      setSelectedProgramId(programId);
      const { data } = await api.get(`program/${programId}/surveys`);
      setSurveys(
        data
          .filter(s => s.surveyType === SURVEY_TYPES.PROGRAMS)
          .map(x => ({ value: x.id, label: x.name })),
      );
    },
    [api, selectedProgramId],
  );

  const submitSurveyResponse = useCallback(
    data =>
      api.post('surveyResponse', {
        surveyId: survey.id,
        startTime,
        patientId: patient.id,
        endTime: new Date(),
        answers: getAnswersFromData(data, survey),
        actions: getActionsFromData(data, survey),
      }),
    [api, startTime, survey, patient],
  );

  if (!programs) {
    return <LoadingIndicator />;
  }

  if (!survey) {
    return (
      <>
        <PatientDisplay />
        <ProgramsPane>
          <ProgramsPaneHeader>
            <ProgramsPaneHeading variant="h6">Select a survey</ProgramsPaneHeading>
          </ProgramsPaneHeader>
          <FormGrid columns={1}>
            <SelectInput
              options={programs.map(p => ({ value: p.id, label: p.name }))}
              value={selectedProgramId}
              onChange={selectProgram}
              label="Select program"
            />
            <SurveySelector
              onSelectSurvey={setSelectedSurvey}
              surveys={surveys}
              buttonText="Begin survey"
            />
          </FormGrid>
        </ProgramsPane>
      </>
    );
  }

  return (
    <SurveyView
      onSubmit={submitSurveyResponse}
      survey={survey}
      onCancel={unsetSurvey}
      patient={patient}
      currentUser={currentUser}
    />
  );
};

export const ProgramsView = () => {
  const dispatch = useDispatch();
  const patient = useSelector(state => state.patient);
  const currentUser = useSelector(getCurrentUser);
  if (!patient.id) {
    return <PatientListingView onViewPatient={id => dispatch(reloadPatient(id))} />;
  }

  return <SurveyFlow patient={patient} currentUser={currentUser} />;
};
