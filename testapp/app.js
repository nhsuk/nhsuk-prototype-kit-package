import { join } from 'node:path'

import NHSPrototypeKit from 'nhsuk-prototype-kit'

import sessionDataDefaults from './data/session-data-defaults.js'
import locals from './locals.js'
import routes from './routes.js'

let port = 3000

// Views folder for templates
const appViews = join(import.meta.dirname, 'views')

const prototype = NHSPrototypeKit.init({
  serviceName: 'Test service',
  buildOptions: {
    entryPoints: ['assets/sass/*.scss', 'assets/javascript/*.js'],
    sassLoadPaths: ['../node_modules']
  },
  appViews,
  routes,
  locals,
  sessionDataDefaults
})

prototype.start(port)
