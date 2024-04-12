import { isPlainObject } from 'lodash';

import { VISIBILITY_STATUSES } from '@tamanu/constants';

function mapAndCompactArray(input) {
  return input.map(v => objectAsFhir(v)).filter(v => v !== null && v !== undefined);
}

export function objectAsFhir(input) {
  if (Array.isArray(input)) {
    return mapAndCompactArray(input);
  }

  if (!isPlainObject(input)) {
    return input;
  }

  const obj = {};
  for (const [name, value] of Object.entries(input)) {
    if (value === null || value === undefined) {
      continue;
    } else if (Array.isArray(value)) {
      obj[name] = mapAndCompactArray(value);
    } else if (isPlainObject(value)) {
      obj[name] = objectAsFhir(value);
    } else {
      obj[name] = value;
    }
  }
  return obj;
}

export function activeFromVisibility(upstream) {
  switch (upstream.visibilityStatus) {
    case VISIBILITY_STATUSES.CURRENT:
      return !upstream.deletedAt;
    default:
      return false;
  }
}
