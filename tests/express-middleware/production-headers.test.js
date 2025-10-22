const productionHeaders = require('../../lib/express-middleware/production-headers')
const http = require('http')
const request = require('supertest')
const express = require('express');
const { describe, it } = require('node:test')
const assert = require('node:assert')


const app = express();
app.use(productionHeaders);

const server = http.createServer(app);

describe('productionHeaders', () => {

  it('adds content security policy', async () => {  
    const response = await request(server).get('/nonexistent');
    
    assert.strictEqual(response.headers['content-security-policy'], 'upgrade-insecure-requests')
  });
  
  it('adds Strict-Transport-Security', async () => {  
    const response = await request(server).get('/nonexistent');
    
    assert.strictEqual(response.headers['strict-transport-security'], 'max-age=31536000; includeSubDomains; preload')
  });
  
  it('redirects from http to https', async () => {    
    const response = await request(server)
      .get('/secure-only')
      .set('Host', 'example.com');
    
    assert.strictEqual(response.status, 302)
    assert.strictEqual(response.headers.location, 'https://example.com/secure-only')
  
  });
})
