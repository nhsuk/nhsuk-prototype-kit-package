/**
 * Trim and replace multiple spaces with a single space
 *
 * @example 'NHS England'
 * ```njk
 * {{ ' NHS   England  ' | normaliseSpaces }}
 * ```
 * @param {string | number} [value] - Value to normalise spaces
 */
export function normaliseSpaces(value = '') {
  return `${value}`.trim().replaceAll(/\s+/g, ' ')
}
