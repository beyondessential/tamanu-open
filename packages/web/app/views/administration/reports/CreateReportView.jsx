import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import {
  REPORT_DATA_SOURCES,
  REPORT_DB_SCHEMAS,
  REPORT_DEFAULT_DATE_RANGES,
  REPORT_STATUSES,
} from '@tamanu/constants/reports';
import { useDispatch } from 'react-redux';
import { push } from 'connected-react-router';
import { useApi } from '../../../api';
import { ReportEditor } from './ReportEditor';
import { useAuth } from '../../../contexts/Auth';

const Container = styled.div`
  padding: 20px;
`;

export const CreateReportView = () => {
  const api = useApi();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { ability } = useAuth();

  const onSubmit = async ({ name, query, status, dbSchema, notes, ...queryOptions }) => {
    delete queryOptions.options;

    const { dataSources } = queryOptions;
    const isRawReport = dbSchema === REPORT_DB_SCHEMAS.RAW;
    try {
      const { reportDefinitionId, id } = await api.post('admin/reports', {
        name,
        query,
        status,
        dbSchema,
        notes,
        queryOptions: {
          ...queryOptions,
          dataSources: isRawReport ? dataSources : [REPORT_DATA_SOURCES.ALL_FACILITIES],
        },
      });
      queryClient.invalidateQueries(['reportList']);
      dispatch(push(`/admin/reports/${reportDefinitionId}/versions/${id}/edit`));
      toast.success(`Imported report: ${reportDefinitionId}`);
    } catch (err) {
      toast.error(`Failed to create report: ${err.message}`);
    }
  };

  const canEditSchema = Boolean(ability?.can('write', 'ReportDbSchema'));

  return (
    <Container>
      <ReportEditor
        initialValues={{
          status: REPORT_STATUSES.PUBLISHED,
          dataSources: [REPORT_DATA_SOURCES.ALL_FACILITIES],
          defaultDateRange: REPORT_DEFAULT_DATE_RANGES.TWENTY_FOUR_HOURS,
          dbSchema: canEditSchema ? REPORT_DB_SCHEMAS.RAW : null,
          parameters: [],
        }}
        onSubmit={onSubmit}
      />
    </Container>
  );
};
