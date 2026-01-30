const NHSPrototypeKit = require('nhsuk-prototype-kit')

const config = require('./app/config.js')
const { sessionDataDefaults } = require('./app/data/session-data-defaults.js')
const filters = require('./app/filters.js')
const { locals } = require('./app/locals.js')
const { routes } = require('./app/routes.js')

async function init() {
  const prototype = await NHSPrototypeKit.init({
    serviceName: config.serviceName,
    buildOptions: {
      entryPoints: ['app/assets/sass/*.scss', 'app/assets/javascript/*.js'],
      sassLoadPaths: ['../node_modules']
    },
    viewsPath: ['app/views'],
    routes,
    locals,
    filters,
    sessionDataDefaults
  })

  prototype.app?.set('port', config.port)
  prototype.start()
}

init()
