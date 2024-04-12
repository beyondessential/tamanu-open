import {
  createDummyEncounter,
  createDummyEncounterDiagnosis,
  createDummyPatient,
  randomRecordId,
  randomReferenceId,
  randomReferenceIds,
  randomUser,
} from '@tamanu/shared/demoData';
import { createTestContext } from '../../utilities';

describe('Incomplete Referrals report', () => {
  let app = null;
  let village1 = null;
  let village2 = null;
  let patient1 = null;
  let baseApp = null;
  let models = null;
  let expectedDiagnosis1 = null;
  let expectedDiagnosis2 = null;
  let encounter = null;
  let ctx;

  beforeAll(async () => {
    ctx = await createTestContext();
    baseApp = ctx.baseApp;
    models = ctx.models;
    app = await baseApp.asRole('practitioner');
    [village1, village2] = await randomReferenceIds(models, 'village', 2);
    patient1 = await models.Patient.create(
      await createDummyPatient(models, { villageId: village1 }),
    );
    await models.Patient.create(
      await createDummyPatient(models, { villageId: village2 }),
    );
    await randomUser(models);
    await randomUser(models);
    await randomRecordId(models, 'Department');
    await randomRecordId(models, 'Facility');
    expectedDiagnosis1 = await randomReferenceId(models, 'icd10');
    expectedDiagnosis2 = await randomReferenceId(models, 'icd10');
    encounter = await models.Encounter.create({
      ...(await createDummyEncounter(models)),
      patientId: patient1.id,
    });

    await models.EncounterDiagnosis.create(
      await createDummyEncounterDiagnosis(models, {
        current: true,
        diagnosisId: expectedDiagnosis1,
        encounterId: encounter.dataValues.id,
      }),
    );
    await models.EncounterDiagnosis.create(
      await createDummyEncounterDiagnosis(models, {
        current: true,
        diagnosisId: expectedDiagnosis2,
        encounterId: encounter.dataValues.id,
      }),
    );
  });
  afterAll(() => ctx.close());

  it('should reject creating a diagnoses report with insufficient permissions', async () => {
    const noPermsApp = await baseApp.asRole('base');
    const result = await noPermsApp.post(`/api/reports/incomplete-referrals`, {});
    expect(result).toBeForbidden();
  });

  describe('returns data based on supplied parameters', () => {
    beforeAll(async () => {
      await models.Referral.destroy({ where: {}, truncate: true });
      await models.Referral.create({
        initiatingEncounterId: encounter.id,
        referredFacility: 'Test facility',
      });
    });
    it('should return only requested village', async () => {
      const result = await app.post('/api/reports/incomplete-referrals').send({
        parameters: { village: village1 },
      });

      expect(result).toHaveSucceeded();
      expect(result.body.length).toEqual(2);
      expect(result.body[1][0]).toEqual(patient1.firstName);
      expect(result.body[1][1]).toEqual(patient1.lastName);
    });

    it('should return multiple diagnoses', async () => {
      const result = await app.post('/api/reports/incomplete-referrals').send({
        parameters: { village: village1 },
      });

      expect(result).toHaveSucceeded();
      expect(result.body.length).toEqual(2);
      // the order of diagnoses is not guaranteed, so we just check for count
      expect(result.body[1][3].split(',').length).toEqual(2);
    });
  });
});
