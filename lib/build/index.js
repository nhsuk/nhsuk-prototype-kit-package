import esbuild from 'esbuild'
import { sassPlugin } from 'esbuild-sass-plugin'

import { modulesPath } from '../nhsuk-prototype-kit.config.js'

const { NODE_ENV } = process.env

/**
 * @param {boolean} [watch]
 * @param {Options['buildOptions']} [options]
 */
export async function build(watch, options = {}) {
  const { alias = {}, external = [], plugins = [], ...rest } = options

  /** @type {BuildOptions} */
  const esbuildOptions = {
    alias: {
      ...alias,
      'nhsuk-frontend': '/nhsuk-frontend/nhsuk-frontend.min.js'
    },
    bundle: true,
    entryNames: '[dir]/[name]',
    external: [...external, '/nhsuk-frontend/*'],
    format: 'esm',
    legalComments: 'none',
    minify: NODE_ENV === 'production',
    outbase: 'app',
    outdir: 'public',
    plugins: [
      ...plugins,
      sassPlugin({
        embedded: true,
        loadPaths: [modulesPath],
        silenceDeprecations: ['import'],
        quietDeps: true,
        sourceMap: true,
        sourceMapIncludeSources: true
      })
    ],
    publicPath: '/',
    sourcemap: NODE_ENV === 'production' ? 'linked' : 'inline',
    target: 'es2015',
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
