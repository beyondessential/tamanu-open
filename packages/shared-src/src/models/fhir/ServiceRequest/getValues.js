import config from 'config';

import { getNotePagesWithType } from '../../../utils/notePages';
import {
  FhirAnnotation,
  FhirCodeableConcept,
  FhirCoding,
  FhirIdentifier,
  FhirReference,
} from '../../../services/fhirTypes';
import {
  FHIR_REQUEST_INTENT,
  FHIR_REQUEST_PRIORITY,
  FHIR_REQUEST_STATUS,
  IMAGING_REQUEST_STATUS_TYPES,
  LAB_REQUEST_STATUSES,
  NOTE_TYPES,
} from '../../../constants';
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
    occurrenceDateTime: formatFhirDate(upstream.requestedDate),
    requester: new FhirReference({
      display: upstream.requestedBy.displayName,
    }),
    locationCode: locationCode(upstream),
    note: imagingAnnotations(upstream),
  };
}

async function getValuesFromLabRequest(upstream) {
  return {
    lastUpdated: new Date(),
    contained: labContained(upstream),
    identifier: [
      new FhirIdentifier({
        system: config.hl7.dataDictionaries.serviceRequestImagingId,
        value: upstream.id,
      }),
      new FhirIdentifier({
        system: config.hl7.dataDictionaries.serviceRequestImagingDisplayId,
        value: upstream.display_id,
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
    priority: validatePriority(upstream.priority),
    code: labCode(upstream),
    orderDetail: labOrderDetails(upstream),
    subject: new FhirReference({
      type: 'upstream://patient',
      reference: upstream.encounter.patient.id,
      display: `${upstream.encounter.patient.firstName} ${upstream.encounter.patient.lastName}`,
    }),
    encounter: new FhirReference({
      reference: `Encounter/${upstream.encounter.id}`,
    }),
    occurrenceDateTime: formatFhirDate(upstream.requestedDate),
    requester: new FhirReference({
      reference: `Practitioner/${upstream.requestedBy.id}`,
      display: upstream.requestedBy.displayName,
    }),
    note: labAnnotations(upstream),
  };
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

function validatePriority(priority) {
  if (!priority) {
    // default to routine when we don't have a priority in Tamanu
    return FHIR_REQUEST_PRIORITY.ROUTINE;
  }

  if (!Object.values(FHIR_REQUEST_PRIORITY).includes(priority)) {
    throw new Exception(`Invalid priority: ${priority}`);
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
  if (!labTestPanelRequest) throw new Error('No lab test panel request specified.');
  const { externalCode, name } = labTestPanelRequest.labTestPanel;
  if (!externalCode) throw new Error('No external code specified for this lab test panel.');

  return new FhirCodeableConcept({
    coding: [
      new FhirCoding({
        system: 'http://intersystems.com/fhir/extn/sda3/lib/code-table-translated-prior-codes',
        code: externalCode,
        display: name,
      }),
    ],
  });
}

function labContained(upstream) {
  return [
    {
      resourceType: 'Specimen',
      collection: {
        collectedDateTime: formatFhirDate(upstream.sampleTime),
      },
    },
  ];
}

function labOrderDetails(upstream) {
  return upstream.tests.map(test => {
    if (!test) throw new Exception('Received a null test');

    const { externalCode, name } = test.labTestType;
    if (!externalCode) throw new Error('No external code specified for this lab test type.');

    return new FhirCodeableConcept({
      coding: [
        new FhirCoding({
          system: 'http://intersystems.com/fhir/extn/sda3/lib/code-table-translated-prior-codes',
          code: externalCode,
          display: name,
        }),
      ],
    });
  });
}

function labAnnotations(upstream) {
  return upstream.notePages.map(notePage => {
    return new FhirAnnotation({
      time: formatFhirDate(notePage.date),
      text: notePage.noteItems.map(noteItem => noteItem.content).join('\n\n'),
    });
  });
}

function imagingAnnotations(upstream) {
  // See EPI-451: imaging requests can embed notes about the area to image
  return getNotePagesWithType(upstream.notePages, NOTE_TYPES.OTHER).map(
    np =>
      new FhirAnnotation({
        time: formatFhirDate(np.date),
        text: np.noteItems.map(ni => ni.content).join('\n\n'),
      }),
  );
}
