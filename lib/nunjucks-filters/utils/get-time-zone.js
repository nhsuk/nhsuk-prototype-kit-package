import { Temporal } from 'temporal-polyfill-lite'

/**
 * @returns {string} A valid IANA time zone from process.env.TZ, or 'Europe/London'
 */
export function getTimeZone() {
  const tz = process.env.TZ
  if (tz) {
    try {
      Temporal.Now.zonedDateTimeISO(tz)
      return tz
    } catch {
      // Invalid timezone, fall through to default
    }
  }
  return 'Europe/London'
}
