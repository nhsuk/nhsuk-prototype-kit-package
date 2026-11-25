const NHSPrototypeKit = require('nhsuk-prototype-kit')

const config = require('./app/config.js')
const { sessionDataDefaults } = require('./app/data/session-data-defaults.js')
const filters = require('./app/filters.js')
const { locals } = require('./app/locals.js')
const { routes } = require('./app/routes.js')
const { session } = require('./app/session.js')

async function init() {
  const prototype = await NHSPrototypeKit.init({
    serviceName: config.serviceName,
    buildOptions: {
      entryPoints: ['app/stylesheets/*.scss', 'app/javascripts/*.js']
    },
    viewsPath: ['app/views'],
    routes,
    locals,
    filters,
    session,
    sessionDataDefaults
  })

  prototype.start(3000)
}

init()
