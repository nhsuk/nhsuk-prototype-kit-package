import assert from 'node:assert'
import http from 'node:http'
import { describe, it, beforeEach, mock } from 'node:test'

import express from 'express'
import request from 'supertest'

import { redirectPostToGet } from './redirect-post-to-get.js'

const app = express()
app.use(redirectPostToGet)

const server = http.createServer(app)

describe('redirectPostToGet', () => {
  let /** @type {Request} */ req
  let /** @type {Response} */ res
  let /** @type {Mock<NextFunction>} */ next

  beforeEach(() => {
    req = /** @type {Request} */ ({})
    res = /** @type {Response} */ ({})

    next = mock.fn()
  })

  it('adds redirects a POST request to a GET request', async () => {
    const response = await request(server).post('/form-handler')

    assert.strictEqual(response.status, 302)
    assert.ok(response.headers.location)
    assert.strictEqual(response.headers.location, '/form-handler')
  })

  it('adds does not redirect a GET request', async () => {
    const response = await request(server).get('/page')

    assert.strictEqual(response.status, 404)
  })

  it('adds preserves query string when redirecting a POST', async () => {
    const response = await request(server).post('/form-handler?test=true')

    assert.strictEqual(response.headers.location, '/form-handler?test=true')
  })

  it('should call next() on get requests', () => {
    req.method = 'GET'

    redirectPostToGet(req, res, next)

    assert.strictEqual(next.mock.callCount(), 1)
  })
})

/**
 * @import { NextFunction, Request, Response } from 'express'
 * @import { Mock } from 'node:test'
 */
