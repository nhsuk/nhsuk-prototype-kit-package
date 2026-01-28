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
  ignore: ['app/assets/javascript/**/*', 'public/**/*'],
  script: 'app.js',
  signal: 'SIGINT',
  spawn: true,
  watch: ['app.js', 'app']
})

/**
 * @import { NodemonSettings } from 'nodemon';
 */
