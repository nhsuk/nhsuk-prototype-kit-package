import { join } from 'node:path'

import { prototypeKitPath } from './nhsuk-prototype-kit.config.js'

const { PORT = '3000' } = process.env
const script = process.mainModule?.filename ?? 'app.js'

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
  script,
  signal: 'SIGINT',
  spawn: true,
  watch: [join(prototypeKitPath, 'lib'), script, 'app']
})

/**
 * @import { NodemonSettings } from 'nodemon';
 */
