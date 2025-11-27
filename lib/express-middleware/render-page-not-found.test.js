const assert = require('node:assert')
const http = require('node:http')
const { join } = require('node:path')
const { describe, it } = require('node:test')

const express = require('express')
const nunjucks = require('nunjucks')
const request = require('supertest')

const renderPageNotFound = require('./render-page-not-found')

const app = express()
app.set('view engine', 'html')
nunjucks.configure([join(__dirname, 'test-templates')], {
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
