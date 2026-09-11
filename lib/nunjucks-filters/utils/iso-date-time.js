// Fragments shared between the ISO date-time formats below
const isoDate = '\\d{4}-\\d{2}-\\d{2}'
const isoTime = '\\d{2}:\\d{2}(?::\\d{2}(?:\\.\\d+)?)?'
const isoOffset = '(?:[Zz]|[+-]\\d{2}:\\d{2})'

// Matches an ISO date, optionally with a time, but not a timezone offset or name
const isoDateTimeNoOffsetFormat = new RegExp(`^${isoDate}(?:T${isoTime})?$`)

// Matches a full ISO date-time (date required) that carries a timezone offset
const isoDateTimeWithOffsetFormat = new RegExp(
  `^${isoDate}T${isoTime}${isoOffset}`
)

// Matches any ISO time carrying a timezone offset, whether or not a date is present
const isoTimeWithOffsetFormat = new RegExp(
  `^(?:${isoDate}T)?${isoTime}${isoOffset}$`
)

/**
 * Check whether a string is an ISO date, optionally with a time,
 * but without a timezone offset or name
 *
 * @param {string} input - String to test
 * @returns {boolean} `true` if the string matches
 */
export function isIsoDateTimeWithoutOffset(input) {
  return isoDateTimeNoOffsetFormat.test(input)
}

/**
 * Check whether a string is a full ISO date-time with a timezone offset.
 *
 * A date is required, so this is stricter than {@link hasIsoOffset}: it answers
 * "can this be parsed as a zoned date-time?", and rejects time-only strings
 * such as `14:15Z`.
 *
 * @param {string} input - String to test
 * @returns {boolean} `true` if the string matches
 */
export function isIsoDateTimeWithOffset(input) {
  return isoDateTimeWithOffsetFormat.test(input)
}

/**
 * Check whether a string carries a timezone offset, with or without a date.
 *
 * The date is optional, so this is looser than {@link isIsoDateTimeWithOffset}:
 * it answers "does this have an offset at all?" and also matches time-only
 * strings such as `14:15Z`. Used to route offset-bearing input away from
 * plain-time parsing (which would silently discard the offset).
 *
 * @param {string} input - String to test
 * @returns {boolean} `true` if the string matches
 */
export function hasIsoOffset(input) {
  return isoTimeWithOffsetFormat.test(input)
}
