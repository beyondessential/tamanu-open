import { random } from 'lodash';
import {
  createDummyEncounter,
  createDummyEncounterMedication,
  createDummyPatient,
  randomReferenceId,
} from 'shared/demoData/patients';
import { fake } from 'shared/test-helpers/fake';
import { createTestContext } from '../utilities';

describe('Patient', () => {
  let app = null;
  let baseApp = null;
  let models = null;
  let patient = null;
  let ctx;

  beforeAll(async () => {
    ctx = await createTestContext();
    baseApp = ctx.baseApp;
    models = ctx.models;
    app = await baseApp.asRole('practitioner');
    patient = await models.Patient.create(await createDummyPatient(models));
  });
  afterAll(() => ctx.close());

  it('should reject reading a patient with insufficient permissions', async () => {
    const noPermsApp = await baseApp.asRole('base');
    const result = await noPermsApp.get(`/v1/patient/${patient.id}`);
    expect(result).toBeForbidden();
  });

  test.todo('should create an access record');

  test.todo('should get a list of patients matching a filter');
  test.todo('should reject listing of patients with insufficient permissions');

  it('should get the details of a patient', async () => {
    const result = await app.get(`/v1/patient/${patient.id}`);
    expect(result).toHaveSucceeded();
    expect(result.body).toHaveProperty('displayId', patient.displayId);
    expect(result.body).toHaveProperty('firstName', patient.firstName);
    expect(result.body).toHaveProperty('lastName', patient.lastName);
  });

  test.todo('should get a list of patient conditions');
  test.todo('should get a list of patient allergies');
  test.todo('should get a list of patient family history entries');
  test.todo('should get a list of patient issues');

  it('should get empty results when checking for last discharged encounter medications', async () => {
    // Create encounter without endDate (not discharged yet)
    await models.Encounter.create({
      ...(await createDummyEncounter(models, { current: true })),
      patientId: patient.id,
    });

    // Expect result data to be empty since there are no discharged encounters or medications
    const result = await app.get(`/v1/patient/${patient.id}/lastDischargedEncounter/medications`);
    expect(result).toHaveSucceeded();
    expect(result.body).toMatchObject({
      count: 0,
      data: [],
    });
  });

  it('should get the last discharged encounter and include discharged medications', async () => {
    // Create three encounters: First two will be discharged, the last one won't
    const encounterOne = await models.Encounter.create({
      ...(await createDummyEncounter(models, { current: true })),
      patientId: patient.id,
    });
    const encounterTwo = await models.Encounter.create({
      ...(await createDummyEncounter(models, { current: true })),
      patientId: patient.id,
    });
    await models.Encounter.create({
      ...(await createDummyEncounter(models, { current: true })),
      patientId: patient.id,
    });

    // Create two medications for encounterTwo (the one we should get)
    const dischargedMedication = await models.EncounterMedication.create({
      ...(await createDummyEncounterMedication(models, { isDischarge: true })),
      encounterId: encounterTwo.id,
    });
    await models.EncounterMedication.create({
      ...(await createDummyEncounterMedication(models)),
      encounterId: encounterTwo.id,
    });

    // Edit the first two encounters to simulate a discharge
    // (the second one needs to have a 'greater' date to be the last)
    const endDate = new Date();
    await Promise.all([
      encounterOne.update({ endDate }),
      encounterTwo.update({ endDate: new Date(endDate.getTime() + 1000) }),
    ]);

    // Expect encounter to be the second encounter discharged
    // and include discharged medication with reference associations
    const result = await app.get(`/v1/patient/${patient.id}/lastDischargedEncounter/medications`);
    expect(result).toHaveSucceeded();
    expect(result.body).toMatchObject({
      count: 1,
      data: expect.any(Array),
    });
    expect(result.body.data[0]).toMatchObject({
      id: dischargedMedication.id,
      medication: expect.any(Object),
      encounter: {
        location: expect.any(Object),
      },
    });
  });

  describe('write', () => {
    it('should reject users with insufficient permissions', async () => {
      const noPermsApp = await baseApp.asRole('base');

      const result = await noPermsApp.put(`/v1/patient/${patient.id}`).send({
        firstName: 'New',
      });

      expect(result).toBeForbidden();
    });

    it('should create a new patient', async () => {
      const newPatient = await createDummyPatient(models);
      const result = await app.post('/v1/patient').send(newPatient);
      expect(result).toHaveSucceeded();
      expect(result.body).toHaveProperty('displayId', newPatient.displayId);
      expect(result.body).toHaveProperty('firstName', newPatient.firstName);
      expect(result.body).toHaveProperty('lastName', newPatient.lastName);
    });

    it('should create a new patient with additional data', async () => {
      const newPatient = await createDummyPatient(models);
      const result = await app.post('/v1/patient').send({
        ...newPatient,
        passport: 'TEST-PASSPORT',
      });

      expect(result).toHaveSucceeded();

      const { id } = result.body;
      const additional = await models.PatientAdditionalData.findOne({ where: { patientId: id } });
      expect(additional).toBeTruthy();
      expect(additional).toHaveProperty('passport', 'TEST-PASSPORT');
    });

    it('should update patient details', async () => {
      // skip middleName, to be added in PUT request
      const newPatient = await createDummyPatient(models, { middleName: '' });
      const result = await app.post('/v1/patient').send(newPatient);
      expect(result.body.middleName).toEqual('');

      const newVillage = await randomReferenceId(models, 'village');
      const updateResult = await app.put(`/v1/patient/${result.body.id}`).send({
        villageId: newVillage,
        middleName: 'MiddleName',
        bloodType: 'AB+',
      });

      expect(updateResult).toHaveSucceeded();
      expect(updateResult.body).toHaveProperty('villageId', newVillage);
      expect(updateResult.body).toHaveProperty('middleName', 'MiddleName');

      const additionalDataResult = await app.get(`/v1/patient/${result.body.id}/additionalData`);

      expect(additionalDataResult).toHaveSucceeded();
      expect(additionalDataResult.body).toHaveProperty('bloodType', 'AB+');
    });

    test.todo('should create a new patient as a new birth');

    test.todo('should add a new condition');
    test.todo('should edit an existing condition');
    test.todo('should add a new allergy');
    test.todo('should edit an existing allergy');
    test.todo('should add a new family history entry');
    test.todo('should edit an existing family history entry');
    test.todo('should add a new issue');
    test.todo('should edit an existing issue');
  });

  describe('merge', () => {
    test.todo('should merge two patients into a single record');
  });

  test.todo('should get a list of patient encounters');
  test.todo('should get a list of patient appointments');
  test.todo('should get a list of patient referrals');

  describe('Death', () => {
    let commons;
    beforeAll(async () => {
      const { User, Facility, Department, Location, ReferenceData } = models;
      const { id: clinicianId } = await User.create({ ...fake(User), role: 'practitioner' });
      const { id: facilityId } = await Facility.create(fake(Facility));
      const { id: departmentId } = await Department.create({
        ...fake(Department),
        facilityId,
      });
      const { id: locationId } = await Location.create({
        ...fake(Location),
        facilityId,
      });
      const cond1 = await ReferenceData.create({
        id: 'ref/icd10/K07.9',
        type: 'icd10',
        code: 'K07.9',
        name: 'Dentofacial anomaly',
      });
      const cond2 = await ReferenceData.create({
        id: 'ref/icd10/A51.3',
        type: 'icd10',
        code: 'A51.3',
        name: 'Secondary syphilis of skin',
      });
      const cond3 = await ReferenceData.create({
        id: 'ref/icd10/R41.0',
        type: 'icd10',
        code: 'R41.0',
        name: 'Confusion',
      });

      commons = {
        clinicianId,
        facilityId,
        departmentId,
        locationId,
        cond1Id: cond1.id,
        cond2Id: cond2.id,
        cond3Id: cond3.id,
        cond1: {
          ...cond1.dataValues,
          createdAt: cond1.createdAt.toISOString(),
          updatedAt: cond1.updatedAt.toISOString(),
        },
        cond2: {
          ...cond2.dataValues,
          createdAt: cond2.createdAt.toISOString(),
          updatedAt: cond2.updatedAt.toISOString(),
        },
        cond3: {
          ...cond3.dataValues,
          createdAt: cond3.createdAt.toISOString(),
          updatedAt: cond3.updatedAt.toISOString(),
        },
      };
    });

    it('should mark a patient as dead', async () => {
      const { Patient } = models;
      const { id } = await Patient.create({ ...fake(Patient), dateOfDeath: null });
      const { clinicianId, facilityId, cond1Id, cond2Id, cond3Id } = commons;

      const dod = new Date('2021-09-01T00:00:00.000Z');
      const result = await app.post(`/v1/patient/${id}/death`).send({
        clinicianId,
        facilityId,
        outsideHealthFacility: false,
        timeOfDeath: dod,
        causeOfDeath: cond1Id,
        causeOfDeathInterval: 100,
        antecedentCause1: cond2Id,
        antecedentCause1Interval: 120,
        antecedentCause2: cond3Id,
        antecedentCause2Interval: 150,
        otherContributingConditions: [{ cause: cond2Id, interval: 400 }],
        surgeryInLast4Weeks: 'yes',
        lastSurgeryDate: '2021-08-02T20:52:00.000Z',
        lastSurgeryReason: cond1Id,
        pregnant: 'no',
        mannerOfDeath: 'Accident',
        mannerOfDeathDate: '2021-08-31T12:00:00.000Z',
        fetalOrInfant: 'yes',
        stillborn: 'unknown',
        birthWeight: 120,
        numberOfCompletedPregnancyWeeks: 30,
        ageOfMother: 21,
        motherExistingCondition: cond1Id,
        deathWithin24HoursOfBirth: 'yes',
        numberOfHoursSurvivedSinceBirth: 12,
      });
      expect(result).toHaveSucceeded();

      const foundPatient = await Patient.findByPk(id);
      expect(foundPatient.dateOfDeath).toEqual(dod);
    });

    it('should not mark a dead patient as dead', async () => {
      const { Patient } = models;
      const patientData = fake(Patient);
      patientData.dateOfDeath = new Date(random(patientData.dateOfBirth.getTime(), Date.now()));
      const { id } = await Patient.create(patientData);
      const { clinicianId, facilityId, cond1Id } = commons;

      const result = await app.post(`/v1/patient/${id}/death`).send({
        clinicianId,
        facilityId,
        timeOfDeath: '2021-09-01T00:00:00.000Z',
        causeOfDeath: cond1Id,
        causeOfDeathInterval: 100,
        mannerOfDeath: 'Disease',
      });
      expect(result).not.toHaveSucceeded();
    });

    it('should reject with no data', async () => {
      const { Patient } = models;
      const { id } = await Patient.create({ ...fake(Patient), dateOfDeath: null });

      const result = await app.post(`/v1/patient/${id}/death`).send({});
      expect(result).not.toHaveSucceeded();
    });

    it('should reject with invalid data', async () => {
      const { Patient } = models;
      const { id } = await Patient.create({ ...fake(Patient), dateOfDeath: null });

      const result = await app.post(`/v1/patient/${id}/death`).send({
        timeOfDeath: 'this is not a date',
      });
      expect(result).not.toHaveSucceeded();
    });

    it('should mark active encounters as discharged', async () => {
      const { Encounter, Patient } = models;
      const { clinicianId, facilityId, departmentId, locationId, cond1Id } = commons;
      const { id } = await Patient.create({ ...fake(Patient), dateOfDeath: null });
      const { id: encId } = await Encounter.create({
        ...fake(Encounter),
        departmentId,
        locationId,
        patientId: id,
        examinerId: clinicianId,
        endDate: null,
      });

      const result = await app.post(`/v1/patient/${id}/death`).send({
        clinicianId,
        facilityId,
        timeOfDeath: '2021-09-01T00:00:00.000Z',
        causeOfDeath: cond1Id,
        causeOfDeathInterval: 100,
        mannerOfDeath: 'Disease',
      });
      expect(result).toHaveSucceeded();

      const encounter = await Encounter.findByPk(encId);
      expect(encounter.endDate).toBeTruthy();

      const discharge = await encounter.getDischarge();
      expect(discharge).toBeTruthy();
      expect(discharge.dischargerId).toEqual(clinicianId);
    });

    it('should return no death data for alive patient', async () => {
      const { Patient } = models;
      const { id, dateOfBirth } = await Patient.create({ ...fake(Patient), dateOfDeath: null });

      const result = await app.get(`/v1/patient/${id}/death`);

      expect(result).toHaveStatus(404);
      expect(result.body).toMatchObject({
        patientId: id,
        dateOfBirth: dateOfBirth.toISOString(),
        dateOfDeath: null,
      });
    });

    it('should return death data for deceased patient', async () => {
      const { Patient } = models;
      const { id, dateOfBirth } = await Patient.create({ ...fake(Patient), dateOfDeath: null });
      const { clinicianId, facilityId, cond1, cond2, cond3, cond1Id, cond2Id, cond3Id } = commons;

      const dod = new Date('2021-09-01T00:00:00.000Z');
      await app.post(`/v1/patient/${id}/death`).send({
        clinicianId,
        facilityId,
        outsideHealthFacility: false,
        timeOfDeath: dod,
        causeOfDeath: cond1Id,
        causeOfDeathInterval: 100,
        antecedentCause1: cond2Id,
        antecedentCause1Interval: 120,
        antecedentCause2: cond3Id,
        antecedentCause2Interval: 150,
        otherContributingConditions: [{ cause: cond2Id, interval: 400 }],
        surgeryInLast4Weeks: 'yes',
        lastSurgeryDate: '2021-08-02T20:52:00.000Z',
        lastSurgeryReason: cond1Id,
        pregnant: 'no',
        mannerOfDeath: 'Accident',
        mannerOfDeathDate: '2021-08-31T12:00:00.000Z',
        fetalOrInfant: 'yes',
        stillborn: 'unknown',
        birthWeight: 120,
        numberOfCompletedPregnancyWeeks: 30,
        ageOfMother: 21,
        motherExistingCondition: cond1Id,
        deathWithin24HoursOfBirth: 'yes',
        numberOfHoursSurvivedSinceBirth: 12,
      });

      const result = await app.get(`/v1/patient/${id}/death`);

      expect(result).toHaveSucceeded();
      expect(result.body.dateOfDeath).toEqual(dod.toISOString());

      expect(result.body).toMatchObject({
        patientId: id,
        dateOfBirth: dateOfBirth.toISOString(),
        dateOfDeath: dod.toISOString(),

        manner: 'Accident',
        causes: {
          primary: {
            condition: cond1,
            timeAfterOnset: 100,
          },
          antecedent1: {
            condition: cond2,
            timeAfterOnset: 120,
          },
          antecedent2: {
            condition: cond3,
            timeAfterOnset: 150,
          },
          contributing: [
            {
              condition: cond2,
              timeAfterOnset: 400,
            },
          ],
          external: {
            date: '2021-08-31T12:00:00.000Z',
          },
        },

        recentSurgery: {
          date: '2021-08-02T20:52:00.000Z',
          reasonId: cond1Id,
        },

        pregnancy: 'no',
        fetalOrInfant: {
          birthWeight: 120,
          carrier: {
            age: 21,
            existingConditionId: cond1Id,
            weeksPregnant: 30,
          },
          hoursSurvivedSinceBirth: 12,
          stillborn: 'unknown',
          withinDayOfBirth: true,
        },
      });
    });
  });
});
