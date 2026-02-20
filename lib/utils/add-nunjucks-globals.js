/**
 * Add Nunjucks globals to environment
 *
 * @param {Environment} nunjucksEnv - Nunjucks environment
 * @param {NunjucksGlobals | ((env: Environment) => NunjucksGlobals)} nunjucksGlobals - Nunjucks globals to add
 */
export function addNunjucksGlobals(nunjucksEnv, nunjucksGlobals) {
  if (typeof nunjucksGlobals === 'function') {
    nunjucksGlobals = nunjucksGlobals(nunjucksEnv)
  }

  for (const [name, global] of Object.entries(nunjucksGlobals)) {
    nunjucksEnv.addGlobal(name, global)
  }
}

/**
 * @typedef {Parameters<Environment['addGlobal']>[1]} NunjucksGlobal
 * @typedef {Record<string, NunjucksGlobal>} NunjucksGlobals
 */

/**
 * @import { Environment } from 'nunjucks'
 */
