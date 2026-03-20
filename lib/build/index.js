import esbuild from 'esbuild'

import esbuildConfig from '../esbuild.config.js'

/**
 * Build using esbuild config with optional options
 *
 * @param {boolean} [watch]
 * @param {Options['buildOptions']} [options]
 */
export async function build(watch, options = {}) {
  const { alias = {}, external = [], plugins = [], ...rest } = options

  /** @type {BuildOptions} */
  const esbuildOptions = {
    ...esbuildConfig,
    alias: { ...alias, ...esbuildConfig.alias },
    external: [...external, ...esbuildConfig.external],
    plugins: mergePlugins(esbuildConfig.plugins, plugins),
    ...rest
  }

  try {
    if (watch) {
      const ctx = await esbuild.context(esbuildOptions)
      await ctx.watch()
    } else {
      await esbuild.build(esbuildOptions)
    }
  } catch (error) {
    console.error(error)
  }
}

/**
 * Merge default and user plugins, letting user plugins
 * override defaults with the same name (e.g. 'sass-plugin')
 *
 * @param {Plugin[]} defaultPlugins
 * @param {Plugin[]} userPlugins
 */
export function mergePlugins(defaultPlugins, userPlugins) {
  const merged = /** @type {Map<string, Plugin>} */ (new Map())

  for (const plugin of defaultPlugins) {
    merged.set(plugin.name, plugin)
  }

  for (const plugin of userPlugins) {
    merged.set(plugin.name, plugin)
  }

  return [...merged.values()]
}

/**
 * @import { BuildOptions, Plugin } from 'esbuild'
 * @import { Options } from '../nhsuk-prototype-kit.js'
 */
