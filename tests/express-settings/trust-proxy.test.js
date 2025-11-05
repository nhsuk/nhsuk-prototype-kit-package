const { describe, it } = require('node:test')
const assert = require('node:assert')
const setTrustProxy = require('../../lib/express-settings/trust-proxy')
const express = require('express')
const app = express()

describe('setTrustProxy', () => {
  it('adds sets the app to trust proxies', async () => {
    setTrustProxy(app)

    assert.strictEqual(app.get('trust proxy'), 1)
  })
})
