import assert from 'node:assert/strict'
import { join } from 'node:path'
import { beforeEach, describe, it, mock } from 'node:test'

import express from 'express'

import { prototypeKitPath } from '.././nhsuk-prototype-kit.config.js'
import { normaliseOptions } from '../utils/index.js'

import { pageListing } from './page-listing.js'

describe('pageListing', () => {
  let /** @type {Environment} */ env

  beforeEach(() => {
    const options = normaliseOptions({
      app: express().set('view engine', 'html'),
      viewsPath: [join(prototypeKitPath, 'test/fixtures/views')]
    })

    env = options.nunjucks

    mock.method(process, 'cwd', () => join(prototypeKitPath, 'test'))
  })

  it('lists all routes to pages as objects with children', () => {
    const result = pageListing.call({ env }, 'fixtures/views')

    assert.deepEqual(result, [
      {
        text: '404',
        href: '/404',
        children: []
      },
      {
        text: '500',
        href: '/500',
        children: []
      },
      {
        text: 'Error',
        href: '/error',
        children: []
      },
      {
        text: 'Layout',
        href: '/layout',
        children: []
      },
      {
        text: 'Nested',
        href: '/nested',
        children: [
          {
            text: 'Example',
            href: '/nested/example',
            children: []
          },
          {
            text: 'More',
            href: '/nested/more',
            children: [
              {
                text: 'Example',
                href: '/nested/more/example',
                children: []
              }
            ]
          }
        ]
      },
      {
        text: 'Nested with njk',
        href: '/nested-with-njk',
        children: []
      },
      {
        text: 'Simple',
        href: '/simple',
        children: []
      },
      {
        text: 'With njk',
        href: '/with-njk',
        children: []
      }
    ])
  })
})

/**
 * @import { Environment } from 'nunjucks'
 */
