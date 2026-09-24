# Breaking Changes - ng-hub-ui-ds

This document tracks all breaking changes in the `ng-hub-ui-ds` package.

## v22.12.0

### The focus ring is opaque and 2px, and the accent colours move on dark themes

- **Change**: four shipped defaults change value. `--hub-sys-focus-ring-color` goes from a 25%
  wash of the primary to the opaque `--hub-sys-color-primary-emphasis`, and
  `--hub-sys-focus-ring-width` from `0.25rem` to `0.125rem`. `--hub-sys-link-color` and
  `--hub-sys-link-hover-color` derive from the accent instead of naming a blue.
  `--hub-sys-color-{variant}-emphasis` is steered into a lightness window the theme owns, which on
  `dark` and `terminal` moves it toward white rather than away from it. The per-theme
  `--hub-sys-focus-ring-color` and link literals are deleted from `bootstrap`, `dark`, `sunset`,
  `forest` and `mono`, and `--hub-focus-ring-opacity` is removed.
- **Impact**: visible on the day you upgrade, in three places. Focus rings are a thin solid line
  where they were a thick halo. Links in the light themes are a darker blue (`#0049c1` rather than
  `#0d6efd`). On the dark and terminal themes, anything painted with an `-emphasis` role — ghost
  and outline buttons, `.text-{variant}` — flips from dark ink to light, which is the fix, but it
  will look like a different product to anyone who had learned the broken version. Nothing moves
  on the light themes' emphasis values; those are byte-identical. No token is renamed, so nothing
  stops compiling: a stylesheet reading `--hub-focus-ring-opacity` keeps its `var()` fallback and
  simply stops having an effect.
- **Migration**: nothing, if you take the accessible defaults — which is the point of the release.
  To hold the old look, set the values back yourself, knowing what they measure:

    ```css
    :root {
    	--hub-sys-focus-ring-width: 0.25rem;
    	--hub-sys-focus-ring-color: rgba(13, 110, 253, 0.25); /* 1.41:1 — fails 1.4.11 */
    	--hub-sys-link-color: var(--hub-sys-color-primary); /* 4.27:1 on the elevated surface */
    }
    ```

    If you are the other way round — you had already patched these in your own application, the way
    the consuming product did — delete your overrides and let the package do it. Check first that
    yours are not now the weaker pair.

- **Why**: every one of these was below the minimum on a surface this package itself defines, so no
  consumer could be blamed for the failure and every consumer had to fix it separately. The ring
  measured 1.28–1.41:1 against the 3:1 of 1.4.11; a `neutral` ghost button on the dark theme's
  elevated surface measured 2.25:1 against the 4.5:1 of 1.4.3, and its `dark` sibling 1.08:1,
  which is not a contrast problem so much as an invisible button. `npm run check:contrast` now
  fails the build if any of them slips back.

## v22.10.0

### `.border` and the single-side utilities follow the border-width tokens

- **Change**: `.border` had its `1px` written into the rule, and so did `.border-top`,
  `.border-bottom`, `.border-start` and `.border-end`. The width now resolves through
  `var(--hub-border-width, var(--hub-ref-border-width, 1px))` for the box and
  `var(--hub-border-side-width, var(--hub-ref-border-width, 1px))` for the four side rules. The
  `surfaces.border()` mixin's `$width` default moves with them; an explicit argument is unaffected.
- **Impact**: only a theme that had already re-based `--hub-ref-border-width`. That token is
  declared by this package and documented as themeable, but the border utilities ignored it, so a
  theme setting it to `2px` or `0` saw its rules and its own components change while every `.border`
  stayed at one pixel. They now follow it, which is the point — and it is a visible change nobody
  asked for on the day they upgrade. Everything else renders identically: with none of the three
  variables set, the chain still ends at `1px`.
- **Migration**: nothing, if `--hub-ref-border-width` is untouched. To keep the old look while
  keeping your ref value, pin the two utility chains instead of the primitive:

    ```css
    :root {
    	--hub-border-width: 1px;
    	--hub-border-side-width: 1px;
    }
    ```

- **Why**: a token nobody reads is not a token. The width had to leave the rule for a flat theme to
  be expressible at all, and the two chains are separate on purpose: `.border` outlines a surface
  and a flat theme wants that gone, while `.border-bottom` separates one row from the next and that
  is structure. One variable for both would force a theme to choose between keeping its cards and
  losing its separators.

## v22.9.0

### The Bootstrap bridge is gone: Bootstrap no longer drives the semantic tokens

- **Change**: a block of `--hub-sys-*` declarations resolved through Bootstrap's own variables
  (`--hub-sys-color-primary: var(--bs-primary, #0d6efd)`, and the same for `secondary`,
  `success`, `danger`, `warning`, `info`, `dark`, plus `--bs-body-bg`, `--bs-body-color`,
  `--bs-light` and `--bs-border-color`). It has been deleted. Every token now comes from this
  package's own ref layer.
- **Impact**: only an application that loads Bootstrap **and** relied on its palette to retint
  ng-hub-ui. If you set `--bs-primary` and expected `--hub-sys-color-primary` to follow, it no
  longer does. Nothing else changes: with Bootstrap absent, every one of those declarations
  already resolved to its fallback, so the rendered values are identical.
- **Migration**: set the hub token directly — `:root { --hub-sys-color-primary: #7c3aed; }` — which
  is what the token file's own header has always recommended. To keep a Bootstrap-driven theme,
  re-declare the bridge in your own stylesheet; it was ten lines.
- **Why**: the bridge made a published package's public API depend on whether an unrelated
  framework happened to be loaded, and its selector matched every theme, so a consumer could not
  opt out of it.

## v22.4.0

### `--hub-sys-color-{variant}-dark` is gone

- **Change**: every variant used to emit a `--hub-sys-color-{variant}-dark` token — a
  back-compat alias that resolved to `--hub-sys-color-{variant}-emphasis` and nothing else.
  The derivation mixin no longer writes it, so `var(--hub-sys-color-primary-dark)` (and the
  same for every other variant) now resolves to nothing.
- **Impact**: any stylesheet that reads the token. A CSS custom property that resolves to
  nothing fails silently — the declaration is dropped and the element falls back to its
  inherited or initial value — so this breaks quietly, at paint time, with no build error.
  Note the token that survives: `--hub-sys-color-dark` is the _`dark` variant's accent_, a
  different thing from the retired `-dark` **role** of each variant.
- **Migration**: `-emphasis` for the same colour the alias resolved to (legible text over the
  variant's `-subtle` background), or the `-on` token added in this same release for text and
  icons laid **on** the solid accent.
- **Why**: the alias enumerated the roles a second time while meaning nothing new, and 22.4.0
  opened the accent map so consumers can add their own variants — every extra role in the
  derivation loop is emitted once per variant, for every variant anyone ever adds.

> This entry was written after the fact. The removal shipped in 22.4.0 with a `### Removed`
> line in the changelog and no entry here; in this repository the major version tracks Angular
> and can never signal a break, which makes this file the only warning a consumer gets.
