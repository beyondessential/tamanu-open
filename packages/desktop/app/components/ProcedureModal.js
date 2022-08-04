import React from 'react';

import { useApi } from '../api';
import { Suggester } from '../utils/suggester';

import { Modal } from './Modal';
import { ProcedureForm } from '../forms/ProcedureForm';

export const ProcedureModal = ({ onClose, onSaved, encounterId, editedProcedure }) => {
  const api = useApi();
  const locationSuggester = new Suggester(api, 'location');
  const practitionerSuggester = new Suggester(api, 'practitioner');
  const procedureSuggester = new Suggester(api, 'procedureType');
  const anaestheticSuggester = new Suggester(api, 'drug');

  return (
    <Modal width="md" title="New procedure" open={!!editedProcedure} onClose={onClose}>
      <ProcedureForm
        onSubmit={async data => {
          if (data.id) {
            await api.put(`procedure/${data.id}`, data);
          } else {
            await api.post('procedure', {
              ...data,
              encounterId,
            });
          }
          onSaved();
        }}
        onCancel={onClose}
        editedObject={editedProcedure}
        locationSuggester={locationSuggester}
        practitionerSuggester={practitionerSuggester}
        procedureSuggester={procedureSuggester}
        anaestheticSuggester={anaestheticSuggester}
      />
    </Modal>
  );
};
