/**
 * The derived roles must be declared on every theme root, not on `:root` alone.
 *
 * A custom property resolves its `var()` on the element that declares it, and
 * descendants inherit the resolved value. A family declared only on `:root` is
 * therefore computed from the light inputs once, and a `[data-theme='dark']`
 * subtree inherits it unchanged: dark ink on a dark surface. The guard reads the
 * compiled sheet and checks that every block declaring a derived role also
 * matches `[data-theme]`.
 *
 * Run: `npm test` from `projects/ds`.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import path from 'node:path';
import { describe, it } from 'node:test';

const SHEET = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'styles', 'tokens', 'hub-tokens.css');

const css = readFileSync(SHEET, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
const blocks = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map(([, selectors, body]) => ({
	selectors: selectors.split(',').map((s) => s.trim()),
	props: [...body.matchAll(/(--[\w-]+)\s*:/g)].map(([, prop]) => prop)
}));

// The accents are the names that carry an `-emphasis`; their family is what `hub-color-derive()` emits.
const accents = new Set(
	blocks
		.flatMap((b) => b.props)
		.map((p) => p.match(/^--hub-sys-color-([\w-]+)-emphasis$/)?.[1])
		.filter(Boolean)
);
const DERIVED = new RegExp(
	`^--hub-sys-(color-(${[...accents].join('|')})-(subtle|border-subtle|emphasis|on)|text-body[\\w-]*)$`
);

describe('derived roles follow a theme applied to a subtree', () => {
	const declaring = blocks.filter((block) => block.props.some((prop) => DERIVED.test(prop)));

	it('declares the derived roles somewhere', () => {
		assert.ok(declaring.length > 0);
	});

	// A theme's own block may override a role for itself; a :root block must reach every theme.
	for (const block of declaring.filter((b) => b.selectors.includes(':root'))) {
		it(`${block.selectors.join(', ')} also matches every [data-theme]`, () => {
			assert.ok(
				block.selectors.includes('[data-theme]'),
				'a derived role declared on :root alone keeps the light value inside a themed subtree'
			);
		});
	}
});
