import React from 'react';
import { getDisplayDate } from 'shared/utils/patientCertificates/getDisplayDate';
import { Divider } from 'shared/utils/handoverNotes/Divider';
import { Col, Row } from '../patientCertificates/Layout';
import { P } from '../patientCertificates/Typography';
import { getName, getSex, getDOB } from './accessors';

const PATIENT_FIELDS = [
  { key: 'name', label: 'Patient Name', accessor: getName, percentageWidth: 40 },
  { key: 'displayId', label: 'Patient ID', percentageWidth: 40 },
  {
    key: 'dateOfBirth',
    label: 'DOB',
    accessor: getDOB,
    percentageWidth: 20,
  },
  { key: 'sex', label: 'Sex', accessor: getSex, percentageWidth: 40 },
];

const ValueDisplay = ({ width, title, value }) => (
  <Col style={{ width }}>
    <P mb={5} style={{ fontSize: 10 }}>
      <P style={{ fontSize: 10 }} bold>
        {title}:
      </P>{' '}
      {value}
    </P>
  </Col>
);

export const HandoverPatient = ({
  patient,
  location,
  arrivalDate,
  diagnosis,
  notes,
  getLocalisation,
  createdAt,
}) => {
  const detailsToDisplay = PATIENT_FIELDS.filter(
    ({ key }) => !getLocalisation(`fields.${key}.hidden`),
  );
  return (
    <>
      <Row style={{ width: '100%', marginBottom: 40 }}>
        <Col style={{ width: '100%' }}>
          <Row>
            {detailsToDisplay.map(
              ({ key, label: defaultLabel, accessor, percentageWidth = 33 }) => {
                const value = (accessor ? accessor(patient, getLocalisation) : patient[key]) || '';
                const label = defaultLabel || getLocalisation(`fields.${key}.shortLabel`);

                return (
                  <ValueDisplay
                    key={key}
                    width={`${percentageWidth}%`}
                    title={label}
                    value={value}
                  />
                );
              },
            )}
            <ValueDisplay width="40%" title="Location" value={location} />
            <ValueDisplay
              width="20%"
              title="Arrival date"
              value={getDisplayDate(arrivalDate, 'dd/MM/yy')}
            />
          </Row>
          {diagnosis && <ValueDisplay width="100%" title="Diagnosis" value={diagnosis} />}
          {notes && (
            <Row>
              <ValueDisplay width="100%" title="Notes" value={notes} />
              {createdAt && (
                <Col style={{ width: '100%' }}>
                  <P style={{ fontSize: 8 }}>{getDisplayDate(createdAt, 'dd/MM/yyyy hh:mm a')}</P>
                </Col>
              )}
            </Row>
          )}
        </Col>
      </Row>
      <Divider />
    </>
  );
};
