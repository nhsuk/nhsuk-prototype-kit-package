/**
 * Convert a value to a finite number, rejecting empty/whitespace strings
 * which `Number()` would otherwise coerce to `0`
 *
 * @param {unknown} value - Value to convert
 * @returns {number} The converted number
 * @throws {RangeError} If the value is empty, whitespace-only, or not finite
 */
export function parseFiniteNumber(value) {
  if (typeof value === 'string' && value.trim() === '') {
    throw new RangeError('Invalid input')
  }

  const number = Number(value)

  if (!Number.isFinite(number)) {
    throw new RangeError('Invalid input')
  }

  return number
}
