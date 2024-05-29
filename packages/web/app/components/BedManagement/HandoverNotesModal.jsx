import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { HandoverNotesPDF } from '@tamanu/shared/utils/handoverNotes';
import { getDisplayDate } from '@tamanu/shared/utils/patientCertificates/getDisplayDate';
import { Modal } from '../Modal';
import { useApi } from '../../api';
import { useLocalisation } from '../../contexts/Localisation';
import { useCertificate } from '../../utils/useCertificate';
import { TranslatedText } from '../Translation/TranslatedText';
import { PDFLoader, printPDF } from '../PatientPrinting/PDFLoader';

export const HandoverNotesModal = React.memo(({ area: areaId, ...props }) => {
  const { getLocalisation } = useLocalisation();
  const api = useApi();
  const { data: certificateData, isFetching: isFetchingCertificate } = useCertificate();
  const { logo, title, subTitle } = certificateData;
  const letterheadConfig = { title, subTitle };
  const modalTitle = (
    <TranslatedText
      stringId="bedManagement.modal.handoverNotes.title"
      fallback="Handover notes :date"
      replacements={{ date: getDisplayDate(new Date(), 'dd/MM/yy') }}
    />
  );

  const {
    data: { data: handoverNotes = [], locationGroup = {} } = {},
    refetch: refetchHandoverNotes,
    isFetching: isFetchingHandoverNotes,
  } = useQuery(
    ['locationGroupHandoverNotes'],
    () => areaId && api.get(`locationGroup/${areaId}/handoverNotes`),
  );

  useEffect(() => {
    if (areaId) {
      refetchHandoverNotes();
    }
  }, [refetchHandoverNotes, areaId]);

  const isLoading = isFetchingCertificate || isFetchingHandoverNotes;

  return (
    <Modal {...props} title={modalTitle} onPrint={() => printPDF('handover-notes')}>
      <PDFLoader isLoading={isLoading} id="handover-notes">
        <HandoverNotesPDF
          logoSrc={logo}
          handoverNotes={handoverNotes}
          locationGroupName={locationGroup.name}
          getLocalisation={getLocalisation}
          letterheadConfig={letterheadConfig}
        />
      </PDFLoader>
    </Modal>
  );
});
