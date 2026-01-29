import NHSPrototypeKit from 'nhsuk-prototype-kit'

import * as config from './app/config.js'
import { sessionDataDefaults } from './app/data/session-data-defaults.js'
import * as filters from './app/filters.js'
import { locals } from './app/locals.js'
import { routes } from './app/routes.js'

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
