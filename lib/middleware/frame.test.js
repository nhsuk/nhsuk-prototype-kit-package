import assert from 'node:assert/strict'
import http from 'node:http'
import { beforeEach, describe, it, mock } from 'node:test'

import request from 'supertest'

import * as expressSettings from '../express-settings/index.js'
import { normaliseOptions } from '../utils/index.js'
import { frame } from './frame.js'

describe('frame', () => {
  let /** @type {Server} */ server
  let /** @type {Request} */ req
  let /** @type {Response} */ res
  let /** @type {Mock<NextFunction>} */ next

  beforeEach(() => {
    const options = normaliseOptions()

    server = http.createServer(options.app)
    expressSettings.setAll(options.app, options)

    options.app.use(frame)

    req = /** @type {Request} */ ({ path: '/frame', method: 'GET', query: {} })
    res = /** @type {Response} */ ({
      render(_view, _options) {}
    })
    next = mock.fn()
  })

  describe('GET /frame', () => {
    it('returns 200', async () => {
      const response = await request(server).get('/frame')
      assert.equal(response.status, 200)
    })

    it('renders the frame template', (context) => {
      const render = context.mock.method(res, 'render')
      frame(req, res, next)
      assert.equal(render.mock.calls[0].arguments[0], 'frame')
    })

    it('defaults iframeSrc to / when no url param is given', (context) => {
      const render = context.mock.method(res, 'render')
      frame(req, res, next)
      assert.deepEqual(render.mock.calls[0].arguments, [
        'frame',
        { iframeSrc: '/' }
      ])
    })

    it('uses the url param as iframeSrc', (context) => {
      const render = context.mock.method(res, 'render')
      req.query = { url: '/my-page' }
      frame(req, res, next)
      assert.deepEqual(render.mock.calls[0].arguments, [
        'frame',
        { iframeSrc: '/my-page' }
      ])
    })

    it('preserves query strings in the url param', (context) => {
      const render = context.mock.method(res, 'render')
      req.query = { url: '/search?q=foo' }
      frame(req, res, next)
      assert.deepEqual(render.mock.calls[0].arguments, [
        'frame',
        { iframeSrc: '/search?q=foo' }
      ])
    })

    it('rejects protocol-relative URLs', (context) => {
      const render = context.mock.method(res, 'render')
      req.query = { url: '//evil.com' }
      frame(req, res, next)
      assert.deepEqual(render.mock.calls[0].arguments, [
        'frame',
        { iframeSrc: '/' }
      ])
    })

    it('rejects absolute external URLs', (context) => {
      const render = context.mock.method(res, 'render')
      req.query = { url: 'https://evil.com' }
      frame(req, res, next)
      assert.deepEqual(render.mock.calls[0].arguments, [
        'frame',
        { iframeSrc: '/' }
      ])
    })
  })

  describe('other requests', () => {
    it('calls next() for non-frame paths', () => {
      frame(
        /** @type {Request} */ ({
          path: '/other-page',
          method: 'GET',
          query: {}
        }),
        res,
        next
      )
      assert.equal(next.mock.callCount(), 1)
    })

    it('calls next() for POST /frame', () => {
      req.method = 'POST'
      frame(req, res, next)
      assert.equal(next.mock.callCount(), 1)
    })
  })
})

/**
 * @import { Server } from 'node:http'
 * @import { NextFunction, Request, Response } from 'express'
 * @import { Mock } from 'node:test'
 */
