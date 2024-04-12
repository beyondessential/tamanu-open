import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { createDummyPatient, createDummyPatientAdditionalData } from '@tamanu/shared/demoData';
import { VaccineCertificate as Component } from '@tamanu/shared/utils/patientCertificates';
import { PDFViewer } from '@react-pdf/renderer';
import SigningImage from '../assets/signing-image.png';
import Watermark from '../assets/watermark.png';
import Logo from '../assets/tamanu-logo.png';

export default {
  title: 'pdfs/VaccineCertificate',
  component: Component,
};

const dummyPatient = createDummyPatient();
const dummyAdditionalData = createDummyPatientAdditionalData();

const patient = {
  ...dummyPatient,
  ...dummyAdditionalData,
};

const vdsData = {
  hdr: { is: 'UTO', t: 'icao.vacc', v: 1 },
  msg: { uvci: '4ag7mhr81u90', vaxx: 'data' },
  sig: {
    alg: 'ES256',
    cer:
      'MIIBfzCCASSgAwIBAgICA-kwCgYIKoZIzj0EAwIwGzEZMAkGA1UEBhMCVVQwDAYDVQQDDAVVVCBDQTAeFw0yMjAyMjgwNDM4NTlaFw0yMjA2MDEwNTM4NTlaMBgxFjAJBgNVBAYTAlVUMAkGA1UEAxMCVEEwWTATBgcqhkjOPQIBBggqhkjOPQMBBwNCAAQYoJ0WkOC60kG1xS7tGqVGNTmsoURKr2NWzMh6HZv3Zl5nq97-sD8q9_6JM-SyLmDh4b1g_t98aD-L3v5RTlIHo1swWTAnBgNVHSMBAf8EHTAbgBQBov7Y-IocFwj1UlYXU6buFiz3A6EAggEBMBoGB2eBCAEBBgIEDzANAgEAMQgTAk5UEwJOVjASBgNVHSUECzAJBgdngQgBAQ4CMAoGCCqGSM49BAMCA0kAMEYCIQD4qnBz7amUmmg0AgfdlqT0ItnsZ_X8cPYJRqZuBaZG5AIhAKUqdrxDYTKIbZ01ZTFaXGJFXXxaHr5DmuWWoeaUEYkO',
    sigvl:
      'MEUCID6xG4DJpb3wQyHSRwTCVBdUP5YA4noGkTtinl4sSDO6AiEAhQfb36wrFDhVh6uFLph2siKJtothMIz0DebzZIR7nZU',
  },
};

const getLocalisation = key => {
  const config = {
    'templates.letterhead.title': 'TAMANU MINISTRY OF HEALTH & MEDICAL SERVICES',
    'templates.letterhead.subTitle': 'PO Box 12345, Melbourne, Australia',
    'templates.vaccineCertificate.emailAddress': 'tamanu@health.govt',
    'templates.vaccineCertificate.contactNumber': '123456',
    'fields.firstName.longLabel': 'First Name',
    'fields.lastName.longLabel': 'Last Name',
    'fields.dateOfBirth.longLabel': 'Date of Birth',
    'fields.sex.longLabel': 'Sex',
    previewUvciFormat: 'tamanu',
  };
  return config[key];
};

const examiner = {
  id: '6b1269ff-2443-4381-a532-ddd48fbd5020',
  email: 'admin@tamanu.io',
  displayName: 'Initial Admin',
  role: 'admin',
  createdAt: '2022-01-20T22:48:47.375Z',
  updatedAt: '2022-02-21T01:02:40.347Z',
};

const vaccinations = [
  {
    id: '2f27fd7a-e954-4d28-82e9-f64d7b0b5978',
    batch: '123',
    status: 'GIVEN',
    injectionSite: 'Left arm',
    date: '2022-02-21T01:05:14.118Z',
    createdAt: '2022-02-21T01:05:29.498Z',
    updatedAt: '2022-02-21T01:06:00.461Z',
    encounterId: 'e498c326-850b-4d14-8716-0e742d5fb379',
    scheduledVaccineId: 'e5813cff-51d2-4ae8-a30e-3c60332880db',
    encounter: {
      id: 'e498c326-850b-4d14-8716-0e742d5fb379',
      encounterType: 'admission',
      startDate: '2022-02-03T02:03:04.750Z',
      endDate: null,
      reasonForEncounter: null,
      deviceId: null,
      createdAt: '2022-02-03T02:03:21.849Z',
      updatedAt: '2022-02-21T01:06:00.456Z',
      patientId: 'e0f2557f-254f-4d52-8376-39f2fcacfe52',
      examinerId: '6b1269ff-2443-4381-a532-ddd48fbd5020',
      locationId: 'location-ClinicalTreatmentRoom',
      departmentId: 'ref/department/ANTENATAL',
      vitals: [],
      department: {
        id: 'ref/department/ANTENATAL',
        code: 'ANTENATAL',
        name: 'Antenatal',
        createdAt: '2022-01-20T22:51:24.384Z',
        updatedAt: '2022-01-23T21:54:25.135Z',
        facilityId: 'ref/facility/ba',
      },
      location: {
        id: 'location-ClinicalTreatmentRoom',
        code: 'ClinicalTreatmentRoom',
        name: 'Clinical Treatment Room',
        createdAt: '2022-01-20T22:51:24.738Z',
        updatedAt: '2022-01-23T21:56:27.340Z',
      },
      examiner,
    },
    scheduledVaccine: {
      id: 'e5813cff-51d2-4ae8-a30e-3c60332880db',
      category: 'Campaign',
      label: 'COVID-19 Pfizer',
      schedule: 'Dose 1',
      weeksFromBirthDue: null,
      weeksFromLastVaccinationDue: null,
      index: 1,
      createdAt: '2022-01-20T22:51:25.251Z',
      updatedAt: '2022-01-23T21:56:27.437Z',
      vaccineId: 'drug-COVID-19-Pfizer',
    },
    certifiable: true,
  },
];

export const VaccineCertificate = () => {
  const [vdsSrc, setVdsSrc] = useState();

  useEffect(() => {
    (async () => {
      const src = await QRCode.toDataURL(JSON.stringify(vdsData));
      setVdsSrc(src);
    })();
  }, []);

  return (
    <PDFViewer width={800} height={1000} showToolbar={false}>
      <Component
        patient={patient}
        vaccinations={vaccinations}
        watermarkSrc={Watermark}
        signingSrc={SigningImage}
        logoSrc={Logo}
        vdsSrc={vdsSrc}
        getLocalisation={getLocalisation}
      />
    </PDFViewer>
  );
};
