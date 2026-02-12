import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import nhsukFrontendPkg from 'nhsuk-frontend/package.json' with { type: 'json' }

import pkg from '../package.json' with { type: 'json' }

// NHS prototype kit path
const nhsukPrototypeKitPath = dirname(import.meta.dirname)

// NHS.UK frontend path
const nhsukFrontendPath = fileURLToPath(
  dirname(import.meta.resolve('nhsuk-frontend/package.json'))
)

// Node.js modules path
export const modulesPath = dirname(nhsukFrontendPath)

// Node.js dependency paths and versions
export const modules = {
  'nhsuk-frontend': {
    text: 'NHS.UK frontend',
    href: `https://github.com/nhsuk/nhsuk-frontend/releases/v${nhsukFrontendPkg.version}`,
    path: nhsukFrontendPath,
    version: `v${nhsukFrontendPkg.version}`
  },
  'nhsuk-prototype-kit': {
    text: 'NHS prototype kit',
    href: `https://github.com/nhsuk/nhsuk-prototype-kit-package/releases/v${pkg.version}`,
    path: nhsukPrototypeKitPath,
    version: `v${pkg.version}`
  }
}
