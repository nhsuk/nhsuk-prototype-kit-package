/**
 * Output the data in the browser console
 *
 * @param {object} data - the NHS number to format
 * @returns {string} HTML code to log the data in the browser console
 */

function log(data) {
  const safe = this.env.getFilter('safe')
  return safe(
    `<script>console.log(${JSON.stringify(data, null, '\t')});</script>`
  )
}

export default log
