import validator from 'validator'

import { trimSpaces } from './trim-spaces.js'

/**
 * Format a postcode with spaces
 *
 * @param {string | number} [value] - Value to format as postcode
 */
export function formatPostcode(value) {
  let postcode = trimSpaces(value)

  if (!validator.isPostalCode(postcode, 'GB')) {
    return value
  }

  postcode = postcode.toUpperCase()

  // Split 3 characters from the end
  const split = postcode.length - 3
  const outcode = postcode.substring(0, split)
  const incode = postcode.substring(split)

  // Add spaces to become "E14 4PU"
  return `${outcode} ${incode}`
}
