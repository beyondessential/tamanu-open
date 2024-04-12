import React from 'react';

import { FormSubmitCancelRow } from '../components/ButtonRow';
import {
  NoteContentField,
  NoteDateTimeField,
  NoteTypeField,
  StyledDivider,
  StyledFormGrid,
  WrittenByField,
} from '../components/NoteCommonFields';
import { TranslatedText } from '../components/Translation/TranslatedText';

export const CreateNoteForm = ({
  onNoteContentChange,
  onSubmit,
  onCancel,
  noteTypeCountByType,
}) => (
  <>
    <StyledFormGrid columns={3}>
      <NoteTypeField required noteTypeCountByType={noteTypeCountByType} />
      <WrittenByField required />
      <NoteDateTimeField required />
    </StyledFormGrid>
    <NoteContentField
      label={<TranslatedText stringId="note.modal.addNote.label" fallback="Add note" />}
      onChange={onNoteContentChange}
    />
    <StyledDivider />
    <FormSubmitCancelRow
      onConfirm={onSubmit}
      confirmText={<TranslatedText stringId="note.action.addNote" fallback="Add note" />}
      cancelText={<TranslatedText stringId="general.action.cancel" fallback="Cancel" />}
      onCancel={onCancel}
    />
  </>
);
