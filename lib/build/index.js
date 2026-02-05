import esbuild from 'esbuild'

import esbuildConfig from '../esbuild.config.js'

/**
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
    plugins: [...plugins, ...esbuildConfig.plugins],
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
 * @import { BuildOptions } from 'esbuild'
 * @import { Options } from '../nhsuk-prototype-kit.js'
 */
