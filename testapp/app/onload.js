import matter from 'gray-matter'

/**
 * Apply front matter as Nunjucks variables
 *
 * @param {string} name
 * @param {{ src: string; path: string; noCache: boolean }} source
 */
export function onLoad(name, source) {
  let { content, data } = matter(source.src)

  const entries = Object.entries(data)

  // Add front matter variables
  if (entries.length) {
    for (const [key, value] of entries) {
      content = `{%- set ${key} = ${normaliseValue(value)} -%}\n${content}`
    }
  }

  // Remove front matter from source
  source.src = content
}

/**
 * @param {unknown} input
 */
export function normaliseValue(input) {
  let output = 'null'

  switch (typeof input) {
    case 'boolean':
    case 'number':
      output = `${input}`
      break

    case 'string':
      output = `"${input.replaceAll('"', '\\"')}"`
      break

    case 'object': {
      if (input) {
        output = JSON.stringify(input, undefined, 2)
          .replaceAll('<', '\\u003c')
          .replaceAll('>', '\\u003e')
          .replaceAll('&', '\\u0026')
          .replaceAll("'", '\\u0027')
      }

      break
    }
  }

  return output
}
