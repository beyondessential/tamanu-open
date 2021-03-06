import React, { useEffect, useCallback } from 'react';

import { connect } from 'react-redux';
import { connectApi } from 'desktop/app/api';

import { reloadPatient } from 'desktop/app/store/patient';

import { SurveyView } from 'desktop/app/views/programs/SurveyView';
import { SurveySelector } from 'desktop/app/views/programs/SurveySelector';
import { LoadingIndicator } from 'desktop/app/components/LoadingIndicator';
import { DumbPatientListingView } from 'desktop/app/views/patients/PatientListingView';

const DumbSurveyFlow = React.memo(
  ({ onFetchSurvey, onSubmitSurvey, onFetchProgramsList, onFetchSurveysList, patient }) => {
    const [survey, setSurvey] = React.useState(null);
    const [programsList, setProgramsList] = React.useState(null);
    const [startTime, setStartTime] = React.useState(null);

    useEffect(() => {
      (async () => {
        const { data } = await onFetchProgramsList();
        setProgramsList(data);
      })();
    }, []);

    const onSelectSurvey = useCallback(async id => {
      const response = await onFetchSurvey(id);
      setSurvey(response);
      setStartTime(new Date());
    });

    const onCancelSurvey = useCallback(() => {
      setSurvey(null);
    });

    const onSubmit = useCallback(
      data => {
        onSubmitSurvey({
          surveyId: survey.id,
          startTime: startTime,
          patientId: patient.id,
          endTime: new Date(),
          answers: data,
        });
      },
      [startTime, survey],
    );

    if (!programsList) {
      return <LoadingIndicator />;
    }

    if (!survey) {
      return (
        <SurveySelector
          programs={programsList}
          onSelectSurvey={onSelectSurvey}
          onFetchSurveysList={onFetchSurveysList}
        />
      );
    }

    return <SurveyView onSubmit={onSubmit} survey={survey} onCancel={onCancelSurvey} />;
  },
);

const SurveyFlow = connectApi(api => ({
  onFetchSurvey: id => api.get(`survey/${id}`),
  onFetchProgramsList: () => api.get('program'),
  onFetchSurveysList: programId => api.get(`program/${programId}/surveys`),
  onSubmitSurvey: data => api.post(`surveyResponse`, data),
}))(DumbSurveyFlow);

const DumbPatientLinker = React.memo(({ patient, patientId, onViewPatient }) => {
  if (!patientId) {
    return <DumbPatientListingView onViewPatient={onViewPatient} />;
  }

  return <SurveyFlow patient={patient} />;
});

export const ProgramsView = connect(
  state => ({
    patientId: state.patient.id,
    patient: state.patient,
  }),
  dispatch => ({
    onViewPatient: id => dispatch(reloadPatient(id)),
  }),
)(DumbPatientLinker);
