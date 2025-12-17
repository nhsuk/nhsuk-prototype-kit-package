import esbuild from 'esbuild'
import { sassPlugin } from 'esbuild-sass-plugin'

export async function build(watch, options = {}) {
  const sassLoadPaths = ['node_modules']

  if (options.sassLoadPaths) {
    sassLoadPaths.push(...options.sassLoadPaths)
  }

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
