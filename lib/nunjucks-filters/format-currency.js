import { formatNumber } from './format-number.js'
import { isNumeric } from './is-numeric.js'

/**
 * Format currency
 *
 * @param {string | number} [value] - Value to format
 */
export function formatCurrency(value = '') {
  let minimumFractionDigits = 2
  let maximumFractionDigits = 2

  const number = formatNumber(value)

  if (!isNumeric(number)) {
    return value
  }

  // Decimal places are optional for '.00'
  if (number === Number.parseInt(`${number}`, 10)) {
    minimumFractionDigits = 0
    maximumFractionDigits = 0
  }

  // Format as currency string
  return number.toLocaleString('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits,
    maximumFractionDigits
  })
}
