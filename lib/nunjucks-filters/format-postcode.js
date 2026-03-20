import { trimSpaces } from './trim-spaces.js'

// This is a relative loose regular expression which just checks the
// format of the postcode, but not that the postcode actually exists.
const postcodeRegex = /^(gir\s?0aa|[a-z]{1,2}\d[\da-z]?\s?(\d[a-z]{2})?)$/i

/**
 * Format a postcode with spaces
 *
 * @param {string | number} [value] - Value to format as postcode
 */
export function formatPostcode(value) {
  let postcode = trimSpaces(value)

  if (!postcodeRegex.test(postcode)) {
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
