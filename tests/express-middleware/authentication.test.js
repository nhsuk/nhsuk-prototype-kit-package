const assert = require('node:assert')
const { describe, it, beforeEach, afterEach } = require('node:test')

const cookieParser = require('cookie-parser')
const express = require('express')
const request = require('supertest')

describe('authentication', () => {
  let app, originalPassword

  beforeEach(() => {
    originalPassword = process.env.PROTOTYPE_PASSWORD
  })

  afterEach(() => {
    process.env.PROTOTYPE_PASSWORD = originalPassword
    // Clear module cache to ensure fresh authentication module
    const authModulePath = require.resolve(
      '../../lib/express-middleware/authentication'
    )
    Reflect.deleteProperty(require.cache, authModulePath)
  })

  const createApp = () => {
    // Reload the authentication module to pick up the current password
    const authModulePath = require.resolve(
      '../../lib/express-middleware/authentication'
    )
    Reflect.deleteProperty(require.cache, authModulePath)
    const authentication = require('../../lib/express-middleware/authentication')

    app = express()
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

      const app = createApp()

      const response = await request(app).get('/')

      assert.strictEqual(response.statusCode, 200)
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
        const app = createApp()

        const response = await request(app).get('/prototype-admin/password')

        assert.strictEqual(response.statusCode, 200)
        assert.strictEqual(response.text, 'OK')
      })

      it('should allow access to /css/main.css', async () => {
        const app = createApp()

        const response = await request(app).get('/css/main.css')

        assert.strictEqual(response.statusCode, 200)
      })

      it('should allow access to /css/main.css.map', async () => {
        const app = createApp()

        const response = await request(app).get('/css/main.css.map')

        assert.strictEqual(response.statusCode, 200)
      })

      it('should allow access to /nhsuk-frontend/nhsuk-frontend.min.js', async () => {
        const app = createApp()

        const response = await request(app).get(
          '/nhsuk-frontend/nhsuk-frontend.min.js'
        )

        assert.strictEqual(response.statusCode, 200)
      })

      it('should allow access to /js/auto-store-data.js', async () => {
        const app = createApp()

        const response = await request(app).get('/js/auto-store-data.js')

        assert.strictEqual(response.statusCode, 200)
      })

      it('should allow access to /js/main.js', async () => {
        const app = createApp()

        const response = await request(app).get('/js/main.js')

        assert.strictEqual(response.statusCode, 200)
      })

      it('should allow access to NHS Frontend assets', async () => {
        const app = createApp()

        const response = await request(app).get(
          '/nhsuk-frontend/assets/logos/logo.svg'
        )

        assert.strictEqual(response.statusCode, 200)
      })

      it('should allow access to other NHS Frontend assets', async () => {
        const app = createApp()

        const response = await request(app).get(
          '/nhsuk-frontend/assets/images/favicon.svg'
        )

        assert.strictEqual(response.statusCode, 200)
      })
    })

    describe('with valid authentication cookie', () => {
      it('should allow access to protected pages', async () => {
        const app = createApp()

        // Hash of 'testpassword' using SHA256
        const { createHash } = require('node:crypto')
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
        const app = createApp()

        // Hash of 'testpassword' using SHA256
        const { createHash } = require('node:crypto')
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
        const app = createApp()

        const response = await request(app).get('/some-protected-page')

        assert.strictEqual(response.statusCode, 302)
        assert.ok(response.headers.location)
        assert.ok(
          response.headers.location.startsWith('/prototype-admin/password')
        )
      })

      it('should include returnURL in redirect', async () => {
        const app = createApp()

        const response = await request(app).get('/some-protected-page')

        assert.strictEqual(response.statusCode, 302)
        assert.ok(
          response.headers.location.includes('returnURL=%2Fsome-protected-page')
        )
      })

      it('should preserve query parameters in returnURL', async () => {
        const app = createApp()

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
        const app = createApp()

        const response = await request(app).get('/')

        assert.strictEqual(response.statusCode, 302)
        assert.ok(
          response.headers.location.startsWith('/prototype-admin/password')
        )
      })
    })

    describe('with invalid authentication cookie', () => {
      it('should redirect to password page', async () => {
        const app = createApp()

        const response = await request(app)
          .get('/some-protected-page')
          .set('Cookie', 'authentication=invalidhash')

        assert.strictEqual(response.statusCode, 302)
        assert.ok(
          response.headers.location.startsWith('/prototype-admin/password')
        )
      })
    })
  })
})
