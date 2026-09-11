/**
 * Convert a value to a finite number, rejecting empty/whitespace strings,
 * booleans, null, arrays and objects, which `Number()` would otherwise
 * coerce to `0`, `1` or `NaN`
 *
 * @param {unknown} value - Value to convert
 * @returns {number} The converted number
 * @throws {RangeError} If the value isn't a non-empty string or a finite number
 */
export function parseFiniteNumber(value) {
  if (typeof value !== 'string' && typeof value !== 'number') {
    throw new RangeError('Invalid input')
  }

  if (typeof value === 'string' && value.trim() === '') {
    throw new RangeError('Invalid input')
  }

  const number = Number(value)

  if (!Number.isFinite(number)) {
    throw new RangeError('Invalid input')
  }

  return number
}
