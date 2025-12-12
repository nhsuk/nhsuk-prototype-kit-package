import assert from 'node:assert'
import http from 'node:http'
import { join } from 'node:path'
import { describe, it } from 'node:test'

import express from 'express'
import nunjucks from 'nunjucks'
import request from 'supertest'

import renderPageNotFound from './render-page-not-found.js'

const app = express()
app.set('view engine', 'html')
nunjucks.configure([join(import.meta.dirname, 'test-templates')], {
  express: app,
  noCache: true
})
app.use(renderPageNotFound)

const server = http.createServer(app)

describe('renderPageNotFound', () => {
  it('sets the 404 status code', async () => {
    const response = await request(server).get('/nonexistent')
    assert.strictEqual(response.status, 404)
  })

  it('renders the 404.html template', async () => {
    const response = await request(server).get('/nonexistent')
    assert.strictEqual(response.text, 'Page not found\n')
  })
})
