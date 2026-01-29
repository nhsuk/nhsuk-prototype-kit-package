import assert from 'node:assert'
import { createHash } from 'node:crypto'
import { dirname, join } from 'node:path'
import { describe, it, beforeEach, afterEach } from 'node:test'
import { fileURLToPath } from 'node:url'

import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import express from 'express'
import nunjucks from 'nunjucks'
import request from 'supertest'

import { authentication } from './authentication.js'

describe('authentication', () => {
  let app, originalPassword

  // NHS.UK frontend package path
  const frontendPath = fileURLToPath(
    dirname(import.meta.resolve('nhsuk-frontend/package.json'))
  )

  const appViews = [
    join(import.meta.dirname, '../views'),
    join(frontendPath, 'dist/nhsuk/components'),
    join(frontendPath, 'dist/nhsuk/macros'),
    join(frontendPath, 'dist/nhsuk'),
    join(frontendPath, 'dist'),
    join(import.meta.dirname, 'test-templates')
  ]

  beforeEach(() => {
    originalPassword = process.env.PROTOTYPE_PASSWORD
    createApp()
  })

  afterEach(() => {
    process.env.PROTOTYPE_PASSWORD = originalPassword
  })

  const createApp = () => {
    app = express()
    app.set('view engine', 'html')
    nunjucks.configure(appViews, {
      express: app,
      noCache: true
    })
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(cookieParser())
    app.use(authentication)

    // Add a simple route that returns OK if authentication passes
    app.use((req, res) => {
      res.send('OK')
    })

    return app
  }

  describe('when no password is set', () => {
    it('should show an error and a link to the online guidance', async () => {
      delete process.env.PROTOTYPE_PASSWORD
      const response = await request(app).get('/')

      assert.strictEqual(response.statusCode, 401)
      assert.ok(response.text.includes('Password not set'))
      assert.ok(
        response.text.includes(
          'https://prototype-kit.service-manual.nhs.uk/how-tos/publish-your-prototype-online'
        )
      )
    })
  })

  describe('when password is set', () => {
    beforeEach(() => {
      process.env.PROTOTYPE_PASSWORD = 'testpassword'
    })

    describe('accessing allowed paths', () => {
      it('should allow access to /prototype-admin/password', async () => {
        const response = await request(app).get('/prototype-admin/password')

        assert.strictEqual(response.statusCode, 200)
        assert(response.text.includes('Enter password'))
      })

      it('should render password page with error parameter', async () => {
        const response = await request(app).get(
          '/prototype-admin/password?error=wrong-password&returnURL=%2Ftest'
        )

        assert.strictEqual(response.statusCode, 200)
        assert(response.text.includes('The password is not correct'))
      })

      it('should allow access to /nhsuk-frontend/nhsuk-frontend.min.css', async () => {
        const response = await request(app).get(
          '/nhsuk-frontend/nhsuk-frontend.min.css'
        )

        assert.strictEqual(response.statusCode, 200)
      })

      it('should allow access to /nhsuk-frontend/nhsuk-frontend.min.css.map', async () => {
        const response = await request(app).get(
          '/nhsuk-frontend/nhsuk-frontend.min.css.map'
        )

        assert.strictEqual(response.statusCode, 200)
      })

      it('should allow access to /nhsuk-frontend/nhsuk-frontend.min.js', async () => {
        const response = await request(app).get(
          '/nhsuk-frontend/nhsuk-frontend.min.js'
        )

        assert.strictEqual(response.statusCode, 200)
      })

      it('should allow access to NHS Frontend assets', async () => {
        const response = await request(app).get(
          '/nhsuk-frontend/assets/logos/logo.svg'
        )

        assert.strictEqual(response.statusCode, 200)
      })

      it('should allow access to other NHS Frontend assets', async () => {
        const response = await request(app).get(
          '/nhsuk-frontend/assets/images/favicon.svg'
        )

        assert.strictEqual(response.statusCode, 200)
      })
    })

    describe('with valid authentication cookie', () => {
      it('should allow access to protected pages', async () => {
        // Hash of 'testpassword' using SHA256
        const hash = createHash('sha256')
        hash.update('testpassword')
        const authCookie = hash.digest('hex')

        const response = await request(app)
          .get('/some-protected-page')
          .set('Cookie', `authentication=${authCookie}`)

        assert.strictEqual(response.statusCode, 200)
        assert.strictEqual(response.text, 'OK')
      })

      it('should allow access to root path', async () => {
        // Hash of 'testpassword' using SHA256
        const hash = createHash('sha256')
        hash.update('testpassword')
        const authCookie = hash.digest('hex')

        const response = await request(app)
          .get('/')
          .set('Cookie', `authentication=${authCookie}`)

        assert.strictEqual(response.statusCode, 200)
        assert.strictEqual(response.text, 'OK')
      })
    })

    describe('without valid authentication cookie', () => {
      it('should redirect to password page', async () => {
        const response = await request(app).get('/some-protected-page')

        assert.strictEqual(response.statusCode, 302)
        assert.ok(response.headers.location)
        assert.ok(
          response.headers.location.startsWith('/prototype-admin/password')
        )
      })

      it('should include returnURL in redirect', async () => {
        const response = await request(app).get('/some-protected-page')

        assert.strictEqual(response.statusCode, 302)
        assert.ok(
          response.headers.location.includes('returnURL=%2Fsome-protected-page')
        )
      })

      it('should preserve query parameters in returnURL', async () => {
        const response = await request(app).get('/some-page?foo=bar&baz=qux')

        assert.strictEqual(response.statusCode, 302)
        // Query params are encoded in the returnURL parameter
        assert.ok(response.headers.location.includes('returnURL='))
        // The returnURL should contain the encoded query string
        const decodedUrl = decodeURIComponent(response.headers.location)
        assert.ok(decodedUrl.includes('foo=bar'))
        assert.ok(decodedUrl.includes('baz=qux'))
      })

      it('should redirect root path to password page', async () => {
        const response = await request(app).get('/')

        assert.strictEqual(response.statusCode, 302)
        assert.ok(
          response.headers.location.startsWith('/prototype-admin/password')
        )
      })
    })

    describe('with invalid authentication cookie', () => {
      it('should redirect to password page', async () => {
        const response = await request(app)
          .get('/some-protected-page')
          .set('Cookie', 'authentication=invalidhash')

        assert.strictEqual(response.statusCode, 302)
        assert.ok(
          response.headers.location.startsWith('/prototype-admin/password')
        )
      })
    })

    describe('submitting password', () => {
      it('should set cookie and redirect on correct password', async () => {
        const response = await request(app)
          .post('/prototype-admin/password')
          .type('form')
          .send({ password: 'testpassword', returnURL: '/dashboard' })

        assert.strictEqual(response.statusCode, 302)
        assert.strictEqual(response.headers.location, '/dashboard')
        assert.ok(response.headers['set-cookie'])
        assert.ok(response.headers['set-cookie'][0].includes('authentication='))
      })

      it('should redirect back to password page with error on wrong password', async () => {
        const response = await request(app)
          .post('/prototype-admin/password')
          .type('form')
          .send({ password: 'wrongpassword', returnURL: '/dashboard' })

        assert.strictEqual(response.statusCode, 302)
        assert.ok(response.headers.location.includes('error=wrong-password'))
        assert.ok(response.headers.location.includes('returnURL=%2Fdashboard'))
      })

      it('should redirect to / when returnURL is not provided', async () => {
        const response = await request(app)
          .post('/prototype-admin/password')
          .type('form')
          .send({ password: 'testpassword' })

        assert.strictEqual(response.statusCode, 302)
        assert.strictEqual(response.headers.location, '/')
      })
    })
  })
})
