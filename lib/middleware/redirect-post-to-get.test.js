import assert from 'node:assert/strict'
import http from 'node:http'
import { describe, it, beforeEach, mock } from 'node:test'

import express from 'express'
import request from 'supertest'

import { normaliseOptions } from '../utils/index.js'

import { redirectPostToGet } from './redirect-post-to-get.js'

describe('redirectPostToGet', () => {
  let /** @type {Server} */ server
  let /** @type {Express} */ app
  let /** @type {Request} */ req
  let /** @type {Response} */ res
  let /** @type {Mock<NextFunction>} */ next

  beforeEach(() => {
    const options = normaliseOptions({
      app: express().set('view engine', 'html')
    })

    server = http.createServer(options.app)

    app = options.app
    app.use(redirectPostToGet)

    req = /** @type {Request} */ ({})
    res = /** @type {Response} */ ({})

    next = mock.fn()
  })

  it('adds redirects a POST request to a GET request', async () => {
    const response = await request(server).post('/form-handler')

    assert.equal(response.status, 302)
    assert.ok(response.headers.location)
    assert.equal(response.headers.location, '/form-handler')
  })

  it('adds does not redirect a GET request', async () => {
    const response = await request(server).get('/page')

    assert.equal(response.status, 404)
  })

  it('adds preserves query string when redirecting a POST', async () => {
    const response = await request(server).post('/form-handler?test=true')

    assert.equal(response.headers.location, '/form-handler?test=true')
  })

  it('should call next() on get requests', () => {
    req.method = 'GET'

    redirectPostToGet(req, res, next)

    assert.equal(next.mock.callCount(), 1)
  })
})

/**
 * @import { Server } from 'node:http'
 * @import { Express, NextFunction, Request, Response } from 'express'
 * @import { Mock } from 'node:test'
 */
