/**
 * Output the data in the browser console
 *
 * @this {{ env: Environment }}
 * @param {object} data - the NHS number to format
 * @returns {string} HTML code to log the data in the browser console
 */
export function log(data) {
  const safe = this.env.getFilter('safe')
  return safe(
    `<script>console.log(${JSON.stringify(data, null, '\t')});</script>`
  )
}

/**
 * @import { Environment } from 'nunjucks'
 */
