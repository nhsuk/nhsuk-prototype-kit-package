import { confirm } from '@inquirer/prompts'
import { checkPortStatus, findAPortNotInUse } from 'portscanner'

/**
 * Find an available port to run a server on. This will check
 * whether the default port is available and if not, will ask
 * the user whether to switch to an available port.
 *
 * @param {number} [startPort] - Find port starting from this port number (optional)
 * @throws {Error} If port unavailable or user declines to change port
 */
export async function findAvailablePort(startPort = 3000) {
  const host = '127.0.0.1'

  // Check default port is free
  if ((await checkPortStatus(startPort, host)) === 'closed') {
    return startPort
  }

  console.error(
    `ERROR: Port ${startPort} in use - you may have another prototype running.\n`
  )

  const change = confirm({
    message: 'Change to an available port?',
    default: false
  })

  if (await change.catch(() => false)) {
    return getAvailablePort(startPort + 1000)
  }

  throw new Error(`Port ${startPort} in use`)
}

/**
 * Suggest port numbers to check for availability
 *
 * @see {@link https://www.keenformatics.com/ports-that-are-blocked-by-browsers}
 * @param {number} [startPort] - Suggest ports starting from this port number (optional)
 * @returns {number[]} - Suggested port numbers
 */
export function getSuggestedPorts(startPort = 3000) {
  return (
    [0, 1000, 2000, 3000, 4000, 5000, 6000]
      .map((increment) => startPort + increment)

      // Exclude port 6000 blocked by browsers
      .filter((port) => port !== 6000)
  )
}

/**
 * Get an available port without confirmation
 *
 * @param {number} [startPort] - Find port starting from this port number (optional)
 * @returns {Promise<number>} - Available port number
 */
export async function getAvailablePort(startPort = 3000) {
  const host = '127.0.0.1'

  // Try fixed port numbers 3000, 4000, 5000 etc,
  // but fall back to increments 3002, 3003, 3004 etc
  try {
    return await findAPortNotInUse(getSuggestedPorts(startPort), host)
  } catch {
    return findAPortNotInUse(getSuggestedPorts(startPort + 2), host)
  }
}
