import { createDummyPatient, createDummyEncounter, randomReferenceId } from 'shared/demoData/patients';
import { createTestContext } from '../utilities';

async function createDummyProcedure(models) {
  const locationId = await randomReferenceId(models, 'location');
  return {
    note: '',
    date: new Date(),
    locationId,
  };
}

describe('Procedures', () => {
  const { baseApp, models } = createTestContext();

  let patient = null;
  let app = null;
  let encounter = null;
  beforeAll(async () => {
    patient = await models.Patient.create(await createDummyPatient(models));
    app = await baseApp.asRole('practitioner');
    encounter = await models.Encounter.create({
      ...(await createDummyEncounter(models)),
      patientId: patient.id,
      reasonForEncounter: 'vitals test',
    });
  });

  it('should record a procedure', async () => {
    const result = await app.post('/v1/procedure').send({
      encounterId: encounter.id,
      note: 'test',
      date: new Date(),
    });
    expect(result).toHaveSucceeded();

    const record = await models.Procedure.findByPk(result.body.id);
    expect(record).toHaveProperty('note', 'test');
  });

  it('should update a procedure', async () => {
    const record = await models.Procedure.create({
      ...(await createDummyProcedure(models)),
      note: 'before',
      encounterId: encounter.id,
    });

    const result = await app.put(`/v1/procedure/${record.id}`).send({
      note: 'after',
    });
    expect(result).toHaveSucceeded();

    const updated = await models.Procedure.findByPk(record.id);
    expect(updated).toHaveProperty('note', 'after');
  });

  it('should close a procedure', async () => {
    const record = await models.Procedure.create({
      ...(await createDummyProcedure(models)),
      encounterId: encounter.id,
    });
    expect(record.endTime).toBeFalsy();

    const result = await app.put(`/v1/procedure/${record.id}`).send({
      endTime: new Date(),
    });
    expect(result).toHaveSucceeded();

    const updated = await models.Procedure.findByPk(record.id);
    expect(updated.endTime).toBeTruthy();
  });
});
