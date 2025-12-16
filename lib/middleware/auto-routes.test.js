import assert from 'node:assert'
import http from 'node:http'
import { join } from 'node:path'
import { describe, it } from 'node:test'

import express from 'express'
import nunjucks from 'nunjucks'
import request from 'supertest'

import { autoRoutes } from './auto-routes.js'

describe('autoRoutes', () => {
  // Create test templates directory
  const templatesDir = join(import.meta.dirname, 'test-templates')

  // Setup Express app with Nunjucks
  const app = express()
  app.set('view engine', 'html')
  nunjucks.configure([templatesDir], {
    express: app,
    noCache: true
  })

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

  const server = http.createServer(app)

  describe('root path', () => {
    it('should render index.html for root path', async () => {
      const response = await request(server).get('/')
      assert.strictEqual(response.status, 200)
      assert.strictEqual(response.text, 'Test index page\n')
      assert.strictEqual(
        response.headers['content-type'],
        'text/html; charset=utf-8'
      )
    })
  })

  describe('simple path', () => {
    it('should render simple.html for /simple path', async () => {
      const response = await request(server).get('/simple')
      assert.strictEqual(response.status, 200)
      assert.strictEqual(response.text, 'Simple test page\n')
      assert.strictEqual(
        response.headers['content-type'],
        'text/html; charset=utf-8'
      )
    })

    it('should render simple.html for /simple.html path', async () => {
      const response = await request(server).get('/simple.html')
      assert.strictEqual(response.status, 200)
      assert.strictEqual(response.text, 'Simple test page\n')
      assert.strictEqual(
        response.headers['content-type'],
        'text/html; charset=utf-8'
      )
    })
  })

  describe('path matching a .njk view', () => {
    it('should render with-njk.njk for /with-njk path', async () => {
      const response = await request(server).get('/with-njk')
      assert.strictEqual(response.status, 200)
      assert.strictEqual(response.text, 'Test page using njk extension\n')
      assert.strictEqual(
        response.headers['content-type'],
        'text/html; charset=utf-8'
      )
    })
  })

  describe('nested path with index', () => {
    it('should render nested/index.html for /nested path', async () => {
      const response = await request(server).get('/nested')
      assert.strictEqual(response.status, 200)
      assert.strictEqual(response.text, 'Nested index page\n')
      assert.strictEqual(
        response.headers['content-type'],
        'text/html; charset=utf-8'
      )
    })

    it('should render nested/index.html for /nested/ path with trailing slash', async () => {
      const response = await request(server).get('/nested/')
      assert.strictEqual(response.status, 200)
      assert.strictEqual(response.text, 'Nested index page\n')
      assert.strictEqual(
        response.headers['content-type'],
        'text/html; charset=utf-8'
      )
    })

    it('should render a nestee index.njk for /nested path', async () => {
      const response = await request(server).get('/nested-with-njk')
      assert.strictEqual(response.status, 200)
      assert.strictEqual(
        response.text,
        'Nested index page using njk extension\n'
      )
      assert.strictEqual(
        response.headers['content-type'],
        'text/html; charset=utf-8'
      )
    })
  })

  describe('non-existent paths', () => {
    it('should call next() for non-existent template', async () => {
      const response = await request(server).get('/does-not-exist')
      assert.strictEqual(response.status, 404)
      assert.strictEqual(response.text, 'Not found')
    })

    it('should call next() for non-existent nested path', async () => {
      const response = await request(server).get('/path/does/not/exist')
      assert.strictEqual(response.status, 404)
      assert.strictEqual(response.text, 'Not found')
    })
  })

  describe('template errors', () => {
    it('should call next(error) for template rendering errors', async () => {
      const response = await request(server).get('/error')
      assert.strictEqual(response.status, 500)
      assert.strictEqual(response.text, 'Template error')
    })
  })
})
