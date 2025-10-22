const productionHeaders = require('../../lib/express-middleware/production-headers')
const http = require('http')
const request = require('supertest')
const express = require('express');

const app = express();
app.use(productionHeaders);

const server = http.createServer(app);

test('productionHeaders adds content security policy', async () => {  
  const response = await request(server).get('/nonexistent');
  
  expect(response.headers['content-security-policy']).toBe('upgrade-insecure-requests')
});

test('productionHeaders adds Strict-Transport-Security', async () => {  
  const response = await request(server).get('/nonexistent');
  
  expect(response.headers['strict-transport-security']).toBe('max-age=31536000; includeSubDomains; preload')
});

test('it redirects from http to https', async () => {    
  const response = await request(server)
    .get('/secure-only')
    .set('Host', 'example.com');
  
  expect(response.status).toBe(302)
  expect(response.headers.location).toBe('https://example.com/secure-only')

});
