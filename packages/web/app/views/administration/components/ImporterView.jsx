import React, { memo, useCallback, useMemo, useState } from 'react';
import { startCase, sum } from 'lodash';
import styled from 'styled-components';
import * as yup from 'yup';

import { useApi } from '../../../api';
import { Field, Form } from '../../../components/Field';
import { FileChooserField, FILTER_EXCEL } from '../../../components/Field/FileChooserField';
import { ExpandedMultiSelectField } from '../../../components/Field/ExpandedMultiSelectField';
import { FormGrid } from '../../../components/FormGrid';
import { ButtonRow } from '../../../components/ButtonRow';
import { Table } from '../../../components/Table';
import { LargeOutlinedSubmitButton, LargeSubmitButton } from '../../../components/Button';
import { FORM_TYPES } from '../../../constants';
import { TranslatedText } from '../../../components/Translation/TranslatedText';

const ColorText = styled.span`
  color: ${props => props.color};
`;

const ERROR_COLUMNS = [
  { key: 'sheet', title: 'Sheet', width: 1, sortable: false },
  { key: 'row', title: 'Row', sortable: false },
  { key: 'kind', title: 'Error', sortable: false },
  {
    key: 'error',
    title: 'Message',
    accessor: data => <ColorText color="red">{data.message}</ColorText>,
    sortable: false,
  },
];

const ImportErrorsTable = ({ errors }) => (
  <Table columns={ERROR_COLUMNS} noDataMessage="All good!" data={errors} />
);

const STATS_COLUMNS = [
  { key: 'key', title: 'Table', sortable: false },
  { key: 'created', title: 'Created', sortable: false },
  { key: 'updated', title: 'Updated', sortable: false },
  {
    key: 'errored',
    title: 'Errored',
    accessor: ({ errored }) => (
      <ColorText color={errored > 0 ? 'red' : 'green'}>{errored}</ColorText>
    ),
    sortable: false,
  },
];

const ImportStatsDisplay = ({ stats }) => (
  <Table
    rowIdKey="key"
    columns={STATS_COLUMNS}
    noDataMessage="Nothing there"
    data={Object.entries(stats).map(([key, data]) => ({ key, ...data }))}
  />
);

const ImportForm = ({ submitForm, dataTypes, dataTypesSelectable }) => (
  <FormGrid columns={1}>
    <Field
      component={FileChooserField}
      filters={[FILTER_EXCEL]}
      label="Select file"
      name="file"
      required
    />
    {dataTypes && dataTypesSelectable && (
      <Field
        name="includedDataTypes"
        label="Select data types to import"
        component={ExpandedMultiSelectField}
        options={dataTypes.map(value => ({ value, label: startCase(value) }))}
      />
    )}
    <ButtonRow>
      <LargeOutlinedSubmitButton
        text="Test import"
        onSubmit={event => submitForm(event, { dryRun: true })}
      />
      <LargeSubmitButton text="Import" />
    </ButtonRow>
  </FormGrid>
);

function sumStat(stats, fields = ['created', 'updated', 'errored']) {
  return sum(Object.values(stats).map(stat => sum(fields.map(f => stat[f]))));
}

const OutcomeHeader = ({ result }) => {
  let head;
  if (result.didntSendReason === 'validationFailed') {
    head = <h3>Please correct these validation issues and try again</h3>;
  } else if (result.didntSendReason === 'dryRun') {
    head = <h3>Test import finished successfully</h3>;
  } else if (result.didntSendReason) {
    head = <h3>{`Import failed! server reports "${result.didntSendReason}"`}</h3>;
  } else if (!result?.errors?.length) {
    head = <h3>Import successful!</h3>;
  } else {
    head = <h3>Import failed - unknown server error</h3>;
  }

  return (
    <>
      {head}
      {result.stats && (
        <p>
          {`Time: ${result.duration?.toFixed(2) ?? 'unknown '}s — Records: ` +
            `${sumStat(result.stats, ['created'])} created, ` +
            `${sumStat(result.stats, ['updated'])} updated, ` +
            `${sumStat(result.stats, ['errored'])} errored, ` +
            `${sumStat(result.stats)} total`}
        </p>
      )}
    </>
  );
};

const OutcomeDisplay = ({ result }) => {
  if (!result) {
    return null;
  }

  return (
    <div>
      <OutcomeHeader result={result} />
      <hr />
      <h4>Summary</h4>
      {result.stats && <ImportStatsDisplay stats={result.stats} />}
      {result?.errors?.length > 0 && (
        <>
          <h4>Errors</h4>
          <ImportErrorsTable errors={result?.errors} />
        </>
      )}
    </div>
  );
};

export const ImporterView = memo(({ endpoint, dataTypes, dataTypesSelectable, setIsLoading }) => {
  const [resetKey, setResetKey] = useState(Math.random());
  const [result, setResult] = useState(null);

  const api = useApi();

  const onSubmitUpload = useCallback(
    async ({ file, ...data }) => {
      setResult(null);
      setIsLoading(true);
      try {
        const intermediateResult = await api.postWithFileUpload(
          `admin/import/${endpoint}`,
          file,
          data,
        );

        if (intermediateResult.sentData) {
          // reset the form
          setResetKey(Math.random());
        }

        setResult(intermediateResult);
        return true;
      } finally {
        setIsLoading(false);
      }
    },
    [api, endpoint, setIsLoading],
  );

  const renderForm = useCallback(
    props => (
      <ImportForm dataTypes={dataTypes} dataTypesSelectable={dataTypesSelectable} {...props} />
    ),
    [dataTypes, dataTypesSelectable],
  );

  const initialDataTypes = useMemo(() => dataTypes && [...dataTypes], [dataTypes]);

  return (
    <>
      <Form
        key={resetKey}
        onSubmit={onSubmitUpload}
        formType={FORM_TYPES.CREATE_FORM}
        validationSchema={yup.object().shape({
          includedDataTypes: dataTypesSelectable
            ? yup
                .array()
                .of(yup.string())
                .required()
                .min(1)
            : undefined,
          file: yup
            .string()
            .required()
            .translatedLabel(<TranslatedText stringId="general.file.label" fallback="File" />),
        })}
        initialValues={{
          includedDataTypes: initialDataTypes,
        }}
        render={renderForm}
      />
      <OutcomeDisplay result={result} />
    </>
  );
});
