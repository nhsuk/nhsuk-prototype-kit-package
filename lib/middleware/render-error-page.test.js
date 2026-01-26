import assert from 'node:assert'
import http from 'node:http'
import { join } from 'node:path'
import { describe, it, beforeEach, afterEach } from 'node:test'

import express from 'express'
import nunjucks from 'nunjucks'
import request from 'supertest'

import { renderErrorPage } from './render-error-page.js'

const originalError = console.error
let errorCalls = []

const app = express()
app.set('view engine', 'html')
nunjucks.configure([join(import.meta.dirname, 'test-templates')], {
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

  it('preserves existing error status code', async () => {
    // Create a separate app to test with custom error status
    const customApp = express()
    customApp.set('view engine', 'html')
    nunjucks.configure([join(import.meta.dirname, 'test-templates')], {
      express: customApp,
      noCache: true
    })

    customApp.use(function (_req, _res, _next) {
      const error = new Error('Custom error')
      throw Object.assign(error, { status: 503 })
    })

    customApp.use(renderErrorPage)

    const response = await request(customApp).get('/test')
    assert.strictEqual(response.status, 503)
  })
})
