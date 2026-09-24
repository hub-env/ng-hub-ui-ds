/**
 * Every opaque text role must be readable on both surfaces the package declares.
 *
 * WCAG 1.4.3 asks 4.5:1 of normal body text, and the package states that number
 * itself in `--hub-sys-text-contrast-min`, so the threshold is READ from the
 * sheet instead of repeated here: if the system ever revises its own minimum,
 * this guard follows it rather than contradicting it. The package declares no
 * large-text role, so the 3:1 tier has nothing to apply to.
 *
 * It reads the COMPILED sheet, `styles/tokens/hub-tokens.css`, because that is
 * the artifact consumers get — a value that looks right in SCSS and loses to the
 * cascade would still pass a source-level check.
 *
 * Themes and tokens are DISCOVERED from the sheet, so a new `[data-theme='x']`
 * or a new `--hub-sys-text-*` role comes under the guard with no edit here.
 *
 * Scope: the text ramp's OPAQUE roles. `--hub-sys-text-secondary` and
 * `-tertiary` are alpha over the theme's own ink by design, which makes their
 * ratio a property of whatever they are painted over rather than of a value the
 * package commits to; the advisory tier of `scripts/check-contrast.mjs` watches
 * those, along with links, accents and the focus ring. A token that resolves to
 * neither an opaque colour nor an alpha ramp fails here rather than being
 * skipped, so nothing leaves the guard quietly.
 *
 * Run: `npm test` from `projects/ds`.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import path from 'node:path';
import { describe, it } from 'node:test';

const SHEET = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'styles', 'tokens', 'hub-tokens.css');

/* ------------------------------------------------------------------
   Colour maths — WCAG 2.x relative luminance
   ------------------------------------------------------------------ */

const toLinear = (channel) => (channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);

const luminance = ({ r, g, b }) => 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);

const contrast = (fg, bg) => {
	const [a, b] = [luminance(fg), luminance(bg)];
	return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
};

/**
 * Parses the colour literals a token can end up as. Returns `null` for anything
 * else — a `color-mix()`, a bare keyword — which the caller then has to classify.
 */
function parseColor(value) {
	const src = value.trim().toLowerCase();

	if (/^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/.test(src)) {
		const h = src.slice(1);
		const digits = h.length <= 4 ? [...h].map((c) => c + c).join('') : h;
		const channel = (i) => parseInt(digits.slice(i, i + 2), 16) / 255;
		return { r: channel(0), g: channel(2), b: channel(4), a: digits.length === 8 ? channel(6) : 1 };
	}

	const rgb = src.match(/^rgba?\(([^)]+)\)$/);
	if (rgb) {
		const parts = rgb[1].split(/[,/\s]+/).filter(Boolean);
		const channel = (p) => (p.endsWith('%') ? parseFloat(p) / 100 : parseFloat(p) / 255);
		return {
			r: channel(parts[0]),
			g: channel(parts[1]),
			b: channel(parts[2]),
			a: parts[3] === undefined ? 1 : parseFloat(parts[3])
		};
	}

	if (src === 'white') return { r: 1, g: 1, b: 1, a: 1 };
	if (src === 'black') return { r: 0, g: 0, b: 0, a: 1 };

	return null;
}

/* ------------------------------------------------------------------
   Sheet → per-theme variable map
   ------------------------------------------------------------------ */

/**
 * Flat scan of the compiled sheet. Nothing in it nests, and document order is
 * what decides the cascade between `:root` and an equal-specificity
 * `[data-theme=…]`, so the blocks are kept in the order they are written.
 */
function parseBlocks(css) {
	const blocks = [];
	const rule = /([^{}]+)\{([^{}]*)\}/g;
	let match;

	while ((match = rule.exec(css.replace(/\/\*[\s\S]*?\*\//g, '')))) {
		const declarations = match[2]
			.split(';')
			.map((decl) => [decl.slice(0, decl.indexOf(':')).trim(), decl.slice(decl.indexOf(':') + 1).trim()])
			.filter(([prop]) => prop.startsWith('--'));

		if (declarations.length) {
			blocks.push({ selectors: match[1].split(',').map((s) => s.trim()), declarations });
		}
	}

	return blocks;
}

const themeOf = (selector) => selector.match(/^\[data-theme=['"]?([\w-]+)['"]?\]$/)?.[1] ?? null;

function appliesTo(selector, theme) {
	if (selector === ':root' || selector === 'html') return true;
	const named = themeOf(selector);
	return named ? named === theme || (theme === 'light' && named === 'base') : false;
}

function varsFor(blocks, theme) {
	const vars = new Map();

	for (const block of blocks) {
		if (!block.selectors.some((selector) => appliesTo(selector, theme))) continue;
		for (const [prop, value] of block.declarations) vars.set(prop, value);
	}

	return vars;
}

/**
 * Textual `var()` substitution, which is what a browser performs: a custom
 * property holds an unparsed token stream, so the fallback arm matters as much
 * as the value and only the final text is a colour.
 */
function substitute(value, vars, seen = new Set()) {
	let src = String(value).trim();

	for (let guard = 0; guard < 50 && src.includes('var('); guard++) {
		const at = src.indexOf('var(');
		let depth = 0;
		let end = -1;

		for (let i = at + 3; i < src.length; i++) {
			if (src[i] === '(') depth++;
			else if (src[i] === ')' && --depth === 0) {
				end = i;
				break;
			}
		}
		if (end < 0) break;

		const args = src.slice(at + 4, end);
		const comma = args.indexOf(',');
		const name = (comma < 0 ? args : args.slice(0, comma)).trim();
		const fallback = comma < 0 ? '' : args.slice(comma + 1).trim();
		const replacement =
			vars.has(name) && !seen.has(name) ? substitute(vars.get(name), vars, new Set(seen).add(name)) : fallback;

		src = src.slice(0, at) + replacement + src.slice(end + 1);
	}

	return src.trim();
}

/* ------------------------------------------------------------------
   The guard
   ------------------------------------------------------------------ */

const blocks = parseBlocks(readFileSync(SHEET, 'utf8'));

const themes = [...new Set(blocks.flatMap((b) => b.selectors.map(themeOf)).filter(Boolean))].filter((t) => t !== 'base');

const textTokens = [
	...new Set(
		blocks
			.flatMap((b) => b.declarations.map(([prop]) => prop))
			.filter((prop) => /^--hub-sys-(text|color-text)-/.test(prop) && prop !== '--hub-sys-text-contrast-min')
	)
].sort();

const MINIMUM = Number(substitute('var(--hub-sys-text-contrast-min)', varsFor(blocks, 'light')));

describe('text roles clear the contrast minimum the package declares', () => {
	it('discovers the themes, the text roles and the threshold from the sheet', () => {
		assert.ok(themes.length >= 2, `expected several themes in ${SHEET}, found ${themes.length}`);
		assert.ok(textTokens.length >= 2, `expected several text roles in ${SHEET}, found ${textTokens.length}`);
		assert.equal(MINIMUM, 4.5, '--hub-sys-text-contrast-min should state the WCAG AA minimum for body text');
	});

	for (const theme of themes) {
		const vars = varsFor(blocks, theme);
		const resolve = (token) => substitute(`var(${token})`, vars);
		const surfaces = [
			['surface-page', parseColor(resolve('--hub-sys-surface-page'))],
			['surface-elevated', parseColor(resolve('--hub-sys-surface-elevated'))]
		];

		for (const [name, surface] of surfaces) {
			it(`${theme}: --hub-sys-${name} resolves to an opaque colour`, () => {
				assert.ok(surface, `--hub-sys-${name} did not resolve to a colour on theme "${theme}"`);
				assert.equal(surface.a, 1, `--hub-sys-${name} must be opaque: text contrast over it is otherwise undefined`);
			});
		}

		for (const token of textTokens) {
			const value = resolve(token);
			const color = parseColor(value);

			// The alpha ramp is a deliberate non-value: it is whatever it is painted
			// over, so it is watched by the advisory tier, not asserted here.
			if (!color || color.a < 1) {
				it(`${theme}: ${token} is the declared alpha ramp, not an unreadable value`, () => {
					assert.match(
						value,
						/transparent/,
						`${token} resolved to "${value}" on theme "${theme}": neither an opaque colour nor an alpha ramp, so nothing measures it`
					);
				});
				continue;
			}

			for (const [name, surface] of surfaces) {
				it(`${theme}: ${token} on --hub-sys-${name}`, () => {
					const ratio = contrast(color, surface);
					assert.ok(
						ratio >= MINIMUM,
						`${token} (${value}) measures ${ratio.toFixed(2)}:1 on ${name} of theme "${theme}", under the ${MINIMUM}:1 minimum`
					);
				});
			}
		}
	}
});
