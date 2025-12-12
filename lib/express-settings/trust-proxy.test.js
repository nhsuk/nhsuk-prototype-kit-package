import assert from 'node:assert'
import { describe, it } from 'node:test'

import express from 'express'

import { setTrustProxy } from './trust-proxy.js'

const app = express()

describe('setTrustProxy', () => {
  it('adds sets the app to trust proxies', async () => {
    setTrustProxy(app)

    assert.strictEqual(app.get('trust proxy'), 1)
  })
})
