const { PORT = '3000' } = process.env

/**
 * Wait on config
 */
export default /** @satisfies {WaitOnOptions} */ ({
  resources: [`tcp:${PORT}`],

  // Allow 5 seconds to start server
  timeout: 5000
})

/**
 * @import { WaitOnOptions } from 'wait-on'
 */
