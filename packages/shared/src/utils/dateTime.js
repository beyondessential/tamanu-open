import {
  differenceInMilliseconds as dateFnsDifferenceInMilliseconds,
  format as dateFnsFormat,
  differenceInMonths,
  differenceInWeeks,
  differenceInYears,
  formatISO9075,
  isMatch,
  isValid,
  parseISO,
  startOfDay,
  sub,
} from 'date-fns';
import { TIME_UNIT_OPTIONS } from '@tamanu/constants';

export const ISO9075_DATE_FORMAT = 'yyyy-MM-dd';
export const ISO9075_DATETIME_FORMAT = 'yyyy-MM-dd HH:mm:ss';
export const ISO8061_WITH_TIMEZONE = "yyyy-MM-dd'T'HH:mm:ssXXX";

export const isISOString = dateString =>
  isMatch(dateString, ISO9075_DATETIME_FORMAT) || isMatch(dateString, ISO9075_DATE_FORMAT);

/**
 *
 * @param date - usually we are working with a ISO9075 date_time_string or date_string but could
 * also be a ISO8061 date string or a date object so we need to gracefully handle all of them.
 * If you know you are working with an ISO9075 date_time_string or date_string, just use parseIso
 * from date-fns
 * @returns {null|Date} Outputs a Date object
 */
export const parseDate = date => {
  if (date === null || date === undefined) {
    return null;
  }
  let dateObj = date;

  if (isISOString(date)) {
    dateObj = parseISO(date);
  } else if (typeof date === 'string') {
    // It seems that some JS implementations have problems parsing strings to dates.
    dateObj = new Date(date.replace(' ', 'T'));
  }

  if (!isValid(dateObj)) {
    throw new Error('Not a valid date');
  }

  return dateObj;
};

export function toDateTimeString(date) {
  if (date === null || date === undefined) {
    return null;
  }
  const dateObj = parseDate(date);
  return formatISO9075(dateObj, { representation: 'complete' });
}

export function toDateString(date) {
  if (date === null || date === undefined) {
    return null;
  }
  const dateObj = parseDate(date);
  return formatISO9075(dateObj, { representation: 'date' });
}

export function getCurrentDateTimeString() {
  return formatISO9075(new Date());
}

export function getDateTimeSubtractedFromNow(daysToSubtract) {
  return toDateTimeString(sub(new Date(), { days: daysToSubtract }));
}

export function getDateSubtractedFromToday(daysToSubtract) {
  return toDateTimeString(sub(startOfDay(new Date()), { days: daysToSubtract }));
}

export function getCurrentDateString() {
  return formatISO9075(new Date(), { representation: 'date' });
}

export function convertISO9075toRFC3339(dateString) {
  // parseISO does not support null values
  const parsedDate = dateString === null ? new Date() : parseISO(dateString);
  return dateFnsFormat(parsedDate, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
}

export function ageInWeeks(dob) {
  return differenceInWeeks(new Date(), parseISO(dob));
}

export function ageInMonths(dob) {
  return differenceInMonths(new Date(), parseISO(dob));
}

export function ageInYears(dob) {
  return differenceInYears(new Date(), parseISO(dob));
}

export function compareDateStrings(key = 'desc') {
  return (a, b) => {
    if (key.toLowerCase() === 'asc') return parseISO(a.date) - parseISO(b.date);
    if (key.toLowerCase() === 'desc') return parseISO(b.date) - parseISO(a.date);
    return 0;
  };
}

function getAgeRangeInMinutes({ ageMin = -Infinity, ageMax = Infinity, ageUnit }) {
  const timeUnit = TIME_UNIT_OPTIONS.find(option => option.unit === ageUnit);
  const conversionValue = timeUnit.minutes;
  return {
    ageMin: ageMin * conversionValue,
    ageMax: ageMax * conversionValue,
    previousAgeUnit: ageUnit,
  };
}

export function doAgeRangesHaveGaps(rangesArray) {
  const conversions = {
    weeks: {
      months: (a, b) => {
        const weeks = a.ageMax / 60 / 24 / 7;
        const months = b.ageMin / 60 / 24 / 30;
        return weeks / 4 !== months;
      },
      years: (a, b) => {
        const weeks = a.ageMax / 60 / 24 / 7;
        const years = b.ageMin / 60 / 24 / 365;
        return weeks / 52 !== years;
      },
    },
    months: {
      years: (a, b) => {
        const months = a.ageMax / 60 / 24 / 30;
        const years = b.ageMin / 60 / 24 / 365;
        return months / 12 !== years;
      },
    },
  };

  // Get all values into same time unit and sort by ageMin low to high
  const normalized = rangesArray.map(getAgeRangeInMinutes);
  normalized.sort((a, b) => a.ageMin - b.ageMin);

  return normalized.some((rangeA, i) => {
    const rangeB = normalized[i + 1];
    // This means we reached the last item, nothing more to compare
    if (!rangeB) return false;

    if (rangeA.previousAgeUnit !== rangeB.previousAgeUnit) {
      // No conversion means that minute comparison is good
      const conversion = conversions[rangeA.previousAgeUnit]?.[rangeB.previousAgeUnit];
      if (conversion) {
        return conversion(rangeA, rangeB);
      }
    }
    // These have to forcefully match, otherwise a gap exists
    return rangeA.ageMax !== rangeB.ageMin;
  });
}

export function doAgeRangesOverlap(rangesArray) {
  return rangesArray.some((rangeA, aIndex) => {
    return rangesArray.some((rangeB, bIndex) => {
      // Only compare once between two ranges
      if (aIndex >= bIndex) return false;

      // Get both values into same time unit
      const aInMinutes = getAgeRangeInMinutes(rangeA);
      const bInMinutes = getAgeRangeInMinutes(rangeB);

      // Figure out the lowest min range
      const lowestMin = aInMinutes.ageMin < bInMinutes.ageMin ? aInMinutes : bInMinutes;
      const highestMin = aInMinutes.ageMin < bInMinutes.ageMin ? bInMinutes : aInMinutes;
      const lowestAgeMax = lowestMin.ageMax;
      const highestAgeMin = highestMin.ageMin;

      // Min inclusive - max exclusive: only overlaps if its less than
      return highestAgeMin < lowestAgeMax;
    });
  });
}

/*
 * date-fns wrappers
 * Wrapper functions around date-fns functions that parse date_string and date_time_string types
 * For date-fns docs @see https://date-fns.org
 */

export const format = (date, f) => {
  if (date === null || date === undefined) {
    return null;
  }
  const dateObj = parseDate(date);
  return dateFnsFormat(dateObj, f);
};

export const differenceInMilliseconds = (a, b) =>
  dateFnsDifferenceInMilliseconds(new Date(a), new Date(b));

const locale = globalThis.navigator?.language ?? 'default';

const intlFormatDate = (date, formatOptions, fallback = 'Unknown') => {
  if (!date) return fallback;
  return new Date(date).toLocaleString(locale, formatOptions);
};

export const formatShortest = date =>
  intlFormatDate(date, { month: '2-digit', day: '2-digit', year: '2-digit' }, '--/--'); // 12/04/20

export const formatShort = date =>
  intlFormatDate(date, { day: '2-digit', month: '2-digit', year: 'numeric' }, '--/--/----'); // 12/04/2020

export const formatTime = date =>
  intlFormatDate(
    date,
    {
      timeStyle: 'short',
      hour12: true,
    },
    '__:__',
  ); // 12:30 am

export const formatTimeWithSeconds = date =>
  intlFormatDate(
    date,
    {
      timeStyle: 'medium',
      hour12: true,
    },
    '__:__:__',
  ); // 12:30:00 am

// long format date is displayed on hover
export const formatLong = date =>
  intlFormatDate(
    date,
    {
      timeStyle: 'short',
      dateStyle: 'full',
      hour12: true,
    },
    'Date information not available',
  ); // "Thursday, 14 July 2022, 03:44 pm"
