import React from 'react';
import * as yup from 'yup';

import { useSuggester } from '../../../api';
import {
  Form,
  Field,
  AutocompleteField,
  ConfirmCancelRow,
  FormGrid,
  Modal,
} from '../../../components';

const validationSchema = yup.object().shape({
  labTestLaboratoryId: yup.string().required('Laboratory is required'),
});

export const LabRequestChangeLabModal = React.memo(
  ({ laboratory, updateLabReq, open, onClose }) => {
    const laboratorySuggester = useSuggester('labTestLaboratory');

    const updateLab = async ({ labTestLaboratoryId }) => {
      await updateLabReq({
        labTestLaboratoryId,
      });
      onClose();
    };

    return (
      <Modal open={open} onClose={onClose} title="Change lab request laboratory">
        <Form
          onSubmit={updateLab}
          validationSchema={validationSchema}
          initialValues={{
            labTestLaboratoryId: laboratory?.id,
          }}
          render={({ submitForm }) => (
            <FormGrid columns={1}>
              <Field
                component={AutocompleteField}
                label="Laboratory"
                name="labTestLaboratoryId"
                suggester={laboratorySuggester}
                required
              />
              <ConfirmCancelRow onConfirm={submitForm} confirmText="Save" onCancel={onClose} />
            </FormGrid>
          )}
        />
      </Modal>
    );
  },
);
