import { disableHardcodedPermissionsForSuite, fake } from '@tamanu/shared/test-helpers';

import { createTestContext } from '../utilities';

describe('SurveyResponse', () => {
  let app;
  let baseApp;
  let models;
  let ctx;

  beforeAll(async () => {
    ctx = await createTestContext();
    baseApp = ctx.baseApp;
    models = ctx.models;
    app = await baseApp.asRole('practitioner');
  });
  afterAll(() => ctx.close());

  const setupAutocompleteSurvey = async (sscConfig, answerBody) => {
    const {
      Facility,
      Location,
      Department,
      Patient,
      User,
      Encounter,
      Program,
      Survey,
      SurveyResponse,
      ProgramDataElement,
      SurveyScreenComponent,
      SurveyResponseAnswer,
    } = models;

    const facility = await Facility.create(fake(Facility));
    const location = await Location.create({
      ...fake(Location),
      facilityId: facility.id,
    });
    const department = await Department.create({
      ...fake(Department),
      facilityId: facility.id,
    });
    const examiner = await User.create(fake(User));
    const patient = await Patient.create(fake(Patient));
    const encounter = await Encounter.create({
      ...fake(Encounter),
      patientId: patient.id,
      departmentId: department.id,
      locationId: location.id,
      examinerId: examiner.id,
    });
    const program = await Program.create(fake(Program));
    const survey = await Survey.create({
      ...fake(Survey),
      programId: program.id,
    });
    const response = await SurveyResponse.create({
      ...fake(SurveyResponse),
      surveyId: survey.id,
      encounterId: encounter.id,
    });
    const dataElement = await ProgramDataElement.create({
      ...fake(ProgramDataElement),
      type: 'Autocomplete',
    });
    await SurveyScreenComponent.create({
      ...fake(SurveyScreenComponent),
      responseId: response.id,
      dataElementId: dataElement.id,
      surveyId: survey.id,
      config: sscConfig,
    });
    const answer = await SurveyResponseAnswer.create({
      ...fake(SurveyResponseAnswer),
      dataElementId: dataElement.id,
      responseId: response.id,
      body: answerBody,
    });

    return { answer, response };
  };

  describe('autocomplete', () => {
    it("should look up an autocomplete component's source model and extract a name", async () => {
      // arrange
      const { Facility } = models;
      const facility = await Facility.create(fake(Facility));
      const { answer, response } = await setupAutocompleteSurvey(
        JSON.stringify({
          source: 'Facility',
        }),
        facility.id,
      );

      // act
      const result = await app.get(`/api/surveyResponse/${response.id}`);

      // assert
      expect(result).toHaveSucceeded();
      expect(result.body).toMatchObject({
        answers: [
          {
            id: answer.id,
            originalBody: facility.id,
            body: facility.name,
          },
        ],
      });
    });

    // This test currently fails because some survey utils filter the missing-source config out before
    // it reaches the logic that would throw the "misconfigured" error. A question with a missing
    // source will be obviously broken anyway, so while this should be fixed eventually it doesn't
    // represent a risk to data or user experience, just a chance of inconveniencing a PM.
    it('should error if the config has no source', async () => {
      // arrange
      const { Facility } = models;
      const facility = await Facility.create(fake(Facility));
      const { response } = await setupAutocompleteSurvey('{}', facility.id);

      // act
      const result = await app.get(`/api/surveyResponse/${response.id}`);

      // assert
      expect(result).not.toHaveSucceeded();
      expect(result.body).toMatchObject({
        error: {
          message: 'Survey is misconfigured: Question config did not specify a valid source',
        },
      });
    });

    it("should error if the config doesn't point to a valid source", async () => {
      // arrange
      const { Facility } = models;
      const facility = await Facility.create(fake(Facility));
      const { response } = await setupAutocompleteSurvey(
        JSON.stringify({ source: 'Frobnizzle' }),
        facility.id,
      );

      // act
      const result = await app.get(`/api/surveyResponse/${response.id}`);

      // assert
      expect(result).not.toHaveSucceeded();
      expect(result.body).toMatchObject({
        error: {
          message: 'Survey is misconfigured: Question config did not specify a valid source',
        },
      });
    });

    it("should error if the answer body doesn't point to a real record", async () => {
      // arrange
      const { Facility } = models;
      await Facility.create(fake(Facility));
      const { response } = await setupAutocompleteSurvey(
        JSON.stringify({ source: 'Facility' }),
        'this-facility-id-does-not-exist',
      );

      // act
      const result = await app.get(`/api/surveyResponse/${response.id}`);

      // assert
      expect(result).not.toHaveSucceeded();
      expect(result.body).toMatchObject({
        error: {
          message: `Selected answer Facility[this-facility-id-does-not-exist] not found`,
        },
      });
    });

    it('should skip error if the answer body is an empty string', async () => {
      // arrange
      const { Facility } = models;
      await Facility.create(fake(Facility));
      const { response } = await setupAutocompleteSurvey(
        JSON.stringify({ source: 'Facility' }),
        '',
      );

      // act
      const result = await app.get(`/api/surveyResponse/${response.id}`);

      // assert
      expect(result).toHaveSucceeded();
      expect(result.body.answers[0].body).toBe('');
    });

    it('should error and hint if users might have legacy ReferenceData sources', async () => {
      // arrange
      const { Facility } = models;
      const facility = await Facility.create(fake(Facility));
      const { response } = await setupAutocompleteSurvey(
        JSON.stringify({ source: 'ReferenceData', where: { type: 'facility' } }),
        facility.id,
      );

      // act
      const result = await app.get(`/api/surveyResponse/${response.id}`);

      // assert
      expect(result).not.toHaveSucceeded();
      expect(result.body).toMatchObject({
        error: {
          message: `Selected answer ReferenceData[${facility.id}] not found (check that the surveyquestion's source isn't ReferenceData for a Location, Facility, or Department)`,
        },
      });
    });
  });

  describe('permissions', () => {
    disableHardcodedPermissionsForSuite();

    it("should not throw forbidden error when role has sufficient permission for a particular survey", async () => {
      // arrange
      const { Facility } = models;
      const facility = await Facility.create(fake(Facility));
      const { response } = await setupAutocompleteSurvey(
        JSON.stringify({
          source: 'Facility',
        }),
        facility.id,
      );

      const permissions = [
        ['read', 'SurveyResponse'],
        ['read', 'Survey', response.surveyId]
      ]

      app = await baseApp.asNewRole(permissions);

      // act
      const result = await app.get(`/api/surveyResponse/${response.id}`);

      // assert
      expect(result).toHaveSucceeded();
    });

    it("should throw forbidden error when role does not sufficient permission for a particular survey", async () => {
      // arrange
      const { Facility } = models;
      const facility = await Facility.create(fake(Facility));
      const { response } = await setupAutocompleteSurvey(
        JSON.stringify({
          source: 'Facility',
        }),
        facility.id,
      );

      const permissions = [
        ['read', 'SurveyResponse'],
      ]

      app = await baseApp.asNewRole(permissions);

      // act
      const result = await app.get(`/api/surveyResponse/${response.id}`);

      // assert
      expect(result).toHaveStatus(403);
    });
  });
});
