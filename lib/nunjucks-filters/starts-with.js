/**
 * Check string starts with a value
 *
 * @example
 * ```njk
 * {{ startsWith("NHS England", "NHS") }}
 * ```
 * @param {string} string - String to check
 * @param {string} value - Value to check against
 * @returns {boolean} Returns `true` if `string` starts with `value`, else `false`
 */
export function startsWith(string, value) {
  return string.startsWith(value)
}
