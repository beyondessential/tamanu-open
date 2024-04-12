import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import { Button } from '@material-ui/core';
import { useSuggester } from '../../api';
import { Colors, LOCATION_AVAILABILITY_OPTIONS } from '../../constants';
import { HandoverNotesIcon } from '../../assets/icons/HandoverNotesIcon';
import { AutocompleteField, LocalisedField, SelectField } from '../Field';
import { HandoverNotesModal } from '../BedManagement/HandoverNotesModal';
import { CustomisableSearchBar } from './CustomisableSearchBar';
import { ThemedTooltip } from '../Tooltip';
import { TranslatedText } from '../Translation/TranslatedText';

const HandoverNotesButton = styled(Button)`
  font-weight: 500;
  text-transform: none;
  text-decoration: underline;
  color: ${Colors.primary};
  margin-right: auto;
  margin-top: auto;
  margin-bottom: auto;
  &:hover {
    text-decoration: underline;
  }
  &.Mui-disabled {
    pointer-events: auto;
  }
`;

const EmptyGridItem = styled.div``;

export const BedManagementSearchBar = React.memo(({ onSearch, searchParameters }) => {
  const locationGroupSuggester = useSuggester('locationGroup', {
    baseQueryParameters: { filterByFacility: true },
  });

  const [handoverNotesModalShown, setHandoverNotesModalShown] = useState(false);

  const handleHandoverNotesButtonClick = useCallback(() => setHandoverNotesModalShown(true), [
    setHandoverNotesModalShown,
  ]);

  const handleHandoverNotesModalClose = useCallback(() => setHandoverNotesModalShown(false), [
    setHandoverNotesModalShown,
  ]);

  const handoverNotesButtonDisabled = !searchParameters?.area;

  return (
    <>
      <CustomisableSearchBar
        title={<TranslatedText stringId="bedManagement.search.title" fallback="Search Locations" />}
        onSearch={onSearch}
        initialValues={searchParameters}
      >
        <HandoverNotesButton
          disabled={handoverNotesButtonDisabled}
          startIcon={
            <HandoverNotesIcon color={searchParameters?.area ? Colors.primary : Colors.softText} />
          }
          onClick={handleHandoverNotesButtonClick}
        >
          {handoverNotesButtonDisabled ? (
            <ThemedTooltip
              title={
                <TranslatedText
                  stringId="bedManagement.search.handoverNotes.tooltip"
                  fallback="Select an 'Area' to create handover notes"
                />
              }
            >
              <span>
                <TranslatedText
                  stringId="bedManagement.search.handoverNotes.button.label"
                  fallback="Handover notes"
                />
              </span>
            </ThemedTooltip>
          ) : (
            <TranslatedText
              stringId="bedManagement.search.handoverNotes.button.label"
              fallback="Handover notes"
            />
          )}
        </HandoverNotesButton>

        <EmptyGridItem />
        <LocalisedField
          name="area"
          label={<TranslatedText stringId="general.localisedField.area.label" fallback="Area" />}
          defaultLabel="Area"
          component={AutocompleteField}
          size="small"
          suggester={locationGroupSuggester}
        />
        <LocalisedField
          name="status"
          label={
            <TranslatedText stringId="general.localisedField.status.label" fallback="Status" />
          }
          size="small"
          component={SelectField}
          options={LOCATION_AVAILABILITY_OPTIONS}
          prefix="bedManagement.property.status"
        />
      </CustomisableSearchBar>
      <HandoverNotesModal
        open={handoverNotesModalShown}
        onClose={handleHandoverNotesModalClose}
        printable
        width="md"
        keepMounted
        area={searchParameters?.area}
      />
    </>
  );
});
