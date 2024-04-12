import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import NotesIcon from '@material-ui/icons/Notes';
import { Box } from '@material-ui/core';
import { NOTE_TYPES } from '@tamanu/constants';
import { getCurrentDateTimeString } from '@tamanu/shared/utils/dateTime';

import { useApi } from '../api';
import {
  Button,
  DateDisplay,
  Field,
  Form,
  FormCancelButton,
  FormSubmitButton,
  TextField,
} from '../components';
import { FORM_TYPES } from '../constants';
import { TranslatedText } from '../components/Translation/TranslatedText';

const Container = styled.div`
  display: flex;
  align-items: flex-start;
  background: white;
  border-radius: 3px;
  margin-bottom: 15px;
  padding: 12px;
`;

const List = styled.ul`
  margin: 0;
  padding: 5px 0 0 15px;
  max-height: 200px;
  overflow: auto;
`;

const ListItem = styled.li`
  margin: 0 0 5px 0;
  font-weight: 400;
  font-size: 12px;
  line-height: 15px;
`;

const Caption = styled.span`
  color: ${props => props.theme.palette.text.tertiary};
  margin-left: 6px;
`;

const NotesInput = styled(Field)`
  flex: 1;

  .MuiInputBase-input {
    font-size: 12px;
    line-height: 15px;
    padding: 8px;
  }
`;

const buttonStyle = css`
  font-weight: 500;
  font-size: 12px;
  line-height: 15px;
  text-transform: none;
  padding-left: 8px;
  padding-right: 8px;
  min-width: auto;
  background: none;
  color: ${props =>
    props.$underline ? props.theme.palette.primary.main : props.theme.palette.text.tertiary};
  text-decoration: ${props => (props.$underline ? 'underline' : 'none')};

  &.MuiButton-root:hover {
    background: none;
    text-decoration: underline;
    color: ${props => props.theme.palette.primary.main};
  }
`;

const SubmitNoteButton = styled(FormSubmitButton)`
  ${buttonStyle}
`;

const ShowAddNoteFormButton = styled(Button)`
  ${buttonStyle}
`;

const CancelAddNoteButton = styled(FormCancelButton)`
  ${buttonStyle}
`;

export const LabRequestNoteForm = React.memo(({ labRequestId, isReadOnly }) => {
  const api = useApi();
  const queryClient = useQueryClient();
  const [active, setActive] = useState(false);

  const { data: notes, isSuccess } = useQuery(['labRequest', labRequestId, 'notes'], () =>
    api.get(`labRequest/${labRequestId}/notes`),
  );

  const { mutateAsync: saveNote } = useMutation(
    ({ values }) =>
      api.post(`labRequest/${labRequestId}/notes`, {
        content: values.content?.trim(),
        authorId: api.user.id,
        noteType: NOTE_TYPES.OTHER,
        date: getCurrentDateTimeString(),
      }),
    {
      onSuccess: (responseData, { formProps }) => {
        setActive(false);
        formProps.resetForm();
        queryClient.invalidateQueries(['labRequest', labRequestId]);
      },
    },
  );

  return (
    <Container>
      <NotesIcon color="primary" style={{ marginTop: 4 }} />
      <Box flex="1" ml={1}>
        <List>
          {isSuccess &&
            notes.data?.map(note => (
              <ListItem key={`${note.id}`}>
                {note.content}
                <Caption>
                  {note.author?.displayName} <DateDisplay date={note.date} showTime />
                </Caption>
              </ListItem>
            ))}
        </List>
        {!isReadOnly && (
          <Form
            onSubmit={async (values, formProps) => {
              await saveNote({ values, formProps });
            }}
            formType={FORM_TYPES.CREATE_FORM}
            render={({ values }) => {
              const formSubmitIsDisabled = !values.content?.trim();
              return active ? (
                <Box display="flex" alignItems="center">
                  <NotesInput label="" name="content" component={TextField} autoFocus />
                  <CancelAddNoteButton onClick={() => setActive(false)}>Cancel</CancelAddNoteButton>
                  <SubmitNoteButton $underline disabled={formSubmitIsDisabled} text="Save" />
                </Box>
              ) : (
                <ShowAddNoteFormButton $underline onClick={() => setActive(true)}>
                  <TranslatedText stringId="general.action.addNote" fallback="Add note" />
                </ShowAddNoteFormButton>
              );
            }}
          />
        )}
      </Box>
    </Container>
  );
});
