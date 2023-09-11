import React from 'react';
import styled from 'styled-components';
import { NotesSection } from './SimplePrintout';

export const StyledNotesSectionWrapper = styled.div`
  margin-top: 30px;
  margin-bottom: 40px;
`;

const StyledId = styled.b`
  margin-right: 10px;
`;

export const NotesPagesSection = ({ idsAndNotePages }) => {
  const notes = idsAndNotePages
    .map(([id, notePages]) => {
      const content = notePages
        .filter(np => np?.noteItems?.length > 0)
        .map(({ noteItems }) => noteItems[0].content)
        .join(', ');
      if (!content) {
        return null;
      }
      return {
        content: (
          <p key={id}>
            <StyledId>{idsAndNotePages.length > 1 ? id : ''}</StyledId>
            {content}
          </p>
        ),
      };
    })
    .filter(note => !!note);
  return (
    <StyledNotesSectionWrapper>
      <NotesSection title="Notes" notes={notes} height="auto" separator={null} boldTitle />
    </StyledNotesSectionWrapper>
  );
};
