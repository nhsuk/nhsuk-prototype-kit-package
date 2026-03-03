import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import esbuildConfig from '../esbuild.config.js'

import { mergePlugins } from './index.js'

describe('mergePlugins', () => {
  const { plugins } = esbuildConfig

  const sassPluginDefault = plugins.find((plugin) => {
    return plugin.name === 'sass-plugin'
  })

  const sassPluginCustom = {
    name: 'sass-plugin',
    setup: () => {}
  }

  it('should include default plugins', () => {
    const result = mergePlugins(plugins, [])

    assert.deepEqual(
      result.map((plugin) => plugin.name),
      ['clean', 'sass-plugin']
    )
  })

  it('should override default plugin with user plugin', () => {
    const result = mergePlugins(plugins, [sassPluginCustom])
    const sassPluginResult = result.find((plugin) => {
      return plugin.name === 'sass-plugin'
    })

    assert.deepEqual(
      result.map((plugin) => plugin.name),
      ['clean', 'sass-plugin']
    )

    assert.equal(sassPluginResult, sassPluginCustom)
    assert.notEqual(sassPluginResult, sassPluginDefault)
  })

  it('should append new user plugins', () => {
    const result = mergePlugins(plugins, [
      {
        name: 'custom-plugin-1',
        setup: () => {}
      },
      {
        name: 'custom-plugin-2',
        setup: () => {}
      },
      {
        name: 'custom-plugin-3',
        setup: () => {}
      }
    ])

    assert.deepEqual(
      result.map((plugin) => plugin.name),
      [
        'clean',
        'sass-plugin',
        'custom-plugin-1',
        'custom-plugin-2',
        'custom-plugin-3'
      ]
    )
  })
})
