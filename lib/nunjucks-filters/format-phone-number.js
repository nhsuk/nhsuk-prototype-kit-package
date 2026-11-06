import { parsePhoneNumberFromString } from 'libphonenumber-js'

// This checks whether the phone number is a 6 digit
// phone number like 116 123
const memorableNumberRegex = /^1\d{5}$/

/**
 * Display a phone number formatted with spaces
 *
 * For example, "01273800900" becomes "01273 800 900" and
 * "+442074504000" becomes "+44 (0)20 7450 4000".
 *
 * For non-UK numbers, include the international dialling code at the
 * start to format the number according to the convention of that country.
 * For example "+33123456789" becomes "+33 1 23 45 67 89".
 *
 * These formats make it easier for people and assistive technologies
 * to read.
 *
 * See https://service-manual.nhs.uk/content/a-to-z-of-nhs-health-writing#phone-and-phone-numbers
 *
 * @param {string | number | null} [value] - Phone number to format
 */
export function formatPhoneNumber(value) {
  // If the value is not a string or number, return it unchanged
  if (typeof value !== 'string' && typeof value !== 'number') {
    return value
  }

  // Memorable numbers like 116 123 are not supported by libphonenumber-js
  const digitsOnly = value.replace(/\s/g, '')
  if (memorableNumberRegex.test(digitsOnly)) {
    return `${digitsOnly.substring(0, 3)} ${digitsOnly.substring(3)}`
  }

  // Avoid guessing a missing leading zero or country code
  if (!/^\(?[0+]/.test(value.trim())) {
    return value
  }

  const phoneNumber = parsePhoneNumberFromString(value, {
    defaultCountry: 'GB',
    extract: false
  })

  // If phone number is not possible, return the original value
  if (!phoneNumber?.isPossible()) {
    return value
  }

  // For non-UK numbers, format using the international format
  if (phoneNumber.countryCallingCode !== '44') {
    return phoneNumber.formatInternational()
  }

  // For UK numbers, check if it ends in a 6 digit block and if so, insert a space in the middle (the library doesn't do this automatically)
  const national = phoneNumber
    .formatNational()
    .replace(/ (\d{3})(\d{3})$/, ' $1 $2')

  // If the original value started with +44, format it with
  // a (0) to indicate the national dialling code
  if (value.trim().startsWith('+')) {
    return `+44 (0)${national.substring(1)}`
  }

  return national
}
