import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import nhsukFrontendPkg from 'nhsuk-frontend/package.json' with { type: 'json' }

import pkg from '../package.json' with { type: 'json' }

// NHS.UK frontend path
const nhsukFrontendPath = fileURLToPath(
  dirname(import.meta.resolve('nhsuk-frontend/package.json'))
)

// Node.js modules path
export const modulesPath = dirname(nhsukFrontendPath)

// Node.js dependency paths and versions
export const modules = {
  'nhsuk-frontend': {
    url: 'https://github.com/nhsuk/nhsuk-frontend/releases',
    path: nhsukFrontendPath,
    version: `v${nhsukFrontendPkg.version}`
  },
  'nhsuk-prototype-kit': {
    url: 'https://github.com/nhsuk/nhsuk-prototype-kit-package/releases',
    path: dirname(import.meta.dirname),
    version: `v${pkg.version}`
  }
}
