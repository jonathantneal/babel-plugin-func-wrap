import template from '@babel/template';

import {
	templateCjsDefault,
	templateCjsNamed,
	templateEsmDefault,
	templateEsmNamed,
	templateGlobalDefault,
	templateGlobalNamed,
	templateIifeDefault,
	templateIifeNamed
} from './lib/templates';

export default function babelPluginTransformGlobals (api, opts) {
	const { types: t } = api;
	const run = [];

	// options
	const args = [].concat(opts.args || []).map(
		arg => t.identifier(arg)
	);
	const name = 'name' in opts ? String(opts.name) : 'default';
	const format = ['cjs', 'esm', 'iife', 'global'].find(format => format === opts.format);

	const buildTemplate = template(
		name === 'default'
			? format === 'cjs'
				? templateCjsDefault
			: format === 'iife'
				? templateIifeDefault
			: format === 'global'
				? templateGlobalDefault
			: templateEsmDefault
		: format === 'cjs'
			? templateCjsNamed
		: format === 'iife'
			? templateIifeNamed
		: format === 'global'
			? templateGlobalNamed
		: templateEsmNamed
	);

	if (name === 'default' && format === 'global') {
		throw Error('The "global" option requires a "name"');
	}

	return {
		name: 'func-wrap',
		visitor: {
			ExportDefaultDeclaration (path) {
				if (!run.includes(this)) {
					const replacableExport = (
						t.isClassDeclaration(path.node.declaration) ||
						t.isFunctionDeclaration(path.node.declaration)
					);

					// transform `export default class {} /* more */`
					// into `class _default {}; /* more */ return _default`, or

					// transform `export default class Cl {} /* more */`
					// into `class Cl {}; /* more */ return Cl`, or

					// transform `export default function () {} /* more */`
					// into `function _default () {}; /* more */ return _default`, or

					// transform `export default function fn () {} /* more */`
					// into `function fn () {}; /* more */ return fn`

					if (replacableExport) {
						let name = path.node.declaration.id && path.node.declaration.id.name;

						// transform `function () {}` into `function _default () {}`, or
						// transform `class {}` into `class _default {}`
						if (!name) {
							path.node.declaration.id = path.scope.generateUidIdentifier('default');

							name = path.node.declaration.id.name;
						}

						if (name) {
							path.replaceWith(path.node.declaration);

							path.parentPath.pushContainer('body',
								t.returnStatement(
									t.identifier(name)
								)
							);
						}
					}

					else if (path.node.declaration) {
						// transform `export default {} /* more */`
						// into `const _default = {}; /* more */ return _default`

						const identifier = path.scope.generateUidIdentifier('default');
						const { name } = identifier;

						const variableDeclaration = t.variableDeclaration(
							'const',
							[t.variableDeclarator(
								identifier,
								path.node.declaration
							)]
						);

						const returnStatement = t.returnStatement(
							t.identifier(name)
						);

						path.replaceWith(variableDeclaration);

						path.parentPath.pushContainer('body', returnStatement);
					}
				}
			},
			Program: {
				exit (path) {
					if (!run.includes(this)) {
						run.push(this);

						const { body } = path.node;

						const templateOptions = name === 'default'
							? { body, args }
						: { name, body, args };

						const ast = buildTemplate(templateOptions);

						// wrap the whole script in a function
						path.replaceWith(
							t.program([ ast ])
						);
					}
				}
			}
		}
	}
}
