import assert from 'node:assert/strict'
import { after, before, describe, it } from 'node:test'

import browserSync from 'browser-sync'

process.env.PORT = '3500'
process.env.PROXY_PORT = '3501'

const { default: browserSyncConfig } = await import('./browsersync.config.js')

describe('Browsersync proxy', () => {
  const bs = browserSync.create()

  before((context, done) => {
    bs.init(browserSyncConfig, done)
  })

  after(() => {
    bs.exit()
  })

  it(
    'returns a 502 error page when the proxied app is unavailable',
    { timeout: 2000 },
    async () => {
      const response = await fetch(`http://localhost:${process.env.PROXY_PORT}`)

      assert.equal(response.status, 502)
      assert.match(await response.text(), /browser-sync-client/)
    }
  )
})