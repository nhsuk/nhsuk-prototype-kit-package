import assert from 'node:assert/strict'
import { once } from 'node:events'
import http from 'node:http'
import { describe, it } from 'node:test'

describe('BrowserSync proxy', () => {
  it('returns a 502 error page when the proxied app is unavailable', async () => {
    const upstream = http.createServer()
    const upstreamPort = await listen(upstream)
    const previousPort = process.env.PORT
    process.env.PORT = `${upstreamPort}`

    let proxy
    let server

    try {
      ;({ proxy } = await import(`./browsersync.config.js?${upstreamPort}`))
      await close(upstream)

      server = http.createServer((req, res) => proxy.web(req, res))
      const proxyPort = await listen(server)
      const response = await fetch(`http://127.0.0.1:${proxyPort}`, {
        signal: AbortSignal.timeout(2000)
      })

      assert.equal(response.status, 502)
      assert.match(await response.text(), /browser-sync-client/)
    } finally {
      if (server?.listening) {
        await close(server)
      }

      if (upstream.listening) {
        await close(upstream)
      }

      proxy?.close()

      if (previousPort === undefined) {
        delete process.env.PORT
      } else {
        process.env.PORT = previousPort
      }
    }
  })
})

async function listen(server) {
  const listening = once(server, 'listening')
  server.listen(0, '127.0.0.1')
  await listening

  const address = server.address()
  assert.ok(address && typeof address !== 'string')
  return address.port
}

async function close(server) {
  const closed = once(server, 'close')
  server.close()
  await closed
}
