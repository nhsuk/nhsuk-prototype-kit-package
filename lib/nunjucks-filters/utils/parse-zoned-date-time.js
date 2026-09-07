import { Temporal } from 'temporal-polyfill-lite'

import { getTimeZone } from './get-time-zone.js'
import { parseFiniteNumber } from './parse-finite-number.js'

/**
 * Build a `ZonedDateTime` from an object with a full date and offset,
 * converting it to the target time zone.
 *
 * @param {object} input - Object with year, month, day, hour, minute and offset
 * @param {string} [zone] - IANA time zone to convert to (defaults to `getTimeZone()`)
 * @returns {Temporal.ZonedDateTime} The date-time in the target time zone
 */
export function zonedDateTimeFromObject(input, zone) {
  const sourceDateTime = Temporal.ZonedDateTime.from(
    {
      year: parseFiniteNumber(input.year),
      month: parseFiniteNumber(input.month),
      day: parseFiniteNumber(input.day),
      hour: parseFiniteNumber(input.hour),
      minute: parseFiniteNumber(input.minute),
      timeZone: String(input.offset)
    },
    { overflow: 'reject' }
  )

  return sourceDateTime.withTimeZone(zone || getTimeZone())
}

/**
 * Build a `ZonedDateTime` from an ISO date-time string with a timezone offset
 * or UTC designator, converting it to the target time zone.
 *
 * @param {string} input - ISO date-time string with an offset or `Z`
 * @param {string} [zone] - IANA time zone to convert to (defaults to `getTimeZone()`)
 * @returns {Temporal.ZonedDateTime} The date-time in the target time zone
 */
export function zonedDateTimeFromOffsetString(input, zone) {
  const instant = Temporal.Instant.from(input)
  return instant.toZonedDateTimeISO(zone || getTimeZone())
}
