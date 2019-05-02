const babel = require('@babel/core');
const babelPluginTransformGlobals = require('.');

function test (name, sourceCode, expectCode, options, errorMessage) {
	/* eslint-disable no-console */

	console.log(name);

	let resultCode;

	try {
		resultCode = babel.transformSync(sourceCode, {
			plugins: [
				[ babelPluginTransformGlobals, options ]
			]
		}).code;
	} catch (error) {
		if (error.message === errorMessage) {
			console.log('  PASSED');

			return;
		} else {
			console.log('  FAILED');
			console.log('Expected error:', JSON.stringify(errorMessage));
			console.log('Recieved error:', JSON.stringify(error.message));
			console.log({ errorMessage });

			process.exit(1);
		}
	}

	if (expectCode === resultCode) {
		console.log('  PASSED');
	} else {
		console.log('  FAILED');
		console.log('Expected:', JSON.stringify(expectCode));
		console.log('Recieved:', JSON.stringify(resultCode));

		process.exit(1);
	}
}

test(
	'babel-plugin-func-wrap',
	`window.a = 1;`,
	`export default function () {\n  window.a = 1;\n}`
);

test(
	'babel-plugin-func-wrap: args',
	`window.a = 1;`,
	`export default function (argA, argB) {\n  window.a = 1;\n}`,
	{
		args: ['argA', 'argB']
	}
);

test(
	'babel-plugin-func-wrap: name + args',
	`window.a = 1;`,
	`export function foo(argA, argB) {\n  window.a = 1;\n}`,
	{
		name: 'foo',
		args: ['argA', 'argB']
	}
);

test(
	'babel-plugin-func-wrap: name + cjs + args',
	`window.a = 1;`,
	`exports.foo = function (argA, argB) {\n  window.a = 1;\n};`,
	{
		name: 'foo',
		args: ['argA', 'argB'],
		format: 'cjs'
	}
);

test(
	'babel-plugin-func-wrap: args spread',
	`window.a = 1;`,
	`exports.foo = function (argA, argB, ...argC) {\n  window.a = 1;\n};`,
	{
		name: 'foo',
		args: ['argA', 'argB', '...argC'],
		format: 'cjs'
	}
);

test(
	'babel-plugin-func-wrap: iife',
	`window.a = 1;`,
	`(function () {\n  window.a = 1;\n})();`,
	{
		format: 'iife'
	}
);

test(
	'babel-plugin-func-wrap: iife + name',
	`window.a = 1;`,
	`window.library = function () {\n  window.a = 1;\n}();`,
	{
		format: 'iife',
		name: 'window.library'
	}
);

test(
	'babel-plugin-func-wrap: global',
	`window.a = 1;`,
	`window.a = 1;`,
	{
		format: 'global'
	},
	`[BABEL] unknown: The "global" option requires a "name" (While processing: "base$0")`
);

test(
	'babel-plugin-func-wrap: global + name',
	`window.a = 1;`,
	`window.library = function () {\n  window.a = 1;\n};`,
	{
		format: 'global',
		name: 'window.library'
	}
);

test(
	'babel-plugin-func-wrap: existing named export function',
	`export default function foo() {}; foo.more = null`,
	`export default function () {\n  function foo() {}\n\n  ;\n  foo.more = null;\n  return foo;\n}`
);

test(
	'babel-plugin-func-wrap: existing unnamed export function',
	`export default function () {}; const more = null`,
	`export default function () {\n  function _default() {}\n\n  ;\n  const more = null;\n  return _default;\n}`
);

test(
	'babel-plugin-func-wrap: existing unnamed export function (unique id test)',
	`export default function () { return _default }; const more = null`,
	`export default function () {\n  function _default2() {\n    return _default;\n  }\n\n  ;\n  const more = null;\n  return _default2;\n}`
);

test(
	'babel-plugin-func-wrap: existing named export class',
	`export default class Foo {}; Foo.more = null`,
	`export default function () {\n  class Foo {}\n\n  ;\n  Foo.more = null;\n  return Foo;\n}`
);

test(
	'babel-plugin-func-wrap: existing unnamed export class',
	`export default class {}; const more = null`,
	`export default function () {\n  class _default {}\n\n  ;\n  const more = null;\n  return _default;\n}`
);

test(
	'babel-plugin-func-wrap: default export object',
	`export default {}; const more = null`,
	`export default function () {\n  const _default = {};\n  const more = null;\n  return _default;\n}`
);

test(
	'babel-plugin-func-wrap: default export string',
	`export default 'st'; const more = null`,
	`export default function () {\n  const _default = 'st';\n  const more = null;\n  return _default;\n}`
);

test(
	'babel-plugin-func-wrap: default export variable',
	`export default _default; const more = null`,
	`export default function () {\n  const _default2 = _default;\n  const more = null;\n  return _default2;\n}`
);

process.exit(0);
