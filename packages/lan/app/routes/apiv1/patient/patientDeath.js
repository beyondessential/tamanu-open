import config from 'config';
import express from 'express';
import asyncHandler from 'express-async-handler';
import { InvalidOperationError, NotFoundError } from 'shared/errors';
import * as yup from 'yup';

export const patientDeath = express.Router();

function exportCause(cause) {
  return {
    id: cause.id,
    condition: cause.condition,
    timeAfterOnset: cause.timeAfterOnset,
  };
}

patientDeath.get(
  '/:id/death',
  asyncHandler(async (req, res) => {
    req.checkPermission('read', 'Patient');
    req.checkPermission('read', 'PatientDeath');

    const {
      models: { ContributingDeathCause, Patient, PatientDeathData, User, Facility, ReferenceData },
      params: { id: patientId },
    } = req;

    const patient = await Patient.findByPk(patientId);
    if (!patient) throw new NotFoundError('Patient not found');
    if (!patient.dateOfDeath) {
      res.status(404).send({
        patientId: patient.id,
        dateOfBirth: patient.dateOfBirth,
        dateOfDeath: null,
      });
      return;
    }

    const deathData = await PatientDeathData.findOne({
      where: { patientId },
      include: [
        {
          model: User,
          as: 'clinician',
        },
        {
          model: Facility,
          as: 'facility',
        },
        {
          model: ReferenceData,
          as: 'primaryCauseCondition',
        },
        {
          model: ReferenceData,
          as: 'antecedentCause1Condition',
        },
        {
          model: ReferenceData,
          as: 'antecedentCause2Condition',
        },
        {
          model: ContributingDeathCause,
          as: 'contributingCauses',
          include: ['condition'],
        },
      ],
    });

    res.send({
      patientId: patient.id,
      patientDeathDataId: deathData.id,
      clinician: deathData.clinician,
      facility: deathData.facility,
      outsideHealthFacility: deathData.outsideHealthFacility,

      dateOfBirth: patient.dateOfBirth,
      dateOfDeath: patient.dateOfDeath,

      manner: deathData.manner,
      causes: {
        primary: deathData.primaryCauseCondition
          ? exportCause({
              condition: deathData.primaryCauseCondition,
              timeAfterOnset: deathData.primaryCauseTimeAfterOnset,
            })
          : null,
        antecedent1: deathData.antecedentCause1Condition
          ? exportCause({
              condition: deathData.antecedentCause1Condition,
              timeAfterOnset: deathData.antecedentCause1TimeAfterOnset,
            })
          : null,
        antecedent2: deathData.antecedentCause2Condition
          ? exportCause({
              condition: deathData.antecedentCause2Condition,
              timeAfterOnset: deathData.antecedentCause2TimeAfterOnset,
            })
          : null,
        contributing: deathData.contributingCauses.map(exportCause),
        external:
          deathData.externalCauseDate ||
          deathData.externalCauseLocation ||
          deathData.externalCauseNotes
            ? {
                date: deathData.externalCauseDate,
                location: deathData.externalCauseLocation,
                notes: deathData.externalCauseNotes,
              }
            : null,
      },

      recentSurgery:
        deathData.recentSurgery === 'yes'
          ? {
              date: deathData.lastSurgeryDate,
              reasonId: deathData.lastSurgeryReasonId,
            }
          : deathData.recentSurgery,

      pregnancy:
        deathData.wasPregnant === 'yes'
          ? {
              contributed: deathData.pregnancyContributed,
            }
          : deathData.wasPregnant,

      fetalOrInfant: deathData.fetalOrInfant
        ? {
            birthWeight: deathData.birthWeight,
            carrier: {
              age: deathData.carrierAge,
              existingConditionId: deathData.carrierExistingConditionId,
              weeksPregnant: deathData.carrierPregnancyWeeks,
            },
            hoursSurvivedSinceBirth: deathData.hoursSurvivedSinceBirth,
            stillborn: deathData.stillborn,
            withinDayOfBirth: deathData.withinDayOfBirth,
          }
        : false,
    });
  }),
);

patientDeath.post(
  '/:id/death',
  asyncHandler(async (req, res) => {
    req.checkPermission('write', 'Patient');
    req.checkPermission('create', 'PatientDeath');

    const {
      db,
      models: { Patient, PatientDeathData, ContributingDeathCause, User },
      params: { id: patientId },
    } = req;

    const yesNoUnknown = yup
      .string()
      .lowercase()
      .oneOf(['yes', 'no', 'unknown']);

    const yesNo = yup
      .string()
      .lowercase()
      .oneOf(['yes', 'no']);

    const schema = yup.object().shape({
      ageOfMother: yup.number(),
      antecedentCause1: yup.string(),
      antecedentCause1Interval: yup.number().default(0),
      antecedentCause2: yup.string(),
      antecedentCause2Interval: yup.number().default(0),
      birthWeight: yup.number(),
      causeOfDeath: yup.string().required(),
      causeOfDeathInterval: yup.number().default(0),
      clinicianId: yup.string().required(),
      deathWithin24HoursOfBirth: yesNo,
      facilityId: yup.string(),
      fetalOrInfant: yesNo.default('no'),
      lastSurgeryDate: yup.date(),
      lastSurgeryReason: yup.string(),
      mannerOfDeath: yup.string().required(),
      mannerOfDeathDate: yup.date(),
      mannerOfDeathLocation: yup.string(), // actually "external cause"
      mannerOfDeathOther: yup.string(),
      motherExistingCondition: yup.string(),
      numberOfCompletedPregnancyWeeks: yup.number(),
      numberOfHoursSurvivedSinceBirth: yup.number(),
      otherContributingConditions: yup.array().of(yup.object()),
      outsideHealthFacility: yup.boolean().default(false),
      pregnancyContribute: yesNoUnknown,
      pregnant: yesNoUnknown,
      stillborn: yesNoUnknown,
      surgeryInLast4Weeks: yesNoUnknown,
      timeOfDeath: yup.date().required(),
    });

    const body = await schema.validate(req.body);

    const patient = await Patient.findByPk(patientId);
    if (!patient) throw new NotFoundError('Patient not found');
    if (patient.dateOfDeath) throw new InvalidOperationError('Patient is already deceased');

    const doc = await User.findByPk(body.clinicianId);
    if (!doc) throw new NotFoundError('Discharge clinician not found');

    await transactionOnPostgres(db, async () => {
      await patient.update({ dateOfDeath: body.timeOfDeath });

      const deathData = await PatientDeathData.create({
        antecedentCause1ConditionId: body.antecedentCause1,
        antecedentCause1TimeAfterOnset: body.antecedentCause1Interval,
        antecedentCause2ConditionId: body.antecedentCause2,
        antecedentCause2TimeAfterOnset: body.antecedentCause2Interval,
        birthWeight: body.birthWeight,
        carrierAge: body.ageOfMother,
        carrierExistingConditionId: body.motherExistingCondition,
        carrierPregnancyWeeks: body.numberOfCompletedPregnancyWeeks,
        clinicianId: doc.id,
        externalCauseDate: body.mannerOfDeathDate,
        externalCauseLocation: body.mannerOfDeathLocation,
        externalCauseNotes: body.mannerOfDeathOther,
        facilityId: body.facilityId,
        fetalOrInfant: body.fetalOrInfant === 'yes',
        hoursSurvivedSinceBirth: body.numberOfHoursSurvivedSinceBirth,
        lastSurgeryDate: body.surgeryInLast4Weeks === 'yes' ? body.lastSurgeryDate : null,
        lastSurgeryReasonId: body.lastSurgeryReason,
        manner: body.mannerOfDeath,
        outsideHealthFacility: body.outsideHealthFacility,
        patientId: patient.id,
        pregnancyContributed: body.pregnancyContribute,
        primaryCauseConditionId: body.causeOfDeath,
        primaryCauseTimeAfterOnset: body.causeOfDeathInterval,
        recentSurgery: body.surgeryInLast4Weeks,
        stillborn: body.stillborn,
        wasPregnant: body.pregnant,
        withinDayOfBirth: body.deathWithin24HoursOfBirth
          ? body.deathWithin24HoursOfBirth === 'yes'
          : null,
      });

      if (body.otherContributingConditions) {
        for (const condition of body.otherContributingConditions) {
          await ContributingDeathCause.create({
            patientDeathDataId: deathData.id,
            conditionId: condition.cause,
            timeAfterOnset: condition.interval ?? 0,
          });
        }
      }

      const activeEncounters = await patient.getEncounters({
        where: {
          endDate: null,
        },
      });
      for (const encounter of activeEncounters) {
        await encounter.dischargeWithDischarger(doc, body.timeOfDeath);
      }
    });

    res.send({
      data: {},
    });
  }),
);

async function transactionOnPostgres(db, transaction) {
  if (config.db.sqlitePath) {
    return transaction();
  }

  return db.transaction(transaction);
}
