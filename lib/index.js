const { join } = require('node:path')

const build = require('./build')
const expressMiddleware = require('./express-middleware')
const expressSettings = require('./express-settings')
const nunjucksFilters = require('./nunjucks-filters')
const utils = require('./utils')

function NHSPrototypeKit({ express, nunjucks, config, buildOptions }) {
  this.express = express
  this.nunjucks = nunjucks
  this.config = config
  this.buildOptions = buildOptions
}

NHSPrototypeKit.nunjucksFilters = nunjucksFilters
NHSPrototypeKit.utils = utils
NHSPrototypeKit.expressMiddleware = expressMiddleware

// This does all setup for both the Express app
// and the Nunjucks environment
NHSPrototypeKit.init = function (options) {
  // Set all the Express settings
  expressSettings.setAll(options.express)

  // Add the prototype kit view path to Nunjucks environment
  const prototypeKitViewsPath = join(__dirname, 'views')
  options.nunjucks.loaders[0].searchPaths.push(prototypeKitViewsPath)

  // Add the prototype kit Nunjucks filters
  NHSPrototypeKit.nunjucksFilters.addAll(options.nunjucks)

  // Use all the middleware
  options.express.use(
    NHSPrototypeKit.expressMiddleware.all({
      serviceName: options.serviceName,
      routes: options.routes,
      locals: options.locals,
      sessionDataDefaults: options.sessionDataDefaults
    })
  )

  return new NHSPrototypeKit({
    express: options.express,
    nunjucks: options.nunjucks,
    config: options.config,
    buildOptions: options.buildOptions
  })
}

// This function can be used to start the app
//
// Unless the app is being run in production, it will
// check that the port is available first and ask
// to switch to a different one if not.
NHSPrototypeKit.prototype.start = async function (port) {
  const nodeEnv = process.env.NODE_ENV || 'development'
  port = parseInt(port || process.env.PORT, 10) || 2000
  let availablePort = port

  if (nodeEnv === 'development') {
    try {
      availablePort = await NHSPrototypeKit.utils.findAvailablePort(port)
    } catch (error) {
      console.error(error.message)
      return
    }
  }

  if (typeof availablePort !== 'number') {
    // User selected 'No'
    return
  }

  // Build the frontend assets (if configured)
  await this.build()

  this.express.listen(availablePort, () => {
    if (nodeEnv === 'production') {
      console.info(`Running on port ${availablePort}`)
    } else {
      console.info(`Running at http://localhost:${availablePort}/`)
    }
  })
}

// This function can be used to compile the frontend assets
NHSPrototypeKit.prototype.build = async function () {
  const nodeEnv = process.env.NODE_ENV || 'development'

  if (this.buildOptions) {
    const watch = nodeEnv !== 'production'
    try {
      await build(watch, this.buildOptions)
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = NHSPrototypeKit
