import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { ENCOUNTER_TYPES } from '@tamanu/constants';
import { useEncounter } from '../../contexts/Encounter';
import { useLocalisation } from '../../contexts/Localisation';
import { useUrlSearchParams } from '../../utils/useUrlSearchParams';
import { ContentPane, EncounterTopBar } from '../../components';
import { DiagnosisView } from '../../components/DiagnosisView';
import { LoadingIndicator } from '../../components/LoadingIndicator';
import { TabDisplay } from '../../components/TabDisplay';
import { useApi } from '../../api';
import {
  DocumentsPane,
  EncounterInfoPane,
  EncounterMedicationPane,
  EncounterProgramsPane,
  ImagingPane,
  InvoicingPane,
  LabsPane,
  NotesPane,
  ProcedurePane,
  VitalsPane,
} from './panes';
import { Colors, ENCOUNTER_OPTIONS_BY_VALUE } from '../../constants';
import { ENCOUNTER_TAB_NAMES } from '../../constants/encounterTabNames';
import { EncounterActions } from './components';
import { useReferenceData } from '../../api/queries';
import { useAuth } from '../../contexts/Auth';
import { VitalChartDataProvider } from '../../contexts/VitalChartData';
import { TranslatedText } from '../../components/Translation/TranslatedText';

const getIsTriage = encounter => ENCOUNTER_OPTIONS_BY_VALUE[encounter.encounterType].triageFlowOnly;

const TABS = [
  {
    label: <TranslatedText stringId="encounter.tabs.vitals" fallback="Vitals" />,
    key: ENCOUNTER_TAB_NAMES.VITALS,
    render: props => (
      <VitalChartDataProvider>
        <VitalsPane {...props} />
      </VitalChartDataProvider>
    ),
  },
  {
    label: <TranslatedText stringId="encounter.tabs.notes" fallback="Notes" />,
    key: ENCOUNTER_TAB_NAMES.NOTES,
    render: props => <NotesPane {...props} />,
  },
  {
    label: <TranslatedText stringId="encounter.tabs.procedures" fallback="Procedures" />,
    key: ENCOUNTER_TAB_NAMES.PROCEDURES,
    render: props => <ProcedurePane {...props} />,
  },
  {
    label: <TranslatedText stringId="encounter.tabs.labs" fallback="Labs" />,
    key: ENCOUNTER_TAB_NAMES.LABS,
    render: props => <LabsPane {...props} />,
  },
  {
    label: <TranslatedText stringId="encounter.tabs.imaging" fallback="Imaging" />,
    key: ENCOUNTER_TAB_NAMES.IMAGING,
    render: props => <ImagingPane {...props} />,
  },
  {
    label: <TranslatedText stringId="encounter.tabs.medication" fallback="Medication" />,
    key: ENCOUNTER_TAB_NAMES.MEDICATION,
    render: props => <EncounterMedicationPane {...props} />,
  },
  {
    label: <TranslatedText stringId="encounter.tabs.forms" fallback="Forms" />,
    key: ENCOUNTER_TAB_NAMES.FORMS,
    render: props => <EncounterProgramsPane {...props} />,
  },
  {
    label: <TranslatedText stringId="encounter.tabs.documents" fallback="Documents" />,
    key: ENCOUNTER_TAB_NAMES.DOCUMENTS,
    render: props => <DocumentsPane {...props} />,
  },
  {
    label: <TranslatedText stringId="encounter.tabs.invoicing" fallback="Invoicing" />,
    key: ENCOUNTER_TAB_NAMES.INVOICING,
    render: props => <InvoicingPane {...props} />,
    condition: getLocalisation => getLocalisation('features.enableInvoicing'),
  },
];

function getHeaderText({ encounterType }) {
  switch (encounterType) {
    case ENCOUNTER_TYPES.TRIAGE:
      return <TranslatedText stringId="encounter.type.triage" fallback="Triage" />;
    case ENCOUNTER_TYPES.OBSERVATION:
      return <TranslatedText stringId="encounter.type.observation" fallback="Active ED patient" />;
    case ENCOUNTER_TYPES.EMERGENCY:
      return <TranslatedText stringId="encounter.type.emergency" fallback="Emergency short stay" />;
    case ENCOUNTER_TYPES.ADMISSION:
      return <TranslatedText stringId="encounter.type.admission" fallback="Hospital admission" />;
    case ENCOUNTER_TYPES.CLINIC:
    case ENCOUNTER_TYPES.IMAGING:
    default:
      return (
        <TranslatedText stringId="encounter.header.patientEncounter" fallback="Patient Encounter" />
      );
  }
}

const GridColumnContainer = styled.div`
  // set min-width to 0 to stop the grid column getting bigger than it's parent
  // as grid column children default to min-width: auto @see https://www.w3.org/TR/css3-grid-layout/#min-size-auto
  min-width: 0;
`;

const StyledTabDisplay = styled(TabDisplay)`
  box-shadow: 2px 2px 25px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  border: 1px solid ${Colors.outline};
  background: white;

  .MuiTabs-root {
    margin-left: -12px;
  }

  .MuiTabs-scroller {
    border-bottom: 1px solid #ebebeb;
  }
`;

export const EncounterView = () => {
  const api = useApi();
  const query = useUrlSearchParams();
  const { getLocalisation } = useLocalisation();
  const { facility } = useAuth();
  const patient = useSelector(state => state.patient);
  const { encounter, isLoadingEncounter } = useEncounter();
  const { data: patientBillingTypeData } = useReferenceData(encounter?.patientBillingTypeId);
  const [currentTab, setCurrentTab] = useState(query.get('tab') || ENCOUNTER_TAB_NAMES.VITALS);
  const disabled = encounter?.endDate || patient.death;

  useEffect(() => {
    api.post(`user/recently-viewed-patients/${patient.id}`);
  }, [api, patient.id]);

  if (!encounter || isLoadingEncounter || patient.loading) return <LoadingIndicator />;

  const visibleTabs = TABS.filter(tab => !tab.condition || tab.condition(getLocalisation));

  return (
    <GridColumnContainer>
      <EncounterTopBar
        title={getHeaderText(encounter)}
        subTitle={encounter.location?.facility?.name}
        encounter={encounter}
      >
        {(facility.id === encounter.location.facilityId || encounter.endDate) &&
          // Hide all actions if encounter type is Vaccination or Survey Response,
          // as they should only contain 1 survey response or vaccination and discharged automatically,
          // no need to show any summaries or actions
          ![ENCOUNTER_TYPES.VACCINATION, ENCOUNTER_TYPES.SURVEY_RESPONSE].includes(
            encounter.encounterType,
          ) && <EncounterActions encounter={encounter} />}
      </EncounterTopBar>
      <EncounterInfoPane
        encounter={encounter}
        getLocalisation={getLocalisation}
        patientBillingType={patientBillingTypeData?.name}
      />
      <DiagnosisView
        encounter={encounter}
        isTriage={getIsTriage(encounter)}
        disabled={disabled}
      />
      <ContentPane>
        <StyledTabDisplay
          tabs={visibleTabs}
          currentTab={currentTab}
          onTabSelect={setCurrentTab}
          encounter={encounter}
          patient={patient}
          disabled={disabled}
        />
      </ContentPane>
    </GridColumnContainer>
  );
};
