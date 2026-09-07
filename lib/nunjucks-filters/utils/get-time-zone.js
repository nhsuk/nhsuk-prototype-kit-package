import { Temporal } from 'temporal-polyfill-lite'

/**
 * @returns {string} A valid IANA time zone from process.env.TZ, or 'Europe/London'
 */
export function getTimeZone() {
  const defaultTimeZone = 'Europe/London'
  const { TZ = defaultTimeZone } = process.env

  try {
    Temporal.Now.zonedDateTimeISO(TZ)
  } catch {
    // Invalid timezone, fall back to default
    console.warn('Invalid time zone:', TZ)
    return defaultTimeZone
  }

  return TZ
}
