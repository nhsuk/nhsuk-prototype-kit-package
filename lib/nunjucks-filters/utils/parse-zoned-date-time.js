import { Temporal } from 'temporal-polyfill'

import { getTimeZone } from './get-time-zone.js'
import { parseInteger } from './parse-integer.js'

/**
 * Build a `ZonedDateTime` from an object with a full date and offset,
 * converting it to the target time zone.
 *
 * @param {DateTimeInputWithOffset} input - Date time with year, month, day, hour, minute and offset
 * @param {string} [timeZone] - IANA time zone to convert to, if the input includes an offset or Z
 * @returns {Temporal.ZonedDateTime} Date time in the target time zone
 */
export function parseZonedDateTime(input, timeZone) {
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
  ).withTimeZone(timeZone ?? getTimeZone())
}

/**
 * @import { DateTimeInputWithOffset } from '../format-date.js'
 */
