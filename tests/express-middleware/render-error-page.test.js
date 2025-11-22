const assert = require('node:assert')
const http = require('node:http')
const { join } = require('node:path')
const { describe, it, beforeEach, afterEach } = require('node:test')

const express = require('express')
const nunjucks = require('nunjucks')
const request = require('supertest')

const originalError = console.error
let errorCalls = []

const renderErrorPage = require('../../lib/express-middleware/render-error-page')

const app = express()
app.set('view engine', 'html')
nunjucks.configure([join(__dirname, '.')], {
  express: app,
  noCache: true
})

app.use(function (_req, _res, _next) {
  throw Error('Template error')
})

app.use(renderErrorPage)

const server = http.createServer(app)

describe('renderErrorPage', () => {
  beforeEach(() => {
    errorCalls = []
    console.error = (...args) => {
      errorCalls.push(args)
      originalError(...args) // Still logs to console
    }
  })

  afterEach(() => {
    console.error = originalError
  })

  it('sets the 500 status code', async () => {
    const response = await request(server).get('/error')
    assert.strictEqual(response.status, 500)
  })

  it('renders the 500.html template', async () => {
    const response = await request(server).get('/error')
    assert.strictEqual(response.text, 'Server error\n')
  })

  it('calls console.error() with the error', async () => {
    await request(server).get('/error')
    assert.strictEqual(errorCalls.length, 1)
    assert.ok(errorCalls[0][0].startsWith('Error: Template error'))
  })
})
