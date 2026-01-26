import assert from 'node:assert'
import { dirname, join } from 'node:path'
import { describe, it, before, after } from 'node:test'
import { fileURLToPath } from 'node:url'

import express from 'express'
import nunjucks from 'nunjucks'

import { NHSPrototypeKit } from './nhsuk-prototype-kit.js'

describe('NHSPrototypeKit', () => {
  describe('constructor', () => {
    it('should create an instance with provided options', () => {
      const app = express()
      const nunjucksEnv = nunjucks.configure(['views'], { express: app })
      const config = { test: 'config' }
      const buildOptions = { entryPoints: ['test.js'] }

      const prototype = new NHSPrototypeKit({
        app: app,
        nunjucks: nunjucksEnv,
        config: config,
        buildOptions: buildOptions
      })

      assert.strictEqual(prototype.app, app)
      assert.strictEqual(prototype.nunjucks, nunjucksEnv)
      assert.strictEqual(prototype.config, config)
      assert.strictEqual(prototype.buildOptions, buildOptions)
    })

    it('should work with minimal options', () => {
      const app = express()
      const nunjucksEnv = nunjucks.configure(['views'], { express: app })

      const prototype = new NHSPrototypeKit({
        app: app,
        nunjucks: nunjucksEnv
      })

      assert.strictEqual(prototype.app, app)
      assert.strictEqual(prototype.nunjucks, nunjucksEnv)
      assert.strictEqual(prototype.config, undefined)
      assert.strictEqual(prototype.buildOptions, undefined)
    })
  })

  describe('init', () => {
    it('should initialize with minimal options', () => {
      const prototype = NHSPrototypeKit.init({})

      assert.ok(prototype instanceof NHSPrototypeKit)
      assert.ok(prototype.app)
      assert.ok(prototype.nunjucks)
    })

    it('should set express settings', () => {
      const prototype = NHSPrototypeKit.init({})

      // Check that express settings were applied
      assert.strictEqual(prototype.app.get('query parser'), 'extended')
      assert.strictEqual(prototype.app.get('trust proxy'), 1)
      assert.strictEqual(prototype.app.get('view engine'), 'html')
    })

    it('should configure nunjucks with correct paths', () => {
      const prototype = NHSPrototypeKit.init({})

      // Should have nunjucks configured
      assert.ok(prototype.nunjucks)
      // @ts-expect-error - Property 'loaders' does not exist
      assert.ok(prototype.nunjucks.loaders[0].searchPaths)

      // Build expected search paths
      const prototypeKitViewsPath = join(import.meta.dirname, 'views')
      const frontendPath = fileURLToPath(
        dirname(import.meta.resolve('nhsuk-frontend/package.json'))
      )
      const expectedSearchPaths = [
        prototypeKitViewsPath,
        join(frontendPath, 'dist/nhsuk/components'),
        join(frontendPath, 'dist/nhsuk/macros'),
        join(frontendPath, 'dist/nhsuk'),
        join(frontendPath, 'dist')
      ]

      assert.deepStrictEqual(
        // @ts-expect-error - Property 'loaders' does not exist
        prototype.nunjucks.loaders[0].searchPaths,
        expectedSearchPaths
      )
    })

    it('should set noCache to true on nunjucks environment', () => {
      const prototype = NHSPrototypeKit.init({})

      // @ts-expect-error - Property 'opts' does not exist
      assert.strictEqual(prototype.nunjucks.opts.noCache, true)
    })

    it('should initialize with custom viewsPath', () => {
      const customViewsPath = '/custom/views'
      const prototype = NHSPrototypeKit.init({
        viewsPath: customViewsPath
      })

      assert.ok(
        // @ts-expect-error - Property 'loaders' does not exist
        prototype.nunjucks.loaders[0].searchPaths.includes(customViewsPath)
      )
    })

    it('should initialize with all options', () => {
      const routes = express.Router()
      routes.get('/test', (req, res) => {
        res.send('test')
      })

      const locals = (req, res, next) => {
        res.locals.testLocal = 'test value'
        next()
      }

      const sessionDataDefaults = { key: 'value' }
      const config = { test: 'config' }
      const buildOptions = { entryPoints: ['test.js'] }

      const prototype = NHSPrototypeKit.init({
        serviceName: 'Test Service',
        routes: routes,
        locals: locals,
        sessionDataDefaults: sessionDataDefaults,
        config: config,
        buildOptions: buildOptions
      })

      assert.ok(prototype instanceof NHSPrototypeKit)
      assert.ok(prototype.app)
      assert.ok(prototype.nunjucks)
      assert.strictEqual(prototype.config, config)
      assert.strictEqual(prototype.buildOptions, buildOptions)
    })
  })

  describe('prototype.build', () => {
    let originalNodeEnv

    before(() => {
      originalNodeEnv = process.env.NODE_ENV
      // Set to production to prevent watch mode
      process.env.NODE_ENV = 'production'
    })

    after(() => {
      process.env.NODE_ENV = originalNodeEnv
    })

    it('should handle build when buildOptions are not set', async () => {
      const app = express()
      const nunjucksEnv = nunjucks.configure(['views'], { express: app })

      const prototype = new NHSPrototypeKit({
        app: app,
        nunjucks: nunjucksEnv
      })

      // Should not throw when buildOptions is undefined
      await assert.doesNotReject(async () => {
        await prototype.build()
      })
    })

    it('should handle build errors gracefully', async () => {
      const app = express()
      const nunjucksEnv = nunjucks.configure(['views'], { express: app })

      // Invalid buildOptions that will cause build to fail
      const buildOptions = {
        entryPoints: ['nonexistent-file-that-does-not-exist.js']
      }

      const prototype = new NHSPrototypeKit({
        app: app,
        nunjucks: nunjucksEnv,
        buildOptions: buildOptions
      })

      // Should not throw even when build fails
      await assert.doesNotReject(async () => {
        await prototype.build()
      })
    })
  })

  describe('prototype.start', () => {
    let originalNodeEnv
    const serversToClose = []

    // Helper function to intercept server listen
    function interceptListen(app) {
      const originalListen = app.listen.bind(app)
      let capturedServer
      let capturedPort

      app.listen = function (port, ...args) {
        capturedPort = port
        capturedServer = originalListen(port, ...args)
        serversToClose.push(capturedServer)
        // Unref the server so it doesn't keep the process alive
        capturedServer.unref()
        return capturedServer
      }

      return {
        capturedServer: () => capturedServer,
        capturedPort: () => capturedPort
      }
    }

    before(() => {
      originalNodeEnv = process.env.NODE_ENV
    })

    after(async () => {
      process.env.NODE_ENV = originalNodeEnv
      // Close all servers
      const closePromises = serversToClose.map(
        (server) =>
          new Promise((resolve) => {
            if (server && server.listening) {
              // Close all connections first if method is available
              if (typeof server.closeAllConnections === 'function') {
                server.closeAllConnections()
              }
              server.close(() => resolve())
            } else {
              resolve()
            }
          })
      )
      await Promise.all(closePromises)
    })

    it('should start server in production mode', async () => {
      process.env.NODE_ENV = 'production'
      const prototype = NHSPrototypeKit.init({})

      const { capturedServer } = interceptListen(prototype.app)

      const testPort = 3000 + Math.floor(Math.random() * 1000)
      await prototype.start(testPort)

      // Wait for server to be ready
      await new Promise((resolve) => setTimeout(resolve, 100))

      assert.ok(capturedServer(), 'Server should have been created')
      assert.ok(capturedServer().listening, 'Server should be listening')
    })

    it('should handle PORT environment variable', async () => {
      process.env.NODE_ENV = 'production'
      process.env.PORT = '3500'
      const prototype = NHSPrototypeKit.init({})

      const { capturedPort } = interceptListen(prototype.app)

      await prototype.start()

      // Wait for server to be ready
      await new Promise((resolve) => setTimeout(resolve, 100))

      assert.strictEqual(capturedPort(), 3500)
      delete process.env.PORT
    })

    it('should handle port as string', async () => {
      process.env.NODE_ENV = 'production'
      const prototype = NHSPrototypeKit.init({})

      const { capturedServer, capturedPort } = interceptListen(prototype.app)

      const testPort = 3000 + Math.floor(Math.random() * 1000)
      await prototype.start(testPort)

      // Wait for server to be ready
      await new Promise((resolve) => setTimeout(resolve, 100))

      assert.strictEqual(capturedPort(), testPort)
      assert.ok(capturedServer().listening, 'Server should be listening')
    })
  })
})
