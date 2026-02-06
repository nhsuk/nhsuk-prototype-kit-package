import assert from 'node:assert/strict'
import { dirname, join } from 'node:path'
import { describe, it, before, beforeEach, mock } from 'node:test'
import { fileURLToPath } from 'node:url'

import express from 'express'
import nunjucks from 'nunjucks'

import { NHSPrototypeKit } from './nhsuk-prototype-kit.js'

describe('NHSPrototypeKit', () => {
  let app = express()

  const nunjucksEnv = nunjucks.configure(['views'], { express: app })
  const buildOptions = { entryPoints: ['test.js'] }
  const sessionDataDefaults = { key: 'value' }

  describe('constructor', () => {
    it('should create an instance with provided options', () => {
      const prototype = new NHSPrototypeKit({
        app: app,
        nunjucks: nunjucksEnv,
        buildOptions: buildOptions
      })

      assert.equal(prototype.app, app)
      assert.equal(prototype.nunjucks, nunjucksEnv)
      assert.equal(prototype.buildOptions, buildOptions)
    })

    it('should work with minimal options', () => {
      const prototype = new NHSPrototypeKit({
        app: app,
        nunjucks: nunjucksEnv
      })

      assert.equal(prototype.app, app)
      assert.equal(prototype.nunjucks, nunjucksEnv)
      assert.equal(prototype.buildOptions, undefined)
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

    it('should initialize with custom express app', async () => {
      const customApp = express()

      assert.ok(!customApp.get('view engine'), undefined)
      assert.ok(!customApp.get('nunjucksEnv'), undefined)

      const prototype = await NHSPrototypeKit.init({
        app: customApp
      })

      assert.equal(customApp.get('view engine'), 'html')
      assert.deepEqual(customApp.get('nunjucksEnv'), prototype.nunjucks)
      assert.deepEqual(prototype.app, customApp)
    })

    it('should initialize with custom nunjucks filters object', async () => {
      const prototype = await NHSPrototypeKit.init({
        filters: {
          sayHello(name) {
            return `Hello, <strong>${name}!</strong>`
          }
        }
      })

      assert.equal(
        prototype.nunjucks.renderString(`{{ 'World' | sayHello }}`, {}),
        'Hello, &lt;strong&gt;World!&lt;/strong&gt;'
      )
    })

    it('should initialize with custom nunjucks filters function', async () => {
      const prototype = await NHSPrototypeKit.init({
        filters(env) {
          return {
            sayHello(name) {
              const safe = env.getFilter('safe')
              return safe(`Hello, <strong>${name}!</strong>`)
            }
          }
        }
      })

      assert.equal(
        prototype.nunjucks.renderString(`{{ 'World' | sayHello }}`, {}),
        'Hello, <strong>World!</strong>'
      )
    })

    it('should initialize with custom nunjucks globals object', async () => {
      const prototype = await NHSPrototypeKit.init({
        globals: {
          get version() {
            return 'v9.9.9'
          }
        }
      })

      assert.equal(
        prototype.nunjucks.renderString(`{{ version }}`, {}),
        'v9.9.9'
      )
    })

    it('should initialize with custom nunjucks globals function', async () => {
      const prototype = await NHSPrototypeKit.init({
        globals(env) {
          return {
            get version() {
              const safe = env.getFilter('safe')
              return safe(`<strong>v9.9.9</strong>`)
            }
          }
        }
      })

      assert.equal(
        prototype.nunjucks.renderString(`{{ version }}`, {}),
        '<strong>v9.9.9</strong>'
      )
    })

    it('should initialize with custom nunjucks environment', async () => {
      const customNunjucksEnv = nunjucks.configure(['views'])

      const prototype = await NHSPrototypeKit.init({
        nunjucks: customNunjucksEnv
      })

      assert.equal(prototype.app.get('view engine'), 'html')
      assert.deepEqual(customNunjucksEnv, prototype.nunjucks)
    })

    it('should initialize with custom express app and nunjucks environment', async () => {
      const customApp = express()
      const customNunjucksEnv = nunjucks.configure(['views'])

      assert.ok(!customApp.get('view engine'), undefined)
      assert.ok(!customApp.get('nunjucksEnv'), undefined)

      const prototype = await NHSPrototypeKit.init({
        app: customApp,
        nunjucks: customNunjucksEnv
      })

      assert.equal(customApp.get('view engine'), 'html')
      assert.deepEqual(customApp.get('nunjucksEnv'), prototype.nunjucks)
      assert.deepEqual(customApp.get('nunjucksEnv'), customNunjucksEnv)
      assert.deepEqual(prototype.app, customApp)
    })

    it('should set express settings', async () => {
      const prototype = await NHSPrototypeKit.init()

      // Check that express settings were applied
      assert.equal(prototype.app.get('query parser'), 'extended')
      assert.equal(prototype.app.get('trust proxy'), 1)
      assert.equal(prototype.app.get('view engine'), 'html')
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

      assert.deepEqual(
        // @ts-expect-error - Property 'loaders' does not exist
        prototype.nunjucks.loaders[0].searchPaths,
        expectedSearchPaths
      )
    })

    it('should set noCache to true on nunjucks environment', async () => {
      const prototype = await NHSPrototypeKit.init()

      // @ts-expect-error - Property 'opts' does not exist
      assert.equal(prototype.nunjucks.opts.noCache, true)
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
        buildOptions: buildOptions,
        sessionDataDefaults: sessionDataDefaults
      })

      assert.ok(prototype instanceof NHSPrototypeKit)
      assert.ok(prototype.app)
      assert.ok(prototype.nunjucks)
      assert.equal(prototype.buildOptions, buildOptions)
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
    let /** @type {Mock<Express['listen']>} */ listen

    beforeEach(() => {
      app = express()
      listen = mock.method(app, 'listen', (port, done) => done())
      process.env.NODE_ENV = 'production'
    })

    it('should start server in production mode', async () => {
      const prototype = await NHSPrototypeKit.init({ app })
      await prototype.start()

      assert.equal(listen.mock.calls[0].arguments[0], 3000)
    })

    it('should ignore server port argument in production mode', async () => {
      const prototype = await NHSPrototypeKit.init({ app })
      await prototype.start(4000)

      assert.equal(listen.mock.calls[0].arguments[0], 3000)
    })

    it('should handle configured server port', async () => {
      app.set('port', 4000)

      const prototype = await NHSPrototypeKit.init({ app })
      await prototype.start()

      assert.equal(listen.mock.calls[0].arguments[0], 4000)
    })

    it('should handle PORT environment variable', async () => {
      process.env.PORT = '3500'

      const prototype = await NHSPrototypeKit.init({ app })
      await prototype.start()

      assert.equal(listen.mock.calls[0].arguments[0], 3500)
    })

    it('should handle PORT environment variable (overriding express)', async () => {
      process.env.PORT = '3500'

      const prototype = await NHSPrototypeKit.init({ app })
      await prototype.start()

      assert.equal(listen.mock.calls[0].arguments[0], 3500)
    })

    it('should handle PORT environment variable (overriding express and start)', async () => {
      app.set('port', 4000)

      // Set PORT environment variable
      process.env.PORT = '3500'

      const prototype = await NHSPrototypeKit.init({ app })
      await prototype.start(3000)

      assert.equal(listen.mock.calls[0].arguments[0], 3500)
    })
  })
})

/**
 * @import { Mock } from 'node:test'
 * @import { Express } from 'express'
 */
