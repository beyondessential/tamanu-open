import React, { useCallback } from 'react';
import { Loop } from '@material-ui/icons';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';

import { Button } from './Button';
import { Colors } from '../constants';
import { reloadPatient } from '../store/patient';
import { useApi } from '../api';
import { useSyncState } from '../contexts/SyncState';
import { TranslatedText } from './Translation/TranslatedText';

const MarkPatientForSyncButton = styled(Button)`
  background: ${Colors.white};
  height: 9rem;
  .MuiButton-label {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

const MarkPatientForSyncIcon = styled(Loop)`
  font-size: 5rem;
  padding-bottom: 1rem;
`;

export const MarkPatientForSync = ({ patient }) => {
  const dispatch = useDispatch();
  const api = useApi();
  const syncState = useSyncState();

  const patientId = patient.id;

  const onMarkPatientForSync = useCallback(async () => {
    const result = await api.post(`patientFacility`, { patientId });
    dispatch(reloadPatient(patientId));
    syncState.addSyncingPatient(patientId, result.updatedAtSyncTick);
  }, [patientId, dispatch, api, syncState]);
  return (
    <MarkPatientForSyncButton onClick={onMarkPatientForSync} variant="text" color="default">
      <MarkPatientForSyncIcon />
      <TranslatedText stringId="patient.action.markForSync" fallback="Sync patient records" />
    </MarkPatientForSyncButton>
  );
};
