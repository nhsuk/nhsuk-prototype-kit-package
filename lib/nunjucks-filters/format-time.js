import { isObject } from 'nhsuk-frontend'
// Uses the JavaScript Temporal API, polyfilled until it's natively supported
import { Intl, Temporal } from 'temporal-polyfill-lite'

import { getTimeZone } from './utils/get-time-zone.js'

// Formats hour and minute, e.g. 2:15 PM
const timeFormat =
  /** @type {import('temporal-polyfill-lite').Intl.DateTimeFormat} */ (
    new Intl.DateTimeFormat('en-GB', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  )

// Formats hour only, e.g. 2 PM, for times on the hour
const hourFormat =
  /** @type {import('temporal-polyfill-lite').Intl.DateTimeFormat} */ (
    new Intl.DateTimeFormat('en-GB', {
      hour: 'numeric',
      hour12: true
    })
  )

/**
 * @param {unknown} input - Time as ISO string or object with hour, minute
 * @param {string} [zone] - IANA time zone to convert to
 * @returns {Temporal.PlainTime} the parsed time
 */
function parseTime(input, zone) {
  if (isObject(input) && 'hour' in input && 'minute' in input) {
    // Reject empty/whitespace strings explicitly, as Number('') coerces to 0
    if (
      String(input.hour).trim() === '' ||
      String(input.minute).trim() === ''
    ) {
      throw new RangeError('Invalid input')
    }

    const hour = Number(input.hour)
    const minute = Number(input.minute)

    if (!Number.isFinite(hour) || !Number.isFinite(minute)) {
      throw new RangeError('Invalid input')
    }

    return Temporal.PlainTime.from({ hour, minute }, { overflow: 'reject' })
  }

  if (typeof input === 'string') {
    const parsed12Hour = parse12HourTime(input)
    if (parsed12Hour) return parsed12Hour

    // If the string contains a timezone offset, convert to local time
    if (/[Zz]$|[+-]\d{2}:\d{2}$/.test(input)) {
      const instant = Temporal.Instant.from(input)
      const zonedDateTime = instant.toZonedDateTimeISO(zone || getTimeZone())
      return zonedDateTime.toPlainTime()
    }

    return Temporal.PlainTime.from(input)
  }

  throw new RangeError('Invalid input')
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
  if (!match) return null

  const [, hourStr, minuteStr, period] = match
  const hour12 = Number(hourStr)

  if (hour12 < 1 || hour12 > 12) {
    throw new RangeError('Invalid input')
  }

  const isPm = period.toLowerCase() === 'pm'
  const hour = (hour12 % 12) + (isPm ? 12 : 0)
  const minute = minuteStr ? Number(minuteStr) : 0

  return Temporal.PlainTime.from({ hour, minute }, { overflow: 'reject' })
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
 * @see {@link https://service-manual.nhs.uk/content/numbers-measurements-dates-time#times}
 * @param {string|TimeInputObject|unknown} input - Time as ISO string or object with hour, minute
 * @param {object} [options] - Options
 * @param {boolean} [options.truncate] - Whether to drop :00 minutes on the hour (default: true)
 * @param {boolean} [options.middayMidnight] - Whether to display 12:00 and 00:00 as midday and midnight (default: true)
 * @param {string} [options.zone] - IANA time zone to convert to (overrides process.env.TZ)
 */
export function formatTime(input, options) {
  try {
    const resolvedOptions = {
      truncate: true,
      middayMidnight: true,
      ...options
    }

    const time = parseTime(input, resolvedOptions.zone)

    if (time.minute === 0 && resolvedOptions.middayMidnight) {
      if (time.hour === 0) return 'midnight'
      if (time.hour === 12) return 'midday'
    }

    const formatter =
      time.minute === 0 && resolvedOptions.truncate ? hourFormat : timeFormat

    return formatter.format(time).replace(' ', '').toLowerCase()
  } catch {
    console.warn('Invalid time:', input)
    return 'Invalid time'
  }
}

/**
 * Format a time using the 24 hour clock, e.g. `09:05` or `14:15`
 *
 * The input can be hour and minute numbers entered by a user into
 * the Time input component, which the prototype kit converts into an object.
 *
 * Alternatively the filter also works with ISO time strings like `14:15`,
 * or ISO date-time strings like `2026-08-08T14:15`.
 *
 * @example
 * ```njk
 * {{ data.appointmentTime | formatTime24Hour }}
 * ```
 * @param {string|TimeInputObject|unknown} input - Time as ISO string or object with hour, minute
 */
export function formatTime24Hour(input) {
  try {
    const time = parseTime(input)

    const hour = `${time.hour}`.padStart(2, '0')
    const minute = `${time.minute}`.padStart(2, '0')

    return `${hour}:${minute}`
  } catch {
    console.warn('Invalid time:', input)
    return 'Invalid time'
  }
}

/**
 * @typedef {object} TimeInputObject
 * @property {string|number} hour - The hour
 * @property {string|number} minute - The minute
 */
