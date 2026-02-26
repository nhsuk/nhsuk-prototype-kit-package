import { join } from 'node:path'

import {
  appPath,
  scriptPath,
  prototypeKitPath
} from './nhsuk-prototype-kit.config.js'

const { PORT = '3000' } = process.env

/**
 * Nodemon config
 */
export default /** @satisfies {NodemonSettings} */ ({
  env: {
    PORT,
    PROXY: 'true'
  },
  ext: 'cjs,js,json',
  ignore: ['public/**/*', '**/*.test.*'],
  script: scriptPath,
  signal: 'SIGINT',
  spawn: true,
  watch: [join(prototypeKitPath, 'lib'), scriptPath, appPath]
})

/**
 * @import { NodemonSettings } from 'nodemon';
 */
