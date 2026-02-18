import assert from 'node:assert/strict'
import http from 'node:http'
import { join } from 'node:path'
import { describe, it, beforeEach } from 'node:test'

import express from 'express'
import request from 'supertest'

import { prototypeKitPath } from '../nhsuk-prototype-kit.config.js'
import { normaliseOptions } from '../utils/index.js'

import { renderPageNotFound } from './render-page-not-found.js'

describe('renderPageNotFound', () => {
  let /** @type {Server} */ server
  let /** @type {Express} */ app
  let /** @type {Request} */ req
  let /** @type {Response} */ res

  beforeEach(() => {
    const options = normaliseOptions({
      app: express().set('view engine', 'html'),
      viewsPath: [join(prototypeKitPath, 'lib/middleware/test-templates')]
    })

    server = http.createServer(options.app)

    req = /** @type {Request} */ ({
      path: '/test-path'
    })

    res = /** @type {Response} */ ({
      render(_view, _options) {},
      send(_body) {},
      status(_code) {}
    })

    app = options.app
    app.use(renderPageNotFound)
  })

  it('sets the 404 status code', async () => {
    const response = await request(server).get('/nonexistent')
    assert.equal(response.status, 404)
  })

  it('renders the 404.html template', async () => {
    const response = await request(server).get('/nonexistent')
    assert.equal(response.text, 'Page not found\n')
  })

  it('passes the request path to the template', (context) => {
    const render = context.mock.method(res, 'render')

    renderPageNotFound(req, res)

    assert.deepEqual(render.mock.calls[0].arguments, [
      '404',
      { path: '/test-path' }
    ])
  })
})

/**
 * @import { Server } from 'node:http'
 * @import { Express, Request, Response } from 'express'
 */
