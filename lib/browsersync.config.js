import httpProxy from 'http-proxy-node16'

const { PORT = '3000' } = process.env
const port = parseInt(PORT, 10)

// We create our own proxy server here
// as the default proxy option does not work
// on GitHub Codespaces
export const proxy = httpProxy.createProxyServer({
  target: `http://localhost:${port}`,
  changeOrigin: true,
  xfwd: true
})

/**
 * BrowserSync config
 */
export default /** @satisfies {Options} */ ({
  port: port + 1,
  files: ['app/**/*.{html,njk}', 'app/assets/**/*'],
  server: { baseDir: 'app/public' },
  middleware: (req, res) => proxy.web(req, res),

  // Prevent browser mirroring
  ghostMode: false,

  // Prevent browser opening
  open: false,

  // Allow for Express.js restart
  reloadDelay: 1000,

  // Watch for file changes
  watch: true,

  // Prevent Browsersync UI
  ui: false
})

/**
 * @import { Options } from 'browser-sync';
 */
