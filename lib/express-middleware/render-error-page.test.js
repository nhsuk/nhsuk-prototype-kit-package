import assert from 'node:assert'
import http from 'node:http'
import { join, dirname } from 'node:path'
import { describe, it, beforeEach, afterEach } from 'node:test'
import { fileURLToPath } from 'node:url'

import express from 'express'
import nunjucks from 'nunjucks'
import request from 'supertest'

import renderErrorPage from './render-error-page.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const originalError = console.error
let errorCalls = []

const app = express()
app.set('view engine', 'html')
nunjucks.configure([join(__dirname, 'test-templates')], {
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
