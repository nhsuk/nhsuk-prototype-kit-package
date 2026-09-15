import { isObject } from 'nhsuk-frontend'
// Uses the JavaScript Temporal API, polyfilled until it's natively supported
import { Intl, Temporal } from 'temporal-polyfill'

import { isDateTimeInputWithOffset } from './format-date.js'
import { getTimeZone } from './utils/get-time-zone.js'
import { hasIsoOffset } from './utils/iso-date-time.js'
import { parseInteger } from './utils/parse-integer.js'
import { parseZonedDateTime } from './utils/parse-zoned-date-time.js'

// Formats hour and minute, e.g. 2:15 PM
const timeFormat = new Intl.DateTimeFormat('en-GB', {
  hour: 'numeric',
  minute: '2-digit',
  hour12: true
})

// Formats hour only, e.g. 2 PM, for times on the hour
const hourFormat = new Intl.DateTimeFormat('en-GB', {
  hour: 'numeric',
  hour12: true
})

// Formats hour and minute using the 24 hour clock, e.g. 09:05 or 14:15
const hour24Format = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false
})

/**
 * @param {TimeInputType | string | unknown} input - Time as ISO string or object with hour, minute (and optionally year, month, day, offset)
 * @param {string} [timeZone] - IANA time zone to convert to, if the input includes a time zone offset or Z
 * @returns {Temporal.PlainTime} the parsed time
 */
function parseTime(input, timeZone) {
  if (isTimeInput(input)) {
    return parseTimeFromObject(input, timeZone)
  }

  if (typeof input === 'string') {
    return parseTimeFromString(input, timeZone)
  }

  throw new RangeError('Invalid input')
}

/**
 * @param {TimeInputType} input
 * @param {string} [timeZone] - IANA time zone to convert to, if the input includes an offset
 * @returns {Temporal.PlainTime} the parsed time
 */
function parseTimeFromObject(input, timeZone) {
  // Full date and offset: convert to the target time zone.
  // An offset without a full date can't be zoned, so this correctly throws
  // (invalid), mirroring the date-less offset string case below
  if (isDateTimeInputWithOffset(input)) {
    return parseZonedDateTime(input, timeZone).toPlainTime()
  }

  // Hour and minute only: a plain time with no time zone
  if (isTimeInput(input) && !('offset' in input)) {
    return Temporal.PlainTime.from(
      {
        hour: parseInteger(input.hour),
        minute: parseInteger(input.minute)
      },
      { overflow: 'reject' }
    )
  }

  throw new RangeError('Invalid input')
}

/**
 * @param {string} input
 * @param {string} [timeZone] - IANA time zone to convert to, if the input includes an offset or Z
 * @returns {Temporal.PlainTime} the parsed time
 */
function parseTimeFromString(input, timeZone) {
  const parsed12Hour = parse12HourTime(input)
  if (parsed12Hour) {
    return parsed12Hour
  }

  // Offset-bearing strings are zoned: convert to local time.
  // A date-less offset can't be zoned, so this correctly throws (invalid),
  // rather than falling through to PlainTime.from, which silently drops the offset.
  if (hasIsoOffset(input)) {
    return Temporal.Instant.from(input)
      .toZonedDateTimeISO(timeZone ?? getTimeZone())
      .toPlainTime()
  }

  return Temporal.PlainTime.from(input)
}

/**
 * Parses a 12 hour clock time string like `2pm` or `2:15pm`,
 * or returns null if the string doesn't match.
 *
 * @param {string} input
 * @returns {Temporal.PlainTime | null}
 */
function parse12HourTime(input) {
  const match = input.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)$/i)
  if (!match) {
    return null
  }

  const [, hourStr, minuteStr, period] = match
  const hour12 = Number(hourStr)

  if (hour12 >= 1 && hour12 <= 12) {
    const isPm = period.toLowerCase() === 'pm'
    const hour = (hour12 % 12) + (isPm ? 12 : 0)
    const minute = minuteStr ? Number(minuteStr) : 0

    return Temporal.PlainTime.from({ hour, minute }, { overflow: 'reject' })
  }

  throw new RangeError('Invalid input')
}

/**
 * Format a time whilst following the NHS.UK style guide for times
 *
 * The input can be hour and minute numbers entered by a user into
 * the Time input component, which the prototype kit converts into an object.
 *
 * Alternatively the filter also works with ISO time strings like `14:15`,
 * or ISO date-time strings like `2026-08-08T14:15`.
 *
 * @example
 * ```njk
 * {{ data.appointmentTime | formatTime }}
 * ```
 * @example
 * ```njk
 * {{ data.appointmentTime | formatTime({ 'use24hour': true }) }}
 * ```
 * @see {@link https://service-manual.nhs.uk/content/numbers-measurements-dates-time#time}
 * @param {TimeInputType | string | unknown} input - Time as ISO string or object with hour, minute (and optionally year, month, day, offset)
 * @param {FormatTimeOptions} [options] - Formatting options
 */
export function formatTime(input, options) {
  try {
    const time = parseTime(input, options?.timeZone)

    if (options?.use24hour) {
      return hour24Format.format(time)
    }

    if (time.minute === 0 && options?.useMiddayMidnight !== false) {
      if (time.hour === 0) {
        return 'midnight'
      }

      if (time.hour === 12) {
        return 'midday'
      }
    }

    const formatter =
      time.minute === 0 && !options?.includeMinutesOnTheHour
        ? hourFormat
        : timeFormat

    return formatter.format(time).replace(' ', '').toLowerCase()
  } catch {
    console.warn('Invalid time:', input)
    return 'Invalid time'
  }
}

/**
 * Format a time using the 24 hour clock, e.g. `09:05` or `14:15`
 *
 * Alias for `formatTime(input, { 'use24hour': true })`.
 *
 * @example
 * ```njk
 * {{ data.appointmentTime | formatTime24Hour }}
 * ```
 * @param {TimeInputType | string | unknown} input - Time as ISO string or object with hour, minute (and optionally year, month, day, offset)
 */
export function formatTime24Hour(input) {
  return formatTime(input, { use24hour: true })
}

/**
 * Check for time input object
 *
 * @template {TimeInputType} InputType
 * @param {InputType | string | unknown} input
 * @returns {input is InputType}
 */
export function isTimeInput(input) {
  return isObject(input) && 'hour' in input && 'minute' in input
}

/**
 * Time input only
 *
 * @typedef {object} TimeInput
 * @property {string | number} hour - The hour
 * @property {string | number} minute - The minute
 */

/**
 * @typedef {DateTimeInput | TimeInput} TimeInputType - Types with time options
 */

/**
 * @typedef {object} FormatTimeOptions
 * @property {boolean} [includeMinutesOnTheHour] - Include :00 minutes on the hour (default: false)
 * @property {boolean} [useMiddayMidnight] - Display 12:00 and 00:00 as midday and midnight (default: true)
 * @property {string} [timeZone] - An IANA time zone to convert to (overrides process.env.TZ), if the input includes a time zone offset or Z
 * @property {boolean} [use24hour] - Use the 24 hour clock, e.g. `09:05` or `14:15` (default: false)
 */

/**
 * @import { DateTimeInput } from './format-date.js'
 */
