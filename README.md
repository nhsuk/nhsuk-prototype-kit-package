# NHS Prototype kit

This repo contains the code for the NHS Prototype kit that will be distributed as an npm package.

The code contains a set of Express middleware and some Nunjucks filters.

## Installing the kit

### Using the template repository

The simplest way to get started is to use the [NHS Prototype kit template repository](https://github.com/nhsuk/nhsuk-prototype-kit-package/pull/2).

From there, select 'Use this as a template' and follow the instructions.

### Manual installation

You can also add the kit to an existing Express app by running:

```
npm install nhsuk-prototype-kit
```

Then, within your `app.js` file, add this line to the top:

```js
const NHSPrototypeKit = require('nhsuk-prototype-kit')
```

and then after your app and nunjucks configuration code, add this:

```js
NHSPrototypeKit.init(app, nunjucksAppEnv)
```

### Using the Nunjucks filters only

If you only want to use the Nunjucks filters, you can use this:

```js
NHSPrototypeKit.nunjucksFilters.addAll(nunjucksEnv)
```
