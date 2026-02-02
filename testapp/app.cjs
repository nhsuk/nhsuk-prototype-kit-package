const NHSPrototypeKit = require('nhsuk-prototype-kit')

const { sessionDataDefaults } = require('./app/data/session-data-defaults.js')
const filters = require('./app/filters.js')
const { locals } = require('./app/locals.js')
const { routes } = require('./app/routes.js')

async function init() {
  const prototype = await NHSPrototypeKit.init({
    serviceName: 'Test service',
    buildOptions: {
      entryPoints: ['app/stylesheets/*.scss', 'app/javascripts/*.js']
    },
    viewsPath: ['app/views'],
    routes,
    locals,
    filters,
    sessionDataDefaults
  })

  prototype.start(2000)
}

init()
