import { join, dirname } from 'node:path'
import { cwd } from 'node:process'
import { fileURLToPath } from 'node:url'

import nhsukFrontendPkg from 'nhsuk-frontend/package.json' with { type: 'json' }

import pkg from '../package.json' with { type: 'json' }

// NHS prototype kit path
const nhsukPrototypeKitPath = dirname(import.meta.dirname)

// NHS.UK frontend path
const nhsukFrontendPath = fileURLToPath(
  dirname(import.meta.resolve('nhsuk-frontend/package.json'))
)

// Application path
const appPath = cwd()

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

// Node.js modules paths
export const modulePaths = [
  ...new Set(
    [appPath, nhsukPrototypeKitPath].flatMap((path) => {
      return [join(path, 'node_modules'), path]
    })
  )
]
