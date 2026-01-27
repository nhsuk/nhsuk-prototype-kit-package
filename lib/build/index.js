import esbuild from 'esbuild'
import { sassPlugin } from 'esbuild-sass-plugin'

/**
 * @param {boolean} [watch]
 * @param {Options['buildOptions']} [options]
 */
export async function build(watch, options = {}) {
  const sassLoadPaths = ['node_modules']

  if (options.sassLoadPaths) {
    sassLoadPaths.push(...options.sassLoadPaths)
  }

  /** @type {BuildOptions} */
  const esbuildOptions = {
    entryPoints: options.entryPoints,
    entryNames: '[name]',
    bundle: true,
    legalComments: 'none',
    minify: true,
    outdir: 'public',
    plugins: [
      sassPlugin({
        loadPaths: sassLoadPaths,
        silenceDeprecations: ['import'],
        quietDeps: true,
        sourceMap: true,
        sourceMapIncludeSources: true
      })
    ],
    sourcemap: true
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
