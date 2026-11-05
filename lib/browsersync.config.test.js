import assert from 'node:assert/strict'
import { once } from 'node:events'
import http from 'node:http'
import { after, before, describe, it } from 'node:test'

import browserSync from 'browser-sync'

describe('BrowserSync proxy', () => {
  let browser
  let proxyPort
  let previousPort
  let previousProxyPort

  before(async () => {
    previousPort = process.env.PORT
    previousProxyPort = process.env.PROXY_PORT

    const appServer = http.createServer()
    await once(appServer.listen(0, '127.0.0.1'), 'listening')
    const appAddress = appServer.address()
    assert.ok(appAddress && typeof appAddress !== 'string')
    const appPort = appAddress.port
    const appServerClosed = once(appServer, 'close')
    appServer.close()
    await appServerClosed

    const proxyServer = http.createServer()
    await once(proxyServer.listen(0, '127.0.0.1'), 'listening')
    const proxyAddress = proxyServer.address()
    assert.ok(proxyAddress && typeof proxyAddress !== 'string')
    proxyPort = proxyAddress.port
    const proxyServerClosed = once(proxyServer, 'close')
    proxyServer.close()
    await proxyServerClosed

    process.env.PORT = `${appPort}`
    process.env.PROXY_PORT = `${proxyPort}`

    const { default: config } = await import(
      `./browsersync.config.js?${appPort}-${proxyPort}`
    )
    browser = browserSync.create()
    await new Promise((resolve, reject) => {
      browser.init(
        { ...config, files: [], watch: false, logLevel: 'silent' },
        (error) => (error ? reject(error) : resolve())
      )
    })
  })

  after(async () => {
    browser?.exit()

    if (previousPort === undefined) {
      delete process.env.PORT
    } else {
      process.env.PORT = previousPort
    }

    if (previousProxyPort === undefined) {
      delete process.env.PROXY_PORT
    } else {
      process.env.PROXY_PORT = previousProxyPort
    }
  })

  it('returns a 502 error page when the proxied app is unavailable', async () => {
    const baseUrl = `http://127.0.0.1:${proxyPort}`
    const response = await fetch(baseUrl, {
      signal: AbortSignal.timeout(2000)
    })

    assert.equal(response.status, 502)
    assert.match(await response.text(), /browser-sync-client/)
  })
})
