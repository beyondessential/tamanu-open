import { getFormInitialValues } from '~/ui/components/Forms/SurveyForm/helpers';
import { FieldTypes } from '/helpers/fields';
import { makeDummySurvey, mockDummyPatient, mockDummyUser } from '/root/tests/helpers/mock';
import * as dateHelpers from '/helpers/date';

describe('getFormInitialValues()', () => {
  const mockUser = mockDummyUser();
  const mockPatient = mockDummyPatient();

  beforeAll(() => {
    jest.spyOn(dateHelpers,
      'getAgeFromDate').mockImplementation(() => 145);
  });

  it('should populate text types with empty string', () => {
    const survey = makeDummySurvey([
      { code: 'TEST1', type: FieldTypes.TEXT },
      { code: 'TEST2', type: FieldTypes.NUMBER },
      { code: 'TEST3', type: FieldTypes.MULTILINE },
    ]);
    const initialValues = getFormInitialValues(survey, mockUser, mockPatient);
    expect(initialValues).toStrictEqual({
      TEST1: '',
      TEST2: '',
      TEST3: '',
    });
  });

  it('should omit other types', () => {
    const mockData = [];
    for (const fieldType of Object.keys(FieldTypes)) {
      if ([FieldTypes.TEXT, FieldTypes.NUMBER, FieldTypes.MULTILINE].includes(fieldType)) {
        // skip
      } else {
        mockData.push({
          code: `FIELD_${fieldType}`,
          type: fieldType,
        });
      }
    }
    const survey = makeDummySurvey(mockData);
    const initialValues = getFormInitialValues(survey, mockUser, mockPatient);
    expect(initialValues).toStrictEqual({});
  });

  it('should populate user data if a user data question is present', () => {
    const survey = makeDummySurvey([
      { code: 'TEST_DEFAULT_CONFIG', type: FieldTypes.USER_DATA, config: {} },
      { code: 'TEST_DISPLAY_NAME', type: FieldTypes.USER_DATA, config: { column: 'displayName' } },
      { code: 'TEST_EMAIL', type: FieldTypes.USER_DATA, config: { column: 'email' } },
      { code: 'TEST_MISSING_PROPERTY', type: FieldTypes.USER_DATA, config: { column: 'xyz' } },
    ]);
    const user = mockDummyUser({
      displayName: 'Jane Bloggs',
      email: 'jane@example.com',
    });
    const initialValues = getFormInitialValues(survey, user, mockPatient);
    expect(initialValues).toStrictEqual({
      TEST_DEFAULT_CONFIG: 'Jane Bloggs',
      TEST_DISPLAY_NAME: 'Jane Bloggs',
      TEST_EMAIL: 'jane@example.com',
      // TEST_MISSING_PROPERTY omitted
    });
  });

  it('should populate patient data if a patient data question is present', () => {
    const survey = makeDummySurvey([
      { code: 'TEST_DEFAULT_CONFIG', type: FieldTypes.PATIENT_DATA, config: {} },
      { code: 'TEST_FIRST_NAME', type: FieldTypes.PATIENT_DATA, config: { column: 'firstName' } },
      { code: 'TEST_AGE', type: FieldTypes.PATIENT_DATA, config: { column: 'age' } },
      { code: 'TEST_FULL_NAME', type: FieldTypes.PATIENT_DATA, config: { column: 'fullName' } },
      { code: 'TEST_MISSING_PROPERTY', type: FieldTypes.PATIENT_DATA, config: { column: 'xyz' } },
    ]);
    const patient = mockDummyPatient({
      firstName: 'Spidey',
      lastName: 'Mane',
      dateOfBirth: '1966-06-28',
    });
    const initialValues = getFormInitialValues(survey, mockUser, patient);
    expect(initialValues).toStrictEqual({
      TEST_DEFAULT_CONFIG: 'Spidey Mane', // defaults to fullName
      TEST_FIRST_NAME: 'Spidey',
      TEST_AGE: '145', // mocked age calculation
      TEST_FULL_NAME: 'Spidey Mane',
      // TEST_MISSING_PROPERTY omitted
    });
  });
});
