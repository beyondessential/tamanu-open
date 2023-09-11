import React from 'react';
import { Document, Page } from '@react-pdf/renderer';

import { Table } from './Table';
import { styles, Col, Box, Row, Watermark, CertificateHeader, CertificateFooter } from './Layout';
import { PatientDetailsSection } from './PatientDetailsSection';
import { SigningSection } from './SigningSection';
import { P } from './Typography';
import { LetterheadSection } from './LetterheadSection';
import { getDisplayDate } from './getDisplayDate';

const columns = [
  {
    key: 'vaccine',
    title: 'Vaccine',
    customStyles: { minWidth: 30 },
    accessor: ({ scheduledVaccine, vaccineName }) => vaccineName || (scheduledVaccine || {}).label,
  },
  {
    key: 'vaccineBrand',
    title: 'Vaccine brand',
    customStyles: { minWidth: 30 },
    accessor: ({ scheduledVaccine, vaccineBrand }) =>
      vaccineBrand || ((scheduledVaccine || {}).vaccine || {}).name,
  },
  {
    key: 'schedule',
    title: 'Schedule',
    accessor: ({ scheduledVaccine }) => (scheduledVaccine || {}).schedule,
  },
  {
    key: 'countryName',
    title: 'Country',
    accessor: ({ countryName }) => countryName,
  },
  {
    key: 'healthFacility',
    title: 'Health facility',
    customStyles: { minWidth: 30 },
    accessor: ({ healthFacility }) => healthFacility,
  },
  {
    key: 'date',
    title: 'Date',
    accessor: ({ date }, getLocalisation) =>
      date ? getDisplayDate(date, undefined, getLocalisation) : 'Unknown',
  },
  {
    key: 'batch',
    title: 'Batch number',
    customStyles: { minWidth: 30 },
    accessor: ({ batch }) => batch,
  },
];

export const VaccineCertificate = ({
  patient,
  printedBy,
  printedDate,
  vaccinations,
  certificateId,
  signingSrc,
  watermarkSrc,
  logoSrc,
  getLocalisation,
  extraPatientFields,
}) => {
  const contactEmail = getLocalisation('templates.vaccineCertificate.emailAddress');
  const contactNumber = getLocalisation('templates.vaccineCertificate.contactNumber');
  const healthFacility = getLocalisation('templates.vaccineCertificate.healthFacility');
  const countryName = getLocalisation('country.name');

  const data = vaccinations.map(vaccination => ({ ...vaccination, countryName, healthFacility }));

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {watermarkSrc && <Watermark src={watermarkSrc} />}
        <CertificateHeader>
          <LetterheadSection
            getLocalisation={getLocalisation}
            logoSrc={logoSrc}
            certificateTitle="Vaccine Certificate"
          />
          <PatientDetailsSection
            patient={patient}
            getLocalisation={getLocalisation}
            certificateId={certificateId}
            extraFields={extraPatientFields}
          />
        </CertificateHeader>
        <Box mb={20}>
          <Table
            data={data}
            columns={columns}
            getLocalisation={getLocalisation}
            columnStyle={{ padding: '10px 5px' }}
          />
        </Box>
        <CertificateFooter>
          <Box>
            <Row>
              <Col>
                <P>
                  <P bold>Printed by: </P>
                  {printedBy}
                </P>
              </Col>
              <Col>
                <P>
                  <P bold>Printing date: </P>
                  {getDisplayDate(printedDate)}
                </P>
              </Col>
            </Row>
          </Box>
          <SigningSection signingSrc={signingSrc} />
          <Box>
            {contactEmail ? <P>Email address: {contactEmail}</P> : null}
            {contactNumber ? <P>Contact number: {contactNumber}</P> : null}
          </Box>
        </CertificateFooter>
      </Page>
    </Document>
  );
};
