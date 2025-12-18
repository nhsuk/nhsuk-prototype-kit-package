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

      const kit = new NHSPrototypeKit({
        app: app,
        nunjucks: nunjucksEnv,
        config: config,
        buildOptions: buildOptions
      })

      assert.strictEqual(kit.app, app)
      assert.strictEqual(kit.nunjucks, nunjucksEnv)
      assert.strictEqual(kit.config, config)
      assert.strictEqual(kit.buildOptions, buildOptions)
    })

    it('should work with minimal options', () => {
      const app = express()
      const nunjucksEnv = nunjucks.configure(['views'], { express: app })

      const kit = new NHSPrototypeKit({
        app: app,
        nunjucks: nunjucksEnv
      })

      assert.strictEqual(kit.app, app)
      assert.strictEqual(kit.nunjucks, nunjucksEnv)
      assert.strictEqual(kit.config, undefined)
      assert.strictEqual(kit.buildOptions, undefined)
    })
  })

  describe('static properties', () => {
    it('should expose nunjucksFilters', () => {
      assert.ok(NHSPrototypeKit.nunjucksFilters)
      assert.strictEqual(typeof NHSPrototypeKit.nunjucksFilters, 'object')
    })

    it('should expose utils', () => {
      assert.ok(NHSPrototypeKit.utils)
      assert.strictEqual(typeof NHSPrototypeKit.utils, 'object')
    })

    it('should expose middleware', () => {
      assert.ok(NHSPrototypeKit.middleware)
      assert.strictEqual(typeof NHSPrototypeKit.middleware, 'object')
    })
  })

  describe('init', () => {
    it('should initialize with minimal options', () => {
      const kit = NHSPrototypeKit.init({})

      assert.ok(kit instanceof NHSPrototypeKit)
      assert.ok(kit.app)
      assert.ok(kit.nunjucks)
    })

    it('should set express settings', () => {
      const kit = NHSPrototypeKit.init({})

      // Check that express settings were applied
      assert.strictEqual(kit.app.get('query parser'), 'extended')
      assert.strictEqual(kit.app.get('trust proxy'), 1)
      assert.strictEqual(kit.app.get('view engine'), 'html')
    })

    it('should configure nunjucks with correct paths', () => {
      const kit = NHSPrototypeKit.init({})

      // Should have nunjucks configured
      assert.ok(kit.nunjucks)
      assert.ok(kit.nunjucks.loaders)
      assert.ok(kit.nunjucks.loaders[0].searchPaths)

      // Should include the prototype kit views path
      const prototypeKitViewsPath = join(import.meta.dirname, 'views')
      assert.ok(
        kit.nunjucks.loaders[0].searchPaths.includes(prototypeKitViewsPath)
      )

      // Should include NHS frontend paths
      const frontendPath = fileURLToPath(
        dirname(import.meta.resolve('nhsuk-frontend/package.json'))
      )
      const nhsukComponentsPath = join(frontendPath, 'dist/nhsuk/components')
      assert.ok(
        kit.nunjucks.loaders[0].searchPaths.includes(nhsukComponentsPath)
      )
    })

    it('should initialize with custom viewsPath', () => {
      const customViewsPath = '/custom/views'
      const kit = NHSPrototypeKit.init({
        viewsPath: customViewsPath
      })

      assert.ok(kit.nunjucks.loaders[0].searchPaths.includes(customViewsPath))
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

      const kit = NHSPrototypeKit.init({
        serviceName: 'Test Service',
        routes: routes,
        locals: locals,
        sessionDataDefaults: sessionDataDefaults,
        config: config,
        buildOptions: buildOptions
      })

      assert.ok(kit instanceof NHSPrototypeKit)
      assert.ok(kit.app)
      assert.ok(kit.nunjucks)
      assert.strictEqual(kit.config, config)
      assert.strictEqual(kit.buildOptions, buildOptions)
    })
  })

  describe('prototype.build', () => {
    it('should handle build when buildOptions are not set', async () => {
      const app = express()
      const nunjucksEnv = nunjucks.configure(['views'], { express: app })

      const kit = new NHSPrototypeKit({
        app: app,
        nunjucks: nunjucksEnv
      })

      // Should not throw when buildOptions is undefined
      await assert.doesNotReject(async () => {
        await kit.build()
      })
    })

    it('should handle build errors gracefully', async () => {
      const app = express()
      const nunjucksEnv = nunjucks.configure(['views'], { express: app })

      // Invalid buildOptions that will cause build to fail
      const buildOptions = {
        entryPoints: ['nonexistent-file-that-does-not-exist.js']
      }

      const kit = new NHSPrototypeKit({
        app: app,
        nunjucks: nunjucksEnv,
        buildOptions: buildOptions
      })

      // Should not throw even when build fails
      await assert.doesNotReject(async () => {
        await kit.build()
      })
    })
  })

  describe('prototype.start', () => {
    let originalNodeEnv
    let serversToClose = []

    // Helper function to intercept server listen
    function interceptListen(app) {
      const originalListen = app.listen.bind(app)
      let capturedServer
      let capturedPort

      app.listen = function (port, ...args) {
        capturedPort = port
        capturedServer = originalListen(port, ...args)
        serversToClose.push(capturedServer)
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
      for (const server of serversToClose) {
        if (server && server.listening) {
          await new Promise((resolve) => server.close(resolve))
        }
      }
      serversToClose = []
    })

    it('should start server in production mode', async () => {
      process.env.NODE_ENV = 'production'
      const kit = NHSPrototypeKit.init({})

      const { capturedServer } = interceptListen(kit.app)

      const testPort = 3000 + Math.floor(Math.random() * 1000)
      await kit.start(testPort)

      // Wait for server to be ready
      await new Promise((resolve) => setTimeout(resolve, 100))

      assert.ok(capturedServer(), 'Server should have been created')
      assert.ok(capturedServer().listening, 'Server should be listening')
    })

    it('should handle PORT environment variable', async () => {
      process.env.NODE_ENV = 'production'
      process.env.PORT = '3500'
      const kit = NHSPrototypeKit.init({})

      const { capturedPort } = interceptListen(kit.app)

      await kit.start()

      // Wait for server to be ready
      await new Promise((resolve) => setTimeout(resolve, 100))

      assert.strictEqual(capturedPort(), 3500)
      delete process.env.PORT
    })

    it('should handle port as string', async () => {
      process.env.NODE_ENV = 'production'
      const kit = NHSPrototypeKit.init({})

      const { capturedServer, capturedPort } = interceptListen(kit.app)

      const testPort = (3000 + Math.floor(Math.random() * 1000)).toString()
      await kit.start(testPort)

      // Wait for server to be ready
      await new Promise((resolve) => setTimeout(resolve, 100))

      assert.strictEqual(capturedPort(), parseInt(testPort, 10))
      assert.ok(capturedServer().listening, 'Server should be listening')
    })
  })
})
