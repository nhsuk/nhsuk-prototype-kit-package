# NHS Prototype kit

This repo contains the code for the NHS Prototype kit is distributed as an npm package.

The code contains:

- an Express middleware app
- some useful default settings for Express
- some Nunjucks filters
- Nunjucks views, including a template

## Installing the kit

### Using the template repository

The simplest way to get started is to use the [NHS Prototype kit template repository](https://github.com/nhsuk/nhsuk-prototype-kit).

From there, select 'Use this as a template' and follow the instructions.

### Manual installation

You can also add the kit to an existing Express app by running:

```sh
npm install nhsuk-prototype-kit
```

Then, within your `app.js` file, add this line to the top:

```js
import NHSPrototypeKit from 'nhsuk-prototype-kit'
```

Or, if using CommonJS:

```cjs
const NHSPrototypeKit = require('nhsuk-prototype-kit')
```

Initialise the prototype with a reference to your custom routes like this:

```js
import routes from './app/routes.js'

const viewsPath = [
  join(__dirname, 'app/views/')
]

const prototype = NHSPrototypeKit.init({
  serviceName: 'Your service name',
  buildOptions: {
    entryPoints: ['assets/sass/*.scss']
  },
  routes,
  viewsPath
})
```

You can then start the prototype using this:

```js
prototype.start()
```

If you want to set session data defaults, or locals, pass them to the init function:

```js
import sessionDataDefaults from './app/data/session-data-defaults.js'
import locals from './app/locals.js'
import routes from './app/routes.js'

const viewsPath = [
  join(__dirname, 'app/views/')
]

const prototype = NHSPrototypeKit.init({
  serviceName: 'Your service name',
  buildOptions: {
    entryPoints: ['assets/sass/*.scss']
  },
  routes,
  locals,
  sessionDataDefaults,
  viewsPath
})
```

### Using the Nunjucks filters only

If you only want to use the Nunjucks filters, you can import them separately:

```js
import { nunjucksFilters } from 'nhsuk-prototype-kit'

nunjucksFilters.addAll(nunjucksEnv)
```

Or import individual filters:

```js
import { nunjucksFilters } from 'nhsuk-prototype-kit'

nunjucksEnv.addFilter('formatNhsNumber', nunjucksFilters.formatNhsNumber)
nunjucksEnv.addFilter('startsWith', nunjucksFilters.startsWith)
```

### Using the Express middleware only

If you only want to use the Express middleware, you can import it separately:

```js
import { middleware } from 'nhsuk-prototype-kit'

middleware.configure({
  app: app,
  serviceName: serviceName,
  locals: locals,
  routes: routes,
  sessionDataDefaults: sessionDataDefaults
})
```

Or you can choose to only use individual middleware functions:

```js
import { middleware } from 'nhsuk-prototype-kit'

app.use(middleware.autoRoutes)
```

### Using the utilities

You can also import the utility functions separately:

```js
import { utils } from 'nhsuk-prototype-kit'

const port = await utils.findAvailablePort(3000)
```
