import React, { useCallback } from 'react';

import { VACCINATION_CERTIFICATE } from 'shared/constants';
import { VaccineCertificate } from 'shared/utils/patientCertificates';
import { getCurrentDateString } from 'shared/utils/dateTime';

import { Modal } from '../../Modal';
import { useApi } from '../../../api';
import { EmailButton } from '../../Email/EmailButton';
import { useCertificate } from '../../../utils/useCertificate';
import { useLocalisation } from '../../../contexts/Localisation';
import { usePatientAdditionalData, useAdministeredVaccines } from '../../../api/queries';

import { PDFViewer, printPDF } from '../PDFViewer';

export const VaccineCertificateModal = React.memo(({ open, onClose, patient }) => {
  const api = useApi();
  const { getLocalisation } = useLocalisation();
  const { watermark, logo, footerImg, printedBy } = useCertificate();
  const { data: additionalData } = usePatientAdditionalData(patient.id);

  const { data: vaccineData } = useAdministeredVaccines(patient.id, {
    orderBy: 'date',
    order: 'ASC',
    invertNullDateOrdering: true,
    includeNotGiven: false,
  });
  const vaccinations = vaccineData?.data || [];

  const createVaccineCertificateNotification = useCallback(
    data => {
      api.post('certificateNotification', {
        type: VACCINATION_CERTIFICATE,
        requireSigning: false,
        patientId: patient.id,
        forwardAddress: data.email,
        createdBy: printedBy,
        createdAt: getCurrentDateString(),
      });
    },
    [api, patient.id, printedBy],
  );

  const patientData = { ...patient, additionalData };

  return (
    <Modal
      title="Vaccine Certificate"
      open={open}
      onClose={onClose}
      width="md"
      printable
      keepMounted
      onPrint={() => printPDF('vaccine-certificate')}
      additionalActions={<EmailButton onEmail={createVaccineCertificateNotification} />}
    >
      <PDFViewer id="vaccine-certificate">
        <VaccineCertificate
          patient={patientData}
          vaccinations={vaccinations}
          watermarkSrc={watermark}
          logoSrc={logo}
          signingSrc={footerImg}
          printedBy={printedBy}
          printedDate={getCurrentDateString()}
          getLocalisation={getLocalisation}
        />
      </PDFViewer>
    </Modal>
  );
});
