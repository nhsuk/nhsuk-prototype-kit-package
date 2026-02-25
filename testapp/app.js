import NHSPrototypeKit from 'nhsuk-prototype-kit'

import { sessionDataDefaults } from './app/data/session-data-defaults.js'
import * as filters from './app/filters.js'
import { locals } from './app/locals.js'
import { routes } from './app/routes.js'

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
