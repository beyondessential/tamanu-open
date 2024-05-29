import config from 'config';

import {
  FHIR_REQUEST_INTENT,
  FHIR_REQUEST_PRIORITY,
  FHIR_REQUEST_STATUS,
  IMAGING_REQUEST_STATUS_TYPES,
  LAB_REQUEST_STATUSES,
  NOTE_TYPES,
} from '@tamanu/constants';

import { getNotesWithType } from '../../../utils/notes';
import {
  FhirAnnotation,
  FhirCodeableConcept,
  FhirCoding,
  FhirIdentifier,
  FhirReference,
} from '../../../services/fhirTypes';
import { Exception, formatFhirDate } from '../../../utils/fhir';

export async function getValues(upstream, models) {
  const { ImagingRequest, LabRequest } = models;

  if (upstream instanceof ImagingRequest) return getValuesFromImagingRequest(upstream, models);
  if (upstream instanceof LabRequest) return getValuesFromLabRequest(upstream);
  throw new Error(`Invalid upstream type for service request ${upstream.constructor.name}`);
}

async function getValuesFromImagingRequest(upstream, models) {
  const { ImagingAreaExternalCode } = models;

  const areaExtCodes = new Map(
    (
      await ImagingAreaExternalCode.findAll({
        where: {
          areaId: upstream.areas.map(area => area.id),
        },
      })
    ).map(ext => [
      ext.areaId,
      { code: ext.code, description: ext.description, updatedAt: ext.updatedAt },
    ]),
  );

  return {
    lastUpdated: new Date(),
    identifier: [
      new FhirIdentifier({
        system: config.hl7.dataDictionaries.serviceRequestImagingId,
        value: upstream.id,
      }),
      new FhirIdentifier({
        system: config.hl7.dataDictionaries.serviceRequestImagingDisplayId,
        value: upstream.displayId,
      }),
    ],
    status: statusFromImagingRequest(upstream),
    intent: FHIR_REQUEST_INTENT.ORDER._,
    category: [
      new FhirCodeableConcept({
        coding: [
          new FhirCoding({
            system: 'http://snomed.info/sct',
            code: '363679005',
          }),
        ],
      }),
    ],
    priority: validatePriority(upstream.priority),
    code: imagingCode(upstream),
    orderDetail: upstream.areas.flatMap(({ id }) =>
      areaExtCodes.has(id)
        ? [
          new FhirCodeableConcept({
            text: areaExtCodes.get(id)?.description,
            coding: [
              new FhirCoding({
                code: areaExtCodes.get(id)?.code,
                system: config.hl7.dataDictionaries.areaExternalCode,
              }),
            ],
          }),
        ]
        : [],
    ),
    subject: new FhirReference({
      type: 'upstream://patient',
      reference: upstream.encounter.patient.id,
      display: `${upstream.encounter.patient.firstName} ${upstream.encounter.patient.lastName}`,
    }),
    encounter: new FhirReference({
      type: 'upstream://encounter',
      reference: upstream.encounter.id,
    }),
    occurrenceDateTime: formatFhirDate(upstream.requestedDate),
    requester: new FhirReference({
      type: 'upstream://practitioner',
      reference: upstream.requestedBy.id,
    }),
    locationCode: locationCode(upstream),
    note: imagingAnnotations(upstream),
  };
}

async function getValuesFromLabRequest(upstream) {
  return {
    lastUpdated: new Date(),
    identifier: [
      new FhirIdentifier({
        system: config.hl7.dataDictionaries.serviceRequestLabId,
        value: upstream.id,
      }),
      new FhirIdentifier({
        system: config.hl7.dataDictionaries.serviceRequestLabDisplayId,
        value: upstream.displayId,
      }),
    ],
    status: statusFromLabRequest(upstream),
    intent: FHIR_REQUEST_INTENT.ORDER._,
    category: [
      new FhirCodeableConcept({
        coding: [
          new FhirCoding({
            system: 'http://snomed.info/sct',
            code: '108252007',
          }),
        ],
      }),
    ],
    priority: validatePriority(upstream.priority?.name),
    code: labCode(upstream),
    orderDetail: await labOrderDetails(upstream),
    subject: new FhirReference({
      type: 'upstream://patient',
      reference: upstream.encounter.patient.id,
      display: `${upstream.encounter.patient.firstName} ${upstream.encounter.patient.lastName}`,
    }),
    encounter: new FhirReference({
      type: 'upstream://encounter',
      reference: upstream.encounter.id,
    }),
    occurrenceDateTime: formatFhirDate(upstream.requestedDate),
    requester: new FhirReference({
      type: 'upstream://practitioner',
      reference: upstream.requestedBy.id,
    }),
    note: labAnnotations(upstream),
    specimen: resolveSpecimen(upstream),
  };
}

function resolveSpecimen(upstream) {
  if (!upstream.specimenAttached) {
    return null;
  }
  return new FhirReference({
    type: 'upstream://specimen',
    reference: upstream.id,
  });
}

function imagingCode(upstream) {
  const { imagingTypes } = config.localisation.data;
  if (!imagingTypes) throw new Exception('No imaging types specified in localisation.');

  const { imagingType } = upstream;
  const { label } = imagingTypes[imagingType] || {};
  if (!label) throw new Exception(`No label matching imaging type ${imagingType} in localisation.`);

  return new FhirCodeableConcept({
    text: label,
  });
}

// Match the priority to a FHIR ServiceRequest priority where possible
// otherwise return null
// See: https://hl7.org/fhir/R4B/valueset-request-priority.html#expansion
function validatePriority(priority) {
  if (!Object.values(FHIR_REQUEST_PRIORITY).includes(priority)) {
    return null;
  }
  return priority;
}

function locationCode(upstream) {
  const facility =
    upstream.locationGroup?.facility ?? // most accurate
    upstream.location?.facility ?? // legacy data
    upstream.encounter?.location?.facility; // fallback to encounter
  if (!facility) return [];

  return [
    new FhirCodeableConcept({
      text: facility.name,
    }),
  ];
}

function statusFromImagingRequest(upstream) {
  return (
    {
      [IMAGING_REQUEST_STATUS_TYPES.CANCELLED]: FHIR_REQUEST_STATUS.REVOKED,
      [IMAGING_REQUEST_STATUS_TYPES.COMPLETED]: FHIR_REQUEST_STATUS.COMPLETED,
      [IMAGING_REQUEST_STATUS_TYPES.DELETED]: FHIR_REQUEST_STATUS.REVOKED,
      [IMAGING_REQUEST_STATUS_TYPES.ENTERED_IN_ERROR]: FHIR_REQUEST_STATUS.ENTERED_IN_ERROR,
      [IMAGING_REQUEST_STATUS_TYPES.IN_PROGRESS]: FHIR_REQUEST_STATUS.ACTIVE,
      [IMAGING_REQUEST_STATUS_TYPES.PENDING]: FHIR_REQUEST_STATUS.DRAFT,
    }[upstream.status] ?? FHIR_REQUEST_STATUS.UNKNOWN
  );
}

function statusFromLabRequest(upstream) {
  switch (upstream.status) {
    case LAB_REQUEST_STATUSES.SAMPLE_NOT_COLLECTED:
    case LAB_REQUEST_STATUSES.RECEPTION_PENDING:
      return FHIR_REQUEST_STATUS.DRAFT;
    case LAB_REQUEST_STATUSES.RESULTS_PENDING:
    case LAB_REQUEST_STATUSES.TO_BE_VERIFIED:
    case LAB_REQUEST_STATUSES.VERIFIED:
      return FHIR_REQUEST_STATUS.ACTIVE;
    case LAB_REQUEST_STATUSES.PUBLISHED:
      return FHIR_REQUEST_STATUS.COMPLETED;
    case LAB_REQUEST_STATUSES.CANCELLED:
    case LAB_REQUEST_STATUSES.DELETED:
      return FHIR_REQUEST_STATUS.REVOKED;
    case LAB_REQUEST_STATUSES.ENTERED_IN_ERROR:
      return FHIR_REQUEST_STATUS.ENTERED_IN_ERROR;
    default:
      return FHIR_REQUEST_STATUS.UNKNOWN;
  }
}

function labCode(upstream) {
  const { labTestPanelRequest } = upstream;

  // ServiceRequests may not have a panel
  if (!labTestPanelRequest) {
    return null;
  }
  const { externalCode, name, code } = labTestPanelRequest.labTestPanel;
  return generateCodings(
    code,
    externalCode,
    name,
    config.hl7.dataDictionaries.serviceRequestLabPanelCodeSystem,
    config.hl7.dataDictionaries.serviceRequestLabPanelExternalCodeSystem
  );
}

function labOrderDetails({ tests }) {
  if (tests.length) {
    return tests.map(({ labTestType }) => {
      if (!labTestType) throw new Exception('Received a null test');

      const { externalCode, code, name } = labTestType;

      return generateCodings(
        code,
        externalCode,
        name,
        config.hl7.dataDictionaries.serviceRequestLabTestCodeSystem,
        config.hl7.dataDictionaries.serviceRequestLabTestExternalCodeSystem
      );
    });
  }
  return [];
}

function labAnnotations(upstream) {
  return upstream.notes.map(note => {
    return new FhirAnnotation({
      time: formatFhirDate(note.date),
      text: note.content,
    });
  });
}

function imagingAnnotations(upstream) {
  // See EPI-451: imaging requests can embed notes about the area to image
  return getNotesWithType(upstream.notes, NOTE_TYPES.OTHER).map(
    note =>
      new FhirAnnotation({
        time: formatFhirDate(note.date),
        text: note.content,
      }),
  );
}

function generateCodings(code, externalCode, name, codeSystem, externalCodeSystem) {
  const coding = [];
  if (code) {
    coding.push(
      new FhirCoding({
        system: codeSystem,
        code,
        display: name,
      }),
    );
  }

  // Sometimes externalCode will not exists but if it does include it
  if (externalCode) {
    coding.push(
      new FhirCoding({
        system: externalCodeSystem,
        code: externalCode,
        display: name,
      }),
    )
  }
  if (coding.length > 0) {
    return new FhirCodeableConcept({
      coding,
      text: name,
    });
  }
  return null;
}