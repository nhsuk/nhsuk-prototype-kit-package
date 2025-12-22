# NHS Prototype kit

This repo contains the code for the NHS Prototype kit that will be distributed as an npm package.

The code contains:

- an Express middleware app
- some useful default settings for Express
- some Nunjucks filters
- Nunjucks views, including a template

## Installing the kit

### Using the template repository

The simplest way to get started is to use the [NHS Prototype kit template repository](https://github.com/nhsuk/nhsuk-prototype-kit-package/pull/2).

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

```js
const NHSPrototypeKit = require('nhsuk-prototype-kit')
```

Initialise the prototype with a reference to your custom routes like this:

```js
import routes from './routes.js'

const prototype = NHSPrototypeKit.init({
  serviceName: 'Your service name',
  buildOptions: {
    entryPoints: ['assets/sass/*.scss']
  },
  routes
})
```

You can then start the prototype using this:

```js
prototype.start()
```

If you want to set session data defaults, or locals, pass them to the init function:

```js
import sessionDataDefaults from './data/session-data-defaults.js'
import locals from './locals.js'
import routes from './routes.js'

const prototype = NHSPrototypeKit.init({
  serviceName: 'Your service name',
  buildOptions: {
    entryPoints: ['assets/sass/*.scss']
  },
  routes,
  locals,
  sessionDataDefaults
})

### Using the Nunjucks filters only

If you only want to use the Nunjucks filters, you can use this:

```js
NHSPrototypeKit.nunjucksFilters.addAll(nunjucksEnv)
```

### Using the Express middleware only

If you only want to use the Express middleware, you can do this to use everything:

```js
NHSPrototypeKit.middleware.configure({
  app: app,
  serviceName: serviceName,
  locals: locals,
  routes: routes,
  sessionDataDefaults: sessionDataDefaults
}))
```

Or you can choose to only use individual middleware functions like this:

```js
app.use(NHSPrototypeKit.middleware.autoRoutes)
```
