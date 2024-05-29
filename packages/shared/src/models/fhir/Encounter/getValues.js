import config from 'config';
import { addSeconds, parseISO } from 'date-fns';

import {
  ENCOUNTER_TYPES,
  FHIR_ENCOUNTER_CLASS_CODE,
  FHIR_ENCOUNTER_CLASS_DISPLAY,
  FHIR_ENCOUNTER_LOCATION_STATUS,
  FHIR_ENCOUNTER_STATUS,
  FHIR_LOCATION_PHYSICAL_TYPE_CODE,
  FHIR_LOCATION_PHYSICAL_TYPE_DISPLAY,
} from '@tamanu/constants';
import {
  FhirCodeableConcept,
  FhirCoding,
  FhirEncounterLocation,
  FhirPeriod,
  FhirReference,
} from '../../../services/fhirTypes';
import { formatFhirDate } from '../../../utils/fhir';

export async function getValues(upstream, models) {
  const { Encounter } = models;

  if (upstream instanceof Encounter) return getValuesFromEncounter(upstream, models);
  throw new Error(`Invalid upstream type for encounter ${upstream.constructor.name}`);
}

async function getValuesFromEncounter(upstream) {
  return {
    lastUpdated: new Date(),
    status: status(upstream),
    class: classification(upstream),
    actualPeriod: period(upstream),
    subject: subjectRef(upstream),
    location: locationRef(upstream),
    serviceProvider: await serviceProviderRef(upstream),
  };
}

function status(encounter) {
  if (encounter.discharge) {
    return FHIR_ENCOUNTER_STATUS.DISCHARGED;
  }

  return FHIR_ENCOUNTER_STATUS.IN_PROGRESS;
}

function classification(encounter) {
  const code = classificationCode(encounter);
  if (!code) return [];

  return [
    new FhirCodeableConcept({
      coding: [
        new FhirCoding({
          system: config.hl7.dataDictionaries.encounterClass,
          code,
          display: FHIR_ENCOUNTER_CLASS_DISPLAY[code] ?? null,
        }),
      ],
    }),
  ];
}

function classificationCode({ encounterType }) {
  switch (encounterType) {
    case ENCOUNTER_TYPES.ADMISSION:
    case ENCOUNTER_TYPES.CLINIC:
    case ENCOUNTER_TYPES.IMAGING:
      return FHIR_ENCOUNTER_CLASS_CODE.IMP;

    case ENCOUNTER_TYPES.EMERGENCY:
    case ENCOUNTER_TYPES.TRIAGE:
      return FHIR_ENCOUNTER_CLASS_CODE.EMER;

    case ENCOUNTER_TYPES.OBSERVATION:
      return FHIR_ENCOUNTER_CLASS_CODE.OBSENC;

    case ENCOUNTER_TYPES.SURVEY_RESPONSE:
    case ENCOUNTER_TYPES.VACCINATION:
    default:
      return null; // these should be filtered out (TODO EPI-452)
  }
}

function period(encounter) {
  const start = parseISO(encounter.startDate);
  let end = encounter.endDate;
  if (end) {
    end = parseISO(end);
    if (end <= start) {
      // should never happen in real usage, but test, imported, or migrated data
      // may do this; in that case satisfy Period's requirement that end > start.
      end = addSeconds(start, 1);
    }
  }

  return new FhirPeriod({
    start: formatFhirDate(start),
    end: end ? formatFhirDate(end) : null,
  });
}

function subjectRef(encounter) {
  return new FhirReference({
    type: 'upstream://patient',
    reference: encounter.patient.id,
    display: `${encounter.patient.firstName} ${encounter.patient.lastName}`,
  });
}

const { BED, WARD } = FHIR_LOCATION_PHYSICAL_TYPE_CODE;

function locationRef(encounter) {
  return [
    new FhirEncounterLocation({
      location: new FhirReference({
        display: encounter.location.locationGroup.name,
        id: encounter.location.locationGroup.id,
      }),
      status: FHIR_ENCOUNTER_LOCATION_STATUS.ACTIVE,
      physicalType: new FhirCodeableConcept({
        coding: [
          {
            system: config.hl7.dataDictionaries.locationPhysicalType,
            code: WARD,
            display: FHIR_LOCATION_PHYSICAL_TYPE_DISPLAY[WARD],
          },
        ],
      }),
    }),
    new FhirEncounterLocation({
      location: new FhirReference({
        display: encounter.location.name,
        id: encounter.location.id,
      }),
      status: FHIR_ENCOUNTER_LOCATION_STATUS.ACTIVE,
      physicalType: new FhirCodeableConcept({
        coding: [
          {
            system: config.hl7.dataDictionaries.locationPhysicalType,
            code: BED,
            display: FHIR_LOCATION_PHYSICAL_TYPE_DISPLAY[BED],
          },
        ],
      }),
    }),
  ];
}

async function serviceProviderRef(encounter) {
  const { facility } =  encounter.location;
  if (!facility) {
    return null;
  }

  return new FhirReference({
    type: 'upstream://organization',
    reference: facility.id,
    display: facility.name,
  });
}
