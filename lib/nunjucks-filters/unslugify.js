import filters from 'nunjucks/src/filters.js'

/**
 * Format URL friendly "slug" back to human readable text
 *
 * @param {string | number} [value] - Value to format
 * @returns {string} Human readable text
 */
export function unslugify(value) {
  if (typeof value === 'undefined') {
    return ''
  }

  return filters.capitalize(`${value}`.replaceAll(/-/g, ' '))
}
