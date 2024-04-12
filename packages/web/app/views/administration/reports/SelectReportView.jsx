import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import styled from 'styled-components';
import { push } from 'connected-react-router';
import { useDispatch } from 'react-redux';
import { useApi } from '../../../api';
import { ReportTable, VersionTable } from './ReportTables';

const FlexContainer = styled.div`
  padding: 20px;
  display: flex;
  align-items: flex-start;
`;

const VersionsTableContainer = styled.div`
  margin-left: 20px;
`;

export const SelectReportView = () => {
  const api = useApi();
  const dispatch = useDispatch();

  const [report, setReport] = useState(null);

  const handleVersionClick = ({ id }) => {
    dispatch(push(`/admin/reports/${report.id}/versions/${id}/edit`));
  };

  const { data: reportList = [], isLoading: isReportLoading, error: reportError } = useQuery(
    ['reportList'],
    () => api.get('admin/reports'),
  );

  const showVersions = !!report?.id;
  const { data: versionData, isLoading: areVersionsLoading, error: versionsError } = useQuery(
    ['reportVersions', report?.id],
    () => api.get(`admin/reports/${report?.id}/versions`),
    {
      enabled: showVersions,
    },
  );

  return (
    <FlexContainer>
      <ReportTable
        data={reportList}
        selected={report?.id}
        onRowClick={setReport}
        loading={isReportLoading}
        error={reportError?.message}
      />
      {report && (
        <VersionsTableContainer>
          <VersionTable
            data={versionData}
            loading={areVersionsLoading}
            error={versionsError?.message}
            onRowClick={handleVersionClick}
          />
        </VersionsTableContainer>
      )}
    </FlexContainer>
  );
};
