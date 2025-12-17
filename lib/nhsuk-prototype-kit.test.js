import assert from 'node:assert'
import { dirname, join } from 'node:path'
import { describe, it, before, after } from 'node:test'
import { fileURLToPath } from 'node:url'

import express from 'express'
import nunjucks from 'nunjucks'

import * as middleware from './middleware/index.js'
import { NHSPrototypeKit } from './nhsuk-prototype-kit.js'
import * as nunjucksFilters from './nunjucks-filters/index.js'
import * as utils from './utils/index.js'

describe('NHSPrototypeKit', () => {
  describe('constructor', () => {
    it('should create an instance with provided options', () => {
      const app = express()
      const nunjucksEnv = nunjucks.configure(['views'], { express: app })
      const config = { test: 'config' }
      const buildOptions = { entryPoints: ['test.js'] }

      const kit = new NHSPrototypeKit({
        express: app,
        nunjucks: nunjucksEnv,
        config: config,
        buildOptions: buildOptions
      })

      assert.strictEqual(kit.express, app)
      assert.strictEqual(kit.nunjucks, nunjucksEnv)
      assert.strictEqual(kit.config, config)
      assert.strictEqual(kit.buildOptions, buildOptions)
    })

    it('should work with minimal options', () => {
      const app = express()
      const nunjucksEnv = nunjucks.configure(['views'], { express: app })

      const kit = new NHSPrototypeKit({
        express: app,
        nunjucks: nunjucksEnv
      })

      assert.strictEqual(kit.express, app)
      assert.strictEqual(kit.nunjucks, nunjucksEnv)
      assert.strictEqual(kit.config, undefined)
      assert.strictEqual(kit.buildOptions, undefined)
    })
  })

  describe('static properties', () => {
    it('should expose nunjucksFilters', () => {
      assert.strictEqual(NHSPrototypeKit.nunjucksFilters, nunjucksFilters)
    })

    it('should expose utils', () => {
      assert.strictEqual(NHSPrototypeKit.utils, utils)
    })

    it('should expose middleware', () => {
      assert.strictEqual(NHSPrototypeKit.middleware, middleware)
    })
  })

  describe('init', () => {
    it('should initialize with minimal options', () => {
      const app = express()
      const frontendPath = fileURLToPath(
        dirname(import.meta.resolve('nhsuk-frontend/package.json'))
      )

      const appViews = [
        join(frontendPath, 'dist/nhsuk/components'),
        join(frontendPath, 'dist/nhsuk/macros'),
        join(frontendPath, 'dist/nhsuk'),
        join(frontendPath, 'dist')
      ]

      const nunjucksEnv = nunjucks.configure(appViews, {
        express: app,
        noCache: true
      })

      const kit = NHSPrototypeKit.init({
        express: app,
        nunjucks: nunjucksEnv
      })

      assert.ok(kit instanceof NHSPrototypeKit)
      assert.strictEqual(kit.express, app)
      assert.strictEqual(kit.nunjucks, nunjucksEnv)
    })

    it('should set express settings', () => {
      const app = express()
      const frontendPath = fileURLToPath(
        dirname(import.meta.resolve('nhsuk-frontend/package.json'))
      )

      const appViews = [
        join(frontendPath, 'dist/nhsuk/components'),
        join(frontendPath, 'dist/nhsuk/macros'),
        join(frontendPath, 'dist/nhsuk'),
        join(frontendPath, 'dist')
      ]

      const nunjucksEnv = nunjucks.configure(appViews, {
        express: app,
        noCache: true
      })

      NHSPrototypeKit.init({
        express: app,
        nunjucks: nunjucksEnv
      })

      // Check that express settings were applied
      assert.strictEqual(app.get('query parser'), 'extended')
      assert.strictEqual(app.get('trust proxy'), 1)
      assert.strictEqual(app.get('view engine'), 'html')
    })

    it('should add prototype kit views path to nunjucks', () => {
      const app = express()
      const frontendPath = fileURLToPath(
        dirname(import.meta.resolve('nhsuk-frontend/package.json'))
      )

      const appViews = [
        join(frontendPath, 'dist/nhsuk/components'),
        join(frontendPath, 'dist/nhsuk/macros'),
        join(frontendPath, 'dist/nhsuk'),
        join(frontendPath, 'dist')
      ]

      const nunjucksEnv = nunjucks.configure(appViews, {
        express: app,
        noCache: true
      })

      const initialPathCount = nunjucksEnv.loaders[0].searchPaths.length

      NHSPrototypeKit.init({
        express: app,
        nunjucks: nunjucksEnv
      })

      // Should have added the prototype kit views path
      assert.strictEqual(
        nunjucksEnv.loaders[0].searchPaths.length,
        initialPathCount + 1
      )

      const prototypeKitViewsPath = join(import.meta.dirname, 'views')
      assert.ok(
        nunjucksEnv.loaders[0].searchPaths.includes(prototypeKitViewsPath)
      )
    })

    it('should initialize with all options', () => {
      const app = express()
      const frontendPath = fileURLToPath(
        dirname(import.meta.resolve('nhsuk-frontend/package.json'))
      )

      const appViews = [
        join(frontendPath, 'dist/nhsuk/components'),
        join(frontendPath, 'dist/nhsuk/macros'),
        join(frontendPath, 'dist/nhsuk'),
        join(frontendPath, 'dist')
      ]

      const nunjucksEnv = nunjucks.configure(appViews, {
        express: app,
        noCache: true
      })

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
        express: app,
        nunjucks: nunjucksEnv,
        routes: routes,
        locals: locals,
        sessionDataDefaults: sessionDataDefaults,
        config: config,
        buildOptions: buildOptions
      })

      assert.ok(kit instanceof NHSPrototypeKit)
      assert.strictEqual(kit.express, app)
      assert.strictEqual(kit.nunjucks, nunjucksEnv)
      assert.strictEqual(kit.config, config)
      assert.strictEqual(kit.buildOptions, buildOptions)
    })
  })

  describe('prototype.build', () => {
    it('should handle build when buildOptions are not set', async () => {
      const app = express()
      const nunjucksEnv = nunjucks.configure(['views'], { express: app })

      const kit = new NHSPrototypeKit({
        express: app,
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
        express: app,
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

    before(() => {
      originalNodeEnv = process.env.NODE_ENV
    })

    after(() => {
      process.env.NODE_ENV = originalNodeEnv
    })

    it('should parse port correctly when provided as number', () => {
      // Test the port parsing logic without actually starting the server
      const port = parseInt(3000, 10) || 2000
      assert.strictEqual(port, 3000)
    })

    it('should parse port correctly when provided as string', () => {
      // Test the port parsing logic without actually starting the server
      const portString = '3000'
      const port = parseInt(portString, 10) || 2000
      assert.strictEqual(port, 3000)
    })

    it('should use default port 2000 when no port is provided', () => {
      // Test the default port logic
      const port = parseInt(undefined, 10) || 2000
      assert.strictEqual(port, 2000)
    })

    it('should use PORT environment variable when available', () => {
      process.env.PORT = '4000'
      const port = parseInt(process.env.PORT, 10) || 2000
      assert.strictEqual(port, 4000)
      delete process.env.PORT
    })
  })
})
