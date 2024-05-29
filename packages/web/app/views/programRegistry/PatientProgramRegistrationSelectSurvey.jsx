import React from 'react';
import styled from 'styled-components';
import * as yup from 'yup';
import { useQuery } from '@tanstack/react-query';
import { REGISTRATION_STATUSES, SURVEY_TYPES } from '@tamanu/constants';
import { useApi } from '../../api';
import { Colors, FORM_TYPES } from '../../constants';
import { Heading5 } from '../../components/Typography';
import { Button } from '../../components/Button';
import { Field, Form, BaseSelectField } from '../../components/Field';
import { FormGrid } from '../../components/FormGrid';
import { foreignKey } from '../../utils/validation';
import { usePatientNavigation } from '../../utils/usePatientNavigation';
import { ConditionalTooltip } from '../../components/Tooltip';
import { useProgramRegistryContext } from '../../contexts/ProgramRegistry';
import { useTranslation } from '../../contexts/Translation';

const DisplayContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: start;
  align-items: flex-start;
  border: 1px solid ${Colors.softOutline};
  font-size: 11px;
  padding-left: 20px;
  padding-top: 13px;
  padding-right: 14px;
  padding-bottom: 20px;
  background-color: ${Colors.white};
`;

const StyledFormGrid = styled(FormGrid)`
  width: 100%;
  display: grid;
  grid-template-columns: 80% 18%;
  width: 100%;
  justify-content: space-between;
  align-items: flex-end;
`;

const StyledButton = styled(Button)`
  height: 44px;
  background-color: ${Colors.primary};
  color: ${Colors.white};
  width: 100%;
  :disabled {
    background-color: ${Colors.primary};
    color: ${Colors.white};
    opacity: 0.4;
  }
`;

export const PatientProgramRegistrationSelectSurvey = ({ patientProgramRegistration }) => {
  const api = useApi();
  const { navigateToProgramRegistrySurvey } = usePatientNavigation();
  const { getTranslation } = useTranslation();
  const { setProgramRegistryId } = useProgramRegistryContext();

  const { data: surveys } = useQuery(
    ['programSurveys', patientProgramRegistration.programRegistry.programId],
    () =>
      api
        .get(`program/${patientProgramRegistration.programRegistry.programId}/surveys`)
        .then(response => {
          return response.data
            .filter(s => s.surveyType === SURVEY_TYPES.PROGRAMS)
            .map(x => ({ value: x.id, label: x.name }));
        }),
  );

  return (
    <DisplayContainer>
      <Heading5>
        Select a {patientProgramRegistration.programRegistry.name} form below to complete
      </Heading5>
      <Form
        showInlineErrorsOnly
        style={{ width: '100%', marginTop: '5px' }}
        onSubmit={async values => {
          setProgramRegistryId(patientProgramRegistration.programRegistryId);
          navigateToProgramRegistrySurvey(
            patientProgramRegistration.programRegistryId,
            values.surveyId,
            patientProgramRegistration.programRegistry.name,
          );
        }}
        formType={FORM_TYPES.CREATE_FORM}
        render={({ values, submitForm }) => {
          const isRemoved =
            patientProgramRegistration.registrationStatus === REGISTRATION_STATUSES.INACTIVE;
          return (
            <StyledFormGrid>
              <ConditionalTooltip visible={isRemoved} title="Patient must be active">
                <Field
                  name="surveyId"
                  label="Select form"
                  component={BaseSelectField}
                  placeholder={getTranslation('general.placeholder.select', 'Select')}
                  options={surveys}
                  disabled={isRemoved}
                />
              </ConditionalTooltip>

              <ConditionalTooltip
                title={isRemoved ? 'Patient must be active' : 'Select form to proceed'}
                visible={isRemoved || !values.surveyId}
              >
                <div>
                  <StyledButton
                    variant="contained"
                    onClick={submitForm}
                    disabled={isRemoved || !values.surveyId}
                    isSubmitting={false}
                  >
                    Begin form
                  </StyledButton>
                </div>
              </ConditionalTooltip>
            </StyledFormGrid>
          );
        }}
        validationSchema={yup.object().shape({
          surveyId: foreignKey(
            getTranslation('validation.rule.formMustBeSelected', 'A form must be selected'),
          ),
        })}
      />
    </DisplayContainer>
  );
};
