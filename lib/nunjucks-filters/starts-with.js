/**
 * Check string starts with a value
 *
 * @example startsWith('NHS England', 'NHS') // true
 * @param {string} string - String to check
 * @param {string} value - Value to check against
 * @returns {boolean} Returns `true` if `string` starts with `value`, else `false`
 */
function startsWith(string, value) {
  return string.startsWith(value)
}

export default startsWith
