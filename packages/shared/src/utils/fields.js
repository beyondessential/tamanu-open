import {
  ACTION_DATA_ELEMENT_TYPES,
  PROGRAM_DATA_ELEMENT_TYPES,
} from '@tamanu/constants';
import { log } from '../services/logging';
import { checkJSONCriteria } from './criteria';

export function getStringValue(type, value) {
  if (value === null) {
    return null;
  }
  switch (type) {
    case PROGRAM_DATA_ELEMENT_TYPES.CALCULATED:
      return value.toFixed(1);
    default:
      return `${value}`;
  }
}

function compareData(dataType, expected, given) {
  switch (dataType) {
    case PROGRAM_DATA_ELEMENT_TYPES.BINARY:
      if (expected === 'yes' && given === true) return true;
      if (expected === 'no' && given === false) return true;
      break;
    case PROGRAM_DATA_ELEMENT_TYPES.NUMBER:
    case PROGRAM_DATA_ELEMENT_TYPES.CALCULATED: {
      // we check within a threshold because strict equality is actually pretty rare
      const parsed = parseFloat(expected);
      const diff = Math.abs(parsed - given);

      const threshold = 0.05; // TODO: configurable
      if (diff < threshold) return true;
      break;
    }
    case PROGRAM_DATA_ELEMENT_TYPES.MULTI_SELECT:
      return JSON.parse(given).includes(expected);
    default:
      if (expected === given) return true;
      break;
  }

  return false;
}

/**
 * IMPORTANT: We have 4 other versions of this method:
 *
 * - mobile/App/ui/helpers/fields.ts
 * - web/app/utils/survey.js
 * - shared/src/utils/fields.js
 * - central-server/app/subCommands/calculateSurveyResults.js
 *
 * So if there is an update to this method, please make the same update
 * in the other versions
 */
export function checkVisibilityCriteria(component, allComponents, values) {
  const { visibilityCriteria } = component;

  try {
    return checkJSONCriteria(visibilityCriteria, allComponents, values);
  } catch (error) {
    log.warn(
      `Error parsing JSON visibility criteria for ${component.dataElement?.code}, using fallback.\nError message: ${error.message}`,
    );

    return fallbackParseVisibilityCriteria(visibilityCriteria, values, allComponents);
  }
}

/**
 * Meditrak uses JSON for these fields now, whereas we have been using colon separated values.
 * Our goal is to have the same syntax as Meditrak for surveys, but since we already have some
 * test surveys out there using our old system, we fall back to it if we can't parse the JSON.
 * TODO: Remove the fallback once we can guarantee that there's no surveys using it.
 */
function fallbackParseVisibilityCriteria(visibilityCriteria, values, allComponents) {
  const [elementCode = '', expectedAnswer = ''] = visibilityCriteria.split(/\s*:\s*/);

  let givenAnswer = values[elementCode] || '';
  if (givenAnswer.toLowerCase) {
    givenAnswer = givenAnswer.toLowerCase().trim();
  }
  const expectedTrimmed = expectedAnswer.toLowerCase().trim();

  const comparisonComponent = allComponents.find(x => x.dataElement.code === elementCode);

  if (!comparisonComponent) {
    log.warn(`Comparison component ${elementCode} not found!`);
    return false;
  }

  const comparisonDataType = comparisonComponent.dataElement.type;

  return compareData(comparisonDataType, expectedTrimmed, givenAnswer);
}

/*
  Ad hoc function. Currently web client sends all
  survey answers in an object shaped with ProgramDataElement.id as keys.
  However, mobile uses ProgramDataElement.code as keys instead. The logic
  used is the same in both places but is just copy/pasted - for that reason,
  this will convert the values object to match the one from mobile (in the meantime).
  TODO: properly refactor the code. Probably by simply changing the web SurveyQuestion
  and pass name={code} instead of name={id}.
*/
function getValuesByCode(components, valuesById) {
  const valuesByCode = {};

  Object.entries(valuesById).forEach(([id, value]) => {
    const { dataElement } = components.find(c => c.dataElement.id === id);
    valuesByCode[dataElement.code] = value;
  });

  return valuesByCode;
}

export function getActiveActionComponents(components, originalValues) {
  const values = getValuesByCode(components, originalValues);
  return components
    .filter(c => ACTION_DATA_ELEMENT_TYPES.includes(c.dataElement.type))
    .filter(c => checkVisibilityCriteria(c, components, values));
}

export function getResultValue(components, originalValues, specialValues) {
  const values = getValuesByCode(components, originalValues);
  const resultComponents = components
    .filter(c => c.dataElement.type === 'Result')
    .filter(c => checkVisibilityCriteria(c, components, { ...values, ...specialValues }));

  const component = resultComponents.pop();

  if (!component) {
    return { result: 0, resultText: '' };
  }

  const rawValue = values[component.dataElement.code];

  if (rawValue === undefined || rawValue === null || Number.isNaN(rawValue)) {
    return { result: 0, resultText: component.detail || '' };
  }

  if (typeof rawValue === 'string') {
    return { result: 0, resultText: rawValue };
  }

  return {
    result: rawValue,
    resultText: `${rawValue.toFixed(0)}%`,
  };
}
