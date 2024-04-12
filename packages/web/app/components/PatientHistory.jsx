import React, { useState } from 'react';
import styled from 'styled-components';

import { DataFetchingTable } from './Table';
import { DateDisplay } from './DateDisplay';
import { MarkPatientForSync } from './MarkPatientForSync';
import { ENCOUNTER_OPTIONS_BY_VALUE } from '../constants';
import { LocationGroupCell } from './LocationCell';
import { LimitedLinesCell } from './FormattedTableCell';
import { TranslatedText } from './Translation/TranslatedText';
import { useSyncState } from '../contexts/SyncState';
import { useRefreshCount } from '../hooks/useRefreshCount';

const DateWrapper = styled.div`
  min-width: 90px;
`;

const FacilityWrapper = styled.div`
  min-width: 200px;
`;

const getDate = ({ startDate, endDate }) => (
  <DateWrapper>
    <DateDisplay date={startDate} />
    {' - '}
    {endDate ? (
      <DateDisplay date={endDate} />
    ) : (
      <TranslatedText stringId="general.date.current" fallback="Current" />
    )}
  </DateWrapper>
);
const getType = ({ encounterType }) => ENCOUNTER_OPTIONS_BY_VALUE[encounterType].label;
const getReasonForEncounter = ({ reasonForEncounter }) => <div>{reasonForEncounter}</div>;
const getFacility = ({ facilityName }) => <FacilityWrapper>{facilityName}</FacilityWrapper>;

const columns = [
  {
    key: 'startDate',
    title: <TranslatedText stringId="patientHistory.table.column.startDate" fallback="Date" />,
    accessor: getDate,
  },
  {
    key: 'encounterType',
    title: <TranslatedText stringId="patientHistory.table.column.encounterType" fallback="Type" />,
    accessor: getType,
    sortable: false,
  },
  {
    key: 'facilityName',
    title: <TranslatedText stringId="general.table.column.facilityName" fallback="Facility" />,
    accessor: getFacility,
    CellComponent: LimitedLinesCell,
  },
  {
    key: 'locationGroupName',
    title: <TranslatedText stringId="general.table.column.area" fallback="Area" />,
    accessor: LocationGroupCell,
    CellComponent: LimitedLinesCell,
  },
  {
    key: 'reasonForEncounter',
    title: (
      <TranslatedText
        stringId="patientHistory.table.column.reasonForEncounter"
        fallback="Reason for encounter"
      />
    ),
    accessor: getReasonForEncounter,
    sortable: false,
    CellComponent: LimitedLinesCell,
  },
];

const SyncWarning = styled.p`
  margin: 1rem;
`;

const SyncWarningBanner = ({ patient, onRefresh }) => {
  const syncState = useSyncState();
  const isSyncing = syncState.isPatientSyncing(patient.id);
  const [wasSyncing, setWasSyncing] = useState(isSyncing);

  if (isSyncing !== wasSyncing) {
    setWasSyncing(isSyncing);
    // refresh the table on a timeout so we aren't updating two components at once
    setTimeout(onRefresh, 100);
  }

  if (!isSyncing) return null;

  return (
    <SyncWarning>
      <TranslatedText
        stringId="patient.history.syncWarning"
        fallback="Patient is being synced, so records might not be fully updated."
      />
    </SyncWarning>
  );
};

export const PatientHistory = ({ patient, onItemClick }) => {
  const [refreshCount, updateRefreshCount] = useRefreshCount();

  if (!patient.markedForSync) {
    return <MarkPatientForSync patient={patient} />;
  }
  return (
    <>
      <SyncWarningBanner patient={patient} onRefresh={updateRefreshCount} />
      <DataFetchingTable
        columns={columns}
        onRowClick={row => onItemClick(row.id)}
        noDataMessage={
          <TranslatedText
            stringId="patient.history.table.noDataMessage"
            fallback="No historical records for this patient"
          />
        }
        endpoint={`patient/${patient.id}/encounters`}
        initialSort={{ orderBy: 'startDate', order: 'desc' }}
        refreshCount={refreshCount}
      />
    </>
  );
};
