import httpProxy from 'http-proxy-node16'

const { PORT = '3000' } = process.env
const port = parseInt(PORT, 10)

/**
 * Browsersync target
 */
export const target = `http://localhost:${port}`

/**
 * Browsersync proxy
 *
 * We create our own proxy server here as the default proxy
 * option does not work on GitHub Codespaces
 */
export const proxy = httpProxy
  .createProxyServer({
    target,
    changeOrigin: true,
    xfwd: true
  })
  .on('error', (error) => console.error(error.message))

/**
 * Browsersync config
 */
export default /** @satisfies {Options} */ ({
  port: port + 1,
  files: ['app/**/*.{html,njk}', 'public/**/*'],
  ignore: ['public/**/*.map'],
  server: { baseDir: 'public' },
  middleware: (req, res) => proxy.web(req, res),

  // Prevent browser mirroring
  ghostMode: false,

  // Prevent browser opening
  open: false,

  // Watch for file changes
  watch: true,

  // Prevent Browsersync UI
  ui: false
})

/**
 * @import { Options } from 'browser-sync';
 */
