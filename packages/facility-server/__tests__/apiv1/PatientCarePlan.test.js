import { createDummyPatient, randomReferenceId, randomUser } from '@tamanu/shared/demoData/patients';
import { getCurrentDateTimeString } from '@tamanu/shared/utils/dateTime';
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
    const result = await noPermsApp.post(`/api/patientCarePlan`, {});
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
      const onBehalfOfUserId = await randomUser(models);
      const carePlanDate = getCurrentDateTimeString();
      const result = await app.post('/api/patientCarePlan').send({
        date: carePlanDate,
        carePlanId,
        patientId: patient.get('id'),
        content: 'Main care plan',
        examinerId: onBehalfOfUserId,
      });
      expect(result).toHaveSucceeded();
      expect(result.body).toHaveProperty('id');
      expect(result.body).toHaveProperty('date', carePlanDate);
      expect(result.body.patientId).toBe(patient.get('id'));
      expect(result.body.carePlanId).toBe(carePlanId);
      const noteResult = await app.get(`/api/patientCarePlan/${result.body.id}/notes`);
      expect(noteResult).toHaveSucceeded();
      expect(noteResult.body.length).toBeGreaterThan(0);
      expect(noteResult.body[0].content).toBe('Main care plan');
      expect(noteResult.body[0]).toHaveProperty('date', carePlanDate);
    });

    it('should reject care plan without notes', async () => {
      const result = await app.post('/api/patientCarePlan').send({
        date: getCurrentDateTimeString(),
        carePlanId,
        patientId: patient.get('id'),
      });
      expect(result).toHaveRequestError();
    });

    it('should return return notes in order of creation', async () => {
      const onBehalfOfUserId = await randomUser(models);
      const createCarePlanRequest = await app.post('/api/patientCarePlan').send({
        date: getCurrentDateTimeString(),
        carePlanId,
        patientId: patient.get('id'),
        onBehalfOfId: onBehalfOfUserId,
        content: 'Main care plan',
      });
      expect(createCarePlanRequest).toHaveSucceeded();
      const additionalNoteRequest = await app
        .post(`/api/patientCarePlan/${createCarePlanRequest.body.id}/notes`)
        .send({
          date: getCurrentDateTimeString(),
          content: 'Second note',
          onBehalfOfId: onBehalfOfUserId,
        });
      expect(additionalNoteRequest).toHaveSucceeded();
      const noteResult = await app.get(
        `/api/patientCarePlan/${createCarePlanRequest.body.id}/notes`,
      );

      expect(noteResult).toHaveSucceeded();
      expect(noteResult.body.length).toBeGreaterThan(0);
      expect(noteResult.body[0].content).toBe('Main care plan');
      expect(noteResult.body[1].content).toBe('Second note');
      expect(noteResult.body[1].onBehalfOf).toBeDefined();
    });

    it('should delete a note', async () => {
      const noteDate = getCurrentDateTimeString();
      const result = await app.post('/api/patientCarePlan').send({
        date: noteDate,
        carePlanId,
        patientId: patient.get('id'),
        content: 'Main care plan',
      });
      const noteResult = await app.get(`/api/patientCarePlan/${result.body.id}/notes`);
      const deleteResult = await app.delete(`/api/notes/${noteResult.body[0].id}`);
      expect(deleteResult).toHaveSucceeded();
      const emptyNotesResult = await app.get(`/api/patientCarePlan/${result.body.id}/notes`);
      expect(emptyNotesResult.body.length).toBe(0);
    });
  });
});
