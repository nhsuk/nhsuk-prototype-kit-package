import assert from 'node:assert/strict'
import http from 'node:http'
import { join } from 'node:path'
import { describe, it, beforeEach } from 'node:test'

import express from 'express'
import request from 'supertest'

import { prototypeKitPath } from '../nhsuk-prototype-kit.config.js'
import { normaliseOptions } from '../utils/index.js'

import { autoRoutes } from './auto-routes.js'

describe('autoRoutes', () => {
  let /** @type {Server} */ server
  let /** @type {Express} */ app

  beforeEach(() => {
    const options = normaliseOptions({
      app: express().set('view engine', 'html'),
      viewsPath: [join(prototypeKitPath, 'lib/middleware/test-templates')]
    })

    server = http.createServer(options.app)

    app = options.app

    // Add the autoRoutes middleware
    app.use(autoRoutes)

    // Add 404 handler
    app.use((req, res) => {
      res.status(404).send('Not found')
    })

    // Add error handler
    app.use((_err, _req, res, _next) => {
      res.status(500).send('Template error')
    })
  })

  describe('root path', () => {
    it('should render index.html for root path', async () => {
      const response = await request(server).get('/')
      assert.equal(response.status, 200)
      assert.equal(response.text, 'Test index page\n')
      assert.equal(response.headers['content-type'], 'text/html; charset=utf-8')
    })
  })

  describe('simple path', () => {
    it('should render simple.html for /simple path', async () => {
      const response = await request(server).get('/simple')
      assert.equal(response.status, 200)
      assert.equal(response.text, 'Simple test page\n')
      assert.equal(response.headers['content-type'], 'text/html; charset=utf-8')
    })

    it('should render simple.html for /simple.html path', async () => {
      const response = await request(server).get('/simple.html')
      assert.equal(response.status, 200)
      assert.equal(response.text, 'Simple test page\n')
      assert.equal(response.headers['content-type'], 'text/html; charset=utf-8')
    })
  })

  describe('path matching a .njk view', () => {
    it('should render with-njk.njk for /with-njk path', async () => {
      const response = await request(server).get('/with-njk')
      assert.equal(response.status, 200)
      assert.equal(response.text, 'Test page using njk extension\n')
      assert.equal(response.headers['content-type'], 'text/html; charset=utf-8')
    })
  })

  describe('nested path with index', () => {
    it('should render nested/index.html for /nested path', async () => {
      const response = await request(server).get('/nested')
      assert.equal(response.status, 200)
      assert.equal(response.text, 'Nested index page\n')
      assert.equal(response.headers['content-type'], 'text/html; charset=utf-8')
    })

    it('should render nested/index.html for /nested/ path with trailing slash', async () => {
      const response = await request(server).get('/nested/')
      assert.equal(response.status, 200)
      assert.equal(response.text, 'Nested index page\n')
      assert.equal(response.headers['content-type'], 'text/html; charset=utf-8')
    })

    it('should render a nestee index.njk for /nested path', async () => {
      const response = await request(server).get('/nested-with-njk')
      assert.equal(response.status, 200)
      assert.equal(response.text, 'Nested index page using njk extension\n')
      assert.equal(response.headers['content-type'], 'text/html; charset=utf-8')
    })
  })

  describe('non-existent paths', () => {
    it('should call next() for non-existent template', async () => {
      const response = await request(server).get('/does-not-exist')
      assert.equal(response.status, 404)
      assert.equal(response.text, 'Not found')
    })

    it('should call next() for non-existent nested path', async () => {
      const response = await request(server).get('/path/does/not/exist')
      assert.equal(response.status, 404)
      assert.equal(response.text, 'Not found')
    })
  })

  describe('template errors', () => {
    it('should call next(error) for template rendering errors', async () => {
      const response = await request(server).get('/error')
      assert.equal(response.status, 500)
      assert.equal(response.text, 'Template error')
    })
  })
})

/**
 * @import { Server } from 'node:http'
 * @import { Express } from 'express'
 */
