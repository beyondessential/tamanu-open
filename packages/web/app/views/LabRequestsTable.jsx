import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { push } from 'connected-react-router';
import { LAB_REQUEST_STATUSES } from '@tamanu/constants';
import { SearchTable } from '../components';
import { reloadPatient } from '../store/patient';
import {
  getDateWithTimeTooltip,
  getPatientDisplayId,
  getPatientName,
  getPriority,
  getPublishedDate,
  getRequestId,
  getRequestType,
  getStatus,
} from '../utils/lab';
import { TranslatedText } from '../components/Translation/TranslatedText';

export const LabRequestsTable = React.memo(
  ({ status = '', loadEncounter, loadLabRequest, searchParameters }) => {
    const publishedStatus = status === LAB_REQUEST_STATUSES.PUBLISHED;

    const columns = useMemo(() => {
      return [
        {
          key: 'displayId',
          title: (
            <TranslatedText
              stringId="general.localisedField.displayId.label.short"
              fallback="NHN"
            />
          ),
          accessor: getPatientDisplayId,
        },
        {
          key: 'patientName',
          title: 'Patient',
          accessor: getPatientName,
          maxWidth: 200,
          sortable: false,
        },
        { key: 'requestId', title: 'Test ID', accessor: getRequestId, sortable: false },
        { key: 'labTestPanelName', title: 'Panel' },
        { key: 'testCategory', title: 'Test category', accessor: getRequestType },
        { key: 'requestedDate', title: 'Requested at time', accessor: getDateWithTimeTooltip },
        publishedStatus
          ? { key: 'publishedDate', title: 'Completed', accessor: getPublishedDate }
          : { key: 'priority', title: 'Priority', accessor: getPriority },
        {
          key: 'status',
          title: 'Status',
          accessor: getStatus,
          maxWidth: 200,
          sortable: !publishedStatus,
        },
      ];
    }, [publishedStatus]);
    const dispatch = useDispatch();

    const selectLab = async lab => {
      await loadEncounter(lab.encounterId);

      if (lab.patientId) {
        await dispatch(reloadPatient(lab.patientId));
      }
      const { patientId } = lab;
      await loadLabRequest(lab.id);
      dispatch(
        push(`/patients/all/${patientId}/encounter/${lab.encounterId}/lab-request/${lab.id}`),
      );
    };

    return (
      <SearchTable
        autoRefresh
        endpoint="labRequest"
        columns={columns}
        noDataMessage="No lab requests found"
        onRowClick={selectLab}
        fetchOptions={{
          ...searchParameters,
          ...(status && { status }),
        }}
        initialSort={{
          order: 'desc',
          orderBy: publishedStatus ? 'publishedDate' : 'requestedDate',
        }}
      />
    );
  },
);
