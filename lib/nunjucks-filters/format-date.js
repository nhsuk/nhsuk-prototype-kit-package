import { isObject } from 'nhsuk-frontend'
import { Intl, Temporal } from 'temporal-polyfill-lite'

import { parseFiniteNumber } from './utils/parse-finite-number.js'
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

// Matches an ISO date, optionally with a time, but not a timezone offset or name
const isoDateFormat = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2}(\.\d+)?)?)?$/

// Matches an ISO date-time with a timezone offset
const isoDateTimeWithOffset =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d+)?)?([Zz]|[+-]\d{2}:\d{2})/

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
 * @param {string|DateInputObject|unknown} input - Date as ISO YYYY-MM-DD string or object with day, month, year (and optionally hour, minute, offset)
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
    /** @type {Temporal.PlainDate} */
    let date

    if (
      isObject(input) &&
      'year' in input &&
      'month' in input &&
      'day' in input &&
      'hour' in input &&
      'minute' in input &&
      'offset' in input
    ) {
      date = zonedDateTimeFromObject(
        input,
        resolvedOptions.timeZone
      ).toPlainDate()
    } else if (
      isObject(input) &&
      'year' in input &&
      'month' in input &&
      'day' in input
    ) {
      const year = parseFiniteNumber(input.year)
      const month = parseFiniteNumber(input.month)
      const day = parseFiniteNumber(input.day)

      date = Temporal.PlainDate.from(
        { year, month, day },
        { overflow: 'reject' }
      )
    } else if (
      typeof input === 'string' &&
      input.match(isoDateTimeWithOffset)
    ) {
      date = zonedDateTimeFromOffsetString(
        input,
        resolvedOptions.timeZone
      ).toPlainDate()
    } else if (typeof input === 'string' && input.match(isoDateFormat)) {
      date = Temporal.PlainDate.from(input, { overflow: 'reject' })
    } else {
      throw new RangeError('Invalid input')
    }

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
 * @typedef {object} DateInputObject
 * @property {string|number} day - The day
 * @property {string|number} month - The month
 * @property {string|number} year - The year
 * @property {string|number} [hour] - The hour (required with `offset`)
 * @property {string|number} [minute] - The minute (required with `offset`)
 * @property {string} [offset] - Timezone offset, e.g. `+00:00` (requires hour and minute)
 */
