import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@tanstack/react-query';

import { Modal } from '../../Modal';
import { useCertificate } from '../../../utils/useCertificate';
import { useApi } from '../../../api';
import { Colors } from '../../../constants';

import { PDFLoader, printPDF } from '../PDFLoader';
import { useLocalisation } from '../../../contexts/Localisation';
import { useTranslation } from '../../../contexts/Translation';
import { MultipleLabRequestsPrintout } from '@tamanu/shared/utils/patientCertificates';
import { TranslatedText } from '../../Translation/TranslatedText';

export const MultipleLabRequestsPrintoutModal = ({ encounter, labRequests, open, onClose }) => {
  const api = useApi();
  const { getLocalisation } = useLocalisation();
  const { getTranslation } = useTranslation();
  const { data: certificateData, isFetching: isCertificateFetching } = useCertificate();

  const { data: patient, isLoading: isPatientLoading } = useQuery(
    ['patient', encounter.patientId],
    () => api.get(`patient/${encodeURIComponent(encounter.patientId)}`),
  );

  const { data: additionalData, isLoading: isAdditionalDataLoading } = useQuery(
    ['additionalData', encounter.patientId],
    () => api.get(`patient/${encodeURIComponent(encounter.patientId)}/additionalData`),
  );

  const { data: village = {}, isLoading: isVillageQueryLoading } = useQuery(
    ['village', encounter.patientId],
    () => api.get(`referenceData/${encodeURIComponent(patient.villageId)}`),
    {
      enabled: !!patient?.villageId,
    },
  );

  const isVillageLoading = isVillageQueryLoading && !!patient?.villageId;
  const isLoading =
    isPatientLoading || isAdditionalDataLoading || isVillageLoading || isCertificateFetching;

  return (
    <Modal
      title={
        <TranslatedText stringId="lab.modal.printMultiple.title" fallback="Print lab requests" />
      }
      width="md"
      open={open}
      onClose={onClose}
      color={Colors.white}
      printable
      onPrint={() => printPDF('lab-request-printout')}
    >
      <PDFLoader isLoading={isLoading} id="lab-request-printout">
        <MultipleLabRequestsPrintout
          certificateData={certificateData}
          patientData={{ ...patient, additionalData, village }}
          encounter={encounter}
          labRequests={labRequests}
          getLocalisation={getLocalisation}
          getTranslation={getTranslation}
        />
      </PDFLoader>
    </Modal>
  );
};

MultipleLabRequestsPrintoutModal.propTypes = {
  encounter: PropTypes.object.isRequired,
  labRequests: PropTypes.array.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
