import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

// NHS prototype kit path
export const prototypeKitPath = import.meta.dirname

// NHS.UK frontend package path
export const nhsukFrontendPath = fileURLToPath(
  dirname(import.meta.resolve('nhsuk-frontend/package.json'))
)

// Node modules path
export const modulesPath = dirname(nhsukFrontendPath)
