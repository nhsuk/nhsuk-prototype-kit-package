import assert from 'node:assert/strict'
import http from 'node:http'
import { describe, it } from 'node:test'

import express from 'express'
import request from 'supertest'

import { productionHeaders } from './production-headers.js'

const app = express()
app.use(productionHeaders)

const server = http.createServer(app)

describe('productionHeaders', () => {
  it('adds content security policy', async () => {
    const response = await request(server).get('/nonexistent')

    assert.equal(
      response.headers['content-security-policy'],
      'upgrade-insecure-requests'
    )
  })

  it('adds Strict-Transport-Security', async () => {
    const response = await request(server).get('/nonexistent')

    assert.equal(
      response.headers['strict-transport-security'],
      'max-age=31536000; includeSubDomains; preload'
    )
  })

  it('redirects from http to https', async () => {
    const response = await request(server)
      .get('/secure-only')
      .set('Host', 'example.com')

    assert.equal(response.status, 302)
    assert.equal(response.headers.location, 'https://example.com/secure-only')
  })

  it('calls next() when protocol is already https', async () => {
    // Create a separate app to test the https path
    const httpsApp = express()
    httpsApp.set('trust proxy', true)
    httpsApp.use(productionHeaders)
    httpsApp.get('/test', (req, res) => {
      res.send('OK')
    })

    const response = await request(httpsApp)
      .get('/test')
      .set('X-Forwarded-Proto', 'https')

    assert.equal(response.status, 200)
    assert.equal(response.text, 'OK')
    assert.equal(
      response.headers['content-security-policy'],
      'upgrade-insecure-requests'
    )
  })
})
