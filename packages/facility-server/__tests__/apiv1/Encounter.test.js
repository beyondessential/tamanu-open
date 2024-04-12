import { addHours, formatISO9075, sub, subWeeks } from 'date-fns';
import { isEqual } from 'lodash';

import {
  createDummyEncounter,
  createDummyEncounterMedication,
  createDummyPatient,
} from '@tamanu/shared/demoData/patients';
import { randomLabRequest } from '@tamanu/shared/demoData';
import {
  DOCUMENT_SOURCES,
  EncounterChangeType,
  IMAGING_REQUEST_STATUS_TYPES,
  LAB_REQUEST_STATUSES,
  NOTE_RECORD_TYPES,
  NOTE_TYPES,
  VITALS_DATA_ELEMENT_IDS,
} from '@tamanu/constants';
import { setupSurveyFromObject } from '@tamanu/shared/demoData/surveys';
import { fake, fakeUser } from '@tamanu/shared/test-helpers/fake';
import { getCurrentDateTimeString, toDateTimeString } from '@tamanu/shared/utils/dateTime';

import { uploadAttachment } from '../../dist/utils/uploadAttachment';
import { createTestContext } from '../utilities';

describe('Encounter', () => {
  let patient = null;
  let user = null;
  let app = null;
  let baseApp = null;
  let models = null;
  let ctx;

  beforeAll(async () => {
    ctx = await createTestContext();
    baseApp = ctx.baseApp;
    models = ctx.models;
    patient = await models.Patient.create(await createDummyPatient(models));
    user = await models.User.create({ ...fakeUser(), role: 'practitioner' });
    app = await baseApp.asUser(user);
  });
  afterAll(() => ctx.close());

  it('should reject reading an encounter with insufficient permissions', async () => {
    const noPermsApp = await baseApp.asRole('base');
    const encounter = await models.Encounter.create({
      ...(await createDummyEncounter(models)),
      patientId: patient.id,
    });

    const result = await noPermsApp.get(`/api/encounter/${encounter.id}`);
    expect(result).toBeForbidden();
  });

  test.todo('should create an access record');

  it('should get an encounter', async () => {
    const v = await models.Encounter.create({
      ...(await createDummyEncounter(models)),
      patientId: patient.id,
    });
    const result = await app.get(`/api/encounter/${v.id}`);
    expect(result).toHaveSucceeded();
    expect(result.body.id).toEqual(v.id);
    expect(result.body.patientId).toEqual(patient.id);
  });

  it('should get a list of encounters for a patient', async () => {
    const v = await models.Encounter.create({
      ...(await createDummyEncounter(models)),
      patientId: patient.id,
    });
    const c = await models.Encounter.create({
      ...(await createDummyEncounter(models, { current: true })),
      patientId: patient.id,
    });

    const result = await app.get(`/api/patient/${patient.id}/encounters`);
    expect(result).toHaveSucceeded();
    expect(result.body.count).toBeGreaterThan(0);
    expect(result.body.data.some(x => x.id === v.id)).toEqual(true);
    expect(result.body.data.some(x => x.id === c.id)).toEqual(true);

    expect(result.body.data.find(x => x.id === v.id)).toMatchObject({
      id: v.id,
      endDate: expect.any(String),
    });
    expect(result.body.data.find(x => x.id === c.id)).toMatchObject({
      id: c.id,
    });
    expect(result.body.data.find(x => x.id === c.id)).not.toHaveProperty('endDate');
  });

  it('should fail to get an encounter that does not exist', async () => {
    const result = await app.get('/api/encounter/nonexistent');
    expect(result).toHaveRequestError();
  });

  it('should get a discharge', async () => {
    const encounter = await models.Encounter.create({
      ...(await createDummyEncounter(models)),
      patientId: patient.id,
    });
    const { id: dischargeId } = await models.Discharge.create({
      encounterId: encounter.id,
      dischargerId: app.user.id,
    });

    const result = await app.get(`/api/encounter/${encounter.id}/discharge`);

    expect(result).toHaveSucceeded();
    expect(result.body).toMatchObject({
      id: dischargeId,
      encounterId: encounter.id,
      dischargerId: app.user.id,
      discharger: {
        id: app.user.id,
      },
    });
  });

  it('should get a list of notes and pin treatment plan notes to the top', async () => {
    const encounter = await models.Encounter.create({
      ...(await createDummyEncounter(models)),
      patientId: patient.id,
    });
    const otherEncounter = await models.Encounter.create({
      ...(await createDummyEncounter(models)),
      patientId: patient.id,
    });
    await Promise.all([
      models.Note.createForRecord(
        encounter.id,
        'Encounter',
        NOTE_TYPES.AREA_TO_BE_IMAGED,
        'Test 1',
      ),
      models.Note.createForRecord(encounter.id, 'Encounter', NOTE_TYPES.TREATMENT_PLAN, 'Test 2'),
      models.Note.createForRecord(encounter.id, 'Encounter', NOTE_TYPES.MEDICAL, 'Test 3'),
      models.Note.createForRecord(
        otherEncounter.id,
        'Encounter',
        NOTE_TYPES.TREATMENT_PLAN,
        'Fail',
      ),
    ]);

    const result = await app.get(`/api/encounter/${encounter.id}/notes`);
    expect(result).toHaveSucceeded();
    expect(result.body.count).toEqual(3);
    expect(result.body.data.every(x => x.content.match(/^Test \d$/))).toEqual(true);
    expect(result.body.data[0].noteType).toEqual(NOTE_TYPES.TREATMENT_PLAN);
  });

  it('should get a list of notes filtered by noteType', async () => {
    const encounter = await models.Encounter.create({
      ...(await createDummyEncounter(models)),
      patientId: patient.id,
    });
    await Promise.all([
      models.Note.createForRecord(encounter.id, 'Encounter', 'treatmentPlan', 'Test 4'),
      models.Note.createForRecord(encounter.id, 'Encounter', 'treatmentPlan', 'Test 5'),
      models.Note.createForRecord(encounter.id, 'Encounter', 'admission', 'Test 6'),
    ]);

    const result = await app.get(`/api/encounter/${encounter.id}/notes?noteType=treatmentPlan`);
    expect(result).toHaveSucceeded();
    expect(result.body.count).toEqual(2);
    expect(result.body.data.every(x => x.noteType === 'treatmentPlan')).toEqual(true);
  });

  it('should get a list of changelog notes of a root note ordered DESC', async () => {
    const encounter = await models.Encounter.create({
      ...(await createDummyEncounter(models)),
      patientId: patient.id,
    });

    const rootNote = await models.Note.create(
      fake(models.Note, {
        recordId: encounter.id,
        recordType: NOTE_RECORD_TYPES.ENCOUNTER,
        content: 'Root note',
        authorId: app.user.id,
        date: toDateTimeString(sub(new Date(), { days: 8 })),
      }),
    );
    const changelog1 = await models.Note.create(
      fake(models.Note, {
        recordId: encounter.id,
        recordType: NOTE_RECORD_TYPES.ENCOUNTER,
        content: 'Changelog1',
        authorId: app.user.id,
        date: toDateTimeString(sub(new Date(), { days: 6 })),
        revisedById: rootNote.id,
      }),
    );
    const changelog2 = await models.Note.create(
      fake(models.Note, {
        recordId: encounter.id,
        recordType: NOTE_RECORD_TYPES.ENCOUNTER,
        content: 'Changelog2',
        authorId: app.user.id,
        date: toDateTimeString(sub(new Date(), { days: 4 })),
        revisedById: rootNote.id,
      }),
    );

    const changelog3 = await models.Note.create(
      fake(models.Note, {
        recordId: encounter.id,
        recordType: NOTE_RECORD_TYPES.ENCOUNTER,
        content: 'Changelog3',
        authorId: app.user.id,
        date: toDateTimeString(sub(new Date(), { days: 2 })),
        revisedById: rootNote.id,
      }),
    );

    const result = await app.get(`/api/encounter/${encounter.id}/notes/${rootNote.id}/changelogs`);
    expect(result).toHaveSucceeded();
    expect(result.body.count).toEqual(4);
    expect(result.body.data[0]).toMatchObject({
      recordId: changelog3.recordId,
      recordType: NOTE_RECORD_TYPES.ENCOUNTER,
      content: changelog3.content,
      authorId: changelog3.authorId,
      date: changelog3.date,
      revisedById: rootNote.id,
    });
    expect(result.body.data[1]).toMatchObject({
      recordId: changelog2.recordId,
      recordType: NOTE_RECORD_TYPES.ENCOUNTER,
      content: changelog2.content,
      authorId: changelog2.authorId,
      date: changelog2.date,
      revisedById: rootNote.id,
    });
    expect(result.body.data[2]).toMatchObject({
      recordId: changelog1.recordId,
      recordType: NOTE_RECORD_TYPES.ENCOUNTER,
      content: changelog1.content,
      authorId: changelog1.authorId,
      date: changelog1.date,
      revisedById: rootNote.id,
    });
  });

  test.todo('should get a list of procedures');
  test.todo('should get a list of prescriptions');

  describe('GET encounter lab requests', () => {
    it('should get a list of lab requests', async () => {
      const encounter = await models.Encounter.create({
        ...(await createDummyEncounter(models)),
        patientId: patient.id,
      });

      const labRequest1 = await models.LabRequest.create({
        ...(await randomLabRequest(models, {
          patientId: patient.id,
          encounterId: encounter.id,
          status: LAB_REQUEST_STATUSES.RECEPTION_PENDING,
        })),
      });
      const labRequest2 = await models.LabRequest.create({
        ...(await randomLabRequest(models, {
          patientId: patient.id,
          encounterId: encounter.id,
          status: LAB_REQUEST_STATUSES.RECEPTION_PENDING,
        })),
      });

      const result = await app.get(`/api/encounter/${encounter.id}/labRequests`);
      expect(result).toHaveSucceeded();
      expect(result.body).toMatchObject({
        count: 2,
        data: expect.any(Array),
      });
      expect(
        isEqual([labRequest1.id, labRequest2.id], [result.body.data[0].id, result.body.data[1].id]),
      ).toBe(true);
    });

    it('Should not include lab requests with a status of deleted or entered in error', async () => {
      const encounter = await models.Encounter.create({
        ...(await createDummyEncounter(models)),
        patientId: patient.id,
      });

      await models.LabRequest.create({
        ...(await randomLabRequest(models, {
          patientId: patient.id,
          encounterId: encounter.id,
          status: LAB_REQUEST_STATUSES.RECEPTION_PENDING,
        })),
      });
      await models.LabRequest.create({
        ...(await randomLabRequest(models, {
          patientId: patient.id,
          encounterId: encounter.id,
          status: LAB_REQUEST_STATUSES.RECEPTION_PENDING,
        })),
      });
      await models.LabRequest.create({
        ...(await randomLabRequest(models, {
          patientId: patient.id,
          encounterId: encounter.id,
          status: LAB_REQUEST_STATUSES.CANCELLED,
        })),
      });
      await models.LabRequest.create({
        ...(await randomLabRequest(models, {
          patientId: patient.id,
          encounterId: encounter.id,
          status: LAB_REQUEST_STATUSES.DELETED,
        })),
      });
      await models.LabRequest.create({
        ...(await randomLabRequest(models, {
          patientId: patient.id,
          encounterId: encounter.id,
          status: LAB_REQUEST_STATUSES.ENTERED_IN_ERROR,
        })),
      });

      const result = await app.get(`/api/encounter/${encounter.id}/labRequests`);
      expect(result).toHaveSucceeded();
      expect(result.body.count).toEqual(3);
      expect(result.body.data.length).toEqual(3);
    });

    it('should get the correct count for a list of lab requests', async () => {
      const encounter = await models.Encounter.create({
        ...(await createDummyEncounter(models)),
        patientId: patient.id,
      });

      const labRequest1 = await models.LabRequest.create({
        ...(await randomLabRequest(models, {
          patientId: patient.id,
          encounterId: encounter.id,
          status: LAB_REQUEST_STATUSES.RECEPTION_PENDING,
        })),
      });
      await models.LabRequest.create({
        ...(await randomLabRequest(models, {
          patientId: patient.id,
          encounterId: encounter.id,
          status: LAB_REQUEST_STATUSES.RECEPTION_PENDING,
        })),
      });

      // Ensure that the count of results is correct even if Lab Lab Requests have many LabTests
      // to ensure that count is not flattening the count results
      await models.LabTest.create({
        labRequestId: labRequest1.id,
      });
      await models.LabTest.create({
        labRequestId: labRequest1.id,
      });
      await models.LabTest.create({
        labRequestId: labRequest1.id,
      });

      const result = await app.get(`/api/encounter/${encounter.id}/labRequests`);
      expect(result).toHaveSucceeded();
      expect(result.body.count).toEqual(2);
      expect(result.body.data.length).toEqual(2);
    });

    it('should get a list of lab requests filtered by status query parameter', async () => {
      const encounter = await models.Encounter.create({
        ...(await createDummyEncounter(models)),
        patientId: patient.id,
      });

      const labRequest1 = await models.LabRequest.create({
        ...(await randomLabRequest(models, {
          patientId: patient.id,
          encounterId: encounter.id,
          status: LAB_REQUEST_STATUSES.RECEPTION_PENDING,
        })),
      });
      await models.LabRequest.create({
        ...(await randomLabRequest(models, {
          patientId: patient.id,
          encounterId: encounter.id,
          status: LAB_REQUEST_STATUSES.RESULTS_PENDING,
        })),
      });

      const result = await app.get(
        `/api/encounter/${encounter.id}/labRequests?status=reception_pending`,
      );
      expect(result).toHaveSucceeded();
      expect(result.body).toMatchObject({
        count: 1,
        data: expect.any(Array),
      });
      expect(labRequest1.id).toEqual(result.body.data[0].id);
    });

    it('should get a list of lab requests NOT including associated note pages if NOT specified in query parameter', async () => {
      const encounter = await models.Encounter.create({
        ...(await createDummyEncounter(models)),
        patientId: patient.id,
      });

      const labRequest1 = await models.LabRequest.create({
        ...(await randomLabRequest(models, {
          patientId: patient.id,
          encounterId: encounter.id,
          status: LAB_REQUEST_STATUSES.RECEPTION_PENDING,
        })),
      });

      await labRequest1.createNote({
        noteType: NOTE_TYPES.AREA_TO_BE_IMAGED,
        content: 'Testing lab request note',
        authorId: app.user.id,
      });

      const result = await app.get(`/api/encounter/${encounter.id}/labRequests`);
      expect(result).toHaveSucceeded();
      expect(result.body).toMatchObject({
        count: 1,
        data: expect.any(Array),
      });
      expect(labRequest1.id).toEqual(result.body.data[0].id);
      expect(result.body.data[0].notes).not.toBeDefined();
    });

    it('should get a list of lab requests including associated note pages if specified in query parameter', async () => {
      const encounter = await models.Encounter.create({
        ...(await createDummyEncounter(models)),
        patientId: patient.id,
      });

      const labRequest1 = await models.LabRequest.create({
        ...(await randomLabRequest(models, {
          patientId: patient.id,
          encounterId: encounter.id,
          status: LAB_REQUEST_STATUSES.RECEPTION_PENDING,
        })),
      });

      const note = await labRequest1.createNote({
        noteType: NOTE_TYPES.AREA_TO_BE_IMAGED,
        content: 'Testing lab request note',
        authorId: app.user.id,
      });

      const result = await app.get(`/api/encounter/${encounter.id}/labRequests?includeNotes=true`);
      expect(result).toHaveSucceeded();
      expect(result.body).toMatchObject({
        count: 1,
        data: expect.any(Array),
      });
      expect(labRequest1.id).toEqual(result.body.data[0].id);
      expect(result.body.data[0].notes[0].content).toEqual(note.content);
    });
  });

  it('should get a list of all documents from an encounter', async () => {
    const encounter = await models.Encounter.create({
      ...(await createDummyEncounter(models)),
      patientId: patient.id,
    });
    const otherEncounter = await models.Encounter.create({
      ...(await createDummyEncounter(models)),
      patientId: patient.id,
    });
    // Create four document metadata objects: two from requested encounter,
    // one from a different encounter, one from the same patient.
    const metadataOne = {
      name: 'one',
      type: 'application/pdf',
      attachmentId: 'fake-id-1',
      encounterId: encounter.id,
    };
    const metadataTwo = {
      name: 'two',
      type: 'application/pdf',
      attachmentId: 'fake-id-2',
      encounterId: encounter.id,
    };
    const metadataThree = {
      name: 'three',
      type: 'application/pdf',
      attachmentId: 'fake-id-3',
      encounterId: otherEncounter.id,
    };
    const metadataFour = {
      name: 'four',
      type: 'application/pdf',
      attachmentId: 'fake-id-4',
      patientId: patient.id,
    };

    await Promise.all([
      models.DocumentMetadata.create(metadataOne),
      models.DocumentMetadata.create(metadataTwo),
      models.DocumentMetadata.create(metadataThree),
      models.DocumentMetadata.create(metadataFour),
    ]);

    const result = await app.get(`/api/encounter/${encounter.id}/documentMetadata`);
    expect(result).toHaveSucceeded();
    expect(result.body).toMatchObject({
      count: 2,
      data: expect.any(Array),
    });
  });

  it('should get a sorted list of documents', async () => {
    const encounter = await models.Encounter.create({
      ...(await createDummyEncounter(models)),
      patientId: patient.id,
    });
    const metadataOne = await models.DocumentMetadata.create({
      name: 'A',
      type: 'application/pdf',
      attachmentId: 'fake-id-1',
      encounterId: encounter.id,
    });
    const metadataTwo = await models.DocumentMetadata.create({
      name: 'B',
      type: 'image/jpeg',
      attachmentId: 'fake-id-2',
      encounterId: encounter.id,
    });

    // Sort by name ASC/DESC (presumably sufficient to test only one field)
    const resultAsc = await app.get(
      `/api/encounter/${encounter.id}/documentMetadata?order=asc&orderBy=name`,
    );
    expect(resultAsc).toHaveSucceeded();
    expect(resultAsc.body.data[0].id).toBe(metadataOne.id);

    const resultDesc = await app.get(
      `/api/encounter/${encounter.id}/documentMetadata?order=desc&orderBy=name`,
    );
    expect(resultDesc).toHaveSucceeded();
    expect(resultDesc.body.data[0].id).toBe(metadataTwo.id);
  });

  it('should get a paginated list of documents', async () => {
    const encounter = await models.Encounter.create({
      ...(await createDummyEncounter(models)),
      patientId: patient.id,
    });

    const documents = [];
    for (let i = 0; i < 12; i++) {
      documents.push({
        name: String(i),
        type: 'application/pdf',
        attachmentId: `fake-id-${i}`,
        encounterId: encounter.id,
      });
    }
    await models.DocumentMetadata.bulkCreate(documents);
    const result = await app.get(
      `/api/encounter/${encounter.id}/documentMetadata?page=1&rowsPerPage=10&offset=5`,
    );
    expect(result).toHaveSucceeded();
    expect(result.body.data.length).toBe(7);
  });

  describe('write', () => {
    it('should reject updating an encounter with insufficient permissions', async () => {
      const noPermsApp = await baseApp.asRole('base');
      const encounter = await models.Encounter.create({
        ...(await createDummyEncounter(models)),
        patientId: patient.id,
        reasonForEncounter: 'intact',
      });

      const result = await noPermsApp.put(`/api/encounter/${encounter.id}`).send({
        reasonForEncounter: 'forbidden',
      });
      expect(result).toBeForbidden();

      const after = await models.Encounter.findByPk(encounter.id);
      expect(after.reasonForEncounter).toEqual('intact');
    });

    it('should reject creating a new encounter with insufficient permissions', async () => {
      const noPermsApp = await baseApp.asRole('base');
      const result = await noPermsApp.post('/api/encounter').send({
        ...(await createDummyEncounter(models)),
        patientId: patient.id,
        reasonForEncounter: 'should-not-be-created',
      });
      expect(result).toBeForbidden();

      const encounters = await models.Encounter.findAll({
        where: {
          patientId: patient.id,
          reasonForEncounter: 'should-not-be-created',
        },
      });
      expect(encounters).toHaveLength(0);
    });

    describe('journey', () => {
      // NB:
      // triage happens in Triage.test.js

      it('should create a new encounter', async () => {
        const result = await app.post('/api/encounter').send({
          ...(await createDummyEncounter(models)),
          patientId: patient.id,
        });
        expect(result).toHaveSucceeded();
        expect(result.body.id).toBeTruthy();
        const encounter = await models.Encounter.findByPk(result.body.id);
        expect(encounter).toBeDefined();
        expect(encounter.patientId).toEqual(patient.id);
      });

      it('should record referralSourceId when create a new encounter', async () => {
        const referralSource = await models.ReferenceData.create({
          id: 'test-referral-source-id',
          type: 'referralSource',
          code: 'test-referral-source-id',
          name: 'Test referral source',
        });

        const result = await app.post('/api/encounter').send({
          ...(await createDummyEncounter(models)),
          patientId: patient.id,
          referralSourceId: referralSource.id,
        });
        expect(result).toHaveSucceeded();
        expect(result.body.id).toBeTruthy();
        const encounter = await models.Encounter.findByPk(result.body.id);
        expect(encounter).toBeDefined();
        expect(encounter.referralSourceId).toEqual(referralSource.id);
      });

      it('should update encounter details', async () => {
        const v = await models.Encounter.create({
          ...(await createDummyEncounter(models)),
          patientId: patient.id,
          reasonForEncounter: 'before',
        });

        const result = await app.put(`/api/encounter/${v.id}`).send({
          reasonForEncounter: 'after',
        });
        expect(result).toHaveSucceeded();

        const updated = await models.Encounter.findByPk(v.id);
        expect(updated.reasonForEncounter).toEqual('after');
      });

      it('should change encounter type and add a note', async () => {
        const v = await models.Encounter.create({
          ...(await createDummyEncounter(models)),
          patientId: patient.id,
          encounterType: 'triage',
        });

        const result = await app.put(`/api/encounter/${v.id}`).send({
          encounterType: 'admission',
        });
        expect(result).toHaveSucceeded();

        const notes = await v.getNotes();
        expect(notes).toHaveLength(1);
        expect(
          notes[0].content.includes('triage') && notes[0].content.includes('admission'),
        ).toEqual(true);
        expect(notes[0].authorId).toEqual(app.user.id);
      });

      it('should fail to change encounter type to an invalid type', async () => {
        const v = await models.Encounter.create({
          ...(await createDummyEncounter(models)),
          patientId: patient.id,
          encounterType: 'triage',
        });

        const result = await app.put(`/api/encounter/${v.id}`).send({
          encounterType: 'not-a-real-encounter-type',
        });
        expect(result).toHaveRequestError();

        const notes = await v.getNotes();
        expect(notes).toHaveLength(0);
      });

      it('should change encounter department and add a note', async () => {
        const departments = await models.Department.findAll({ limit: 2 });

        const v = await models.Encounter.create({
          ...(await createDummyEncounter(models)),
          patientId: patient.id,
          departmentId: departments[0].id,
        });

        const result = await app.put(`/api/encounter/${v.id}`).send({
          departmentId: departments[1].id,
        });
        expect(result).toHaveSucceeded();

        const notes = await v.getNotes();
        expect(notes).toHaveLength(1);
        expect(
          notes[0].content.includes(departments[0].name) &&
            notes[0].content.includes(departments[1].name),
        ).toEqual(true);
        expect(notes[0].authorId).toEqual(app.user.id);
      });

      it('should change encounter location and add a note', async () => {
        const [fromLocation, toLocation] = await models.Location.findAll({ limit: 2 });

        const v = await models.Encounter.create({
          ...(await createDummyEncounter(models)),
          patientId: patient.id,
          locationId: fromLocation.id,
        });

        const result = await app.put(`/api/encounter/${v.id}`).send({
          locationId: toLocation.id,
        });
        expect(result).toHaveSucceeded();

        const notes = await v.getNotes();
        expect(notes).toHaveLength(1);
        expect(
          notes[0].content.includes(fromLocation.name) &&
            notes[0].content.includes(toLocation.name),
        ).toEqual(true);
        expect(notes[0].authorId).toEqual(app.user.id);
      });

      it('should include comma separated location_group and location name in created note on updating encounter location', async () => {
        const facility = await models.Facility.create(fake(models.Facility));
        const locationGroup = await models.LocationGroup.create({
          ...fake(models.LocationGroup),
          facilityId: facility.id,
        });
        const locationGroup2 = await models.LocationGroup.create({
          ...fake(models.LocationGroup),
          facilityId: facility.id,
        });
        const location = await models.Location.create({
          ...fake(models.Location),
          locationGroupId: locationGroup.id,
          facilityId: facility.id,
        });
        const location2 = await models.Location.create({
          ...fake(models.Location),
          locationGroupId: locationGroup2.id,
          facilityId: facility.id,
        });
        const encounter = await models.Encounter.create({
          ...(await createDummyEncounter(models)),
          patientId: patient.id,
          locationId: location.id,
        });
        const result = await app.put(`/api/encounter/${encounter.id}`).send({
          locationId: location2.id,
        });

        const [notes] = await encounter.getNotes();

        expect(result).toHaveSucceeded();
        expect(notes.content).toEqual(
          `Changed location from ${locationGroup.name}, ${location.name} to ${locationGroup2.name}, ${location2.name}`,
        );
      });

      it('should change encounter clinician and add a note', async () => {
        const fromClinician = await models.User.create(fakeUser());
        const toClinician = await models.User.create(fakeUser());

        const existingEncounter = await models.Encounter.create({
          ...(await createDummyEncounter(models)),
          patientId: patient.id,
          examinerId: fromClinician.id,
        });

        const result = await app.put(`/api/encounter/${existingEncounter.id}`).send({
          examinerId: toClinician.id,
        });
        expect(result).toHaveSucceeded();

        const updatedEncounter = await models.Encounter.findOne({
          where: { id: existingEncounter.id },
        });
        expect(updatedEncounter.examinerId).toEqual(toClinician.id);

        const notes = await existingEncounter.getNotes();
        expect(notes).toHaveLength(1);
        expect(notes[0].content).toEqual(
          `Changed supervising clinician from ${fromClinician.displayName} to ${toClinician.displayName}`,
        );
        expect(notes[0].authorId).toEqual(app.user.id);
      });

      it('should discharge a patient', async () => {
        const v = await models.Encounter.create({
          ...(await createDummyEncounter(models)),
          patientId: patient.id,
          startDate: toDateTimeString(subWeeks(new Date(), 4)),
          endDate: null,
          reasonForEncounter: 'before',
        });
        const endDate = getCurrentDateTimeString();

        const result = await app.put(`/api/encounter/${v.id}`).send({
          endDate,
          discharge: {
            encounterId: v.id,
            dischargerId: app.user.id,
          },
        });
        expect(result).toHaveSucceeded();

        const updated = await models.Encounter.findByPk(v.id);
        expect(updated.endDate).toEqual(endDate);

        const discharges = await models.Discharge.findAll({
          where: { encounterId: v.id },
        });
        // Discharges have a 1-1 relationship with encounters
        expect(discharges).toHaveLength(1);
        expect(discharges[0]).toMatchObject({
          encounterId: v.id,
          dischargerId: app.user.id,
        });

        const notes = await v.getNotes();
        expect(notes).toHaveLength(1);
        expect(notes[0].content.includes('Patient discharged by')).toEqual(true);
        expect(notes[0].authorId).toEqual(app.user.id);
      });

      it('should only update medications marked for discharge', async () => {
        // Create encounter to be discharged
        const encounter = await models.Encounter.create({
          ...(await createDummyEncounter(models, { current: true })),
          patientId: patient.id,
        });

        // Create two encounter medications with specific quantities to compare
        const medicationOne = await models.EncounterMedication.create({
          ...(await createDummyEncounterMedication(models, { quantity: 1 })),
          encounterId: encounter.id,
        });
        const medicationTwo = await models.EncounterMedication.create({
          ...(await createDummyEncounterMedication(models, { quantity: 2 })),
          encounterId: encounter.id,
        });

        // Mark only one medication for discharge
        const result = await app.put(`/api/encounter/${encounter.id}`).send({
          endDate: new Date(),
          discharge: {
            encounterId: encounter.id,
            dischargerId: app.user.id,
          },
          medications: {
            [medicationOne.id]: {
              isDischarge: true,
              quantity: 3,
              repeats: 0,
            },
            [medicationTwo.id]: {
              isDischarge: false,
              quantity: 0,
              repeats: 1,
            },
          },
        });
        expect(result).toHaveSucceeded();

        // Reload medications and make sure only the first one got edited
        await Promise.all([medicationOne.reload(), medicationTwo.reload()]);

        // Only compare explicitly set values
        expect(medicationOne.dataValues).toMatchObject({
          id: medicationOne.id,
          isDischarge: true,
          quantity: 3,
          repeats: 0,
        });
        expect(medicationTwo.dataValues).toMatchObject({
          id: medicationTwo.id,
          quantity: 2,
        });
      });

      it('should not update encounter to an invalid location or add a note', async () => {
        const v = await models.Encounter.create({
          ...(await createDummyEncounter(models)),
          patientId: patient.id,
        });

        const result = await app.put(`/api/encounter/${v.id}`).send({
          locationId: 'invalid-location-id',
        });

        expect(result).toHaveRequestError();
      });

      it('should roll back a whole modification if part of it is invalid', async () => {
        // to test this, we're going to do a valid location change and an invalid encounter type update

        const [fromLocation, toLocation] = await models.Location.findAll({ limit: 2 });

        const v = await models.Encounter.create({
          ...(await createDummyEncounter(models)),
          encounterType: 'clinic',
          patientId: patient.id,
          locationId: fromLocation.id,
        });

        const result = await app.put(`/api/encounter/${v.id}`).send({
          locationId: toLocation.id,
          encounterType: 'not-a-real-encounter-type',
        });
        expect(result).toHaveRequestError();

        const updatedEncounter = await models.Encounter.findByPk(v.id);
        expect(updatedEncounter).toHaveProperty('encounterType', 'clinic');
        expect(updatedEncounter).toHaveProperty('locationId', fromLocation.id);

        const notes = await v.getNotes();
        expect(notes).toHaveLength(0);
      });

      test.todo('should not admit a patient who is already in an encounter');
      test.todo('should not admit a patient who is dead');
    });

    describe('diagnoses', () => {
      let diagnosisEncounter = null;
      let testDiagnosis = null;

      beforeAll(async () => {
        diagnosisEncounter = await models.Encounter.create({
          ...(await createDummyEncounter(models)),
          patientId: patient.id,
          reasonForEncounter: 'diagnosis test',
        });

        testDiagnosis = await models.ReferenceData.create({
          type: 'icd10',
          name: 'Malady',
          code: 'malady',
        });
      });

      it('should record a diagnosis', async () => {
        const result = await app.post('/api/diagnosis').send({
          encounterId: diagnosisEncounter.id,
          diagnosisId: testDiagnosis.id,
        });
        expect(result).toHaveSucceeded();
        expect(result.body.date).toBeTruthy();
      });

      it('should get diagnoses for an encounter', async () => {
        const result = await app.get(`/api/encounter/${diagnosisEncounter.id}/diagnoses`);
        expect(result).toHaveSucceeded();
        const { body } = result;
        expect(body.count).toBeGreaterThan(0);
        expect(body.data[0].diagnosisId).toEqual(testDiagnosis.id);
      });

      it('should get diagnosis reference info when listing encounters', async () => {
        const result = await app.get(`/api/encounter/${diagnosisEncounter.id}/diagnoses`);
        expect(result).toHaveSucceeded();
        const { body } = result;
        expect(body.count).toBeGreaterThan(0);
        expect(body.data[0].diagnosis.name).toEqual('Malady');
        expect(body.data[0].diagnosis.code).toEqual('malady');
      });
    });

    describe('medication', () => {
      let medicationEncounter = null;
      let testMedication = null;

      beforeAll(async () => {
        medicationEncounter = await models.Encounter.create({
          ...(await createDummyEncounter(models)),
          patientId: patient.id,
          reasonForEncounter: 'medication test',
        });

        testMedication = await models.ReferenceData.create({
          type: 'drug',
          name: 'Checkizol',
          code: 'check',
        });
      });

      it('should record a medication', async () => {
        const result = await app.post('/api/medication').send({
          encounterId: medicationEncounter.id,
          medicationId: testMedication.id,
          prescriberId: app.user.id,
        });
        expect(result).toHaveSucceeded();
        expect(result.body.date).toBeTruthy();
      });

      it('should get medications for an encounter', async () => {
        const result = await app.get(`/api/encounter/${medicationEncounter.id}/medications`);
        expect(result).toHaveSucceeded();
        const { body } = result;
        expect(body.count).toBeGreaterThan(0);
        expect(body.data[0].medicationId).toEqual(testMedication.id);
      });

      it('should get medication reference info when listing encounters', async () => {
        const result = await app.get(`/api/encounter/${medicationEncounter.id}/medications`);
        expect(result).toHaveSucceeded();
        const { body } = result;
        expect(body.count).toBeGreaterThan(0);
        expect(body.data[0].medication.name).toEqual('Checkizol');
        expect(body.data[0].medication.code).toEqual('check');
      });
    });

    describe('vitals', () => {
      let vitalsEncounter = null;
      let vitalsPatient = null;

      beforeAll(async () => {
        // The original patient may or may not have a current encounter
        // So let's create a specific one for vitals testing
        vitalsPatient = await models.Patient.create(await createDummyPatient(models));
        vitalsEncounter = await models.Encounter.create({
          ...(await createDummyEncounter(models, { endDate: null })),
          patientId: vitalsPatient.id,
          reasonForEncounter: 'vitals test',
        });

        await setupSurveyFromObject(models, {
          program: {
            id: 'vitals-program',
          },
          survey: {
            id: 'vitals-survey',
            survey_type: 'vitals',
          },
          questions: [
            {
              name: 'PatientVitalsDate',
              type: 'Date',
            },
            {
              name: 'PatientVitalsWeight',
              type: 'Number',
            },
            {
              name: 'PatientVitalsHeight',
              type: 'Number',
            },
            {
              name: 'PatientVitalsHeartRate',
              type: 'Number',
            },
            {
              name: 'PatientVitalsSBP',
              type: 'Number',
            },
          ],
        });
      });

      describe('basic vital features', () => {
        beforeEach(async () => {
          await models.VitalLog.truncate({});
          await models.SurveyResponseAnswer.truncate({});
          await models.SurveyResponse.truncate({});
        });
        it('should record a new vitals reading', async () => {
          const submissionDate = getCurrentDateTimeString();
          const result = await app.post('/api/surveyResponse').send({
            surveyId: 'vitals-survey',
            patientId: vitalsPatient.id,
            startTime: submissionDate,
            endTime: submissionDate,
            answers: {
              'pde-PatientVitalsDate': submissionDate,
              'pde-PatientVitalsHeartRate': 1234,
            },
          });
          expect(result).toHaveSucceeded();
          const saved = await models.SurveyResponseAnswer.findOne({
            where: { dataElementId: 'pde-PatientVitalsHeartRate', body: '1234' },
          });
          expect(saved).toHaveProperty('body', '1234');
        });

        it('should get vitals readings for an encounter', async () => {
          const submissionDate = getCurrentDateTimeString();
          const answers = {
            'pde-PatientVitalsDate': submissionDate,
            'pde-PatientVitalsHeartRate': 123,
            'pde-PatientVitalsHeight': 456,
            'pde-PatientVitalsWeight': 789,
          };
          await app.post('/api/surveyResponse').send({
            surveyId: 'vitals-survey',
            patientId: vitalsPatient.id,
            startTime: submissionDate,
            endTime: submissionDate,
            answers,
          });
          const result = await app.get(`/api/encounter/${vitalsEncounter.id}/vitals`);
          expect(result).toHaveSucceeded();
          const { body } = result;
          expect(body).toHaveProperty('count');
          expect(body.count).toBeGreaterThan(0);
          expect(body).toHaveProperty('data');
          expect(body.data).toEqual(
            expect.arrayContaining(
              Object.entries(answers).map(([key, value]) =>
                expect.objectContaining({
                  dataElementId: key,
                  records: {
                    [submissionDate]: expect.objectContaining({
                      id: expect.any(String),
                      body: value.toString(),
                      logs: null,
                    }),
                  },
                }),
              ),
            ),
          );
        });
      });

      describe('vitals data by data element id', () => {
        const nullAnswer = {
          responseId: 'response_id_5',
          submissionDate: formatISO9075(addHours(new Date(), -5)),
          value: 'null', // null value exist on the databases for historical reasons
        };
        const answers = [
          {
            responseId: 'response_id_1',
            submissionDate: formatISO9075(addHours(new Date(), -1)),
            value: 122,
          },
          {
            responseId: 'response_id_2',
            submissionDate: formatISO9075(addHours(new Date(), -3)),
            value: 155,
          },
          {
            responseId: 'response_id_3',
            submissionDate: formatISO9075(addHours(new Date(), -2)),
            value: 133,
          },
          {
            responseId: 'response_id_4',
            submissionDate: formatISO9075(addHours(new Date(), -4)),
            value: '',
          },
          nullAnswer,
        ];
        const patientVitalSbpKey = VITALS_DATA_ELEMENT_IDS.sbp;

        beforeAll(async () => {
          for (const answer of answers) {
            const { submissionDate, value, responseId } = answer;
            const surveyResponseAnswersBody = {
              'pde-PatientVitalsDate': submissionDate,
              [patientVitalSbpKey]: value,
            };
            await app.post('/api/surveyResponse').send({
              id: responseId,
              surveyId: 'vitals-survey',
              patientId: vitalsPatient.id,
              startTime: submissionDate,
              endTime: submissionDate,
              answers: surveyResponseAnswersBody,
            });
          }

          // Can't import null value by endpoint as it is prevented, so we have to update it manually
          await models.SurveyResponseAnswer.update(
            { body: null },
            {
              where: {
                response_id: nullAnswer.responseId,
                data_element_id: patientVitalSbpKey,
              },
            },
          );
        });

        afterAll(async () => {
          for (const answer of answers) {
            await models.SurveyResponseAnswer.destroy({
              where: {
                response_id: answer.responseId,
              },
            });
            await models.SurveyResponse.destroy({
              where: {
                id: answer.responseId,
              },
            });
          }
        });

        it('should get vital data within time frame and filter out empty and null value', async () => {
          const startDateString = formatISO9075(addHours(new Date(), -4));
          const endDateString = formatISO9075(new Date());
          const expectedAnswers = answers.filter(
            answer => answer.value !== '' && answer.value !== nullAnswer.value,
          );

          const result = await app.get(
            `/api/encounter/${vitalsEncounter.id}/vitals/${patientVitalSbpKey}?startDate=${startDateString}&endDate=${endDateString}`,
          );
          expect(result).toHaveSucceeded();
          const { body } = result;
          expect(body).toHaveProperty('count');
          expect(body.count).toEqual(expectedAnswers.length);
          expect(body).toHaveProperty('data');
          expect(body.data).toEqual(
            expect.arrayContaining(
              expectedAnswers.map(answer =>
                expect.objectContaining({
                  dataElementId: patientVitalSbpKey,
                  body: answer.value.toString(),
                  recordedDate: answer.submissionDate,
                }),
              ),
            ),
          );

          const expectedRecordedDate = [...expectedAnswers]
            .sort((a, b) => (a.submissionDate > b.submissionDate ? 1 : -1))
            .map(answer => answer.submissionDate);
          const resultRecordedDate = body.data.map(data => data.recordedDate);
          expect(resultRecordedDate).toEqual(expectedRecordedDate);
        });

        it('should get vital data on the edge of time frame (equal to startdate)', async () => {
          const startDateString = answers[0].submissionDate;
          const endDateString = formatISO9075(new Date());
          const result = await app.get(
            `/api/encounter/${vitalsEncounter.id}/vitals/${patientVitalSbpKey}?startDate=${startDateString}&endDate=${endDateString}`,
          );
          expect(result).toHaveSucceeded();
          const { body } = result;
          expect(body).toHaveProperty('count');
          expect(body.count).toEqual(1);
          expect(body).toHaveProperty('data');
          expect(body.data).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                dataElementId: patientVitalSbpKey,
                body: answers[0].value.toString(),
                recordedDate: answers[0].submissionDate,
              }),
            ]),
          );
        });
      });
    });

    describe('document metadata', () => {
      it('should fail creating a document metadata if the encounter ID does not exist', async () => {
        const result = await app.post('/api/encounter/123456789/documentMetadata').send({
          name: 'test document',
          documentOwner: 'someone',
          note: 'some note',
        });
        expect(result).toHaveRequestError();
      });

      it('should create a document metadata', async () => {
        const encounter = await models.Encounter.create({
          ...(await createDummyEncounter(models)),
          patientId: patient.id,
        });

        // Mock function gets called inside api route
        uploadAttachment.mockImplementationOnce(req => ({
          metadata: { ...req.body },
          type: 'application/pdf',
          attachmentId: '123456789',
        }));

        const result = await app.post(`/api/encounter/${encounter.id}/documentMetadata`).send({
          name: 'test document',
          type: 'application/pdf',
          source: DOCUMENT_SOURCES.PATIENT_LETTER,
          documentOwner: 'someone',
          note: 'some note',
        });
        expect(result).toHaveSucceeded();
        expect(result.body.id).toBeTruthy();
        const metadata = await models.DocumentMetadata.findByPk(result.body.id);
        expect(metadata).toBeDefined();
        expect(uploadAttachment.mock.calls.length).toBe(1);
      });
    });

    describe('imaging request', () => {
      it('should get a list of imaging requests', async () => {
        // arrange
        const encounter = await models.Encounter.create({
          ...(await createDummyEncounter(models)),
          patientId: patient.id,
        });

        const imagingRequest = await models.ImagingRequest.create(
          fake(models.ImagingRequest, {
            patientId: patient.id,
            encounterId: encounter.id,
            requestedById: app.user.id,
            status: IMAGING_REQUEST_STATUS_TYPES.PENDING,
          }),
        );

        const areaRefData = await models.ReferenceData.create(
          fake(models.ReferenceData, { type: 'xRayImagingArea' }),
        );

        const area = await models.ImagingRequestArea.create(
          fake(models.ImagingRequestArea, {
            areaId: areaRefData.id,
            imagingRequestId: imagingRequest.id,
          }),
        );

        // act
        const result = await app.get(
          `/api/encounter/${encodeURIComponent(encounter.id)}/imagingRequests`,
        );

        // assert
        expect(result).toHaveSucceeded();
        expect(result.body).toMatchObject({
          count: 1,
          data: expect.any(Array),
        });
        const resultLabReq = result.body.data[0];
        expect(resultLabReq.areas).toEqual([
          expect.objectContaining({
            id: areaRefData.id,
            ImagingRequestArea: expect.objectContaining({ id: area.id }),
          }),
        ]);
      });

      it('should get a list of imaging requests ordered by joined column', async () => {
        // arrange

        const practictionerB = await models.User.create({ ...fakeUser(), displayName: 'B' });
        const practictionerA = await models.User.create({ ...fakeUser(), displayName: 'A' });
        const encounter = await models.Encounter.create({
          ...(await createDummyEncounter(models)),
          patientId: patient.id,
        });

        const imagingRequestB = await models.ImagingRequest.create(
          fake(models.ImagingRequest, {
            patientId: patient.id,
            encounterId: encounter.id,
            requestedById: practictionerB.id,
            status: IMAGING_REQUEST_STATUS_TYPES.PENDING,
          }),
        );

        const imagingRequestA = await models.ImagingRequest.create(
          fake(models.ImagingRequest, {
            patientId: patient.id,
            encounterId: encounter.id,
            requestedById: practictionerA.id,
            status: IMAGING_REQUEST_STATUS_TYPES.PENDING,
          }),
        );

        // act
        const result = await app.get(
          `/api/encounter/${encodeURIComponent(
            encounter.id,
          )}/imagingRequests?orderBy=requestedBy.displayName&order=asc`,
        );

        // assert
        expect(result).toHaveSucceeded();
        expect(result.body).toMatchObject({
          count: 2,
          data: [
            expect.objectContaining({ id: imagingRequestA.id }),
            expect.objectContaining({ id: imagingRequestB.id }),
          ],
        });
      });
    });

    describe('encounter history', () => {
      describe('single change', () => {
        it('should record an encounter history when an encounter is created', async () => {
          const result = await app.post('/api/encounter').send({
            ...(await createDummyEncounter(models)),
            patientId: patient.id,
          });

          expect(result).toHaveSucceeded();
          const encounter = await models.Encounter.findByPk(result.body.id);

          const encounterHistoryRecords = await models.EncounterHistory.findAll({
            where: {
              encounterId: encounter.id,
            },
          });

          expect(encounterHistoryRecords).toHaveLength(1);
          expect(encounterHistoryRecords[0]).toMatchObject({
            encounterId: encounter.id,
            departmentId: encounter.departmentId,
            locationId: encounter.locationId,
            examinerId: encounter.examinerId,
            encounterType: encounter.encounterType,
            actorId: user.id,
            date: encounter.startDate,
          });
        });

        it('should record an encounter history for a location change', async () => {
          const [oldLocation, newLocation] = await models.Location.findAll({ limit: 2 });
          const submittedTime = getCurrentDateTimeString();
          const result = await app.post('/api/encounter').send({
            ...(await createDummyEncounter(models)),
            patientId: patient.id,
            locationId: oldLocation.id,
          });

          expect(result).toHaveSucceeded();
          const encounter = await models.Encounter.findByPk(result.body.id);

          const updateResult = await app.put(`/api/encounter/${encounter.id}`).send({
            locationId: newLocation.id,
            submittedTime,
          });

          expect(updateResult).toHaveSucceeded();

          const encounterHistoryRecords = await models.EncounterHistory.findAll({
            where: {
              encounterId: encounter.id,
            },
          });

          expect(encounterHistoryRecords).toHaveLength(2);
          expect(encounterHistoryRecords[0]).toMatchObject({
            encounterId: encounter.id,
            departmentId: encounter.departmentId,
            locationId: oldLocation.id,
            examinerId: encounter.examinerId,
            encounterType: encounter.encounterType,
            actorId: user.id,
            date: encounter.startDate,
          });

          expect(encounterHistoryRecords[1]).toMatchObject({
            date: submittedTime,
            encounterId: encounter.id,
            departmentId: encounter.departmentId,
            locationId: newLocation.id,
            examinerId: encounter.examinerId,
            encounterType: encounter.encounterType,
            changeType: EncounterChangeType.Location,
            actorId: user.id,
          });
        });

        it('should record an encounter history for a department change', async () => {
          const [oldDepartment, newDepartment] = await models.Department.findAll({ limit: 2 });
          const submittedTime = getCurrentDateTimeString();
          const result = await app.post('/api/encounter').send({
            ...(await createDummyEncounter(models)),
            patientId: patient.id,
            departmentId: oldDepartment.id,
          });

          expect(result).toHaveSucceeded();
          const encounter = await models.Encounter.findByPk(result.body.id);

          const updateResult = await app.put(`/api/encounter/${encounter.id}`).send({
            departmentId: newDepartment.id,
            submittedTime,
          });

          expect(updateResult).toHaveSucceeded();

          const encounterHistoryRecords = await models.EncounterHistory.findAll({
            where: {
              encounterId: encounter.id,
            },
          });

          expect(encounterHistoryRecords).toHaveLength(2);
          expect(encounterHistoryRecords[0]).toMatchObject({
            encounterId: encounter.id,
            departmentId: oldDepartment.id,
            locationId: encounter.locationId,
            examinerId: encounter.examinerId,
            encounterType: encounter.encounterType,
            actorId: user.id,
            date: encounter.startDate,
          });
          expect(encounterHistoryRecords[1]).toMatchObject({
            date: submittedTime,
            encounterId: encounter.id,
            departmentId: newDepartment.id,
            locationId: encounter.locationId,
            examinerId: encounter.examinerId,
            encounterType: encounter.encounterType,
            changeType: EncounterChangeType.Department,
            actorId: user.id,
          });
        });

        it('should record an encounter history for a clinician change', async () => {
          const [oldClinician, newClinician] = await models.User.findAll({ limit: 2 });
          const submittedTime = getCurrentDateTimeString();

          const result = await app.post('/api/encounter').send({
            ...(await createDummyEncounter(models)),
            patientId: patient.id,
            examinerId: oldClinician.id,
          });

          expect(result).toHaveSucceeded();
          const encounter = await models.Encounter.findByPk(result.body.id);

          const updateResult = await app.put(`/api/encounter/${encounter.id}`).send({
            examinerId: newClinician.id,
            submittedTime,
          });

          expect(updateResult).toHaveSucceeded();

          const encounterHistoryRecords = await models.EncounterHistory.findAll({
            where: {
              encounterId: encounter.id,
            },
          });

          expect(encounterHistoryRecords).toHaveLength(2);
          expect(encounterHistoryRecords[0]).toMatchObject({
            encounterId: encounter.id,
            departmentId: encounter.departmentId,
            locationId: encounter.locationId,
            examinerId: oldClinician.id,
            encounterType: encounter.encounterType,
            actorId: user.id,
            date: encounter.startDate,
          });
          expect(encounterHistoryRecords[1]).toMatchObject({
            date: submittedTime,
            encounterId: encounter.id,
            departmentId: encounter.departmentId,
            locationId: encounter.locationId,
            examinerId: newClinician.id,
            encounterType: encounter.encounterType,
            changeType: EncounterChangeType.Examiner,
            actorId: user.id,
          });
        });

        it('should record an encounter history for an encounter type change', async () => {
          const oldEncounterType = 'admission';
          const newEncounterType = 'clinic';
          const submittedTime = getCurrentDateTimeString();

          const result = await app.post('/api/encounter').send({
            ...(await createDummyEncounter(models)),
            patientId: patient.id,
            encounterType: oldEncounterType,
          });

          expect(result).toHaveSucceeded();
          const encounter = await models.Encounter.findByPk(result.body.id);

          const updateResult = await app.put(`/api/encounter/${encounter.id}`).send({
            encounterType: newEncounterType,
            submittedTime,
          });

          expect(updateResult).toHaveSucceeded();

          const encounterHistoryRecords = await models.EncounterHistory.findAll({
            where: {
              encounterId: encounter.id,
            },
          });

          expect(encounterHistoryRecords).toHaveLength(2);
          expect(encounterHistoryRecords[0]).toMatchObject({
            encounterId: encounter.id,
            departmentId: encounter.departmentId,
            locationId: encounter.locationId,
            examinerId: encounter.examinerId,
            encounterType: oldEncounterType,
            actorId: user.id,
            date: encounter.startDate,
          });
          expect(encounterHistoryRecords[1]).toMatchObject({
            date: submittedTime,
            encounterId: encounter.id,
            departmentId: encounter.departmentId,
            locationId: encounter.locationId,
            examinerId: encounter.examinerId,
            encounterType: newEncounterType,
            changeType: EncounterChangeType.EncounterType,
            actorId: user.id,
          });
        });
      });

      describe('multiple changes', () => {
        it('should record an encounter history for mixed changes', async () => {
          const [oldLocation, newLocation] = await models.Location.findAll({ limit: 2 });
          const [oldDepartment, newDepartment] = await models.Department.findAll({ limit: 2 });
          const [oldClinician, newClinician] = await models.User.findAll({ limit: 2 });

          const result = await app.post('/api/encounter').send({
            ...(await createDummyEncounter(models)),
            patientId: patient.id,
            examinerId: oldClinician.id,
            locationId: oldLocation.id,
            departmentId: oldDepartment.id,
          });

          expect(result).toHaveSucceeded();
          const encounter = await models.Encounter.findByPk(result.body.id);

          const locationChangeSubmittedTime = getCurrentDateTimeString();

          const updateResult = await app.put(`/api/encounter/${encounter.id}`).send({
            locationId: newLocation.id,
            submittedTime: locationChangeSubmittedTime,
          });
          expect(updateResult).toHaveSucceeded();

          let encounterHistoryRecords = await models.EncounterHistory.findAll({
            where: {
              encounterId: encounter.id,
            },
            order: [['date', 'ASC']],
          });

          expect(encounterHistoryRecords).toHaveLength(2);
          expect(encounterHistoryRecords[0]).toMatchObject({
            encounterId: encounter.id,
            departmentId: encounter.departmentId,
            locationId: oldLocation.id,
            examinerId: encounter.examinerId,
            encounterType: encounter.encounterType,
            date: encounter.startDate,
          });
          expect(encounterHistoryRecords[1]).toMatchObject({
            date: locationChangeSubmittedTime,
            encounterId: encounter.id,
            departmentId: encounter.departmentId,
            locationId: newLocation.id,
            examinerId: encounter.examinerId,
            encounterType: encounter.encounterType,
          });

          const departmentChangeSubmittedTime = getCurrentDateTimeString();
          const updateResult2 = await app.put(`/api/encounter/${encounter.id}`).send({
            departmentId: newDepartment.id,
            submittedTime: departmentChangeSubmittedTime,
          });

          expect(updateResult2).toHaveSucceeded();

          encounterHistoryRecords = await models.EncounterHistory.findAll({
            where: {
              encounterId: encounter.id,
            },
            order: [['date', 'ASC']],
          });

          expect(encounterHistoryRecords).toHaveLength(3);
          expect(encounterHistoryRecords[0]).toMatchObject({
            encounterId: encounter.id,
            departmentId: encounter.departmentId,
            locationId: encounter.locationId,
            examinerId: encounter.examinerId,
            encounterType: encounter.encounterType,
            actorId: user.id,
            date: encounter.startDate,
          });
          expect(encounterHistoryRecords[1]).toMatchObject({
            date: locationChangeSubmittedTime,
            encounterId: encounter.id,
            departmentId: encounter.departmentId,
            locationId: newLocation.id,
            examinerId: encounter.examinerId,
            encounterType: encounter.encounterType,
            actorId: user.id,
            changeType: EncounterChangeType.Location,
          });
          expect(encounterHistoryRecords[2]).toMatchObject({
            date: departmentChangeSubmittedTime,
            encounterId: encounter.id,
            departmentId: newDepartment.id,
            locationId: newLocation.id,
            examinerId: encounter.examinerId,
            encounterType: encounter.encounterType,
            actorId: user.id,
            changeType: EncounterChangeType.Department,
          });

          const clinicianChangeSubmittedTime = getCurrentDateTimeString();
          const updateResult3 = await app.put(`/api/encounter/${encounter.id}`).send({
            examinerId: newClinician.id,
            submittedTime: clinicianChangeSubmittedTime,
          });

          expect(updateResult3).toHaveSucceeded();

          encounterHistoryRecords = await models.EncounterHistory.findAll({
            where: {
              encounterId: encounter.id,
            },
            order: [['date', 'ASC']],
          });

          expect(encounterHistoryRecords).toHaveLength(4);
          expect(encounterHistoryRecords[0]).toMatchObject({
            encounterId: encounter.id,
            departmentId: encounter.departmentId,
            locationId: encounter.locationId,
            examinerId: encounter.examinerId,
            encounterType: encounter.encounterType,
            actorId: user.id,
            date: encounter.startDate,
          });
          expect(encounterHistoryRecords[1]).toMatchObject({
            date: locationChangeSubmittedTime,
            encounterId: encounter.id,
            departmentId: encounter.departmentId,
            locationId: newLocation.id,
            examinerId: encounter.examinerId,
            encounterType: encounter.encounterType,
            actorId: user.id,
            changeType: EncounterChangeType.Location,
          });
          expect(encounterHistoryRecords[2]).toMatchObject({
            date: departmentChangeSubmittedTime,
            encounterId: encounter.id,
            departmentId: newDepartment.id,
            locationId: newLocation.id,
            examinerId: encounter.examinerId,
            encounterType: encounter.encounterType,
            actorId: user.id,
            changeType: EncounterChangeType.Department,
          });
          expect(encounterHistoryRecords[3]).toMatchObject({
            date: clinicianChangeSubmittedTime,
            encounterId: encounter.id,
            departmentId: newDepartment.id,
            locationId: newLocation.id,
            examinerId: newClinician.id,
            encounterType: encounter.encounterType,
            actorId: user.id,
            changeType: EncounterChangeType.Examiner,
          });
        });
      });

      describe('multiple changes in 1 encounter update', () => {
        it('throws an error if multiple changes happen in 1 encounter update', async () => {
          const [oldLocation, newLocation] = await models.Location.findAll({ limit: 2 });
          const [oldDepartment, newDepartment] = await models.Department.findAll({ limit: 2 });
          const [clinician] = await models.User.findAll({ limit: 1 });

          const result = await app.post('/api/encounter').send({
            ...(await createDummyEncounter(models)),
            patientId: patient.id,
            examinerId: clinician.id,
            locationId: oldLocation.id,
            departmentId: oldDepartment.id,
          });

          expect(result).toHaveSucceeded();
          const encounter = await models.Encounter.findByPk(result.body.id);

          const locationChangeSubmittedTime = getCurrentDateTimeString();
          const updateResult = await app.put(`/api/encounter/${encounter.id}`).send({
            locationId: newLocation.id, // update new location
            departmentId: newDepartment.id, // update new department
            examinerId: clinician.id,
            submittedTime: locationChangeSubmittedTime,
          });

          expect(updateResult).toHaveRequestError();
          expect(updateResult.body.error.message).toEqual(
            'Encounter type, department, location and clinician must be changed in separate operations',
          );

          const newEncounter = await models.Encounter.findByPk(result.body.id);

          // Confirm that the encounter has not been changed if an error has been thrown
          expect(newEncounter).toMatchObject({
            patientId: patient.id,
            examinerId: clinician.id,
            locationId: oldLocation.id,
            departmentId: oldDepartment.id,
          });

          const encounterHistoryRecords = await models.EncounterHistory.findAll({
            where: {
              encounterId: encounter.id,
            },
            order: [['date', 'ASC']],
          });

          // only 1 encounter history for initial encounter snapshot
          expect(encounterHistoryRecords).toHaveLength(1);
          expect(encounterHistoryRecords[0]).toMatchObject({
            encounterId: encounter.id,
            departmentId: encounter.departmentId,
            locationId: encounter.locationId,
            examinerId: encounter.examinerId,
            encounterType: encounter.encounterType,
            actorId: user.id,
          });
        });
      });
    });

    test.todo('should record a note');
    test.todo('should update a note');

    describe('Planned location move', () => {
      it('Adding a planned location should also add a planned location time', async () => {
        const [location, plannedLocation] = await models.Location.findAll({ limit: 2 });
        const submittedTime = getCurrentDateTimeString();
        const encounter = await models.Encounter.create({
          ...(await createDummyEncounter(models)),
          patientId: patient.id,
          locationId: location.id,
        });

        const result = await app.put(`/api/encounter/${encounter.id}`).send({
          plannedLocationId: plannedLocation.id,
          submittedTime,
        });
        expect(result).toHaveSucceeded();

        const updatedEncounter = await models.Encounter.findByPk(encounter.id);
        expect(updatedEncounter.plannedLocationId).toEqual(plannedLocation.id);
        expect(updatedEncounter.plannedLocationStartTime).toEqual(submittedTime);
      });
      it('Clearing a planned location should also clear the planned location time', async () => {
        const [location, plannedLocation] = await models.Location.findAll({ limit: 2 });
        const encounter = await models.Encounter.create({
          ...(await createDummyEncounter(models)),
          patientId: patient.id,
          locationId: location.id,
          plannedLocationId: plannedLocation.id,
          submittedTime: getCurrentDateTimeString(),
        });

        const result = await app.put(`/api/encounter/${encounter.id}`).send({
          plannedLocationId: null,
        });
        expect(result).toHaveSucceeded();

        const updatedEncounter = await models.Encounter.findByPk(encounter.id);
        expect(updatedEncounter.plannedLocationId).toBe(null);
        expect(updatedEncounter.plannedLocationStartTime).toBe(null);
      });
      it('Updating the location should also clear the planned location info', async () => {
        const [location, plannedLocation] = await models.Location.findAll({ limit: 2 });
        const encounter = await models.Encounter.create({
          ...(await createDummyEncounter(models)),
          patientId: patient.id,
          locationId: location.id,
          plannedLocationId: plannedLocation.id,
          submittedTime: getCurrentDateTimeString(),
        });

        const result = await app.put(`/api/encounter/${encounter.id}`).send({
          locationId: plannedLocation.id,
        });
        expect(result).toHaveSucceeded();

        const updatedEncounter = await models.Encounter.findByPk(encounter.id);
        expect(updatedEncounter.locationId).toEqual(plannedLocation.id);
        expect(updatedEncounter.plannedLocationId).toBe(null);
        expect(updatedEncounter.plannedLocationStartTime).toBe(null);
      });
    });
  });
});
