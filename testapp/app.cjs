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
    sessionDataDefaults
  })

  // Add custom port number
  prototype.app?.set('port', config.port)

  // Add custom Nunjucks filters
  for (const [name, filter] of Object.entries(filters)) {
    prototype.nunjucks?.addFilter(name, filter)
  }

  prototype.start()
}

init()
