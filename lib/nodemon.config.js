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
  ignore: ['public/**/*'],
  script,
  signal: 'SIGINT',
  spawn: true,
  watch: [script, 'app']
})

/**
 * @import { NodemonSettings } from 'nodemon';
 */
