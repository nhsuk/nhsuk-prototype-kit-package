/**
 * Convert a value to an integer, rejecting empty/whitespace strings, decimals,
 * scientific/hex notation, booleans, null, arrays and objects, which
 * `Number()` would otherwise coerce to `0`, `1`, `NaN` or an unexpected integer.
 * Unlike `parseInt()`, this rejects trailing garbage (`'42abc'`) and leading-digit
 * strings that aren't plain integers (`'2.5'`, `'1e3'`) instead of truncating them
 *
 * @param {unknown} value - Value to convert
 * @returns {number} The converted integer
 * @throws {RangeError} If the value isn't a plain integer string or number
 */
export function parseInteger(value) {
  if (typeof value !== 'string' && typeof value !== 'number') {
    throw new RangeError('Invalid input')
  }

  if (typeof value === 'string') {
    value = value.trim()

    if (!/^[+-]?\d+$/.test(value)) {
      throw new RangeError('Invalid input')
    }
  }

  const number = Number(value)

  if (!Number.isInteger(number)) {
    throw new RangeError('Invalid input')
  }

  return number
}
