import { isObject } from 'nhsuk-frontend'
import { Intl, Temporal } from 'temporal-polyfill'

import {
  isIsoDateTimeWithOffset,
  isIsoDateTimeWithoutOffset
} from './utils/iso-date-time.js'
import { parseInteger } from './utils/parse-integer.js'
import {
  zonedDateTimeFromObject,
  zonedDateTimeFromOffsetString
} from './utils/parse-zoned-date-time.js'

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
 * @param {Partial<DateInput>} input - Object to check for year, month and day
 * @returns {Temporal.PlainDate | undefined} The parsed date, or `undefined` if the object has no full date (so isn't attempting to be parsed as one)
 * @throws {RangeError} If year, month or day are invalid
 */
function plainDateFromObject(input) {
  if (!('year' in input && 'month' in input && 'day' in input)) {
    return undefined
  }

  return Temporal.PlainDate.from(
    {
      year: parseInteger(input.year),
      month: parseInteger(input.month),
      day: parseInteger(input.day)
    },
    { overflow: 'reject' }
  )
}

/**
 * @param {string|DateInput|unknown} input - Date as ISO string or object with year, month, day (and optionally hour, minute, offset)
 * @param {string} [timeZone] - IANA time zone to convert to, if the input includes a time zone offset or Z
 * @returns {Temporal.PlainDate} the parsed date
 */
function parseDate(input, timeZone) {
  if (isObject(input)) {
    const zoned = zonedDateTimeFromObject(input, timeZone)
    if (zoned) return zoned.toPlainDate()

    const plainDate = plainDateFromObject(input)
    if (plainDate) return plainDate
  } else if (typeof input === 'string') {
    if (isIsoDateTimeWithOffset(input)) {
      return zonedDateTimeFromOffsetString(input, timeZone).toPlainDate()
    }

    if (isIsoDateTimeWithoutOffset(input)) {
      return Temporal.PlainDate.from(input, { overflow: 'reject' })
    }
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
 * @param {string|DateInput|unknown} input - Date as ISO YYYY-MM-DD string or object with day, month, year (and optionally hour, minute, offset)
 * @param {object} [options] - Options
 * @param {boolean} [options.includeDayOfWeek] - Include day of the week
 * @param {string} [options.timeZone] - IANA time zone to convert to (overrides process.env.TZ), only used if the input includes a time zone offset or Z
 * @returns {string} `string` as a human readable date
 */
export function formatDate(input, options) {
  const resolvedOptions = {
    includeDayOfWeek: false,
    ...options
  }

  try {
    const date = parseDate(input, resolvedOptions.timeZone)

    let formatted = ''

    // The weekday is manually prefixed to the formatted date,
    // as the Intl.DateTimeFormat combined option will insert a comma,
    // which we don’t want.
    if (resolvedOptions.includeDayOfWeek) {
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
 * @typedef {object} DateInput
 * @property {string|number} year - The year
 * @property {string|number} month - The month
 * @property {string|number} day - The day
 */
