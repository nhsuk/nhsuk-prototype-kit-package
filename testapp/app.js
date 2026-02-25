import cookieSession from 'cookie-session'
import NHSPrototypeKit from 'nhsuk-prototype-kit'

import * as config from './app/config.js'
import { sessionDataDefaults } from './app/data/session-data-defaults.js'
import * as filters from './app/filters.js'
import { locals } from './app/locals.js'
import { routes } from './app/routes.js'

const prototype = await NHSPrototypeKit.init({
  serviceName: config.serviceName,
  buildOptions: {
    entryPoints: ['app/stylesheets/*.scss', 'app/javascripts/*.js']
  },
  viewsPath: ['app/views'],
  routes,
  locals,
  filters,
  session: cookieSession({
    name: config.sessionName,
    secret: config.sessionName,
    maxAge: 1000 * 60 * 60 * 4 // 4 hours
  }),
  sessionDataDefaults
})

prototype.start(3000)
