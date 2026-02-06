import assert from 'node:assert/strict'
import { join } from 'node:path'
import { describe, it, mock } from 'node:test'

import { prototypeKitPath } from '.././nhsuk-prototype-kit.config.js'

import { pageListing } from './page-listing.js'

describe('pageListing', () => {
  mock.method(process, 'cwd', () => join(prototypeKitPath, 'test'))

  it('lists all routes to pages', () => {
    assert.deepEqual(pageListing('fixtures/views'), [
      '/',
      '/404',
      '/500',
      '/error',
      '/layout',
      '/nested',
      '/nested-with-njk',
      '/simple',
      '/with-njk'
    ])
  })
})
