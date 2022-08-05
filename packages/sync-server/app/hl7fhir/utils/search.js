import { Sequelize, Op } from 'sequelize';
import moment from 'moment';
import { jsonFromBase64, jsonToBase64 } from 'shared/utils/encodings';
import { InvalidParameterError } from 'shared/errors';

import { hl7ParameterTypes } from '../hl7Parameters';

export function toSearchId({ after, ...params }) {
  const result = { ...params };
  if (after) {
    result.after = {
      createdAt: after.createdAt.toISOString(),
      id: after.id,
    };
  }
  return jsonToBase64(result);
}

export function fromSearchId(cursor) {
  // leave it to parseQuery to validate params
  return jsonFromBase64(cursor);
}

// HL7 query parameters might have modifiers,
// this will split them into an array.
export function getParamAndModifier(fullParam) {
  return fullParam.split(':', 2);
}

export function getDefaultOperator(type) {
  if (type === hl7ParameterTypes.string) {
    return Op.startsWith;
  }
  if (type === hl7ParameterTypes.date) {
    return Op.between;
  }

  return Op.eq;
}

// Helper function to deal with case insensitive searches for strings
export function getQueryObject(columnName, value, operator, modifier, parameterType) {
  // String searches should be case insensitive unless the modifier is "exact"
  if (parameterType === hl7ParameterTypes.string && modifier !== 'exact') {
    // Perform case insensitive search by using SQL function UPPER
    // and modifying the string to be uppercase.
    return Sequelize.where(Sequelize.fn('upper', Sequelize.col(columnName)), {
      [operator]: value.toUpperCase(),
    });
  }

  // Dates with eq modifier or no modifier should be looked up as a range
  if (parameterType === hl7ParameterTypes.date && ['eq', undefined].includes(modifier)) {
    // Create and return range
    const timeUnit = getSmallestTimeUnit(value);
    const startDate = parseHL7Date(value).startOf(timeUnit);
    const endDate = parseHL7Date(value).endOf(timeUnit);
    return { [operator]: [startDate, endDate] };
  }

  return { [operator]: value };
}

// The date string will be parsed in UTC and return a moment
export function parseHL7Date(dateString) {
  // Only these formats should be valid for a date in HL7 FHIR:
  // https://www.hl7.org/fhir/datatypes.html#date
  return moment.utc(dateString, ['YYYY', 'YYYY-MM', 'YYYY-MM-DD'], true);
}

// Returns the smallest time unit used on the date string format.
// Only supports HL7 formats.
export function getSmallestTimeUnit(dateString) {
  switch (dateString.length) {
    case 4:
      return 'year';
    case 7:
      return 'month';
    case 10:
      return 'day';
    default:
      throw new InvalidParameterError(`Invalid date/time format: ${dateString}`);
  }
}

/*
  References can have three different formats:
  - id
  - type/id
  - Resource URL

  This function extracts and returns the id in each case.
  Read more: http://hl7.org/fhir/search.html#reference
*/
export function parseHL7Reference(reference) {
  const params = reference.split('/');
  return params[params.length - 1];
}
