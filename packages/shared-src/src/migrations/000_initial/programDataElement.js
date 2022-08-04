const PROGRAM_DATA_ELEMENT_TYPE_VALUES = [
  'FreeText',
  'Multiline',
  'Radio',
  'Select',
  'Date',
  'SubmissionDate',
  'Instruction',
  'Number',
  'Binary',
  'Checkbox',
  'CalculatedQuestion',
  'ConditionQuestion',
  'Arithmetic',
  'Condition',
  'Result',
  'SurveyLink',
  'SurveyAnswer',
  'SurveyResult',
  'Autocomplete',
  'Photo',
  'Geolocate',
  'DaysSince',
  'MonthsSince',
  'YearsSince',
  'Entity',
  'PrimaryEntity',
  'CodeGenerator',
];

module.exports = ({ Sequelize }) => ({
  fields: {
    code: Sequelize.STRING,
    name: Sequelize.STRING,
    indicator: Sequelize.STRING,
    defaultText: Sequelize.STRING,
    defaultOptions: Sequelize.STRING,
    type: Sequelize.ENUM(PROGRAM_DATA_ELEMENT_TYPE_VALUES),
  },
  options: {
    indexes: [{ fields: ['code'], unique: true }],
  },
});