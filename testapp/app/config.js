/**
 * Service name
 */
export const serviceName = 'Test service'

/**
 * Nunjucks search paths
 */
export const viewsPath = ['app/views']

/**
 * Build options for esbuild
 *
 * @type {BuildOptions}
 */
export const buildOptions = {
  entryPoints: ['app/stylesheets/*.scss', 'app/javascripts/*.js']
}

/**
 * @import { BuildOptions } from 'esbuild'
 */
