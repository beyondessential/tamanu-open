import {
  createDummyPatient,
  randomUser,
  randomReferenceId,
} from 'shared/demoData/patients';
import { createTestContext } from '../utilities';

describe('PatientCarePlan', () => {
  let app = null;
  let baseApp = null;
  let models = null;
  let ctx;

  beforeAll(async () => {
    ctx = await createTestContext();
    baseApp = ctx.baseApp;
    models = ctx.models;
    app = await baseApp.asRole('practitioner');
  });
  afterAll(() => ctx.close());

  it('should reject creating an admissions report with insufficient permissions', async () => {
    const noPermsApp = await baseApp.asRole('base');
    const result = await noPermsApp.post(`/v1/patientCarePlan`, {});
    expect(result).toBeForbidden();
  });

  describe('create a care plan for a patient', () => {
    let patient = null;
    let carePlanId = null;
    beforeAll(async () => {
      patient = await models.Patient.create(await createDummyPatient(models));
      carePlanId = await randomReferenceId(models, 'carePlan');
    });

    it('should create a care plan with note', async () => {
      const noteDate = new Date().toISOString();
      const result = await app.post('/v1/patientCarePlan').send({
        date: noteDate,
        carePlanId,
        patientId: patient.get('id'),
        content: 'Main care plan',
      });
      expect(result).toHaveSucceeded();
      expect(result.body).toHaveProperty('id');
      expect(result.body).toHaveProperty('date', noteDate);
      expect(result.body.patientId).toBe(patient.get('id'));
      expect(result.body.carePlanId).toBe(carePlanId);
      const noteResult = await app.get(`/v1/patientCarePlan/${result.body.id}/notes`);
      expect(noteResult).toHaveSucceeded();
      expect(noteResult.body.length).toBeGreaterThan(0);
      expect(noteResult.body[0].content).toBe('Main care plan');
      expect(noteResult.body[0]).toHaveProperty('date', noteDate);
    });

    it('should reject care plan without notes', async () => {
      const result = await app.post('/v1/patientCarePlan').send({
        date: new Date().toISOString(),
        carePlanId,
        patientId: patient.get('id'),
      });
      expect(result).toHaveRequestError();
    });

    it('should return return notes in order of creation', async () => {
      const createCarePlanRequest = await app.post('/v1/patientCarePlan').send({
        date: new Date().toISOString(),
        carePlanId,
        patientId: patient.get('id'),
        content: 'Main care plan',
      });
      expect(createCarePlanRequest).toHaveSucceeded();
      const onBehalfOfUserId = await randomUser(models);
      const additionalNoteRequest = await app
        .post(`/v1/patientCarePlan/${createCarePlanRequest.body.id}/notes`)
        .send({
          date: new Date().toISOString(),
          content: 'Second note',
          onBehalfOfId: onBehalfOfUserId,
        });
      expect(additionalNoteRequest).toHaveSucceeded();
      const noteResult = await app.get(
        `/v1/patientCarePlan/${createCarePlanRequest.body.id}/notes`,
      );
      expect(noteResult).toHaveSucceeded();
      expect(noteResult.body.length).toBeGreaterThan(0);
      expect(noteResult.body[0].content).toBe('Main care plan');
      expect(noteResult.body[1].content).toBe('Second note');
      expect(noteResult.body[1].onBehalfOf).toBeDefined();
    });

    it('should delete a note', async () => {
      const noteDate = new Date().toISOString();
      const result = await app.post('/v1/patientCarePlan').send({
        date: noteDate,
        carePlanId,
        patientId: patient.get('id'),
        content: 'Main care plan',
      });
      const noteResult = await app.get(`/v1/patientCarePlan/${result.body.id}/notes`);
      const deleteResult = await app.delete(`/v1/note/${noteResult.body[0].id}`);
      expect(deleteResult).toHaveSucceeded();
      const emptyNotesResult = await app.get(`/v1/patientCarePlan/${result.body.id}/notes`);
      expect(emptyNotesResult.body.length).toBe(0);
    });
  });
});
