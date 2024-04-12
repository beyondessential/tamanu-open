import React, { memo, useCallback, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { useApi } from '../../api';
import { Suggester } from '../../utils/suggester';
import { PANE_SECTION_IDS } from './paneSections';

const FormContainer = styled.div`
  margin: 1rem 0;
`;

const getSuggesters = (id, items) => {
  switch (id) {
    case PANE_SECTION_IDS.CONDITIONS:
      return { practitioner: {}, icd10: {} };
    case PANE_SECTION_IDS.ALLERGIES:
      return { practitioner: {}, allergy: {}, reaction: {} };
    case PANE_SECTION_IDS.FAMILY_HISTORY:
      return { practitioner: {}, icd10: {} };
    case PANE_SECTION_IDS.ISSUES:
      return {};
    case PANE_SECTION_IDS.CARE_PLANS:
      return {
        practitioner: {},
        carePlan: {
          filterer: ({ code }) => !items.some(c => c.carePlan.code === code),
        },
      };
    default:
      return {};
  }
};

export const InfoPaneAddEditForm = memo(({ endpoint, onClose, Form, item, id, items }) => {
  const api = useApi();
  const queryClient = useQueryClient();
  const patient = useSelector(state => state.patient);
  const onSubmit = useCallback(
    async data => {
      if (data.id) {
        // don't need to include patientId as the existing record will already have it
        await api.put(`${endpoint}/${data.id}`, data);
      } else {
        await api.post(endpoint, { ...data, patientId: patient.id });
      }

      queryClient.invalidateQueries([`infoPaneListItem-${id}`, patient.id]);
      onClose();
    },
    [api, endpoint, onClose, patient.id, id, queryClient],
  );

  const suggesters = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(getSuggesters(id, items)).map(([key, options = {}]) => [
          `${key}Suggester`,
          new Suggester(api, key, options),
        ]),
      ),
    [api, id, items],
  );

  return (
    <FormContainer>
      <Form onCancel={onClose} editedObject={item} onSubmit={onSubmit} {...suggesters} />
    </FormContainer>
  );
});
