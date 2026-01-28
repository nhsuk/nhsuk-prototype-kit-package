import { target } from './browsersync.config.js'

/**
 * Wait on config
 */
export default /** @satisfies {WaitOnOptions} */ ({
  resources: [target],

  // Allow 30 seconds to start server
  timeout: 30000
})

/**
 * @import { WaitOnOptions } from 'wait-on'
 */
