const NHSPrototypeKit = require('nhsuk-prototype-kit')

const { sessionDataDefaults } = require('./app/data/session-data-defaults.js')
const filters = require('./app/filters.js')
const { locals } = require('./app/locals.js')
const { routes } = require('./app/routes.js')

async function init() {
  const prototype = await NHSPrototypeKit.init({
    serviceName: 'Test service',
    buildOptions: {
      entryPoints: ['app/stylesheets/*.scss', 'app/javascripts/*.js'],
      external: ['/govuk-frontend/*']
    },
    viewsPath: [
      'app/views',
      '../node_modules/@x-govuk/govuk-prototype-components/src',
      '../node_modules/govuk-frontend/dist'
    ],
    routes,
    locals,
    filters,
    sessionDataDefaults
  })

  prototype.start(3000)
}

init()
