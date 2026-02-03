/**
 * Generate a unique session name based on the service name
 *
 * @param {string} serviceName
 */
export function getSessionName(serviceName) {
  const hash = new TextEncoder()
    .encode(serviceName)
    .reduce((hex, byte) => hex + byte.toString(16).padStart(2, '0'), '')

  return `nhsuk-prototype-kit-${hash}`
}
