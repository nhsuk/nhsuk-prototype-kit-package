import nunjucks from 'nunjucks'

export function Uppercase() {
  this.tags = ['uppercase']

  this.parse = function (parser, nodes) {
    const uppercaseNode = parser.nextToken()

    parser.advanceAfterBlockEnd(uppercaseNode.value)

    const bodyNode = parser.parseUntilBlocks('enduppercase')

    parser.advanceAfterBlockEnd()

    return new nodes.CallExtension(this, 'run', undefined, [bodyNode])
  }

  this.run = function (environment, body) {
    const string = body()
    return new nunjucks.runtime.SafeString(string.toUpperCase())
  }
}
