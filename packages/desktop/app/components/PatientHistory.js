import React, { useState } from 'react';
import styled from 'styled-components';

import { OutlinedButton } from './Button';
import { DataFetchingTable } from './Table';
import { DateDisplay } from './DateDisplay';
import { MarkPatientForSync } from './MarkPatientForSync';
import { ENCOUNTER_OPTIONS_BY_VALUE } from '../constants';

const getDate = ({ startDate, endDate }) => (
  <>
    <DateDisplay date={startDate} />
    {' - '}
    {endDate ? <DateDisplay date={endDate} /> : 'Current'}
  </>
);
const getType = ({ encounterType }) => ENCOUNTER_OPTIONS_BY_VALUE[encounterType].label;
const getDescription = ({ reasonForEncounter }) => <div>{reasonForEncounter}</div>;
const getFacility = ({ facilityName }) => <div>{facilityName}</div>;

const columns = [
  { key: 'startDate', title: 'Date', accessor: getDate },
  { key: 'encounterType', title: 'Type', accessor: getType, sortable: false },
  { key: 'facilityName', title: 'Facility', accessor: getFacility },
  { key: 'reasonForEncounter', title: 'Description', accessor: getDescription, sortable: false },
];

const SyncWarning = styled.p`
  margin: 1rem;
`;

const RefreshButton = styled(OutlinedButton)`
  margin-left: 0.5rem;
`;

export const PatientHistory = ({ patient, onItemClick }) => {
  const [refreshCount, setRefreshCount] = useState(0);

  if (!patient.markedForSync) {
    return <MarkPatientForSync patient={patient} />;
  }
  return (
    <>
      {patient.syncing && (
        <SyncWarning>
          Patient is being synced, so records might not be fully updated.
          <RefreshButton onClick={() => setRefreshCount(refreshCount + 1)}>Refresh</RefreshButton>
        </SyncWarning>
      )}
      <DataFetchingTable
        columns={columns}
        onRowClick={row => onItemClick(row.id)}
        noDataMessage="No historical records for this patient."
        endpoint={`patient/${patient.id}/encounters`}
        initialSort={{ orderBy: 'startDate', order: 'desc' }}
        refreshCount={refreshCount}
      />
    </>
  );
};
