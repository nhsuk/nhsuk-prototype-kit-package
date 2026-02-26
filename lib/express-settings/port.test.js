import assert from 'node:assert/strict'
import { describe, it, beforeEach } from 'node:test'

import express from 'express'

import { setPort } from './port.js'

describe('setPort', () => {
  let /** @type {Express} */ app

  beforeEach(() => {
    app = express()

    delete process.env.NODE_ENV
    delete process.env.PORT
  })

  it('does not set the app port number by default', async () => {
    setPort(app)

    assert.equal(app.get('port'), undefined)
  })

  it('sets the app port number from environment', async () => {
    process.env.PORT = '3500'

    setPort(app)

    assert.equal(app.get('port'), 3500)
  })

  it('overrides an existing app port number from environment', async () => {
    process.env.PORT = '3500'

    app.set('port', 3000)
    setPort(app)

    assert.equal(app.get('port'), 3500)
  })

  it('does not override an existing app port number in production', async () => {
    process.env.NODE_ENV = 'production'

    app.set('port', 3000)
    setPort(app)

    assert.equal(app.get('port'), 3000)
  })
})

/**
 * @import { Express } from 'express'
 */
