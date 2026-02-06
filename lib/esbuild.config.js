import { sassPlugin } from 'esbuild-sass-plugin'

import { modulesPath } from './nhsuk-prototype-kit.config.js'

const { NODE_ENV } = process.env

export default /** @satisfies {BuildOptions} */ ({
  alias: {
    'nhsuk-frontend': '/nhsuk-frontend/nhsuk-frontend.min.js'
  },
  bundle: true,
  entryNames: '[dir]/[name]',
  external: ['/assets/*', '/images/*', '/nhsuk-frontend/*'],
  format: 'esm',
  legalComments: 'none',
  minify: NODE_ENV === 'production',
  outbase: 'app',
  outdir: 'public',
  plugins: [
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
  target: 'es2015'
})

/**
 * @import { BuildOptions } from 'esbuild'
 */
