import { createScheduledVaccine } from 'shared/demoData/vaccines';
import { createTestContext } from '../utilities';

describe('Scheduled Vaccine', () => {
  let baseApp = null;
  let app = null;
  let scheduledVaccine1 = null;
  let scheduledVaccine2 = null;
  let ctx;

  beforeAll(async () => {
    ctx = await createTestContext();
    const models = ctx.models;
    baseApp = ctx.baseApp;
    app = await baseApp.asRole('practitioner');

    scheduledVaccine1 = await models.ScheduledVaccine.create(
      await createScheduledVaccine(models, {
        category: 'Category1',
        label: 'Label1',
        schedule: 'Schedule1',
      }),
    );
    scheduledVaccine2 = await models.ScheduledVaccine.create(
      await createScheduledVaccine(models, {
        category: 'Category2',
        label: 'Label2',
        schedule: 'Schedule2',
      }),
    );
  });
  afterAll(() => ctx.close());

  it('should reject with insufficient permissions', async () => {
    const noPermsApp = await baseApp.asRole('base');
    const result = await noPermsApp.get(`/v1/scheduledVaccine`, {});
    expect(result).toBeForbidden();
  });

  describe('returns data based on query parameters', () => {
    it('should return data for vaccines of the right category', async () => {
      const result = await app.get('/v1/scheduledVaccine?category=Category1');
      const { body } = result;

      expect(result).toHaveSucceeded();
      expect(body.length).toBe(1);
      expect(body[0].category).toBe(scheduledVaccine1.category);
      expect(body[0].label).toBe(scheduledVaccine1.label);
      expect(body[0].schedule).toBe(scheduledVaccine1.schedule);
    });
  });
});
