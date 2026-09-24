#!/usr/bin/env node
/**
 * Contrast guard for the shipped token defaults.
 *
 * Every accent, link, focus ring and control border this package ships is
 * measured against both surfaces of every built-in theme, and the run fails if
 * one drops under the WCAG threshold for its role. It reads the COMPILED sheet,
 * `styles/tokens/hub-tokens.css`, because that is the artifact consumers get —
 * a rule that looks right in SCSS and loses to the cascade would still pass a
 * source-level check.
 *
 * Themes and accents are discovered from the sheet, not listed here: adding
 * `[data-theme='x']` or a tenth accent puts it under the guard with no edit.
 *
 *   node scripts/check-contrast.mjs          # required checks, exits 1 on failure
 *   node scripts/check-contrast.mjs --all    # also prints the advisory tier
 *
 * The advisory tier covers roles the library knowingly ships below the bar —
 * the decorative hairline, the de-emphasis text ramp, a solid accent's own
 * boundary. They are printed so a regression is visible, and they do not fail
 * the build; promoting one means fixing the token first.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

/* ============================================================
   Colour maths
   ============================================================ */

const toLinear = (v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const toGamma = (v) => (v <= 0.0031308 ? v * 12.92 : 1.055 * v ** (1 / 2.4) - 0.055);

function linearToOklab([r, g, b]) {
	const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
	const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
	const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
	return [
		0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
		1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
		0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s
	];
}

function oklabToLinear([L, a, b]) {
	const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
	const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
	const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
	return [
		4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
		-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
		-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s
	];
}

const inGamut = ([r, g, b]) => r >= -1e-5 && r <= 1 + 1e-5 && g >= -1e-5 && g <= 1 + 1e-5 && b >= -1e-5 && b <= 1 + 1e-5;
const clipLinear = (rgb) => rgb.map((v) => Math.min(1, Math.max(0, v)));

/**
 * oklch() → sRGB the way a browser does it: CSS Color 4 gamut mapping, holding
 * lightness and hue and bisecting chroma down until the clipped result is
 * within deltaEOK 0.02. Plain clipping would report a luminance nothing paints,
 * which for a guard means passing a colour the user cannot read.
 */
function oklchToSrgb([L, C, H]) {
	if (L >= 1) return [1, 1, 1];
	if (L <= 0) return [0, 0, 0];
	const hr = (H * Math.PI) / 180;
	const lab = (c) => [L, c * Math.cos(hr), c * Math.sin(hr)];
	if (inGamut(oklabToLinear(lab(C)))) return clipLinear(oklabToLinear(lab(C))).map(toGamma);

	let lo = 0;
	let hi = C;
	while (hi - lo > 1e-4) {
		const mid = (lo + hi) / 2;
		const candidate = oklabToLinear(lab(mid));
		if (inGamut(candidate)) {
			lo = mid;
			continue;
		}
		const clipped = clipLinear(candidate);
		const target = lab(mid);
		const [dL, da, db] = linearToOklab(clipped).map((v, i) => v - target[i]);
		if (Math.hypot(dL, da, db) < 0.02) return clipped.map(toGamma);
		hi = mid;
	}
	return clipLinear(oklabToLinear(lab(lo))).map(toGamma);
}

function srgbToOklch([r, g, b]) {
	const [L, a, bb] = linearToOklab([toLinear(r), toLinear(g), toLinear(b)]);
	const C = Math.hypot(a, bb);
	let H = (Math.atan2(bb, a) * 180) / Math.PI;
	if (H < 0) H += 360;
	return [L, C, C < 1e-6 ? 0 : H];
}

/* ============================================================
   CSS value parsing
   ============================================================ */

const NAMED = { transparent: { r: 0, g: 0, b: 0, a: 0 }, white: { r: 1, g: 1, b: 1, a: 1 }, black: { r: 0, g: 0, b: 0, a: 1 } };

function parseHex(s) {
	let h = s.slice(1);
	if (h.length === 3 || h.length === 4) h = [...h].map((c) => c + c).join('');
	const n = (i) => parseInt(h.slice(i, i + 2), 16) / 255;
	return { r: n(0), g: n(2), b: n(4), a: h.length === 8 ? n(6) : 1 };
}

/** Splits on top-level separators, ignoring anything inside parentheses. */
function splitTop(src, sep = ',') {
	const out = [];
	let depth = 0;
	let buf = '';
	for (const ch of src) {
		if (ch === '(') depth++;
		if (ch === ')') depth--;
		if (depth === 0 && ch === sep) {
			out.push(buf.trim());
			buf = '';
			continue;
		}
		buf += ch;
	}
	if (buf.trim()) out.push(buf.trim());
	return out;
}

/** Reads `name(…)` at the head of `src` and returns its raw argument text. */
function fnArgs(src, name) {
	const head = `${name}(`;
	if (!src.toLowerCase().startsWith(head)) return null;
	let depth = 0;
	for (let i = head.length - 1; i < src.length; i++) {
		if (src[i] === '(') depth++;
		else if (src[i] === ')' && --depth === 0) return src.slice(head.length, i);
	}
	return null;
}

/**
 * Textual var() substitution, which is what the browser performs: a custom
 * property holds an unparsed token stream, so `clamp(var(--a), l, var(--b))`
 * only becomes numbers once its var()s are spliced in. Resolving a var() as a
 * colour would never see the channel arithmetic it sits inside.
 */
function substituteVars(value, vars, seen = new Set()) {
	let src = String(value).trim().replace(/\s+/g, ' ');
	for (let guard = 0; guard < 50 && src.includes('var('); guard++) {
		const at = src.indexOf('var(');
		const args = fnArgs(src.slice(at), 'var');
		if (args === null) break;
		const [name, ...rest] = splitTop(args);
		const replacement =
			vars.has(name) && !seen.has(name) ? substituteVars(vars.get(name), vars, new Set(seen).add(name)) : rest.join(', ');
		src = src.slice(0, at) + replacement + src.slice(at + `var(${args})`.length);
	}
	return src.trim();
}

/** Evaluates the arithmetic a relative-colour channel slot may carry. */
function evalChannel(expr, ch) {
	const src = expr.trim();
	const clamp = fnArgs(src, 'clamp');
	if (clamp !== null) {
		const [lo, val, hi] = splitTop(clamp).map((p) => evalChannel(p, ch));
		return Math.min(Math.max(val, lo), hi);
	}
	for (const [name, fn] of [
		['min', Math.min],
		['max', Math.max]
	]) {
		const args = fnArgs(src, name);
		if (args !== null) return fn(...splitTop(args).map((p) => evalChannel(p, ch)));
	}
	const calc = fnArgs(src, 'calc');
	if (calc !== null) return evalChannel(calc, ch);
	if (src.startsWith('(') && src.endsWith(')')) return evalChannel(src.slice(1, -1), ch);

	const js = src.replace(/\bl\b/g, `(${ch.l})`).replace(/\bc\b/g, `(${ch.c})`).replace(/\bh\b/g, `(${ch.h})`);
	if (!/^[-+*/(). 0-9]+$/.test(js)) throw new Error(`unsupported channel expression: ${expr}`);
	return Function(`"use strict";return (${js})`)();
}

/** color-mix() interpolation with premultiplied alpha, per CSS Color 5. */
function mix(space, a, pa, b, pb) {
	let wa = pa;
	let wb = pb;
	if (wa === null && wb === null) ((wa = 0.5), (wb = 0.5));
	else if (wa === null) wa = 1 - wb;
	else if (wb === null) wb = 1 - wa;
	const sum = wa + wb;
	const alphaScale = sum < 1 ? sum : 1;
	wa /= sum;
	wb /= sum;

	const alpha = a.a * wa + b.a * wb;
	if (alpha === 0) return { r: 0, g: 0, b: 0, a: 0 };

	if (space === 'oklch') {
		const A = srgbToOklch([a.r, a.g, a.b]);
		const B = srgbToOklch([b.r, b.g, b.b]);
		// A transparent or achromatic side has a powerless hue: carry the other's,
		// or 12% of an accent over white comes out on the opposite side of the wheel.
		const powerless = (col, oklch) => col.a === 0 || oklch[1] < 1e-4;
		const hA = powerless(a, A) ? B[2] : A[2];
		const hB = powerless(b, B) ? A[2] : B[2];
		let dh = hB - hA;
		if (dh > 180) dh -= 360;
		if (dh < -180) dh += 360;
		const L = (A[0] * a.a * wa + B[0] * b.a * wb) / alpha;
		const C = (A[1] * a.a * wa + B[1] * b.a * wb) / alpha;
		const [r, g, bl] = oklchToSrgb([L, C, hA + (dh * (b.a * wb)) / alpha]);
		return { r, g, b: bl, a: alpha * alphaScale };
	}
	const ch = (k) => (a[k] * a.a * wa + b[k] * b.a * wb) / alpha;
	return { r: ch('r'), g: ch('g'), b: ch('b'), a: alpha * alphaScale };
}

function resolveColor(value, vars) {
	const src = substituteVars(value, vars);
	if (!src) return null;

	const lower = src.toLowerCase();
	if (lower in NAMED) return { ...NAMED[lower] };
	if (src.startsWith('#')) return parseHex(src);

	for (const fn of ['rgb', 'rgba']) {
		const args = fnArgs(src, fn);
		if (args === null) continue;
		const parts = (args.includes(',') ? splitTop(args) : splitTop(args.replace('/', ','), ' ')).flatMap((p) =>
			p.includes('/') ? p.split('/').map((x) => x.trim()) : [p]
		);
		const num = (p) => (p.endsWith('%') ? parseFloat(p) / 100 : parseFloat(p) / 255);
		return { r: num(parts[0]), g: num(parts[1]), b: num(parts[2]), a: parts[3] === undefined ? 1 : parseFloat(parts[3]) };
	}

	const mixArgs = fnArgs(src, 'color-mix');
	if (mixArgs !== null) {
		const [spaceDecl, first, second] = splitTop(mixArgs);
		const side = (part) => {
			const bits = splitTop(part, ' ');
			const pct = bits.length > 1 && bits[bits.length - 1].endsWith('%') ? parseFloat(bits.pop()) / 100 : null;
			return [resolveColor(bits.join(' '), vars), pct];
		};
		const [ca, pa] = side(first);
		const [cb, pb] = side(second);
		if (!ca || !cb) return null;
		return mix(spaceDecl.trim().split(/\s+/)[1] === 'oklch' ? 'oklch' : 'srgb', ca, pa, cb, pb);
	}

	const oklchArgs = fnArgs(src, 'oklch');
	if (oklchArgs !== null) {
		const body = oklchArgs.trim();
		if (!body.toLowerCase().startsWith('from ')) {
			const [r, g, b] = oklchToSrgb(splitTop(body, ' ').map(parseFloat));
			return { r, g, b, a: 1 };
		}
		const parts = splitTop(body.slice(5).trim(), ' ');
		// The origin colour may itself be a function carrying spaces; the three
		// channel slots are always the last three tokens.
		const originEnd = parts.length - 3;
		const origin = resolveColor(parts.slice(0, originEnd).join(' '), vars);
		if (!origin) return null;
		const [l, c, h] = srgbToOklch([origin.r, origin.g, origin.b]);
		const [r, g, b] = oklchToSrgb(parts.slice(originEnd).map((p) => evalChannel(p, { l, c, h })));
		return { r, g, b, a: origin.a };
	}

	return null;
}

const over = (fg, bg) => ({
	r: fg.r * fg.a + bg.r * (1 - fg.a),
	g: fg.g * fg.a + bg.g * (1 - fg.a),
	b: fg.b * fg.a + bg.b * (1 - fg.a),
	a: 1
});

const luminance = ({ r, g, b }) => 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);

function contrast(fg, bg) {
	const f = luminance(fg.a < 1 ? over(fg, bg) : fg);
	const b = luminance(bg);
	return (Math.max(f, b) + 0.05) / (Math.min(f, b) + 0.05);
}

const hex = ({ r, g, b }) =>
	'#' +
	[r, g, b]
		.map((v) =>
			Math.round(Math.min(1, Math.max(0, v)) * 255)
				.toString(16)
				.padStart(2, '0')
		)
		.join('');

/* ============================================================
   Sheet → per-theme variable map
   ============================================================ */

/**
 * Flat scan of the compiled sheet. Nothing in it nests, and document order is
 * what decides the cascade between `:root` and an equal-specificity
 * `[data-theme=…]`, so the blocks are kept in the order they are written.
 */
function parseBlocks(css) {
	const clean = css.replace(/\/\*[\s\S]*?\*\//g, '');
	const blocks = [];
	const re = /([^{}]+)\{([^{}]*)\}/g;
	let m;
	while ((m = re.exec(clean))) {
		const selectors = m[1]
			.split(',')
			.map((s) => s.trim())
			.filter(Boolean);
		const declarations = [];
		for (const decl of m[2].split(';')) {
			const i = decl.indexOf(':');
			if (i < 0) continue;
			const prop = decl.slice(0, i).trim();
			if (prop.startsWith('--')) declarations.push([prop, decl.slice(i + 1).trim()]);
		}
		if (declarations.length) blocks.push({ selectors, declarations });
	}
	return blocks;
}

const themeOf = (selector) => selector.match(/^\[data-theme=['"]?([\w-]+)['"]?\]$/)?.[1] ?? null;

function matches(selector, theme) {
	if (selector === ':root' || selector === 'html') return true;
	const t = themeOf(selector);
	return t ? t === theme || (theme === 'light' && t === 'base') : false;
}

function themeVars(blocks, theme) {
	const vars = new Map();
	for (const block of blocks) {
		if (!block.selectors.some((s) => matches(s, theme))) continue;
		for (const [prop, value] of block.declarations) vars.set(prop, value);
	}
	return vars;
}

/* ============================================================
   The checks
   ============================================================ */

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SHEET = path.join(HERE, '..', 'styles', 'tokens', 'hub-tokens.css');
const SHOW_ALL = process.argv.includes('--all');

const blocks = parseBlocks(readFileSync(SHEET, 'utf8'));
const themes = [
	'light',
	...new Set(blocks.flatMap((b) => b.selectors.map(themeOf)).filter((t) => t && t !== 'light' && t !== 'base'))
];
const accents = [
	...new Set(
		blocks
			.flatMap((b) => b.declarations.map(([prop]) => prop.match(/^--hub-sys-color-([a-z0-9-]+)-emphasis$/)?.[1]))
			.filter(Boolean)
	)
];

const required = [];
const advisory = [];

for (const theme of themes) {
	const vars = themeVars(blocks, theme);
	const get = (token) => resolveColor(`var(${token})`, vars);
	const surfaces = [
		['surface-page', get('--hub-sys-surface-page')],
		['surface-elevated', get('--hub-sys-surface-elevated')]
	];

	const against = (bucket, token, min, why) => {
		const color = get(token);
		if (!color) {
			bucket.push({ theme, token, surface: '—', value: 'unresolved', ratio: 0, min, why, pass: false });
			return;
		}
		for (const [name, surface] of surfaces) {
			const ratio = contrast(color, surface);
			bucket.push({
				theme,
				token,
				surface: name,
				value: hex(color.a < 1 ? over(color, surface) : color),
				ratio,
				min,
				why,
				pass: ratio >= min
			});
		}
	};

	// 1.4.3 — anything painted as text over a surface the package defines.
	for (const accent of accents) against(required, `--hub-sys-color-${accent}-emphasis`, 4.5, 'text on surface');
	against(required, '--hub-sys-link-color', 4.5, 'text on surface');
	against(required, '--hub-sys-link-hover-color', 4.5, 'text on surface');
	against(required, '--hub-sys-text-primary', 4.5, 'text on surface');

	// 1.4.11 — non-text: the focus indicator and an interactive control's boundary.
	against(required, '--hub-sys-focus-ring-color', 3, 'focus indicator');
	against(required, '--hub-sys-border-color-strong', 3, 'control boundary');

	// Advisory: known-below-bar roles, watched so a regression is at least visible.
	against(advisory, '--hub-sys-border-color-default', 3, 'decorative hairline');
	against(advisory, '--hub-sys-text-secondary', 4.5, 'de-emphasis ramp');
	against(advisory, '--hub-sys-text-muted', 4.5, 'de-emphasis ramp');
	against(advisory, '--hub-sys-text-tertiary', 4.5, 'de-emphasis ramp');
	for (const accent of accents) {
		against(advisory, `--hub-sys-color-${accent}`, 3, 'solid accent boundary');
		const base = get(`--hub-sys-color-${accent}`);
		const on = get(`--hub-sys-color-${accent}-on`);
		if (!base || !on) continue;
		const ratio = contrast(on, base);
		advisory.push({
			theme,
			token: `--hub-sys-color-${accent}-on`,
			surface: `accent ${hex(base)}`,
			value: hex(on),
			ratio,
			min: 4.5,
			why: 'text on the accent',
			pass: ratio >= 4.5
		});
	}
}

const line = (r) =>
	[
		r.pass ? '  ok  ' : '  FAIL',
		r.theme.padEnd(10),
		r.token.padEnd(38),
		String(r.surface).padEnd(18),
		r.value.padEnd(9),
		`${r.ratio.toFixed(2)}:1`.padStart(8),
		`min ${r.min}`.padEnd(8),
		r.why
	].join(' ');

const failed = required.filter((r) => !r.pass);

console.log(
	`Contrast guard — ${themes.length} themes × 2 surfaces, ${accents.length} accents, ${required.length} required checks`
);
console.log(`Sheet: ${path.relative(process.cwd(), SHEET)}\n`);

if (SHOW_ALL) {
	console.log('Required:');
	for (const r of required) console.log(line(r));
	console.log('\nAdvisory (watched, does not fail the build):');
	for (const r of advisory) console.log(line(r));
	console.log('');
}

const advisoryFails = advisory.filter((r) => !r.pass).length;
if (advisoryFails)
	console.log(
		`Advisory: ${advisoryFails} of ${advisory.length} below their reference threshold${SHOW_ALL ? '' : ' (--all to list)'}.\n`
	);

if (failed.length) {
	console.error(`${failed.length} shipped default below the minimum:\n`);
	for (const r of failed) console.error(line(r));
	console.error('\nFix the token, run `npm run build:styles`, then re-run this check.');
	process.exit(1);
}

console.log(`All ${required.length} required checks pass.`);
