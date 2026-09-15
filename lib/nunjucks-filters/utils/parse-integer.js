/**
 * Convert a value to a non-negative integer, rejecting empty/whitespace strings,
 * decimals, scientific/hex notation, negative numbers, booleans, null, arrays
 * and objects, which `Number()` would otherwise coerce to `0`, `1`, `NaN` or
 * an unexpected integer.
 *
 * Unlike `parseInt()`, this rejects trailing garbage (`'42abc'`) and leading-digit
 * strings that aren't plain integers (`'2.5'`, `'1e3'`) instead of truncating them
 *
 * @param {string | number} [value] - Value to convert
 * @returns {number} The converted integer
 * @throws {RangeError} If the value isn't a plain non-negative integer string or number
 */
export function parseInteger(value) {
  if (typeof value !== 'string' && typeof value !== 'number') {
    throw new RangeError('Invalid input')
  }

  const trimmed = typeof value === 'string' ? value.trim() : value

  if (typeof trimmed === 'string' && !/^\d+$/.test(trimmed)) {
    throw new RangeError('Invalid input')
  }

  const number = Number(trimmed)

  if (!Number.isInteger(number) || number < 0) {
    throw new RangeError('Invalid input')
  }

  return number
}
