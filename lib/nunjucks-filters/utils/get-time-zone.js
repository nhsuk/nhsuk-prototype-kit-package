import { Temporal } from 'temporal-polyfill-lite'

/**
 * @returns {string} A valid IANA time zone from process.env.TZ, or 'Europe/London'
 */
export function getTimeZone() {
  const { TZ = 'Europe/London' } = process.env

  try {
    Temporal.Now.zonedDateTimeISO(TZ)
  } catch {
    // Invalid timezone, fall through to default
    console.warn('Invalid time zone:', TZ)
  }
  
  return TZ
}
