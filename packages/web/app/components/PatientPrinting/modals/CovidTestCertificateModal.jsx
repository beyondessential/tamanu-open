import React, { useCallback, useState } from 'react';
import { CertificateTypes, CovidLabCertificate } from '@tamanu/shared/utils/patientCertificates';
import { ASSET_NAMES, ICAO_DOCUMENT_TYPES } from '@tamanu/constants';

import { Modal } from '../../Modal';
import { useApi } from '../../../api';
import { useLocalisation } from '../../../contexts/Localisation';
import { EmailButton } from '../../Email/EmailButton';
import { useCertificate } from '../../../utils/useCertificate';
import { usePatientAdditionalDataQuery } from '../../../api/queries';

import { PDFLoader, printPDF } from '../PDFLoader';
import { useCovidLabTestQuery } from '../../../api/queries/useCovidLabTestsQuery';

export const CovidTestCertificateModal = React.memo(({ patient }) => {
  const [open, setOpen] = useState(true);
  const { getLocalisation } = useLocalisation();
  const api = useApi();

  const { data: certificateData, isFetching: isCertificateFetching } = useCertificate({
    footerAssetName: ASSET_NAMES.COVID_TEST_CERTIFICATE_FOOTER,
  });
  const { watermark, logo, footerImg, printedBy } = certificateData;
  const { data: labTestsResponse, isLoading: isLabTestsLoading } = useCovidLabTestQuery(
    patient.id,
    CertificateTypes.test,
  );
  const {
    data: additionalData,
    isLoading: isAdditionalDataLoading,
  } = usePatientAdditionalDataQuery(patient.id);

  const isLoading = isLabTestsLoading || isAdditionalDataLoading || isCertificateFetching;

  const createCovidTestCertNotification = useCallback(
    data =>
      api.post('certificateNotification', {
        type: ICAO_DOCUMENT_TYPES.PROOF_OF_TESTING.JSON,
        requireSigning: false,
        patientId: patient.id,
        forwardAddress: data.email,
        createdBy: printedBy,
      }),
    [api, patient.id, printedBy],
  );

  const patientData = { ...patient, additionalData };

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      width="md"
      printable
      onPrint={() => printPDF('test-certificate')}
      additionalActions={<EmailButton onEmail={createCovidTestCertNotification} />}
    >
      <PDFLoader isLoading={isLoading} id="test-certificate">
        <CovidLabCertificate
          patient={patientData}
          labs={labTestsResponse?.data}
          watermarkSrc={watermark}
          signingSrc={footerImg}
          logoSrc={logo}
          getLocalisation={getLocalisation}
          printedBy={printedBy}
          certType={CertificateTypes.test}
        />
      </PDFLoader>
    </Modal>
  );
});
