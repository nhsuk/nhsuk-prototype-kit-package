import assert from 'node:assert/strict'
import http from 'node:http'
import { join } from 'node:path'
import { describe, it, beforeEach } from 'node:test'

import express from 'express'
import nunjucks from 'nunjucks'
import request from 'supertest'

import { renderPageNotFound } from './render-page-not-found.js'

const app = express()
app.set('view engine', 'html')
nunjucks.configure([join(import.meta.dirname, 'test-templates')], {
  express: app,
  noCache: true
})
app.use(renderPageNotFound)

const server = http.createServer(app)

describe('renderPageNotFound', () => {
  let /** @type {Request} */ req
  let /** @type {Response} */ res

  beforeEach(() => {
    req = /** @type {Request} */ ({
      path: '/test-path'
    })

    res = /** @type {Response} */ ({
      render(_view, _options) {},
      send(_body) {},
      status(_code) {}
    })
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
 * @import { Request, Response } from 'express'
 */
