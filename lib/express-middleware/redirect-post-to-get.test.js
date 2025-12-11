const assert = require('node:assert')
const http = require('node:http')
const { describe, it } = require('node:test')

const express = require('express')
const request = require('supertest')

const redirectPostToGet = require('./redirect-post-to-get')

const app = express()
app.use(redirectPostToGet)

const server = http.createServer(app)

describe('redirectPostToGet', () => {
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
    let nextCalled = false
    let req = {
      method: 'get'
    }
    let res = {}

    const next = () => {
      nextCalled = true
    }

    redirectPostToGet(req, res, next)

    assert.strictEqual(nextCalled, true)
  })
})
