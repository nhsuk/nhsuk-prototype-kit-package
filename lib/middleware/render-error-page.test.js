import assert from 'node:assert/strict'
import http from 'node:http'
import { join } from 'node:path'
import { describe, it, beforeEach, mock } from 'node:test'

import request from 'supertest'

import * as expressSettings from '../express-settings/index.js'
import { prototypeKitPath } from '../nhsuk-prototype-kit.config.js'
import { normaliseOptions } from '../utils/index.js'

import { renderErrorPage } from './render-error-page.js'

describe('renderErrorPage', () => {
  let /** @type {Server} */ server
  let /** @type {Express} */ app
  let /** @type {Mock<Console['error']>} */ error

  beforeEach(() => {
    const options = normaliseOptions({
      viewsPath: [join(prototypeKitPath, 'lib/middleware/test-templates')]
    })

    server = http.createServer(options.app)
    app = expressSettings.setAll(options.app)

    app.use(function (_req, _res, _next) {
      throw Error('Template error')
    })

    app.use(renderErrorPage)

    error = mock.method(console, 'error', () => {})
  })

  it('sets the 500 status code', async () => {
    const response = await request(server).get('/error')
    assert.equal(response.status, 500)
  })

  it('renders the 500.html template', async () => {
    const response = await request(server).get('/error')
    assert.equal(response.text, 'Server error\n')
  })

  it('calls console.error() with the error', async () => {
    await request(server).get('/error')
    assert.equal(error.mock.callCount(), 1)
    assert.equal(
      error.mock.calls[0].arguments[0].split('\n')[0],
      'Error: Template error'
    )
  })

  it('preserves existing error status code', async () => {
    // Create a separate app to test with custom error status
    const options = normaliseOptions({
      viewsPath: [join(prototypeKitPath, 'lib/middleware/test-templates')]
    })

    app = expressSettings.setAll(options.app)

    app.use(function (_req, _res, _next) {
      const error = new Error('Custom error')
      throw Object.assign(error, { status: 503 })
    })

    app.use(renderErrorPage)

    const response = await request(app).get('/test')
    assert.equal(response.status, 503)
  })
})

/**
 * @import { Server } from 'node:http'
 * @import { Mock } from 'node:test'
 * @import { Express } from 'express'
 */
