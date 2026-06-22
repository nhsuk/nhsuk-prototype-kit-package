import parsePhoneNumber from 'libphonenumber-js'

/**
 * Format phone number
 *
 * @example '020 7450 4000'
 * ```njk
 * {{ '02074504000' | formatPhoneNumber }}
 * ```
 * @example '+44 20 7450 4000'
 * ```njk
 * {{ '02074504000' | formatPhoneNumber('GB') }}
 * ```
 * @example 'tel:+442074504000'
 * ```njk
 * {{ '02074504000' | formatPhoneNumber('GB', 'RFC3966') }}
 * ```
 * @param {string | number} [value] - Value to format
 * @param {CountryCode} [countryCode] - Country code
 * @param {NumberFormat} [format] - Number format
 */
export function formatPhoneNumber(value = '', countryCode, format) {
  const phoneNumber = parsePhoneNumber(`${value}`, {
    defaultCountry: countryCode ?? 'GB',
    extract: false
  })

  if (!phoneNumber || !phoneNumber.isPossible()) {
    return value
  }

  return countryCode
    ? phoneNumber.format(format ?? 'INTERNATIONAL')
    : phoneNumber.format(format ?? 'NATIONAL')
}

/**
 * @import { CountryCode, NumberFormat } from 'libphonenumber-js'
 */
