import React from 'react';
import * as yup from 'yup';
import { LAB_REQUEST_STATUSES, SETTING_KEYS } from '@tamanu/constants';
import styled from 'styled-components';
import {
  AutocompleteField,
  DateTimeField,
  Field,
  Form,
  FormGrid,
  FormModal,
  SuggesterSelectField,
} from '../../../components';
import { Colors, FORM_TYPES } from '../../../constants';
import { useSuggester } from '../../../api';
import { ModalFormActionRow } from '../../../components/ModalActionRow';
import { TranslatedText } from '../../../components/Translation/TranslatedText';
import { useSettings } from '../../../contexts/Settings';

const validationSchema = yup.object().shape({
  sampleTime: yup
    .date()
    .required()
    .translatedLabel(
      <TranslatedText
        stringId="lab.modal.recordSample.sampleTime.label"
        fallback="Date & time collected"
      />,
    ),
  labSampleSiteId: yup.string(),
  specimenTypeId: yup.string().when('mandateSpecimenType', {
    is: true,
    then: schema =>
      schema
        .required()
        .translatedLabel(
          <TranslatedText
            stringId="lab.modal.recordSample.specimenType.label"
            fallback="Specimen type"
          />,
        ),
  }),
});

const StyledModal = styled(FormModal)`
  .MuiPaper-root {
    max-width: 1000px;
  }
`;

const StyledDateTimeField = styled(DateTimeField)`
  .MuiInputBase-root {
    width: 241px;
  }
`;

const StyledField = styled(Field)`
  .label-field {
    margin-bottom: 31px;
  }
  .MuiInputBase-root.Mui-disabled {
    background: ${Colors.background};
  }
  .MuiOutlinedInput-root:hover.Mui-disabled .MuiOutlinedInput-notchedOutline {
    border-color: ${Colors.softOutline};
  }
  .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline {
    border-color: ${Colors.softOutline};
  }
`;

const FieldContainer = styled.div`
  position: relative;
  background-color: ${Colors.white};
  border: 1px solid ${Colors.outline};
  border-radius: 5px;
  padding: 18px;
  margin-bottom: 28px;
`;

const HorizontalLine = styled.div`
  height: 1px;
  background-color: ${Colors.outline};
  position: absolute;
  top: 61px;
  left: 0;
  right: 0;
`;

const LabRequestRecordSampleForm = ({ submitForm, values, onClose }) => {
  const { getSetting } = useSettings();
  const mandateSpecimenType = getSetting(SETTING_KEYS.FEATURE_MANDATE_SPECIMEN_TYPE);

  const practitionerSuggester = useSuggester('practitioner');
  const specimenTypeSuggester = useSuggester('specimenType');
  return (
    <>
      <FieldContainer>
        <HorizontalLine />
        <FormGrid columns={4}>
          <StyledField
            name="sampleTime"
            label={
              <TranslatedText
                stringId="lab.modal.recordSample.sampleTime.label"
                fallback="Date & time collected"
              />
            }
            required
            saveDateAsString
            component={StyledDateTimeField}
          />
          <StyledField
            name="collectedById"
            label="Collected by"
            suggester={practitionerSuggester}
            disabled={!values.sampleTime}
            component={AutocompleteField}
          />
          <StyledField
            name="specimenTypeId"
            label="Specimen type"
            component={AutocompleteField}
            suggester={specimenTypeSuggester}
            disabled={!values.sampleTime}
            required={mandateSpecimenType}
          />
          <StyledField
            name="labSampleSiteId"
            label="Site"
            disabled={!values.sampleTime}
            component={SuggesterSelectField}
            endpoint="labSampleSite"
          />
        </FormGrid>
      </FieldContainer>
      <ModalFormActionRow onConfirm={submitForm} confirmText="Confirm" onCancel={onClose} />
    </>
  );
};

export const LabRequestRecordSampleModal = React.memo(
  ({ updateLabReq, labRequest, open, onClose }) => {
    const { getSetting } = useSettings();
    const mandateSpecimenType = getSetting(SETTING_KEYS.FEATURE_MANDATE_SPECIMEN_TYPE);

    const sampleNotCollected = labRequest.status === LAB_REQUEST_STATUSES.SAMPLE_NOT_COLLECTED;
    const updateSample = async formValues => {
      await updateLabReq({
        ...formValues,
        // If lab request sample is marked as not collected in initial form - mark it as reception pending on submission
        ...(sampleNotCollected && {
          status: LAB_REQUEST_STATUSES.RECEPTION_PENDING,
          specimenCollected: true,
        }),
      });
      onClose();
    };

    return (
      <StyledModal
        open={open}
        onClose={onClose}
        title={sampleNotCollected ? 'Record sample details' : 'Edit sample date and time'}
      >
        <Form
          onSubmit={updateSample}
          validationSchema={validationSchema}
          showInlineErrorsOnly
          formType={FORM_TYPES.EDIT_FORM}
          initialValues={{
            sampleTime: labRequest.sampleTime,
            labSampleSiteId: labRequest.labSampleSiteId,
            specimenTypeId: labRequest.specimenTypeId,
            collectedById: labRequest.collectedById,
            mandateSpecimenType,
          }}
          render={props => <LabRequestRecordSampleForm {...props} onClose={onClose} />}
        />
      </StyledModal>
    );
  },
);
