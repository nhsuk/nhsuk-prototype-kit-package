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
    bundle: true,
    entryNames: '[name]',
    entryPoints: options.entryPoints,
    legalComments: 'none',
    minify: true,
    outbase: 'app/assets',
    outdir: 'public',
    plugins: [
      sassPlugin({
        embedded: true,
        loadPaths: sassLoadPaths,
        silenceDeprecations: ['import'],
        quietDeps: true,
        sourceMap: true,
        sourceMapIncludeSources: true
      })
    ],
    publicPath: '/',
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
