const esbuild = require('esbuild')
const { sassPlugin } = require('esbuild-sass-plugin')

const compileAssets = async function (watch, options = {}) {
  const entryPoints = [options.stylesheets, options.javascripts].filter(Boolean)
  const sassLoadPaths = options.sassLoadPaths || ['node_modules']

  const esbuildOptions = {
    entryPoints: entryPoints,
    entryNames: '[name]',
    bundle: true,
    legalComments: 'none',
    minify: true,
    outdir: 'public',
    plugins: [
      sassPlugin({
        loadPaths: sassLoadPaths,
        silenceDeprecations: ['import'],
        quietDeps: true
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

module.exports = compileAssets
