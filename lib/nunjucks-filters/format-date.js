import { isObject } from 'nhsuk-frontend'
import { Intl, Temporal } from 'temporal-polyfill'

import { getTimeZone } from './utils/get-time-zone.js'
import {
  isIsoDateTimeWithOffset,
  isIsoDateTimeWithoutOffset
} from './utils/iso-date-time.js'
import { parseInteger } from './utils/parse-integer.js'
import { zonedDateTimeFromOffsetString } from './utils/parse-zoned-date-time.js'

// Formats the weekday, e.g. Tuesday
const weekdayFormat = new Intl.DateTimeFormat('en-GB', {
  weekday: 'long'
})

// Formats day, month and year, e.g. 3 March 2026
const dateFormat = new Intl.DateTimeFormat('en-GB', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})

/**
 * Build a `PlainDate` from an object with year, month and day.
 *
 * @param {DateInputType} input - Object to check for year, month and day
 * @returns {Temporal.PlainDate} The parsed date, or `undefined` if the object has no full date (so isn't attempting to be parsed as one)
 * @throws {RangeError} If year, month or day are invalid
 */
function plainDateFromObject(input) {
  if (isDateInput(input)) {
    return Temporal.PlainDate.from(
      {
        year: parseInteger(input.year),
        month: parseInteger(input.month),
        day: parseInteger(input.day)
      },
      { overflow: 'reject' }
    )
  }

  throw new RangeError('Invalid input')
}

/**
 * @param {DateInputType | string | unknown} input - Date as ISO string or object with year, month, day (and optionally hour, minute, offset)
 * @param {string} [timeZone] - IANA time zone to convert to, if the input includes an offset or Z
 * @returns {Temporal.PlainDate} the parsed date
 */
function parseDate(input, timeZone) {
  if (isDateInput(input)) {
    return parseDateFromObject(input, timeZone)
  }

  if (typeof input === 'string') {
    return parseDateFromString(input, timeZone)
  }

  throw new RangeError('Invalid input')
}

/**
 * @param {DateInputType} input
 * @param {string} [timeZone] - IANA time zone to convert to, if the input includes an offset or Z
 * @returns {Temporal.PlainDate} the parsed date
 */
function parseDateFromObject(input, timeZone) {
  if (isDateTimeInputWithOffset(input)) {
    return Temporal.ZonedDateTime.from(
      {
        year: parseInteger(input.year),
        month: parseInteger(input.month),
        day: parseInteger(input.day),
        hour: parseInteger(input.hour),
        minute: parseInteger(input.minute),
        timeZone: String(input.offset)
      },
      { overflow: 'reject' }
    )
      .withTimeZone(timeZone ?? getTimeZone())
      .toPlainDate()
  }

  if (isDateInput(input) && !('offset' in input)) {
    return plainDateFromObject(input)
  }

  throw new RangeError('Invalid input')
}

/**
 * @param {string} input
 * @param {string} [timeZone] - IANA time zone to convert to, if the input includes an offset or Z
 * @returns {Temporal.PlainDate} the parsed date
 */
function parseDateFromString(input, timeZone) {
  if (isIsoDateTimeWithOffset(input)) {
    return zonedDateTimeFromOffsetString(input, timeZone).toPlainDate()
  }

  if (isIsoDateTimeWithoutOffset(input)) {
    return Temporal.PlainDate.from(input, { overflow: 'reject' })
  }

  throw new RangeError('Invalid input')
}

/**
 * Format a date whilst following the NHS.UK style guide for dates
 *
 * The input can be day, month and year numbers entered by a user into
 * the Date input component, which the prototype kit converts into an object.
 *
 * Alternatively the filter also works with ISO date strings like `2026-03-03`.
 *
 * If needed, you can include the day of the week by adding includeDayOfWeek: true option.
 *
 * @example
 * ```njk
 * {{ data.dateOfBirth | formatDate }}
 * ```
 * @example
 * ```njk
 * {{ data.appointmentDate | formatDate({ includeDayOfWeek: true }) }}
 * ```
 * @see {@link https://service-manual.nhs.uk/content/numbers-measurements-dates-time#dates}
 * @param {DateInputType | string | unknown} input - Date as ISO YYYY-MM-DD string or object with day, month, year (and optionally hour, minute, offset)
 * @param {object} [options] - Options
 * @param {boolean} [options.includeDayOfWeek] - Include day of the week
 * @param {string} [options.timeZone] - IANA time zone to convert to (overrides process.env.TZ), only used if the input includes a time zone offset or Z
 * @returns {string} `string` as a human readable date
 */
export function formatDate(input, options) {
  try {
    const date = parseDate(input, options?.timeZone)

    let formatted = ''

    // The weekday is manually prefixed to the formatted date,
    // as the Intl.DateTimeFormat combined option will insert a comma,
    // which we don’t want.
    if (options?.includeDayOfWeek) {
      formatted += `${weekdayFormat.format(date)} `
    }

    formatted += dateFormat.format(date)

    return formatted
  } catch {
    console.warn('Invalid date:', input)
    return 'Invalid date'
  }
}

/**
 * Check for date input object
 *
 * @template {DateInputType} InputType
 * @param {InputType | unknown} input
 * @returns {input is InputType}
 */
export function isDateInput(input) {
  return (
    isObject(input) && 'year' in input && 'month' in input && 'day' in input
  )
}

/**
 * Check for date input object with offset
 *
 * @template {DateInputType} InputType
 * @param {InputType | string | unknown} input
 * @returns {input is Extract<InputType, { offset: string }>}
 */
export function isDateInputWithOffset(input) {
  return isDateInput(input) && 'offset' in input
}

/**
 * Check for date time input object with offset
 *
 * @template {DateInputType} InputType
 * @param {InputType | string | unknown} input
 * @returns {input is Extract<InputType, DateTimeInputWithOffset>}
 */
export function isDateTimeInputWithOffset(input) {
  return (
    isDateInput(input) &&
    'hour' in input &&
    'minute' in input &&
    'offset' in input
  )
}

/**
 * Date only
 *
 * @typedef {object} DateInput
 * @property {string | number} year - The year
 * @property {string | number} month - The month
 * @property {string | number} day - The day
 */

/**
 * Date and time
 *
 * @typedef {object} DateTimeInput
 * @property {string | number} year - The year
 * @property {string | number} month - The month
 * @property {string | number} day - The day
 * @property {string | number} hour - The hour
 * @property {string | number} minute - The minute
 */

/**
 * @typedef {DateInput & { offset: string }} DateInputWithOffset - Date with a timezone offset
 * @typedef {DateTimeInput & { offset: string }} DateTimeInputWithOffset - Date and time with a timezone offset
 * @typedef {DateTimeInputWithOffset | DateTimeInput | DateInputWithOffset | DateInput} DateInputType - Date and time types
 */
