/**
 * The glass layer is opt-in and must degrade to opaque.
 *
 * Reads the COMPILED sheets, the artifact consumers get. Checks that the knobs
 * live on `:root` with their defaults, that the derived values exist only on a
 * glass surface (a derived value on `:root` would turn every theme translucent),
 * that the accessibility and `@supports` fallbacks reset the right values, and
 * that the glass theme and the page backdrop are wired.
 *
 * Run: `npm test` from `projects/ds`.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import path from 'node:path';
import { describe, it } from 'node:test';

const STYLES = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'styles');
const read = (file) => readFileSync(path.join(STYLES, file), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');

const tokens = read('tokens/hub-tokens.css');
const reset = read('base/reset.css');

const SURFACE = [
	'[data-hub-glass] .hub-glass-surface',
	'.hub-glass-surface[data-hub-glass]',
	'[data-theme=glass] .hub-glass-surface'
];

/** Declarations of a flat block, as a name -> value map. */
const declarations = (body) => new Map([...body.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].map(([, k, v]) => [k, v.trim()]));

/** Every flat `selectors { body }` block found in `source`, including those nested one level in an at-rule. */
const blocksOf = (source) =>
	[...source.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map(([, selectors, body]) => ({
		selectors: selectors.split(',').map((s) => s.trim()),
		vars: declarations(body)
	}));

const blocks = blocksOf(tokens);
const onSurface = (b) => SURFACE.every((s) => b.selectors.includes(s));
const surfaceBlocks = blocks.filter(onSurface);
const root = blocks.filter((b) => b.selectors.includes(':root'));
const rootValue = (name) => root.map((b) => b.vars.get(name)).find((v) => v !== undefined);

describe('glass layer', () => {
	it('does not let a surface inherit the pointer position of the surface around it', () => {
		const block = surfaceBlocks.find((b) => b.vars.has('--hub-sys-glass-opacity'));
		assert.equal(block.vars.get('--hub-glass-light-x'), 'initial');
		assert.equal(block.vars.get('--hub-glass-light-y'), 'initial');
	});

	it('keeps the sheen out of sight while no pointer is over the surface', () => {
		const sheen = surfaceBlocks.map((b) => b.vars.get('--hub-sys-glass-sheen')).find(Boolean);
		// Resting at the top edge, every surface showed a glow beside the one under the pointer.
		assert.match(sheen, /var\(--hub-glass-light-y,\s*calc\(-1 \* var\(--hub-sys-glass-light-size\)\)\)/);
	});

	it('declares the knobs on :root with their defaults', () => {
		const defaults = {
			'--hub-sys-glass-strength': '0.5',
			'--hub-sys-glass-saturate': '1.4',
			'--hub-sys-glass-rim-strength': '0.5',
			'--hub-sys-glass-rim-color': '#ffffff',
			'--hub-sys-glass-light-strength': '0',
			'--hub-sys-glass-light-color': '#ffffff',
			'--hub-sys-glass-light-size': '16rem',
			'--hub-sys-page-backdrop': 'none'
		};
		for (const [name, value] of Object.entries(defaults)) assert.equal(rootValue(name), value, name);
	});

	it('derives the surface values only on a glass surface, never on :root', () => {
		const derived = ['opacity', 'inner-opacity', 'veil', 'gloss', 'blur', 'filter', 'rim', 'sheen'].map(
			(n) => `--hub-sys-glass-${n}`
		);
		const main = surfaceBlocks[0];
		assert.ok(main, 'glass surface block not found');
		for (const name of derived) {
			assert.ok(main.vars.has(name), `${name} missing on the glass surface`);
			assert.equal(rootValue(name), undefined, `${name} must not be declared on :root`);
		}
		assert.equal(main.vars.get('--hub-sys-glass-inner-opacity'), '0%');
	});

	it('resets the translucent values when transparency is reduced, contrast is more or colours are forced', () => {
		const media = tokens.match(
			/@media \(prefers-reduced-transparency: reduce\), \(prefers-contrast: more\), \(forced-colors: active\) \{([\s\S]*?\n\s*\})\s*\n\}/
		);
		assert.ok(media, 'accessibility media block not found');
		const vars = blocksOf(media[1]).find(onSurface)?.vars;
		assert.ok(vars, 'media block does not target the glass surface');
		assert.deepEqual(Object.fromEntries(vars), {
			'--hub-sys-glass-opacity': '100%',
			'--hub-sys-glass-inner-opacity': '100%',
			'--hub-sys-glass-veil': 'transparent',
			'--hub-sys-glass-gloss': 'none',
			'--hub-sys-glass-filter': 'none',
			'--hub-sys-glass-sheen': 'none'
		});
	});

	it('resets opacity and filter where backdrop-filter is unsupported', () => {
		const supports = tokens.match(/@supports not \(\(backdrop-filter[^{]*\{([\s\S]*?\n\s*\})\s*\n\}/);
		assert.ok(supports, '@supports block not found');
		const vars = blocksOf(supports[1]).find(onSurface)?.vars;
		assert.ok(vars, '@supports block does not target the glass surface');
		assert.deepEqual(Object.fromEntries(vars), {
			'--hub-sys-glass-opacity': '100%',
			'--hub-sys-glass-inner-opacity': '100%',
			'--hub-sys-glass-filter': 'none'
		});
	});

	it('the glass theme sets strength, light and a page backdrop', () => {
		const theme = blocks.find((b) => b.selectors.includes('[data-theme=glass]') && b.vars.has('--hub-sys-glass-strength'));
		assert.ok(theme, 'glass theme block not found');
		assert.equal(theme.vars.get('--hub-sys-glass-strength'), '0.6');
		assert.equal(theme.vars.get('--hub-sys-glass-light-strength'), '0.18');
		assert.equal(theme.vars.get('--hub-sys-page-backdrop')?.match(/radial-gradient\(/g)?.length, 3);
	});

	it('the reset paints the page backdrop on the body', () => {
		assert.match(reset, /background-image:\s*var\(--hub-sys-page-backdrop,\s*none\)/);
		assert.match(reset, /background-attachment:\s*fixed/);
	});
});
