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
			Program: {
				exit (path) {
					if (!run.includes(this)) {
						run.push(this);

						const { body } = path.node;

						const templateOptions = name === 'default'
							? { body, args }
						: { name, body, args };

						const ast = buildTemplate(templateOptions);

						path.replaceWith(
							t.program([ ast ])
						);
					}
				}
			}
		}
	}
}
