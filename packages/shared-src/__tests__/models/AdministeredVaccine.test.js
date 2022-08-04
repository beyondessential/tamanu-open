import { v4 as uuidv4 } from 'uuid';
import { fake, fakeUser } from 'shared/test-helpers';
import { add } from 'date-fns';
import { fakeReferenceData } from 'shared/test-helpers/fake';
import { initDb } from '../initDb';

describe('AdministeredVaccine.lastVaccinationForPatient', () => {
  let models;
  let context;
  const patientId = uuidv4();
  const encounterId = uuidv4();

  beforeAll(async () => {
    context = await initDb({ testMode: true });
    models = context.models;
    const { Patient, Encounter, Department, Location, User, Facility, ReferenceData } = models;

    const examiner = await User.create(fakeUser());
    await Patient.create({ ...fake(Patient), id: patientId });
    const fact = await Facility.create({ ...fake(Facility) });
    const dept = await Department.create({ ...fake(Department), facilityId: fact.id });
    const loc = await Location.create({ ...fake(Location), facilityId: fact.id });

    await ReferenceData.create({
      ...fakeReferenceData(),
      id: 'drug-Placebo',
      code: 'Placebo',
      type: 'drug',
      name: 'Placebo',
    });

    await ReferenceData.create({
      ...fakeReferenceData(),
      id: 'drug-COVAX',
      code: 'COVAX',
      type: 'drug',
      name: 'COVAX',
    });

    await ReferenceData.create({
      ...fakeReferenceData(),
      id: 'drug-COVID-19-Astra-Zeneca',
      code: 'COVID-19-AZ',
      type: 'drug',
      name: 'COVID-19 AZ',
    });

    await Encounter.create({
      ...fake(Encounter),
      id: encounterId,
      patientId,
      encounterType: 'clinic',
      examinerId: examiner.id,
      departmentId: dept.id,
      locationId: loc.id,
    });
  });

  afterEach(async () => {
    await models.AdministeredVaccine.truncate();
  });

  describe('when used without selector', () => {
    it('should return latest vax', async () => {
      // Arrange
      const { AdministeredVaccine, ScheduledVaccine } = models;
      const scheduledVaccineId = uuidv4();
      const now = new Date();

      await ScheduledVaccine.create({
        ...fake(ScheduledVaccine),
        id: scheduledVaccineId,
        vaccineId: 'drug-Placebo',
      });

      await AdministeredVaccine.create({
        ...fake(AdministeredVaccine),
        id: 'first',
        status: 'GIVEN',
        date: add(now, { minutes: 1 }),
        scheduledVaccineId,
        encounterId,
      });

      const vax = await AdministeredVaccine.create({
        ...fake(AdministeredVaccine),
        id: 'last',
        status: 'GIVEN',
        date: add(now, { minutes: 2 }),
        scheduledVaccineId,
        encounterId,
      });

      // Act
      const result = await AdministeredVaccine.lastVaccinationForPatient(patientId);

      // Assert
      expect(result).toBeTruthy();
      expect(result.id).toEqual(vax.id);
    });

    it('should return nothing if there are no vax', async () => {
      // Arrange
      const { AdministeredVaccine, ScheduledVaccine } = models;
      const scheduledVaccineId = uuidv4();

      await ScheduledVaccine.create({
        ...fake(ScheduledVaccine),
        id: scheduledVaccineId,
        vaccineId: 'drug-Placebo',
      });

      // Act
      const result = await AdministeredVaccine.lastVaccinationForPatient(patientId);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('when used for COVID vax selection', () => {
    it('should return latest COVID19 vax when present', async () => {
      // Arrange
      const { AdministeredVaccine, ScheduledVaccine } = models;
      const scheduledVaccineId = uuidv4();
      const covidScheduledVaccineId = uuidv4();
      const now = new Date();

      await ScheduledVaccine.create({
        ...fake(ScheduledVaccine),
        id: scheduledVaccineId,
        vaccineId: 'drug-Placebo',
      });

      await ScheduledVaccine.create({
        ...fake(ScheduledVaccine),
        id: covidScheduledVaccineId,
        vaccineId: 'drug-COVID-19-Astra-Zeneca',
      });

      await AdministeredVaccine.create({
        ...fake(AdministeredVaccine),
        id: 'first',
        status: 'GIVEN',
        date: add(now, { minutes: 1 }),
        scheduledVaccineId,
        encounterId,
      });

      await AdministeredVaccine.create({
        ...fake(AdministeredVaccine),
        id: 'first-covid',
        status: 'GIVEN',
        date: add(now, { minutes: 2 }),
        scheduledVaccineId: covidScheduledVaccineId,
        encounterId,
      });

      const vax = await AdministeredVaccine.create({
        ...fake(AdministeredVaccine),
        id: 'last-covid',
        status: 'GIVEN',
        date: add(now, { minutes: 3 }),
        scheduledVaccineId: covidScheduledVaccineId,
        encounterId,
      });

      await AdministeredVaccine.create({
        ...fake(AdministeredVaccine),
        id: 'last',
        status: 'GIVEN',
        date: add(now, { minutes: 4 }),
        scheduledVaccineId,
        encounterId,
      });

      // Act
      const result = await AdministeredVaccine.lastVaccinationForPatient(patientId, [
        'drug-COVID-19-Astra-Zeneca',
      ]);

      // Assert
      expect(result).toBeTruthy();
      expect(result.id).toEqual(vax.id);
    });

    it('should return nothing when no COVID19 vax are present', async () => {
      // Arrange
      const { AdministeredVaccine, ScheduledVaccine } = models;
      const scheduledVaccineId = uuidv4();
      const now = new Date();

      await ScheduledVaccine.create({
        ...fake(ScheduledVaccine),
        id: scheduledVaccineId,
        vaccineId: 'drug-Placebo',
      });

      await AdministeredVaccine.create({
        ...fake(AdministeredVaccine),
        id: 'first',
        status: 'GIVEN',
        date: add(now, { minutes: 1 }),
        scheduledVaccineId,
        encounterId,
      });

      await AdministeredVaccine.create({
        ...fake(AdministeredVaccine),
        id: 'last',
        status: 'GIVEN',
        date: add(now, { minutes: 2 }),
        scheduledVaccineId,
        encounterId,
      });

      // Act
      const result = await AdministeredVaccine.lastVaccinationForPatient(patientId, [
        'drug-COVID-19-Astra-Zeneca',
      ]);

      // Assert
      expect(result).toBeNull();
    });

    it('should return nothing when only COVAX is present', async () => {
      // Arrange
      const { AdministeredVaccine, ScheduledVaccine } = models;
      const scheduledVaccineId = uuidv4();
      const now = new Date();

      await ScheduledVaccine.create({
        ...fake(ScheduledVaccine),
        id: scheduledVaccineId,
        vaccineId: 'drug-COVAX',
      });

      await AdministeredVaccine.create({
        ...fake(AdministeredVaccine),
        id: 'first',
        status: 'GIVEN',
        date: add(now, { minutes: 1 }),
        scheduledVaccineId,
        encounterId,
      });

      await AdministeredVaccine.create({
        ...fake(AdministeredVaccine),
        id: 'last',
        status: 'GIVEN',
        date: add(now, { minutes: 2 }),
        scheduledVaccineId,
        encounterId,
      });

      // Act
      const result = await AdministeredVaccine.lastVaccinationForPatient(patientId, [
        'drug-COVID-19-Astra-Zeneca',
      ]);

      // Assert
      expect(result).toBeNull();
    });
  });
});
