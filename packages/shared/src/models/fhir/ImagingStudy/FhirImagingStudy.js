import config from 'config';
import { DataTypes } from 'sequelize';
import * as yup from 'yup';

import {
  FHIR_IMAGING_STUDY_STATUS,
  FHIR_INTERACTIONS,
  FHIR_ISSUE_TYPE,
  IMAGING_REQUEST_STATUS_TYPES,
  NOTE_TYPES,
} from '@tamanu/constants';
import { FhirResource } from '../Resource';

import { FhirAnnotation, FhirIdentifier, FhirReference } from '../../../services/fhirTypes';
import { Deleted, Invalid } from '../../../utils/fhir';
import { getCurrentDateTimeString, toDateTimeString } from '../../../utils/dateTime';

export class FhirImagingStudy extends FhirResource {
  static init(options, models) {
    super.init(
      {
        identifier: DataTypes.JSONB,
        basedOn: DataTypes.JSONB,
        started: DataTypes.TEXT,
        status: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        note: DataTypes.JSONB,
      },
      options,
    );

    // it's not materialised yet. TBD in EPI-224
    this.UpstreamModels = [models.ImagingResult];
  }

  static CAN_DO = new Set([FHIR_INTERACTIONS.TYPE.CREATE]);

  static get INTAKE_SCHEMA() {
    return yup.object({
      identifier: yup.array().of(FhirIdentifier.asYup()),
      basedOn: yup.array().of(FhirReference.asYup()),
      started: yup.string().optional(),
      status: yup.string().required(),
      note: yup.array().of(FhirAnnotation.asYup()),
    });
  }

  // This is currently very hardcoded for Aspen's use case.
  // We'll need to make it more generic at some point, but not today!
  async pushUpstream({ requesterId }) {
    const { FhirServiceRequest, ImagingRequest } = this.sequelize.models;
    const serviceRequestFhirId = this.basedOn
      .map(ref => ref.fhirTypeAndId())
      .filter(Boolean)
      .find(({ type }) => type === 'ServiceRequest')?.id;
    const serviceRequestId = this.basedOn.find(
      b =>
        b?.type === 'ServiceRequest' &&
        b?.identifier?.system === config.hl7.dataDictionaries.serviceRequestImagingId,
    )?.identifier.value;
    const serviceRequestDisplayId = this.basedOn.find(
      b =>
        b?.type === 'ServiceRequest' &&
        b?.identifier?.system === config.hl7.dataDictionaries.serviceRequestImagingDisplayId,
    )?.identifier.value;

    let upstreamRequest;
    if (serviceRequestId) {
      upstreamRequest = await ImagingRequest.findByPk(serviceRequestId);
    } else if (serviceRequestDisplayId) {
      upstreamRequest = await ImagingRequest.findOne({
        where: { displayId: serviceRequestDisplayId },
      });
    }

    let serviceRequest;
    if (upstreamRequest) {
      // serviceRequest will always be searched if the upstream record is found
      serviceRequest = await FhirServiceRequest.findOne({
        where: { upstreamId: upstreamRequest.id },
      });
    } else if (serviceRequestFhirId) {
      serviceRequest = await FhirServiceRequest.findByPk(serviceRequestFhirId);
    }

    if (!serviceRequest) {
      const failedId = serviceRequestFhirId || serviceRequestId || serviceRequestDisplayId;
      if (failedId) {
        throw new Invalid(`ServiceRequest ${failedId} does not exist in Tamanu`, {
          code: FHIR_ISSUE_TYPE.INVALID.VALUE,
        });
      }

      throw new Invalid('Need to have basedOn field that includes a Tamanu identifier', {
        code: FHIR_ISSUE_TYPE.INVALID.STRUCTURE,
      });
    }

    if (![
      FHIR_IMAGING_STUDY_STATUS.AVAILABLE,
      FHIR_IMAGING_STUDY_STATUS.FINAL_INVALID_LEGACY,
      FHIR_IMAGING_STUDY_STATUS.CANCELLED
    ].includes(this.status)) {
      throw new Invalid(`ImagingStudy status must be either '${FHIR_IMAGING_STUDY_STATUS.AVAILABLE}' or '${FHIR_IMAGING_STUDY_STATUS.CANCELLED}'`, {
        code: FHIR_ISSUE_TYPE.INVALID.VALUE,
      });
    }

    const imagingRequest = await ImagingRequest.findByPk(serviceRequest.upstreamId);
    if (!imagingRequest || imagingRequest.status === IMAGING_REQUEST_STATUS_TYPES.DELETED) {
      // this is only a possibility when using a FHIR basedOn reference
      throw new Deleted('ImagingRequest has been deleted');
    }

    if ([
      IMAGING_REQUEST_STATUS_TYPES.CANCELLED,
      IMAGING_REQUEST_STATUS_TYPES.ENTERED_IN_ERROR,
    ].includes(imagingRequest.status)) {
      throw new Invalid('ImagingRequest has been cancelled');
    }

    if ([
      FHIR_IMAGING_STUDY_STATUS.AVAILABLE,
      FHIR_IMAGING_STUDY_STATUS.FINAL_INVALID_LEGACY,
    ].includes(this.status)) {
      return await this.attachResults(imagingRequest);
    }

    if (this.status === FHIR_IMAGING_STUDY_STATUS.CANCELLED) {
      return await this.cancelRequest(imagingRequest, requesterId);
    }
  }

  async cancelRequest(imagingRequest, requesterId) {
    const reasons = config.localisation?.data?.imagingCancellationReasons || [];
    const cancelledReason = reasons.find(reason => reason.value === 'cancelled-externally')?.label;
    imagingRequest.set({
      status: IMAGING_REQUEST_STATUS_TYPES.CANCELLED,
      reasonForCancellation: cancelledReason,
    });
    await this.sequelize.transaction(async () => {
      await imagingRequest.createNote({
        noteType: NOTE_TYPES.OTHER,
        content: `Request cancelled. Reason: ${cancelledReason}.`,
        authorId: requesterId,
      });
      await imagingRequest.save();
    });
  }

  async attachResults(imagingRequest) {
    const imagingAccessCode = this.identifier.find(
      i => i?.system === config.hl7.dataDictionaries.imagingStudyAccessionId,
    )?.value;
    if (!imagingAccessCode) {
      throw new Invalid('Need to have Accession Number identifier', {
        code: FHIR_ISSUE_TYPE.INVALID.STRUCTURE,
      });
    }
    const { ImagingResult } = this.sequelize.models;
    let result = await ImagingResult.findOne({
      where: {
        imagingRequestId: imagingRequest.id,
        externalCode: imagingAccessCode,
      },
    });
    const resultNotes = this.note.map(n => n.text).join('\n\n');
    if (result) {
      result.set({ description: resultNotes });
      await result.save();
    } else {
      result = await ImagingResult.create({
        imagingRequestId: imagingRequest.id,
        description: resultNotes,
        externalCode: imagingAccessCode,
        completedAt: this.started ? toDateTimeString(this.started) : getCurrentDateTimeString(),
      });
    }

    imagingRequest.set({ status: IMAGING_REQUEST_STATUS_TYPES.COMPLETED });
    await imagingRequest.save();

    return result;
  }
}
