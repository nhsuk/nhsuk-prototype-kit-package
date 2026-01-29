import assert from 'node:assert'
import { dirname, join } from 'node:path'
import { describe, it, before, mock } from 'node:test'
import { fileURLToPath } from 'node:url'

import express from 'express'
import nunjucks from 'nunjucks'

import { NHSPrototypeKit } from './nhsuk-prototype-kit.js'

describe('NHSPrototypeKit', () => {
  const app = express()
  const nunjucksEnv = nunjucks.configure(['views'], { express: app })
  const config = { test: 'config' }
  const buildOptions = { entryPoints: ['test.js'] }
  const sessionDataDefaults = { key: 'value' }

  describe('constructor', () => {
    it('should create an instance with provided options', () => {
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
    before(() => {
      process.env.NODE_ENV = 'production'
    })

    it('should initialize with minimal options', async () => {
      const prototype = await NHSPrototypeKit.init()

      assert.ok(prototype instanceof NHSPrototypeKit)
      assert.ok(prototype.app)
      assert.ok(prototype.nunjucks)
    })

    it.only('should initialize with custom express app', async () => {
      const customApp = express()

      assert.ok(!customApp.get('view engine'), undefined)
      assert.ok(!customApp.get('nunjucksEnv'), undefined)

      const prototype = await NHSPrototypeKit.init({
        app: customApp
      })

      assert.strictEqual(customApp.get('view engine'), 'html')
      assert.deepStrictEqual(customApp.get('nunjucksEnv'), prototype.nunjucks)
      assert.deepStrictEqual(prototype.app, customApp)
    })

    it('should initialize with custom nunjucks environment', async () => {
      const customNunjucksEnv = nunjucks.configure(['views'])

      const prototype = await NHSPrototypeKit.init({
        nunjucks: customNunjucksEnv
      })

      assert.strictEqual(prototype.app.get('view engine'), 'html')
      assert.deepStrictEqual(customNunjucksEnv, prototype.nunjucks)
    })

    it.only('should initialize with custom express app and nunjucks environment', async () => {
      const customApp = express()
      const customNunjucksEnv = nunjucks.configure(['views'])

      assert.ok(!customApp.get('view engine'), undefined)
      assert.ok(!customApp.get('nunjucksEnv'), undefined)

      const prototype = await NHSPrototypeKit.init({
        app: customApp,
        nunjucks: customNunjucksEnv
      })

      assert.strictEqual(customApp.get('view engine'), 'html')
      assert.deepStrictEqual(customApp.get('nunjucksEnv'), prototype.nunjucks)
      assert.deepStrictEqual(customApp.get('nunjucksEnv'), customNunjucksEnv)
      assert.deepStrictEqual(prototype.app, customApp)
    })

    it('should set express settings', async () => {
      const prototype = await NHSPrototypeKit.init()

      // Check that express settings were applied
      assert.strictEqual(prototype.app.get('query parser'), 'extended')
      assert.strictEqual(prototype.app.get('trust proxy'), 1)
      assert.strictEqual(prototype.app.get('view engine'), 'html')
    })

    it('should configure nunjucks with correct paths', async () => {
      const prototype = await NHSPrototypeKit.init()

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

    it('should set noCache to true on nunjucks environment', async () => {
      const prototype = await NHSPrototypeKit.init()

      // @ts-expect-error - Property 'opts' does not exist
      assert.strictEqual(prototype.nunjucks.opts.noCache, true)
    })

    it('should initialize with custom viewsPath', async () => {
      const customViewsPath = '/custom/views'
      const prototype = await NHSPrototypeKit.init({
        viewsPath: customViewsPath
      })

      assert.ok(
        // @ts-expect-error - Property 'loaders' does not exist
        prototype.nunjucks.loaders[0].searchPaths.includes(customViewsPath)
      )
    })

    it('should initialize with all options', async () => {
      const routes = express.Router()

      routes.get('/test', (req, res) => {
        res.send('test')
      })

      const locals = (req, res, next) => {
        res.locals.testLocal = 'test value'
        next()
      }

      const prototype = await NHSPrototypeKit.init({
        serviceName: 'Test Service',
        routes: routes,
        locals: locals,
        config: config,
        buildOptions: buildOptions,
        sessionDataDefaults: sessionDataDefaults
      })

      assert.ok(prototype instanceof NHSPrototypeKit)
      assert.ok(prototype.app)
      assert.ok(prototype.nunjucks)
      assert.strictEqual(prototype.config, config)
      assert.strictEqual(prototype.buildOptions, buildOptions)
    })
  })

  describe('prototype.build', () => {
    before(() => {
      process.env.NODE_ENV = 'production'
    })

    it('should handle build when buildOptions are not set', async () => {
      const prototype = await NHSPrototypeKit.init({
        app: app,
        nunjucks: nunjucksEnv
      })

      // Should not throw when buildOptions is undefined
      await assert.doesNotReject(async () => {
        await prototype.build()
      })
    })

    it('should handle build errors gracefully', async () => {
      // Invalid buildOptions that will cause build to fail
      const buildOptions = {
        entryPoints: ['nonexistent-file-that-does-not-exist.js']
      }

      const prototype = await NHSPrototypeKit.init({
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
    before(() => {
      process.env.NODE_ENV = 'production'
    })

    it('should start server in production mode', async () => {
      const prototype = await NHSPrototypeKit.init()
      const listen = mock.method(prototype.app, 'listen', (port, done) =>
        done()
      )

      await prototype.start()

      assert.strictEqual(listen.mock.calls[0].arguments[0], 3000)
    })

    it('should handle configured server port', async () => {
      const prototype = await NHSPrototypeKit.init()
      const listen = mock.method(prototype.app, 'listen', (port, done) =>
        done()
      )

      prototype.app.set('port', 4000)

      await prototype.start()

      assert.strictEqual(listen.mock.calls[0].arguments[0], 4000)
    })

    it('should handle PORT environment variable', async () => {
      process.env.PORT = '3500'

      const prototype = await NHSPrototypeKit.init()
      const listen = mock.method(prototype.app, 'listen', (port, done) =>
        done()
      )

      await prototype.start()

      assert.strictEqual(listen.mock.calls[0].arguments[0], 3500)
    })

    it('should handle PORT environment variable (overriding config)', async () => {
      process.env.PORT = '3500'

      const prototype = await NHSPrototypeKit.init()
      const listen = mock.method(prototype.app, 'listen', (port, done) =>
        done()
      )

      prototype.app.set('port', 4000)

      await prototype.start()

      assert.strictEqual(listen.mock.calls[0].arguments[0], 3500)
    })
  })
})
