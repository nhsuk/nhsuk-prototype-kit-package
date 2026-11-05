import { ServerResponse } from 'node:http'
import { join } from 'node:path'

import httpProxy from 'http-proxy-node16'

import * as config from './nhsuk-prototype-kit.config.js'

const { PORT = '3001', PROXY_PORT = '3000' } = process.env

const port = parseInt(PORT, 10)
const proxyPort = parseInt(PROXY_PORT, 10)

let /** @type {Environment} */ nunjucksEnv

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
  .on('error', async (error, req, res) => {
    console.error(
      error instanceof AggregateError
        ? (error.errors[0]?.message ?? error.message)
        : error.message
    )

    if (!(res instanceof ServerResponse) || res.writableEnded) {
      return
    }

    if (res.headersSent) {
      res.end()
      return
    }

    if (!nunjucksEnv) {
      const { configure } =
        await import('nhsuk-frontend/lib/nunjucks/environment.mjs')
      nunjucksEnv = configure(config.searchPaths)
    }

    res.writeHead(502, { 'Content-Type': 'text/html; charset=utf-8' })
    res.end(nunjucksEnv.render('browsersync-proxy-error.html'))
  })

/**
 * Browsersync config
 */
export default /** @satisfies {Options} */ ({
  port: proxyPort,
  files: ['app/**/*.{html,njk}', 'public/**/*'],
  ignore: ['public/**/*.map'],
  serveStatic: [
    {
      route: '/nhsuk-frontend',
      dir: join(config.nhsukFrontendPath, 'dist/nhsuk')
    }
  ],
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
 * @import { Environment } from 'nunjucks'
 */
