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
 * @see {@link https://service-manual.nhs.uk/content/a-to-z-of-nhs-health-writing#phone-and-phone-numbers}
 * @param {string | number | null} [value] - Phone number to format
 */
export function formatPhoneNumber(value) {
  // If the value is not a string or number, return it unchanged
  if (typeof value !== 'string' && typeof value !== 'number') {
    return value
  }

  // If the value contains any characters other than digits, spaces, +, hyphens or brackets, return it unchanged
  if (/[^0-9\s+\-()]/.test(String(value))) {
    return value
  }

  // Remove all characters except digits and the plus sign
  const digitsAndPlusOnly = String(value).replace(/[^0-9+]/g, '')

  // If the number contains precisely 6 digits, it is a UK memorable
  // phone number, so return it formatted with a space in the middle,
  // like 116 123
  if (memorableNumberRegex.test(digitsAndPlusOnly)) {
    return `${digitsAndPlusOnly.substring(0, 3)} ${digitsAndPlusOnly.substring(3)}`
  }

  // Parse the phone number using libphonenumber-js with the default country set to the United Kingdom
  const phoneNumber = parsePhoneNumberFromString(digitsAndPlusOnly, {
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

  // It’s a UK number, so format it using the national format
  let formatted = phoneNumber.formatNational()

  // Check if it ends in a 6 digit block and if so, insert a space in the middle (the library doesn't do this automatically)
  if (/\s\d{6}$/.test(formatted)) {
    formatted = `${formatted.slice(0, -3)} ${formatted.slice(-3)}`
  }

  // If the value started with +44 or 44 or 0044, format it with
  // '+44 (0)' at the beginning so that it works for both callers
  // within the UK and from abroad.
  if (/^(\+|00)?44/.test(digitsAndPlusOnly)) {
    return `+44 (0)${formatted.substring(1)}`
  }

  return formatted
}
