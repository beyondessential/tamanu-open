import React, { useState } from 'react';
import styled from 'styled-components';

import { useEncounter } from '../../../contexts/Encounter';
import { NoteModal } from '../../../components/NoteModal';
import { NoteTableWithPermission } from '../../../components/NoteTable';
import { ButtonWithPermissionCheck, TableButtonRow } from '../../../components';
import { TabPane } from '../components';
import { SelectField } from '../../../components/Field';
import { NOTE_FORM_MODES, noteTypes } from '../../../constants';
import { useEncounterNotes } from '../../../contexts/EncounterNotes';
import { TranslatedText } from '../../../components/Translation/TranslatedText';

const StyledTranslatedSelectField = styled(SelectField)`
  width: 200px;
`;

export const NotesPane = React.memo(({ encounter, readonly }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const { noteType, setNoteType } = useEncounterNotes();
  const { loadEncounter } = useEncounter();

  const noteModalOnSaved = async () => {
    setModalOpen(false);
    await loadEncounter(encounter.id);
  };

  return (
    <TabPane>
      <NoteModal
        title={<TranslatedText stringId="note.modal.create.title" fallback="New note" />}
        open={modalOpen}
        encounterId={encounter.id}
        onClose={() => setModalOpen(false)}
        onSaved={noteModalOnSaved}
        confirmText={<TranslatedText stringId="note.action.add" fallback="Add note" />}
        noteFormMode={NOTE_FORM_MODES.CREATE_NOTE}
      />
      <TableButtonRow variant="small" justifyContent="space-between">
        <StyledTranslatedSelectField
          options={[
            {
              value: null,
              label: <TranslatedText stringId="general.select.all" fallback="All" />,
            },
            ...noteTypes,
          ]}
          onChange={e => setNoteType(e.target.value)}
          value={noteType}
          name="noteType"
          prefix="note.property.type"
          isClearable={false}
        />
        <ButtonWithPermissionCheck
          onClick={() => setModalOpen(true)}
          disabled={readonly}
          verb="create"
          noun="EncounterNote"
        >
          <TranslatedText stringId="note.action.new" fallback="New note" />
        </ButtonWithPermissionCheck>
      </TableButtonRow>
      <NoteTableWithPermission
        encounterId={encounter.id}
        verb="write"
        noun="EncounterNote"
        noteModalOnSaved={noteModalOnSaved}
        noteType={noteType}
      />
    </TabPane>
  );
});
