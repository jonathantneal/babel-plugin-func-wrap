# babel-plugin-func-wrap [<img src="https://jonneal.dev/node-logo.svg" alt="Babel" width="90" height="90" align="right">][Babel]

[![NPM Version][npm-img]][npm-url]
[![Build Status][cli-img]][cli-url]
[![Support Chat][git-img]][git-url]

[babel-plugin-func-wrap] is a [Babel] plugin that lets you wrap the whole
script in a function, which can export as CommonJS, ES Modules, IIFE, or a
global variable. This can be helpful when transforming scripts with
immediately-executable code into something evocable.

```js
window.a = 1;

/* becomes (with args: ['window']) */

export default function (window) {
  window.a = 1;
}

/* becomes (with name: 'foo', args: ['window']) */

export function foo (window) {
  window.a = 1;
}

/* becomes (with format: 'cjs', args: ['window']) */

module.exports = function (window) {
  window.a = 1;
}

/* becomes (with format: 'cjs', name: 'foo', args: ['window']) */

exports.foo = function (window) {
  window.a = 1;
}
```

## Usage

Add [babel-plugin-func-wrap] to your project:

```bash
npm install babel-plugin-func-wrap --save-dev
```

Add [babel-plugin-func-wrap] to your Babel configuration:

```js
// babel.config.js
module.exports = {
  plugins: [
    'func-wrap'
  ]
}
```

Alternative, configure transformations within your Babel configuration:

```js
module.exports = {
  plugins: [
    ['func-wrap', {
      /* use a named export */
      name: 'library',

      /* assign arguments to the function */
      args: ['window'],
      
      /* export as CommonJS */
      format: 'cjs'
    }]
  ]
}
```

## Options

### args

The `args` option defines argument parameters passed into the wrapping function.

```js
{
  /* export default function (argA, argB, ...argC) {} */
  args: ['argA', 'argB', '...argC']
}
```

### format

The `format` option defines how the function is exported. The available options
are `esm` (default), `cjs`, `iife`, and `global`.

```js
{
  /* export default function () {} */
  format: 'esm'
}
```

```js
{
  /* module.exports = function () {} */
  format: 'cjs'
}
```

```js
{
  /* (function () {})() */
  format: 'iife'
}
```

```js
{
  /* window.$ = function () {} */
  format: 'global',
  name: 'window.$'
}
```

When using `global`, a `name` must always be specified.

### name

The `name` option defines the name of the export, which is otherwise `default`.

```js
{
  /* export function foo () {} */
  name: 'foo'
}
```

```js
{
  /* exports.foo = function () {} */
  format: 'cjs',
  name: 'foo'
}
```

[cli-img]: https://img.shields.io/travis/jonathantneal/babel-plugin-func-wrap.svg
[cli-url]: https://travis-ci.org/jonathantneal/babel-plugin-func-wrap
[git-img]: https://img.shields.io/badge/support-chat-blue.svg
[git-url]: https://gitter.im/postcss/postcss
[npm-img]: https://img.shields.io/npm/v/babel-plugin-func-wrap.svg
[npm-url]: https://www.npmjs.com/package/babel-plugin-func-wrap

[Babel]: https://babeljs.io/
[babel-plugin-func-wrap]: https://github.com/jonathantneal/babel-plugin-func-wrap
