import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import * as yup from 'yup';
import { has, omit, sortBy } from 'lodash';
import React, { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Box, IconButton, Tooltip } from '@material-ui/core';
import { Add as AddIcon, Delete as DeleteIcon } from '@material-ui/icons';
import shortid from 'shortid';
import { Alert, AlertTitle } from '@material-ui/lab';
import { toast } from 'react-toastify';
import HelpIcon from '@material-ui/icons/HelpOutlined';
import { useApi } from '../../../api';
import {
  Field,
  Form,
  OutlinedButton,
  SearchField,
  TableFormFields,
  TextField,
} from '../../../components';
import { AccessorField } from '../../patients/components/AccessorField';
import { LoadingIndicator } from '../../../components/LoadingIndicator';
import { Colors } from '../../../constants';

const StyledTableFormFields = styled(TableFormFields)`
  thead tr th {
    text-align: left;
  }
`;

const StyledIconButton = styled(IconButton)`
  padding: 3px;
  margin-left: 5px;
  color: #2f4358;
`;

const ReservedText = styled.p`
  color: ${Colors.primary};
  margin-right: 6px;
  font-weight: 500;
  font-size: 14px;
`;

const validationSchema = yup.lazy(values => {
  delete values.search;
  const newEntrySchema = {
    stringId: yup
      .string()
      .required('Required')
      .test(
        'isUnique',
        'Must be unique',
        value =>
          Object.entries(values).filter(([k, v]) => k === value || v.stringId === value).length ===
          1,
      ),
  };
  return yup.object().shape(
    Object.keys(values).reduce(
      (acc, key) => ({
        ...acc,
        [key]: yup.object({
          ...(has(values[key], 'stringId') && newEntrySchema),
        }),
      }),
      {},
    ),
  );
});

const useTranslationQuery = () => {
  const api = useApi();
  return useQuery(['translation'], () => api.get(`admin/translation`));
};

const useTranslationMutation = () => {
  const api = useApi();
  const queryClient = useQueryClient();
  return useMutation(payload => api.put('admin/translation', payload), {
    onSuccess: response => {
      const newStringIds = response?.data?.length;
      toast.success(
        `Translations saved${
          newStringIds ? `, Created ${newStringIds} new translated string entries` : ''
        }`,
      );
      queryClient.invalidateQueries(['translation']);
    },
    onError: err => {
      toast.error(`Error saving translations: ${err.message}`);
    },
  });
};

const ErrorMessage = ({ error }) => {
  return (
    <Box p={5}>
      <Alert severity="error">
        <AlertTitle>Error: Could not load translations:</AlertTitle>
        {error}
      </Alert>
    </Box>
  );
};

const TranslationField = ({ placeholderId, stringId, code }) => (
  // This id format is necessary to avoid formik nesting at . delimiters
  <AccessorField id={`['${placeholderId || stringId}']`} name={code} component={TextField} />
);

export const FormContents = ({
  data,
  languageNames,
  setFieldValue,
  isSaving,
  submitForm,
  dirty,
  additionalRows,
  setAdditionalRows,
  values,
}) => {
  const handleSave = event => {
    // Reset search so any validation errors are visible
    setFieldValue('search', '');
    submitForm(event);
  };

  const handleAddColumn = useCallback(() => {
    const placeholderId = shortid();
    setAdditionalRows([
      ...additionalRows,
      {
        placeholderId,
      },
    ]);
    // Initialize stringId so it can be validated if empty
    setFieldValue(`${placeholderId}.stringId`, '');
  }, [additionalRows, setAdditionalRows, setFieldValue]);

  const handleRemoveColumn = useCallback(
    placeholderId => {
      setAdditionalRows(additionalRows.filter(column => column.placeholderId !== placeholderId));
      setFieldValue(placeholderId, undefined);
    },
    [additionalRows, setAdditionalRows, setFieldValue],
  );

  const columns = useMemo(
    () => [
      {
        key: 'stringId',
        title: (
          <Box display="flex" alignItems="center">
            Translation ID
            <StyledIconButton onClick={handleAddColumn}>
              <AddIcon />
            </StyledIconButton>
          </Box>
        ),
        accessor: ({ stringId, placeholderId }) => {
          if (stringId === 'languageName')
            return (
              <Box display="flex" alignItems="center">
                <ReservedText>{stringId}</ReservedText>
                <Tooltip title="Language name is a reserved translation ID used for displaying language in selector">
                  <HelpIcon style={{ color: Colors.primary }} />
                </Tooltip>
              </Box>
            );
          if (!placeholderId) return stringId;
          return (
            <AccessorField
              id={placeholderId}
              name="stringId"
              component={TextField}
              InputProps={{
                endAdornment: (
                  <StyledIconButton onClick={() => handleRemoveColumn(placeholderId)}>
                    <DeleteIcon />
                  </StyledIconButton>
                ),
              }}
            />
          );
        },
      },
      ...Object.keys(omit(data[0], ['stringId'])).map(code => ({
        key: code,
        title: languageNames[code],
        accessor: row => <TranslationField code={code} {...row} />,
      })),
    ],
    [handleAddColumn, handleRemoveColumn, data, languageNames],
  );

  const tableRows = useMemo(
    () =>
      [...data, ...additionalRows].filter(
        row =>
          row.placeholderId ||
          // Search from start of stringId or after a . delimiter
          row.stringId.match(new RegExp(`(?:^|\\.)${values.search.replace('.', '\\.')}`, 'i')),
      ),
    [data, additionalRows, values.search],
  );

  if (data.length === 0)
    return (
      <Alert severity="info">
        Please load in translations using the reference data importer to activate this tab
      </Alert>
    );

  return (
    <>
      <Box display="flex" alignItems="flex-end" mb={2}>
        <Box mr={2} width="250px">
          <Field label="Search" name="search" component={SearchField} />
        </Box>
        <OutlinedButton disabled={isSaving || !dirty} onClick={handleSave}>
          Save
        </OutlinedButton>
      </Box>
      <StyledTableFormFields columns={columns} data={tableRows} />
    </>
  );
};

export const TranslationForm = () => {
  const [additionalRows, setAdditionalRows] = useState([]);
  const { data = {}, error, isLoading } = useTranslationQuery();
  const { translations = [], languageNames = {} } = data;
  const { mutate: saveTranslations, isLoading: isSaving } = useTranslationMutation();

  const initialValues = useMemo(
    () =>
      translations.reduce(
        (acc, { stringId, ...rest }) => ({
          ...acc,
          [stringId]: rest,
        }),
        { search: '' },
      ),
    [translations],
  );

  const handleSubmit = async payload => {
    // Swap temporary id out for stringId
    delete payload.search;
    const submitData = Object.fromEntries(
      Object.entries(payload).map(([key, { stringId, ...rest }]) => [stringId || key, rest]),
    );
    await saveTranslations(submitData);
    setAdditionalRows([]);
  };

  if (isLoading) return <LoadingIndicator />;
  if (error) return <ErrorMessage error={error} />;

  const sortedTranslations = sortBy(translations, obj => obj.stringId !== 'languageName'); // Ensure languageName key stays on top

  return (
    <Form
      initialValues={initialValues}
      enableReinitialize
      showInlineErrorsOnly
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
      render={props => (
        <FormContents
          {...props}
          data={sortedTranslations}
          languageNames={languageNames}
          isSaving={isSaving}
          setAdditionalRows={setAdditionalRows}
          additionalRows={additionalRows}
        />
      )}
    />
  );
};
