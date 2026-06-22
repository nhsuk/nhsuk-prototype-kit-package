import { isNumeric } from './is-numeric.js'

/**
 * Format number
 *
 * @param {string | number} [value] - Value to format
 * @param {string} [disallow] - Regex string to disallow
 */
export function formatNumber(value = '', disallow = '[^0-9.-]+') {
  const normalised = `${value}`
    .replaceAll(/\s+/g, '')

    // Only allow '-' at start
    .replaceAll(/(?!^)-/g, '')

    // Only allow certain characters
    .replaceAll(new RegExp(disallow, 'g'), '')

    // Only allow the last decimal point
    .replaceAll(/[.](?=.*[.])/g, '')

  // Attempt to parse as float
  const number = Number.parseFloat(`${normalised}`)
  return isNumeric(number) ? number : undefined
}
