/**
 * Check value is numeric
 *
 * @param {unknown} [value] - Value to check
 * @returns {value is string | number}
 */
export function numeric(value) {
  if (typeof value !== 'string' && typeof value !== 'number') {
    return false
  }

  if (typeof value === 'number') {
    return Number.isFinite(value)
  }

  return !Number.isNaN(parseFloat(`${value}`)) && Number.isFinite(Number(value))
}
