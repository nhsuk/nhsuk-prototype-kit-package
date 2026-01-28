import NHSPrototypeKit from 'nhsuk-prototype-kit'

import { sessionDataDefaults } from './app/data/session-data-defaults.js'
import * as filters from './app/filters.js'
import { locals } from './app/locals.js'
import { routes } from './app/routes.js'

// Views folder for templates
const viewsPath = ['app/views']

const prototype = await NHSPrototypeKit.init({
  serviceName: 'Test service',
  buildOptions: {
    entryPoints: ['app/assets/sass/*.scss', 'app/assets/javascript/*.js'],
    sassLoadPaths: ['../node_modules']
  },
  viewsPath,
  routes,
  locals,
  sessionDataDefaults
})

for (const [name, filter] of Object.entries(filters)) {
  prototype.nunjucks?.addFilter(name, filter)
}

prototype.start()
