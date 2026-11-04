import { readFileSync } from 'node:fs'
import { ServerResponse } from 'node:http'

import httpProxy from 'http-proxy-node16'

const { PORT = '3001', PROXY_PORT = '3000' } = process.env

const port = parseInt(PORT, 10)
const proxyPort = parseInt(PROXY_PORT, 10)
const proxyErrorPage = readFileSync(
  new URL('./browsersync-proxy-error.html', import.meta.url),
  'utf8'
)

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
  .on('error', (error, req, res) => {
    console.error(error.message)

    if (!(res instanceof ServerResponse) || res.writableEnded) {
      return
    }

    if (res.headersSent) {
      res.end()
      return
    }

    res.writeHead(502, { 'Content-Type': 'text/html; charset=utf-8' })
    res.end(proxyErrorPage)
  })

/**
 * Browsersync config
 */
export default /** @satisfies {Options} */ ({
  port: proxyPort,
  files: ['app/**/*.{html,njk}', 'public/**/*'],
  ignore: ['public/**/*.map'],
  server: { baseDir: 'public' },
  middleware: (req, res) => proxy.web(req, res),

  // Prevent browser mirroring
  ghostMode: false,

  // Prevent browser notifications
  notify: false,

  // Prevent browser opening
  open: false,

  // Watch for file changes
  watch: true,

  // Prevent Browsersync UI
  ui: false
})

/**
 * @import { Options } from 'browser-sync'
 */
