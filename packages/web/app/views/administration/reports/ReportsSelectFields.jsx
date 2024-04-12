import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useApi } from '../../../api';
import { BaseSelectField } from '../../../components';

export const ReportSelectField = ({ includeNameChangeEvent, ...props }) => {
  delete props.error;
  delete props.helperText;

  const api = useApi();
  const { data: reportData = [], error: fetchError } = useQuery(['reportList'], () =>
    api.get('admin/reports'),
  );
  const options = reportData.map(({ id, name }) => ({
    label: name,
    value: id,
  }));

  return (
    <BaseSelectField
      {...props}
      onChange={event => {
        if (includeNameChangeEvent) {
          const { value } = event.target;
          const name = reportData.find(report => report.id === value)?.name;
          props.field.onChange({ target: { name: 'name', value: name } });
        }
        props.field.onChange(event);
      }}
      options={options}
      error={!!fetchError || props.error}
      helperText={fetchError?.message || props.helperText}
    />
  );
};

export const VersionSelectField = props => {
  const api = useApi();
  const {
    form: {
      values: { reportId },
    },
  } = props;

  const query = useQuery(
    ['reportVersions', reportId],
    () => api.get(`admin/reports/${reportId}/versions`),
    {
      enabled: !!reportId,
    },
  );

  const { data: versionData, error: fetchError } = query;
  const options = versionData?.map(({ id, versionNumber }) => ({
    label: versionNumber,
    value: id,
  }));

  const searchProps = { ...props };
  delete searchProps.error;
  delete searchProps.helperText;

  return (
    <BaseSelectField
      {...props}
      options={options}
      error={!!fetchError || props.error}
      helperText={fetchError?.message || props.helperText}
    />
  );
};
