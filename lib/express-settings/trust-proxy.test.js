import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import express from 'express'

import { setTrustProxy } from './trust-proxy.js'

describe('setTrustProxy', () => {
  const app = express()

  it('adds sets the app to trust proxies', async () => {
    setTrustProxy(app)

    assert.equal(app.get('trust proxy'), 1)
  })
})
