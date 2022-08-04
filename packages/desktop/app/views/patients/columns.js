import React from 'react';
import { CloudDownload, CloudOff } from '@material-ui/icons';

import { DateDisplay } from '../../components';
import { capitaliseFirstLetter } from '../../utils/capitalise';

const DateCell = React.memo(({ value }) => <DateDisplay date={value} />);
const SexCell = React.memo(({ value = '' }) => <span>{capitaliseFirstLetter(value)}</span>);
const SyncedCell = React.memo(({ value }) => (value === true ? <CloudDownload /> : <CloudOff />));

export const markedForSync = {
  key: 'markedForSync',
  minWidth: 26,
  CellComponent: SyncedCell,
};

export const displayId = {
  key: 'displayId',
  minWidth: 80,
  accessor: row => row.displayId || `(${row.id})`,
};

export const firstName = {
  key: 'firstName',
  minWidth: 100,
};

export const lastName = {
  key: 'lastName',
  minWidth: 100,
};

export const culturalName = {
  key: 'culturalName',
  minWidth: 100,
};

export const sex = {
  key: 'sex',
  minWidth: 80,
  CellComponent: SexCell,
};

export const dateOfBirth = {
  key: 'dateOfBirth',
  minWidth: 100,
  CellComponent: DateCell,
};

export const dateOfDeath = {
  key: 'dateOfDeath',
  minWidth: 100,
  CellComponent: DateCell,
};

export const village = {
  key: 'villageName',
  minWidth: 100,
  accessor: row => row?.villageName || null,
};

export const location = {
  key: 'locationName',
  title: 'Location',
  minWidth: 100,
};

export const department = {
  key: 'departmentName',
  title: 'Department',
  minWidth: 100,
};

export const status = {
  key: 'patientStatus',
  title: 'Status',
  minWidth: 100,
  accessor: ({ patientStatus }) => {
    const stat = capitaliseFirstLetter(patientStatus ?? '');
    return stat === 'Deceased' ? <strong>{stat}</strong> : stat;
  },
};

export const vaccinationStatus = {
  key: 'vaccinationStatus',
  title: 'Vaccine status',
  minWidth: 100,
  accessor: row => row.vaccinationStatus || 'Unknown',
};
