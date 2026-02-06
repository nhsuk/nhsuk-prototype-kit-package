import { join, parse } from 'node:path'

import { globSync } from 'glob'

/**
 * List pages in a directory
 *
 * @param {string} [path] - Views subdirectory to list pages from
 */
export function pageListing(path = 'app/views') {
  const basePath = join(process.cwd(), path)

  return globSync(join(basePath, '**/*.{html,njk}'), {
    absolute: false,
    cwd: basePath,
    nodir: true
  })
    .map((view) => {
      const { dir, name } = parse(view)
      return name === 'index' ? `/${dir}` : `/${join(dir, name)}`
    })
    .sort()
}
