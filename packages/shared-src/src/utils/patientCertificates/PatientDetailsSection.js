import React from 'react';
import { Col, Row, VDSImage } from './Layout';
import { P } from './Typography';
import { getDOB, getNationality, getPassportNumber } from './accessors';

const PATIENT_FIELDS = [
  { key: 'firstName', label: 'First Name' },
  { key: 'lastName', label: 'Last Name' },
  {
    key: 'dateOfBirth',
    label: 'Date Of Birth',
    accessor: getDOB,
  },
  { key: 'sex', label: 'Sex' },
  { key: 'displayId', label: 'NHN' },
  { key: 'passport', label: 'Passport Number', accessor: getPassportNumber },
  { key: 'nationality', label: 'Nationality', accessor: getNationality },
];

export const PatientDetailsSection = ({
  patient,
  getLocalisation,
  vdsSrc,
  extraFields = [],
  uvci,
}) => {
  const detailsToDisplay = [
    ...PATIENT_FIELDS.filter(({ key }) => getLocalisation(`fields.${key}.hidden`) !== true),
    ...extraFields,
  ];
  return (
    <Row>
      <Col style={{ width: '80%' }}>
        <Row>
          {detailsToDisplay.map(({ key, label: defaultLabel, accessor }) => {
            const value = (accessor ? accessor(patient, getLocalisation) : patient[key]) || '';
            const label = getLocalisation(`fields.${key}.shortLabel`) || defaultLabel;

            return (
              <Col key={key}>
                <P>{`${label}: ${value}`}</P>
              </Col>
            );
          })}
        </Row>
        {uvci && (
          <Row>
            <P>UVCI: {uvci}</P>
          </Row>
        )}
      </Col>
      <Col style={{ width: '20%' }}>{vdsSrc && <VDSImage src={vdsSrc} />}</Col>
    </Row>
  );
};
