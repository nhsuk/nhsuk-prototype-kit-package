const assert = require('node:assert')
const http = require('node:http')
const { join } = require('node:path')
const { describe, it } = require('node:test')

const express = require('express')
const nunjucks = require('nunjucks')
const request = require('supertest')

const { matchRoutes } = require('../../lib/express-middleware/auto-routing')

describe('matchRoutes', () => {
  let app, server

  // Create test templates directory
  const templatesDir = join(__dirname, 'test-templates')

  // Setup Express app with Nunjucks
  app = express()
  app.set('view engine', 'html')
  nunjucks.configure([templatesDir], {
    express: app,
    noCache: true
  })

  // Add the matchRoutes middleware
  app.use(matchRoutes)

  // Add 404 handler
  app.use((req, res) => {
    res.status(404).send('Not found')
  })

  // Add error handler
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err, req, res, next) => {
    res.status(500).send('Template error')
  })

  server = http.createServer(app)

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
