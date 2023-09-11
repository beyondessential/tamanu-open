import React from 'react';
import { getCurrentDateTimeString } from 'shared/utils/dateTime';
import {
  Modal,
  FormGrid,
  ConfirmCancelRow,
  Form,
  Field,
  LocalisedLocationField,
} from '../../../components';
import { usePatientMove } from '../../../api/mutations';

export const MoveModal = React.memo(({ open, onClose, encounter }) => {
  const { mutate: submit } = usePatientMove(encounter.id, onClose);

  return (
    <Modal title="Move patient" open={open} onClose={onClose}>
      <Form
        initialValues={{
          // Used in creation of associated notes
          submittedTime: getCurrentDateTimeString(),
        }}
        onSubmit={submit}
        render={({ submitForm }) => (
          <FormGrid columns={1}>
            <Field
              name="locationId"
              component={LocalisedLocationField}
              label="New location"
              required
            />
            <ConfirmCancelRow onConfirm={submitForm} onCancel={onClose} />
          </FormGrid>
        )}
      />
    </Modal>
  );
});
