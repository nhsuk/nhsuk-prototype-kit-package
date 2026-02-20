/**
 * Trim all spaces
 *
 * @example '9991234567'
 * ```njk
 * {{ ' 999   123 4567  ' | trimSpaces }}
 * ```
 * @param {string | number} [value] - Value to trim all spaces from
 */
export function trimSpaces(value = '') {
  return `${value}`.replaceAll(/\s+/g, '')
}
