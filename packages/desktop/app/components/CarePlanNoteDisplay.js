import React from 'react';
import styled from 'styled-components';
import moment from 'moment';

import { Colors } from '../constants';
import { MoreDropdownMenu } from './MoreDropdownMenu';
import { connectApi } from '../api';

const NoteContainer = styled.div`
  border: 1px solid ${Colors.outline};
  background-color: ${Colors.white};
  margin-bottom: 0.75rem;
`;

const NoteHeaderContainer = styled.div`
  padding: 0.75rem 1rem;
  border-bottom: 1px solid ${Colors.outline};
  display: flex;
  justify-content: space-between;
`;

const NoteAuthorName = styled.strong`
  color: ${Colors.darkText};
`;

const NoteOnBehalfOf = styled.span`
  color: ${Colors.midText};
`;

const MainCarePlanIndicator = styled.strong`
  color: ${Colors.alert};
  padding-left: 1rem;
`;

const VerticalCenter = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Timestamp = styled.span`
  color: ${Colors.midText};
  margin-right: 15px;
`;

const NoteContentContainer = styled.div`
  padding-left: 1rem;
  padding-right: 1rem;
`;

const NoteContent = styled.p`
  color: ${Colors.midText};
  white-space: pre-line;
`;

const DumbCarePlanNoteDisplay = props => {
  return (
    <NoteContainer>
      <NoteHeaderContainer>
        <VerticalCenter>
          <NoteAuthorName>{props.note.author.displayName}</NoteAuthorName>
          {props.note.onBehalfOf && props.note.onBehalfOf.displayName ? (
            <NoteOnBehalfOf>
              &nbsp;&nbsp;|&nbsp;&nbsp;On behalf of {props.note.onBehalfOf.displayName}
            </NoteOnBehalfOf>
          ) : null}
          {props.isMainCarePlan ? (
            <MainCarePlanIndicator>Main Care Plan</MainCarePlanIndicator>
          ) : null}
        </VerticalCenter>
        <VerticalCenter>
          <Timestamp>{moment(props.note.date).format('LLLL')}</Timestamp>
          <MoreDropdownMenu
            iconColor={Colors.midText}
            actions={[
              {
                label: 'Edit',
                onClick() {
                  props.onEditClicked();
                },
              },
              !props.isMainCarePlan && {
                label: 'Delete',
                async onClick() {
                  await props.deleteNote(props.note.id);
                  props.onNoteDeleted();
                },
              },
            ]}
          />
        </VerticalCenter>
      </NoteHeaderContainer>
      <NoteContentContainer>
        <NoteContent>{props.note.content}</NoteContent>
      </NoteContentContainer>
    </NoteContainer>
  );
};

export const CarePlanNoteDisplay = connectApi(api => ({
  deleteNote: async noteId => {
    return await api.delete(`note/${noteId}`);
  },
}))(DumbCarePlanNoteDisplay);
