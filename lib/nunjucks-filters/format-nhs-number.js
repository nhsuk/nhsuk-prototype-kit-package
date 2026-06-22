import { formatNumber } from './format-number.js'

/**
 * Format an NHS number with spaces
 *
 * The format is 3 3 4: 2 groups of 3 digits followed by 4 digits.
 *
 * For example, "9991234567" becomes "999 123 4567".
 * (This is an example or test number.)
 *
 * This number format makes it easier for people and assistive technologies
 * to read. It also makes it less likely that people will make mistakes.
 *
 * See https://service-manual.nhs.uk/content/a-to-z-of-nhs-health-writing#nhs-number
 *
 * @param {string | number} [value] - Value to format as NHS number
 */
export function formatNhsNumber(value) {
  const digitsOnly = formatNumber(value, '[^0-9]')?.toString()

  if (digitsOnly?.length !== 10) {
    return value
  }

  // Split "9991234567" into groups
  const group1 = digitsOnly.substring(0, 3)
  const group2 = digitsOnly.substring(3, 6)
  const group3 = digitsOnly.substring(6, 10)

  // Add spaces to become "999 123 4567"
  return `${group1} ${group2} ${group3}`
}
