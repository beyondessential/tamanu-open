import crypto from 'crypto';

const generators = {
  A: () => String.fromCharCode(65 + Math.floor(Math.random() * 26)),
  '0': () => Math.floor(Math.random() * 10).toFixed(0),
};

function createIdGenerator(format) {
  const generatorPattern = Array.from(format).map(char => generators[char] || (() => ''));

  return () => generatorPattern.map(generator => generator()).join('');
}
const DISPLAY_ID_FORMAT = 'AAAA000000';
export const generateId = createIdGenerator(DISPLAY_ID_FORMAT);

// Checks if the passed displayId was generated using generateId function above
// with the specific 10 digit format DISPLAY_ID_FORMAT. It will need to be reevaluated
// if the format ever changes.
export const isGeneratedDisplayId = displayId => {
  if (DISPLAY_ID_FORMAT !== 'AAAA000000') return false;
  return /^[A-Z]{4}\d{6}$/.test(displayId);
};

/**
 * Makes a 'fake' but valid uuid like '2964ea0d-073d-0000-bda1-ce47fd5de340'.
 *
 * This is built from a UUID v4, but replacing this particular segment means
 * we're also replacing the V4 indication, making this a "version zero" UUID,
 * which doesn't exist and thus cannot conflict with "naturally generated" ones.
 * Yet it will fit in 128-bit binary representation types and also in 36-bytes
 * (or variable width) text representations types.
 *
 * This is used to run tests against real data, where we're able to clear out
 * everything that was created by the tests with just a simple query. See the
 * accompanying FAKE_UUID_PATTERN constant for the SQL LIKE pattern to use.
 */
export function fakeUUID() {
  return crypto.randomUUID().replace(/(.{8}-.{4})-.{4}-(.+)/, '$1-0000-$2');
}

export const FAKE_UUID_PATTERN = '________-____-0000-____-____________';
