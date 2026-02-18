import NHSPrototypeKit from 'nhsuk-prototype-kit'

import { sessionDataDefaults } from './app/data/session-data-defaults.js'
import * as extensions from './app/extensions/index.js'
import * as filters from './app/filters.js'
import { locals } from './app/locals.js'
import { routes } from './app/routes.js'

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

prototype.nunjucks.addExtension(
  'UppercaseExtension',
  new extensions.Uppercase()
)

prototype.start(3000)
