import esbuild from 'esbuild'
import { sassPlugin } from 'esbuild-sass-plugin'

const { NODE_ENV } = process.env

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
    alias: {
      'nhsuk-frontend': '/nhsuk-frontend/nhsuk-frontend.min.js'
    },
    bundle: true,
    entryNames: '[name]',
    entryPoints: options.entryPoints,
    external: ['/nhsuk-frontend/*'],
    format: 'esm',
    legalComments: 'none',
    minify: NODE_ENV === 'production',
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
    sourcemap: NODE_ENV === 'production' ? 'linked' : 'inline',
    target: 'es2015'
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
