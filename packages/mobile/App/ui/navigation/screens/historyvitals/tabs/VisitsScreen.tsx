import React, { ReactElement } from 'react';
import { compose } from 'redux';
import { FullView, StyledSafeAreaView } from '/styled/common';
import { PatientHistoryAccordion } from '~/ui/components/PatientHistoryAccordion';
import { theme } from '/styled/theme';
import { NOTE_TYPES } from '~/ui/helpers/constants';
import { useBackendEffect } from '~/ui/hooks';
import { LoadingScreen } from '~/ui/components/LoadingScreen';
import { ErrorScreen } from '~/ui/components/ErrorScreen';
import { withPatient } from '~/ui/containers/Patient';
import { IDiagnosis, INote } from '~/types';
import { TranslatedText } from '~/ui/components/Translations/TranslatedText';

const DEFAULT_FIELD_VAL = (
  <TranslatedText stringId="general.fallback.notApplicable" fallback="N/A" uppercase />
);

const displayNotes = (notes: INote[]): string =>
  notes
    .filter(note => note.noteType === NOTE_TYPES.CLINICAL_MOBILE)
    .map(note => note.content)
    .join('\n\n') || DEFAULT_FIELD_VAL;

const visitsHistoryRows = {
  diagnoses: {
    name: <TranslatedText stringId="general.form.diagnosis.label" fallback="Diagnosis" />,
    accessor: (diagnoses: IDiagnosis[]): string =>
      diagnoses.map(d => `${d.diagnosis?.name} (${d.certainty})`).join('\n\n') || DEFAULT_FIELD_VAL,
  },
  notes: {
    name: <TranslatedText stringId="note.property.type.clinicalNote" fallback="Clinical Note" />,
    accessor: displayNotes,
  },
};

const DumbVisitsScreen = ({ selectedPatient }): ReactElement => {
  const [data, error] = useBackendEffect(
    ({ models }) => models.Encounter.getForPatient(selectedPatient.id),
    [],
  );

  if (error) return <ErrorScreen error={error} />;

  return (
    <StyledSafeAreaView flex={1}>
      <FullView background={theme.colors.BACKGROUND_GREY}>
        {data ? (
          <PatientHistoryAccordion dataArray={data} rows={visitsHistoryRows} />
        ) : (
          <LoadingScreen />
        )}
      </FullView>
    </StyledSafeAreaView>
  );
};

export const VisitsScreen = compose(withPatient)(DumbVisitsScreen);
