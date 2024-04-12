import React, { useState } from 'react';
import { LabRequestModal } from '../../../components/LabRequestModal';
import { EncounterLabRequestsTable } from '../EncounterLabRequestsTable';
import { ButtonWithPermissionCheck, TableButtonRow } from '../../../components';
import { PrintMultipleLabRequestsSelectionModal } from '../../../components/PatientPrinting';
import { TabPane } from '../components';
import { TranslatedText } from '../../../components/Translation/TranslatedText';

export const LabsPane = React.memo(({ encounter, readonly }) => {
  const [newRequestModalOpen, setNewRequestModalOpen] = useState(false);
  const [printRequestsModalOpen, setPrintRequestsModalOpen] = useState(false);

  return (
    <TabPane>
      <LabRequestModal
        open={newRequestModalOpen}
        encounter={encounter}
        onClose={() => setNewRequestModalOpen(false)}
      />
      <PrintMultipleLabRequestsSelectionModal
        encounter={encounter}
        open={printRequestsModalOpen}
        onClose={() => setPrintRequestsModalOpen(false)}
      />
      <TableButtonRow variant="small">
        <ButtonWithPermissionCheck
          onClick={() => setPrintRequestsModalOpen(true)}
          disabled={readonly}
          verb="read"
          noun="LabRequest"
          variant="outlined"
          color="primary"
          size="small"
        >
          <TranslatedText stringId="lab.action.print" fallback="Print" />
        </ButtonWithPermissionCheck>
        <ButtonWithPermissionCheck
          onClick={() => setNewRequestModalOpen(true)}
          disabled={readonly}
          verb="create"
          noun="LabRequest"
          size="small"
        >
          <TranslatedText stringId="lab.action.create" fallback="New lab request" />
        </ButtonWithPermissionCheck>
      </TableButtonRow>
      <EncounterLabRequestsTable encounterId={encounter.id} />
    </TabPane>
  );
});
