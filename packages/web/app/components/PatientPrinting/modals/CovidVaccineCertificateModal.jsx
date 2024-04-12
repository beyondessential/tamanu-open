import React, { useCallback } from 'react';

import { ASSET_NAMES, ICAO_DOCUMENT_TYPES } from '@tamanu/constants';
import { CovidVaccineCertificate } from '@tamanu/shared/utils/patientCertificates';
import { getCurrentDateString } from '@tamanu/shared/utils/dateTime';

import { Modal } from '../../Modal';
import { useApi } from '../../../api';
import { EmailButton } from '../../Email/EmailButton';
import { useCertificate } from '../../../utils/useCertificate';
import { useLocalisation } from '../../../contexts/Localisation';
import { useAdministeredVaccines, usePatientAdditionalDataQuery } from '../../../api/queries';

import { PDFViewer, printPDF } from '../PDFViewer';

export const CovidVaccineCertificateModal = React.memo(({ open, onClose, patient }) => {
  const api = useApi();
  const { getLocalisation } = useLocalisation();
  const { data: certificateData, isFetching: isCertificateFetching } = useCertificate({
    footerAssetName: ASSET_NAMES.COVID_VACCINATION_CERTIFICATE_FOOTER,
  });
  const { watermark, logo, footerImg, printedBy } = certificateData;
  const { data: additionalData } = usePatientAdditionalDataQuery(patient.id);

  const { data: vaccineData, isFetching: isVaccineFetching } = useAdministeredVaccines(patient.id, {
    orderBy: 'date',
    order: 'ASC',
    invertNullDateOrdering: true,
    includeNotGiven: false,
  });
  const vaccinations = vaccineData?.data.filter(vaccine => vaccine.certifiable) || [];

  const createCovidVaccineCertificateNotification = useCallback(
    data =>
      api.post('certificateNotification', {
        type: ICAO_DOCUMENT_TYPES.PROOF_OF_VACCINATION.JSON,
        requireSigning: true,
        patientId: patient.id,
        forwardAddress: data.email,
        createdBy: printedBy,
        printedDate: getCurrentDateString(),
      }),
    [api, patient.id, printedBy],
  );

  const patientData = { ...patient, additionalData };

  if (isVaccineFetching || isCertificateFetching) return null;

  return (
    <Modal
      title="COVID-19 Vaccine Certificate"
      open={open}
      onClose={onClose}
      width="md"
      printable
      keepMounted
      onPrint={() => printPDF('covid-vaccine-certificate')}
      additionalActions={<EmailButton onEmail={createCovidVaccineCertificateNotification} />}
    >
      <PDFViewer id="covid-vaccine-certificate">
        <CovidVaccineCertificate
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
