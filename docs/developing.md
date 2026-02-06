# NHS prototype kit: Developing

To make development easier, this project comes with a test app that you can use to develop and test new features and changes.

To run the test app:

```sh
npm start --workspace testapp
```

## Node.js module types

To run the test app via ES module:

```sh
npm exec --workspace testapp -- node app.js
```

To run the test app via CommonJS module:

```sh
npm exec --workspace testapp -- node app.cjs
```
