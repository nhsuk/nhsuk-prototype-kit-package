import { join } from 'node:path'

import NHSPrototypeKit from 'nhsuk-prototype-kit'

import { sessionDataDefaults } from './app/data/session-data-defaults.js'
import { locals } from './app/locals.js'
import { routes } from './app/routes.js'

// Views folder for templates
const viewsPath = join(import.meta.dirname, 'app/views')

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

prototype.start()
