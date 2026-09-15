import { Temporal } from 'temporal-polyfill'

import { isDateTimeInputWithOffset } from '../format-date.js'
import { getTimeZone } from './get-time-zone.js'
import { parseInteger } from './parse-integer.js'

/**
 * Build a `ZonedDateTime` from an object with a full date and offset,
 * converting it to the target time zone.
 *
 * @param {DateInputType | TimeInputType | object} input - Object to check for year, month, day, hour, minute and offset
 * @param {string} [timeZone] - IANA time zone to convert to (defaults to `getTimeZone()`), if the input includes a time zone offset or Z
 * @returns {Temporal.ZonedDateTime} The date-time in the target time zone, or `undefined` if the input has no offset (so isn't attempting to be zoned)
 * @throws {RangeError} If the input has an offset but is missing year, month, day, hour or minute
 */
export function zonedDateTimeFromObject(input, timeZone) {
  if (isDateTimeInputWithOffset(input)) {
    const sourceDateTime = Temporal.ZonedDateTime.from(
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

    return sourceDateTime.withTimeZone(timeZone ?? getTimeZone())
  }

  throw new RangeError('Invalid input')
}

/**
 * Build a `ZonedDateTime` from an ISO date-time string with a timezone offset
 * or UTC designator, converting it to the target time zone.
 *
 * @param {string} input - ISO date-time string with an offset or `Z`
 * @param {string} [timeZone] - IANA time zone to convert to (defaults to `getTimeZone()`), if the input includes a time zone offset or Z
 * @returns {Temporal.ZonedDateTime} The date-time in the target time zone
 */
export function zonedDateTimeFromOffsetString(input, timeZone) {
  const instant = Temporal.Instant.from(input)
  return instant.toZonedDateTimeISO(timeZone ?? getTimeZone())
}

/**
 * @import { DateInputType } from '../format-date.js'
 * @import { TimeInputType } from '../format-time.js'
 */
