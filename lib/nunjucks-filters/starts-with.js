/**
 * Check string starts with a value
 *
 * @example
 * ```njk
 * {{ startsWith("NHS England", "NHS") }}
 * ```
 * @param {string | number} [value] - Value to check
 * @param {string | number} [searchValue] - Value to check against
 */
export function startsWith(value, searchValue) {
  if (typeof value === 'undefined' || typeof searchValue === 'undefined') {
    return false
  }

  return `${value}`.startsWith(`${searchValue}`)
}
