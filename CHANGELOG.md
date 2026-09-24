# Changelog

All notable changes to `ng-hub-ui-ds` are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [22.12.0] - 2026-09-23

### Fixed

- **The `-emphasis` role is readable on a dark surface again.** Its lightness was capped at
  `min(l, 0.45)`, a rule written for ink on paper, so on the dark theme it pushed every accent
  down instead of up. The five accents `[data-theme='dark']` re-tints hid the damage; the four it
  does not — `secondary`, `neutral`, `light`, `dark` — showed it. Measured over
  `--hub-sys-surface-elevated` (`#1e1e1e`): `neutral-emphasis` 2.25:1 → **6.74:1**,
  `secondary-emphasis` 2.25:1 → **6.74:1**, `light-emphasis` 2.24:1 → **7.06:1** (via `#f8f9fa`),
  `dark-emphasis` 1.08:1 → **6.73:1**. The five re-tinted accents were failing too —
  `primary-emphasis` 2.21:1, `danger-emphasis` 2.10:1, `info-emphasis` 2.32:1 — and now read
  6.90:1, 6.59:1 and 10.76:1. The `terminal` theme had the same nine failures, floor 2.26:1, and
  now bottoms out at 6.89:1. Nothing changes on the light themes: their emphasis values are
  byte-identical.
- **The focus ring is an indicator rather than a wash.** `rgba(13, 110, 253, 0.25)` composited
  over the page at 1.41:1 where WCAG 1.4.11 asks 3:1, and the per-theme overrides were worse —
  `sunset` 1.28:1, `mono` 1.41:1, `terminal` 2.89:1, `dark` 1.97:1. The ring is now the opaque
  `--hub-sys-color-primary-emphasis` and measures 6.35:1 at its worst across the seven built-ins
  (`forest`), 14.05:1 at its best (`mono`). Width drops from `0.25rem` to `0.125rem` so an opaque
  ring does not read as a slab; 2px is the thickness WCAG 2.2 treats as the floor.
- **Links clear 4.5:1 on both surfaces of every theme.** `--hub-sys-link-color` was the raw
  primary — 4.50:1 on `#ffffff` but **4.27:1** on `#f8f9fa`, so a link inside a card failed — and
  `--hub-sys-link-hover-color` was a hard-coded `#0a58ca`, a blue that meant nothing in an orange
  or a green theme. Both derive now: the link from `--hub-sys-color-primary-emphasis`, the hover
  by walking that colour toward `--hub-sys-color-ink`, which darkens on a light theme and lightens
  on a dark one. Worst link in the package is now 6.35:1 (`forest`), worst hover 7.47:1. The
  `sunset` literal that cleared the bar by two hundredths (4.52:1) is gone with them.
- **`.focus-ring-{variant}` re-tints the ring opaquely.** The `focus-ring-color()` mixin mixed the
  accent to 25% alpha, which put every one of those utilities near 1.3:1. It now reads the
  variant's `-emphasis` role.

### Added

- **`--hub-sys-border-color-strong`** — the boundary of an interactive control, which 1.4.11 wants
  at 3:1. `--hub-sys-border-color-default` is the decorative hairline and measures 1.30:1 on white,
  so a control drawn with it has no visible edge. Derived from the theme's own ink and surface, so
  it needs no per-theme literal: 5.21:1 on the light themes, 3.42:1 at its tightest (`sunset`).
- **`--hub-sys-emphasis-lightness-min` / `--hub-sys-emphasis-lightness-max`** — the lightness
  window the `-emphasis` role is steered into, `0`/`0.45` on a light theme and `0.72`/`1` on
  `dark` and `terminal`. A custom dark theme sets these two and every accent in the open map,
  including ones the consumer added, comes out readable.
- **`npm run check:contrast`** (`scripts/check-contrast.mjs`) — measures every accent, link, focus
  ring and control border of the compiled sheet against both surfaces of every theme it finds, and
  exits non-zero if a shipped default drops under its threshold. Themes and accents are discovered
  from the CSS, so a new one is covered without touching the script. It runs on `prepublishOnly`.

### Changed

- The `bootstrap`, `dark`, `sunset`, `forest` and `mono` themes no longer carry their own
  `--hub-sys-link-color` / `--hub-sys-link-hover-color`, and none of the six themes carries its own
  `--hub-sys-focus-ring-color`. What derives in their place is the same colour or a better one —
  for `dark` it resolves to the very `#6ea8fe` the block used to spell out. `terminal` keeps its
  cyan links, which are deliberate and measure 11.75:1.

### Removed

- `--hub-focus-ring-opacity`. It existed to thin the ring, which is the defect.

## [22.11.5] - 2026-09-20

### Changed

- The npm keywords say that this package is the token layer — `tokens`, `css-custom-properties`,
  `theming`, `themes`, `color-palette`, `spacing`, `typography` — and that it is
  `framework-agnostic`, which is the reason somebody outside Angular would install it at all.
  Metadata only: no token, variable or style changes.

## [22.11.4] - 2026-09-16

### Changed

- The repository moved to the `hub-env` organization. Issues for every Hub UI package are now
  gathered in [hub-env/hub-ui](https://github.com/hub-env/hub-ui/issues), and the `repository`, `bugs`
  and README links point at the new addresses. GitHub redirects the old ones.

## [22.11.3] - 2026-09-13

### Changed

- **The token catalogue covers the twelve variables of the new `<hub-side-panel>` in `ng-hub-ui-panels`.**
  `docs/variables-css-library.en.md` gains rows in the `panels` section for `--hub-side-panel-width`,
  `-bg`, `-color`, `-border-width`, `-border-color`, `-box-shadow`, `-zindex`, `-padding-x`,
  `-padding-y`, `-body-padding`, `-transition-duration` and `-transition-easing`, each citing the line
  of `side-panel.component.scss` where it is read. The folder ships with this package, so the rows
  reach consumers only through a release of it. Documentation only — no token, style or value changes.

## [22.11.2] - 2026-09-13

### Changed

- **The token catalogue covers the four header-layout variables `ng-hub-ui-modal` adds.**
  `docs/variables-css-library.en.md` gains rows for `--hub-modal-header-align-items`,
  `--hub-modal-heading-direction`, `--hub-modal-heading-align-items` and `--hub-modal-heading-gap`,
  and the four `--hub-modal-close-focus-ring-*` rows point at the lines they moved to. No token,
  theme or stylesheet in this package changes.

## [22.11.1] - 2026-09-11

### Changed

- **The token catalogue covers what `ng-hub-ui-forms` 22.35.0 adds.**
  `docs/variables-css-library.en.md` gains 74 rows: the file input's tile, viewer, counter and
  file-family icon tokens, and the colour grid's `--hub-input-swatch-*`. The row for
  `--hub-input-color-size` now gives its new default and says it sets the width of the classic
  colour field's square. The `_tokens.scss` line references that moved with the new blocks point
  at their lines again. No token, theme or stylesheet in this package changes.

## [22.11.0] - 2026-09-08

### Fixed

- **The `-emphasis` role could not carry text on a pale accent.** It was derived as
  `color-mix(accent 80%, ink)`, and a percentage cannot darken a light hue: the shipped
  amber came out at **2.5:1** on white and the shipped cyan at **2.9:1**. Every consumer
  inherited unreadable text through `.text-warning-emphasis` and through any component
  reading the role, and none of them could fix it, because the formula lives here.

    The luminosity is capped instead of mixed — `oklch(from <accent> min(l, .45) c h)` —
    which leaves an already-dark accent exactly where it was and pulls a light one down to
    where it can carry a letter, keeping its hue and its chroma. Measured on white across the
    nine defaults: nothing below 6.6:1 — info is the floor at 6.62, success next at 6.91 —
    and no role moves by more than a point unless it was failing. `dark` is untouched, since
    it already sat at L .26.

    Themes that assign `--hub-sys-color-*-emphasis` by hand are unaffected.

## [22.10.0] - 2026-09-08

### Added

- **A theme can now flatten the boxes it draws.** `.border` carried its `1px` written into the
  rule, so a theme could recolour a border but never remove or thicken one — which meant a
  flat-surface theme was impossible to express through tokens no matter how the consumer wrote its
  markup. The width now travels on `--hub-border-width`, and the single-side rules on
  `--hub-border-side-width`. They are two chains on purpose: `.border` outlines a surface and a flat
  theme wants that gone, while `.border-bottom` separates one row from the next and that is
  structure. One variable for both would force a theme to choose between keeping its cards and
  losing its separators. One consequence is worth reading before upgrading: a theme that had
  already re-based `--hub-ref-border-width` now sees the border utilities follow it, where they
  used to ignore it. See `BREAKING_CHANGES.md`.
- **`theme()` takes surfaces and borders by name.** `$surfaces` sets `--hub-sys-surface-page` and
  `-elevated`; `$borders` sets the border colour and the two width chains above. Both were reachable
  through `$tokens` already, but a visual theme is mostly surfaces and borders, and routing the main
  case through the escape hatch made the API read as if it only did colour and spacing.

## [22.9.3] - 2026-09-08

### Changed

- **The six `--hub-icon-*` rows point at the line they actually live on.** `icons` 22.3.0 moved its
  base rules into `:where(.hub-icon)` and wrote the reason above them, which pushed every token
  declaration down the file. The catalogue travels inside this package, so a citation left behind
  sends a reader to a line that now holds something else — the same failure this package has
  already released for twice. No token is new, renamed, or worth a different value.

## [22.9.2] - 2026-09-07

### Changed

- **The token catalogue catches up with the release of 2026-09-07.** `docs/variables-css-library.en.md`
  travels inside the published package, so it is the one place a consumer can read what every
  `--hub-*` token is for without cloning the repository. Six libraries moved their defaults off their
  own element in that release, and the `Source` column pointed at lines that had shifted. All of that
  is now in step with the code, which is what `npm run tokens:parity` checks on every build.

- **Five calendar tokens documented, three of them new to the catalogue rather than to the code.**
  `--hub-calendar-height` (the calendar's own height, written by its new `height` input),
  `--hub-calendar-header-gap` (the floor on the distance between the header title and either button
  group) and `--hub-calendar-event-time-font-size` (the hour at the end of a month chip) arrive with
  `ng-hub-ui-calendar` 22.7.0. `--hub-calendar-event-gap` and `--hub-calendar-event-padding-x-timed`
  were already read by the component and had never been written down — a hook a consumer could set
  and never learn about — which is exactly the gap this file exists to close.

- **Three calendar defaults corrected, because the code moved and the table did not.**
  `--hub-calendar-event-font-size` now documents `var(--hub-ref-font-size-xs, 0.75rem)` and
  `--hub-calendar-day-padding-x` / `-y` document `var(--hub-ref-space-1, 0.25rem)`: the month grid
  was tightened in that same calendar release. The parity check cannot catch these on its own —
  all three are consumed-only hooks with no declaration to compare against — so they are the kind
  of row that goes stale silently.

## [22.9.1] - 2026-09-06

### Fixed

- **The README stopped promising a token that resolves to nothing.** Its colour table still listed
  `--hub-sys-color-{variant}-dark` as the fifth member of the family — retired in 22.4.0 — and never
  mentioned `-on`, the member that replaced it and that forms, buttons and badges consume today. The
  "SCSS functions" section described a closed `$hub-variants` list and a `-dark` back-compat alias,
  a mechanism the package left behind in that same release: it now shows the open `$hub-accents` map,
  `$hub-accents-extra` and the real derivation loop, so a reader who copies it gets working code.
  Also restores the seven libraries missing from the family list and drops the two that are not in it:
  `ng-hub-ui-accordion`, retired in favour of panels, and `ng-hub-ui-dropdown`, which is a directive
  inside `ng-hub-ui-buttons` and never a package. `focus-ring-color()` joins the mixin catalogue.
  Both languages.
- **`BREAKING_CHANGES.md` records the 22.4.0 removal of `--hub-sys-color-{variant}-dark`.** It shipped
  with a changelog line and no entry here; in this repository the major tracks Angular and can never
  signal a break, so this file is the only warning a consumer gets — and a CSS variable that resolves
  to nothing fails silently, at paint time, with no build error.
- **The terminal-theme comment no longer points at a file the package does not ship.** It sent the
  reader to `styles/themes/terminal.scss`, which lives in the documentation app, not here. The
  compiled `hub-tokens.css` carries the same correction.
- **Docs site** — the family gallery on the design-system page claimed `avatar`, `milestones` and
  `utils` were still pending after they had been wired to `--hub-sys-*`, and listed none of
  `action-sheet`, `badges`, `buttons`, `icons`, `loading`, `metrics` or `signature`. Its cards also
  linked to unprefixed URLs, which only resolve through a legacy redirect table `action-sheet` is
  absent from, and which drop a reader of the Spanish page into the English docs; they are relative
  now. Nothing in the published package changes.

### Added

- **`FUNCTIONALITIES.md`**, the coverage table the rest of the family carries: which tokens, mixins
  and utilities exist and which of them the documentation actually demonstrates. Every mixin is
  marked uncovered on purpose — the page's demos consume the utility classes, as it says itself.

### Removed

- **Docs site** — the orphan `app-topbar` component. The site's top navigation moved into the app
  shell's sidebar slots and nothing mounts the component any more, but its stylesheet stayed behind
  as the last place in the repository still reading `--hub-sys-color-primary-dark`, the alias this
  package retired in 22.4.0. A component nobody renders is still a component somebody copies styles
  from, which is the only reason this was worth a line. Nothing in the published package changes.

## [22.9.0] - 2026-09-03

### Removed

- **The Bootstrap bridge.** A block of `--hub-sys-*` declarations read Bootstrap's own variables
  — `var(--bs-primary, …)`, `var(--bs-body-color, …)`, `var(--bs-border-color, …)` — and its
  selector covered `:root` and every theme. With Bootstrap present it silently handed that
  package control of this one's semantic tokens; without it, every declaration resolved to its
  fallback and the block did nothing. It is gone, and with it the package's last dependency on
  another framework's variables: the emitted tokens carry **0** `--bs-*` references. The
  only ones left in the package are inside `bridge-bootstrap()`, which emits nothing unless
  you call it.

### Changed

- **The `bootstrap` theme keeps its look and loses the dependency.** It borrowed the palette
  through `var(--bs-*)` with the classic values as fallbacks; those values are now written
  literally. It renders identically whether or not Bootstrap is loaded — which, since its
  fallbacks were already the Bootstrap defaults, is what it rendered in practice all along.

### Added

- Four themable hooks for the modal's close-button focus ring, documented in the token spec:
  `--hub-modal-close-focus-ring-width`, `-color`, `-offset` and `-radius`.

## [22.8.5] - 2026-09-02

### Added

- **docs (modal)** — the three `--hub-modal-offcanvas-*` variables of `ng-hub-ui-modal` 22.8.0:
  the width of a start/end drawer, the height of a top/bottom sheet, and the rounding of its
  content. All three sit deliberately outside the modal size scale, which is the point of them:
  `size: 'lg'` is 800px, and on an 853px window that covers the document the drawer is meant to be
  read _against_, leaving 53px of it showing.

### Fixed

- **Ninety `Source` citations point at the right lines again.** `ng-hub-ui-modal` moved its default
  declarations from `.hub-modal` to `:root` to repair its composition contract, which shifted every
  line after them. This package ships its `docs/` folder, so the citations travel to consumers and a
  stale number sends a reader to the wrong rule. Nothing else moved, which the parity check confirms.

## [22.8.4] - 2026-09-02

### Added

- **docs (forms)** — the ten `--hub-form-hint-*` variables of `ng-hub-ui-forms` 22.31.0, which dress
  the question mark that carries `formTextType="tooltip"` helper text: size, type, and the resting
  and hover colours of its surface and border.

    The one worth reading is `--hub-form-hint-size`, at `1.15em` rather than a pixel value. The mark
    sits beside a label, so it is sized against that label's type: a form that scales its labels down
    scales the mark with them, instead of leaving a circle that grows relative to the words next to
    it. The rest of the family is there because the mark is drawn from CSS rather than an icon font —
    `ng-hub-ui-icons` is not a dependency of that package — so every part of its appearance has to be
    reachable from a token or it is not reachable at all.

    Documentation-only, as always for another library's tokens.

## [22.8.3] - 2026-09-02

### Added

- **docs (forms)** — `--hub-input-plaintext-color`, the value colour on a `plaintext` field
  (`ng-hub-ui-forms` 22.30.0), defaulting to `var(--hub-ref-color-gray-700, #495057)`.

    It exists because of what a field loses along with its box. Measured on the documentation site:
    label and value came out at exactly the same colour, separated only by 2px of size and one
    weight step — fine inside a box, which does the separating, and not fine once the box is gone,
    where a column of them reads as undifferentiated lines. The label is deliberately untouched, on
    the same tokens as every other field's, because a form's labels have to keep one rhythm whatever
    state each field is in; it is the value that steps back a shade. 8.18:1 against the page, so it
    clears AAA, and it is a token rather than a literal.

- **docs (forms)** — `--hub-input-plaintext-padding-block`
  (`0 calc(var(--hub-input-padding-y) * 2)`) and `--hub-input-plaintext-font-weight` (`300`), the
  rest of that treatment. The padding is the one worth reading before you override it, because it
  is doing two jobs: nothing above puts the value directly under its label, closing that gap from
  10px to 4px, and twice the padding below holds the control at exactly an editable field's
  height, so a grid mixing the two still lines up. Replace it with a single value and you give up
  one of the two.

## [22.8.2] - 2026-09-02

### Added

- **The thirty-four table variables of `ng-hub-ui-paginable` 22.17.0 are documented.** Twenty-six
  of them exist because that release stopped naming Bootstrap classes in the filter row: the
  controls and the clear-filters button had promised a stylesheet the family does not ship, so in
  a product without Bootstrap the whole row was invisible. They are now drawn from
  `--hub-table-filter-control-*` and `--hub-table-delete-filters-*`, which is what a consumer has
  to reach for to theme them — and the only way back to the old red-at-rest clear button.

    The remaining eight cover the filter row itself (`--hub-table-filter-row-bg`,
    `--hub-table-filter-cell-padding-x` / `-y`), the search box's new clear affordance
    (`--hub-table-search-clear-*`) and the close glyph it uses (`--hub-table-icon-close`).

    Documentation-only, as always for another library's tokens: nothing in the ds's own tokens or
    compiled CSS changes. It earns a release because this package ships its `docs/` folder, so the
    reference table travels to consumers — and a token nobody can find is one nobody can theme.

## [22.8.1] - 2026-09-01

### Changed

- **`--hub-table-action-disabled-opacity` is documented as covering menu items too.** Following
  `ng-hub-ui-paginable` 22.16.0, a row's dropdown reads the same token for an item it refuses, so
  the description named two of the three places it now applies. This package ships its `docs/`
  folder and the table travels to consumers, which is the whole reason a partial description is
  worth a release: a reader tuning the token would have been surprised by what else moved.

## [22.8.0] - 2026-09-01

### Added

- **`.font-tabular-nums`** — the one utility here Bootstrap does not have, and deliberately
  so: Bootstrap ships no `font-variant-numeric` helper at all, so there was nothing to
  mirror. Named into the `.font-*` family beside `.font-monospace`, because it is the same
  kind of decision — which shapes the glyphs take.

    Proportional numerals give every digit its own width, so a 1 is narrower than a 0 and two
    amounts in a column have their units in different places. Money is read by comparing it
    downwards, and a column whose units do not line up has to be read figure by figure
    instead. Consumers were writing the declaration by hand in their own sheets — five screens
    of one product, which is what asked for this.

- **docs (table)** — `--hub-table-action-disabled-opacity`, how far a refused action button is
  faded (`ng-hub-ui-paginable` 22.15.0), defaulting to `0.5`. Consumed-only. It exists because
  the table draws its own action buttons, so the browser's default disabled rendering never
  reaches them: without a declaration a refused action kept its full tint and its pointer and
  read as pressable.

### Fixed

- **Two `Source` lines point at the right rows again**: `--hub-table-cell-bar-width` and
  `--hub-table-cell-bar-color` moved seventeen lines down when the table's stylesheet gained
  its disabled-action block. This package ships its `docs/` folder, so the citations travel to
  consumers and a stale line number sends a reader to the wrong rule. Nothing else moved —
  every value, description and status is unchanged, which the parity check confirms.

## [22.7.20] - 2026-09-01

### Added

- **docs (datepicker)** — `--hub-datepicker-grid-gap`, the gap between the calendar's day cells (`ng-hub-ui-forms` 22.29.0), defaulting to `0.125rem`. Consumed-only, like the overlay's stacking hook before it. What earns it a row is that the panel now measures itself from the same arithmetic the grid lays itself out with — seven cells and the six gaps between them — so this token no longer only spaces the days: widening it widens the panel, which is the supported way to make room for `monthFormat="long"`. A reader who tunes it expecting a purely cosmetic change gets a wider calendar, and the table should say so before they find out.

## [22.7.19] - 2026-08-31

### Added

- **docs (datepicker)** — `--hub-datepicker-overlay-zindex`, the calendar overlay's stacking hook (`ng-hub-ui-forms` 22.28.0), defaulting to `calc(var(--hub-sys-zindex-modal, 1055) + 5)`. It is the datepicker's counterpart of `--hub-select-dropdown-zindex`: both panels now open above `HubModal`, so the two controls of that package answer the same question the same way. Consumed-only, like the select's canonical spelling — the default lives in the `var()` fallback, so an override anywhere in the cascade wins.

## [22.7.18] - 2026-08-27

### Fixed

- **The `Source` column points at the right lines again.** This package ships its `docs/` folder, so the reference table travels to consumers — and the line numbers it cites drifted twice since 22.7.17 was published: 231 of them when the libraries were normalised to the repository's Prettier config, and three more when `ng-hub-ui-forms`' time field gained a group and its stylesheet grew an `@use`. Nothing else moved: every value, description and status is unchanged, which the parity check confirms.

## [22.7.17] - 2026-08-25

### Added

- **The three floating-label tokens are documented**: `--hub-field-floating-inset`, `--hub-field-floating-travel` and `--hub-field-floating-scale`, following `ng-hub-ui-forms@22.24.0`. They are what makes an input, a select and a datepicker with a floating label the same field rather than three that resemble each other — the geometry lives in one place and all of them read it — so they belong in the spec rather than in one library's changelog.

### Changed

- **`--hub-select-min-height` is documented as derived**, not as `2.5rem`. The token now spells out the height an input reaches by construction — one line of text between two paddings and two borders — because a select is a `div` and inherits none of it. Held as a literal it had drifted, and the select stood 2px taller than every other field.

### Fixed

- **The parity check no longer skips a declaration that wraps.** Its pattern needed the whole declaration, terminating `;` included, on a single line; a long `calc()` broken by the formatter therefore registered as _undeclared_, so value parity had nothing to compare and the documented value was free to drift in silence. Teaching it to read a wrapped declaration as one logical line immediately surfaced sixteen stale values — one in this spec and fifteen in the per-library reference docs of `avatar`, `board`, `modal`, `paginable`, `panels` and `stepper`, where for instance `--hub-modal-margin` was still documented as `1.75rem auto` long after the code had decomposed it into four per-side tokens. All sixteen are corrected.

## [22.7.16] - 2026-08-24

### Changed

- **`--hub-field-stack-gap` is documented as a fallback, not a declaration**, following `ng-hub-ui-forms@22.23.2`. Its `Source` now points at the rule that carries the default rather than at a `:root` block that no longer declares it, and the description says why: a declaration ties with a consumer's own and the winner is decided by import order alone. Worth stating plainly, because re-declaring it is exactly what a future reader would do to "tidy" it.

## [22.7.15] - 2026-08-24

### Added

- **`--hub-field-stack-gap` documented**, following `ng-hub-ui-forms@22.23.1`. It is the space a field leaves under itself when fields are stacked, zero by default so no existing form moves, and zeroed outright by `hubFormControlAdapter` on any control built into another component's chrome.

## [22.7.14] - 2026-08-24

### Added

- **The eleven `hub-loading` variables documented**, following the initial `ng-hub-ui-loading@22.0.0`. One of them, `--hub-loading-accent`, joins the accent-slot annex: all five indicator variants read that single slot, so the library derives no `subtle`/`emphasis`/`on` family the way a component with surfaces and borders does. Three carry a literal default on purpose — `--hub-loading-size`, `--hub-loading-speed` and `--hub-loading-backdrop-blur` — because an indicator's diameter is not a spacing step, its loop period is not a transition duration, and a scrim's blur is not a shadow; borrowing a `sys` token that means something else would tie them to a scale that would move for unrelated reasons. The scrim itself does follow the theme, through `--hub-loading-backdrop-bg` mixing `--hub-sys-surface-page` with transparency, which is what lets one declaration read as a white veil on a light theme and a dark one on a dark theme.

## [22.7.13] - 2026-08-23

### Added

- **The three `hub-timepicker` variables documented**, following `ng-hub-ui-forms@22.23.0`: `--hub-timepicker-width` and `--hub-timepicker-min-width` — the field is sized to its content, because an `HH:MM` control stretched across a form row reads as if it expected more than four digits — and `--hub-timepicker-indicator-opacity`, which dims the browser's own clock glyph so it sits with the field's chrome rather than competing with it.

## [22.7.12] - 2026-08-22

### Added

- **`--hub-tooltip-white-space` and `--hub-tooltip-text-align` documented**, following `ng-hub-ui-utils@22.10.0`. They govern how a tooltip's label wraps and aligns, and are forwarded from the host — which is what makes them settable for one tooltip instead of all of them.

## [22.7.11] - 2026-08-21

### Added

- **The table's action tokens and the modal's dialog inset documented**, following `ng-hub-ui-paginable@22.14.0` and `ng-hub-ui-modal@22.7.0`: `--hub-table-action-accent` (also recorded as a per-action accent slot), its `subtle` and `emphasis` mixes, `--hub-table-sort-btn-hover-color`, and `--hub-modal-dialog-inset` — the space a dialog discounts from the viewport so its body is what scrolls rather than the page.

## [22.7.10] - 2026-08-19

### Added

- **`--hub-nav-panel-last-shadow` documented**, following `ng-hub-ui-nav@22.11.0`. It carries the shadow of the outermost panel in a vertical stack, and defaults to `none` because that panel now closes its edge with a border and the boundary should be drawn once. A theme that separates its panels by shade, or by a cast shadow, sets it — `var(--hub-nav-panel-shadow)` keeps the panel's own.

## [22.7.9] - 2026-08-18

### Added

- **Eight `group-attached` tokens documented**, following `ng-hub-ui-forms@22.21.0`: the radius, gap, border width and border colour that govern the seam of a field group, for `input` and for `select`. They are what lets a field drawn without a box — inside a table cell — stop welding its attached content into a strip.

## [22.7.8] - 2026-08-17

### Added

- **Four `hub-list` tokens documented**, following `ng-hub-ui-paginable@22.11.0`: `--hub-list-radio-size` (the single-selection radio, defaulting to the checkbox's size), `--hub-list-divider-width` and `--hub-list-divider-color` (the rule that stands in for the gap between rows when a list is flush, read only under that variant), and `--hub-list-checkbox-size`, which shipped undocumented. Two internal per-cell relays of the table's selected-row bar are recorded as `INTERNAL` so the parity check stops reporting them as undeclared.

## [22.7.7] - 2026-08-17

### Added

- **`--hub-modal-resize-duration` and `--hub-modal-resize-easing`** documented in the token spec. They tune the travel the modal now performs between two content heights. The duration is unitless on purpose: it is read from script rather than used in a CSS transition, because the height a modal is leaving and the one it is arriving at both compute to `auto`, and no CSS transition fires on that.

## [22.7.6] - 2026-08-17

### Fixed

- **The package shipped without its licence notice.** `package.json` declared MIT, but no `LICENSE` file travelled in the tarball — and MIT itself requires the copyright notice to be included in distributions. The notice ships now.

## [22.7.5] - 2026-08-16

### Added

- Token-spec row for the `ng-hub-ui-nav` 22.10.0 travelling active mark: `--hub-nav-item-active-indicator-transition`, which times the mark as it moves between items when `config.activeIndicator` is on. Documentation-only — the token itself is declared and shipped by `ng-hub-ui-nav`, and nothing in the ds's own tokens or compiled CSS changes.

## [22.7.4] - 2026-08-15

### Added

- Token-spec rows for the `ng-hub-ui-nav` 22.9.0 icon rail: `--hub-nav-rail-width`, `--hub-nav-rail-transition` and the sixteen `--hub-nav-rail-toggle-*` slots (size, padding, colors, border, radius, shadow, replaceable SVG icon mask, insets, z-index, transition). Documentation-only — no token or compiled-CSS changes in the ds itself.

## [22.7.3] - 2026-08-14

### Added

- Token-spec section for `ng-hub-ui-signature`: the eleven `--hub-signature-*` slots, with their initial values, usage and source. The library shipped undocumented, which left `tokens:parity` red and its reference table empty.

## [22.7.2] - 2026-08-08

### Fixed

- Documentation links now point at the canonical localized URLs. The README linked to `https://hubui.dev/<path>` with no locale prefix and no trailing slash, and both forms are 301-redirected, so every reader arriving from npm or GitHub landed on a redirect instead of the canonical page.

## [22.7.1] - 2026-07-29

### Changed

- **docs (token catalogue)** — documented the six tokens added by today's upstream batch: the select caret geometry (`--hub-select-arrow-size`, `--hub-select-arrow-gap` — `ng-hub-ui-forms` 22.11.0, where the caret finally renders), the table header chrome (`--hub-table-head-border-width`, `--hub-table-head-text-transform`, `--hub-table-head-letter-spacing` — `ng-hub-ui-paginable` 22.7.0) and the canonical step-indicator metric (`--hub-stepper-indicator-size` — `ng-hub-ui-stepper` 22.7.0). Source line references refreshed by the parity guard. Documentation-only — no token or compiled-CSS changes in the ds itself.
- **README** — the layout mixin group list now includes `offset` (added in 22.7.0 but missing from the list the published tarball carried).

## [22.7.0] - 2026-07-29

### Added

- **`.offset-1…11` grid offsets** plus responsive `.offset-{bp}-0…11` (the `-0` variant resets to auto placement): Bootstrap's offset semantics ported to the CSS grid — the class sets `grid-column-start`, so `.col-4.offset-md-8` spans 4 tracks starting at track 9 from `md` up. Backed by a new public **`offset($n)` layout mixin**, the counterpart of `col($span)`.
- **Responsive variants for the whole flex family** across sm/md/lg/xl/xxl (reported upstream by a consumer: `flex-md-row` and `align-items-md-start` did nothing): `.flex-{bp}-{row,column}(-reverse)`, `.flex-{bp}-{wrap,nowrap,wrap-reverse}`, `.flex-{bp}-fill`, `.flex-{bp}-{grow,shrink}-{0,1}`, `.justify-content-{bp}-*`, `.align-items-{bp}-*`, `.align-self-{bp}-*`, `.align-content-{bp}-*` and `.order-{bp}-{first,0…5,last}`.
- **`.h1`–`.h6` heading classes** — heading typography without the semantics: the matching step of the heading scale plus the reset's heading treatment (margin and tight leading), with the UA's bold weight made explicit so a `.h5` `<div>` reads like an `<h5>`.
- **`.vr` vertical rule** — Bootstrap-exact self-stretching inline separator for flex rows (`currentcolor` at 25% opacity).

### Changed

- **`col($span)` emits the `grid-column-end: span N` longhand** instead of the `grid-column: span N` shorthand. Auto placement is identical, but the start track is left free for `offset()` / `.offset-*` to set on the same element. Only relevant if you were manually overriding `grid-column-start` on a `col()` element — that override no longer needs to fight the shorthand.

## [22.6.1] - 2026-07-10

### Changed

- **docs (token catalogue)** — documented `--hub-panels-accordion-toggle-gutter`, the space the accordion's trailing chevron reserves at the row's end (shipped with the header-actions slot work in `ng-hub-ui-panels` 22.8.2; forced to `0px` when `togglePosition` places the chevron at the start). Documentation-only — no token or compiled-CSS changes.

## [22.6.0] - 2026-07-09

### Added

- **utilities — the Bootstrap-standard classes the sheets were missing.** The utility sheets promise Bootstrap-exact names; an audit against `bootstrap@5` found 74 base classes documented there but absent here. All of them now ship, emitted through the existing accent loops and the surface/typography mixins, so they follow a re-theme like everything else:
    - `text.scss` — `.text-{accent}-emphasis` (the accent driven toward the theme's ink; legible as body copy on its own `-subtle` background), `.text-black-50` / `.text-white-50`, `.link-opacity-{10,25,50,75,100}`.
    - `surfaces.scss` — `.bg-body-secondary` / `.bg-body-tertiary` (the **surface** de-emphasis ramp), `.border-{accent}-subtle`, `.border-black` / `.border-white`, `.border-opacity-{10,25,50,75,100}`, and the side-scoped radii `.rounded-{top,bottom,start,end}-{0..5,circle,pill}` — logical corners, so they flip correctly in RTL.
    - `layout.scss` — `.d-inline-grid` (plus its `.d-print-` and responsive variants), `.focus-ring-{accent}`.
- **tokens — `--hub-sys-text-secondary` and `--hub-sys-text-tertiary`.** Two rungs of the text de-emphasis ramp were consumed by `text-color()` through a fallback but never declared, so `.text-body-secondary` and `.text-body-tertiary` both silently collapsed onto `.text-muted`. They are now derived as alpha over each theme's own `--hub-sys-text-primary` (75% / 50%) — no per-theme value needed, and they survive any re-theme.
- **mixins — `focus-ring-color($variant)`** (`_helpers.scss`), the public API behind `.focus-ring-*`. It re-tints `--hub-sys-focus-ring-color` and leaves the geometry to `focus-ring()`; set it on the element, not on its focus state.
- **cascade knobs — `--hub-border-opacity`, `--hub-link-opacity`, `--hub-focus-ring-opacity`**, documented alongside the existing `--hub-bg-opacity` / `--hub-text-opacity` contract.

### Changed

- **`.small` / `.large` are relative, not token steps.** `.small` resolves to Bootstrap's `0.875em`: it shrinks against whatever it sits in, so `.small` inside an `<h2>` stays proportional to the heading. Reach for `.fs-sm` / `.fs-lg` when you want a fixed rung of the token scale. Both classes are new in this release, so no shipped behaviour changes.
- **`border()` and `border-color()` honour `--hub-border-opacity`**, and `border-color()` gained a `$subtle` flag selecting the accent's `-border-subtle` tint. `link-color()` honours `--hub-link-opacity`. All three knobs default to `1`, so existing output is byte-identical.

## [22.5.6] - 2026-07-09

### Changed

- **docs (token catalogue) — hygiene wave for the Figma design-system sync.** Documentation-only; no token or compiled-CSS changes.
    - The 41 foundational `sys` rows still flagged `PENDING` (shadows ×6, focus/accessibility ×5, zindex ×8, transitions & states ×10, breakpoints ×6, opacity ×6) were re-flagged **`IN_USE`** — every one of them has been compiled in `styles/tokens/hub-tokens.css` for a while; only the flags were stale. The parity guard now has a foundational shipped-PENDING check (A3) so this cannot drift silently again.
    - The `metrics` token table moved from the Appendix to its canonical place in the Components chapter (`### metrics`), like every other library.
    - The "Light / Dark theme" table is now explicitly marked as illustrative (`parity:ignore` region) — its rows re-document tokens whose canonical rows live in their own sections.
- **docs (select)** — `--hub-select-dropdown-zindex` documented as the canonical spelling of the select dropdown stacking hook (`ng-hub-ui-forms` 22.8.0); the old `--hub-select-dropdown-z-index` row remains as the deprecated default carrier.

### Added

- **docs — "Utility opacity knobs" section**: `--hub-bg-opacity`, `--hub-text-opacity` and `--hub-link-underline-opacity`, the cascade knobs read by the opt-in utility sheets (`.bg-opacity-*`, `.text-opacity-*`, `.link-underline-opacity-*`). They were declared in `styles/utilities/` but had no catalogue row (they were invisible to the parity guard, which now counts ds styles as existing code).
- **docs — "Accent slots (generated annex)"**: machine-checked inventory of the 60 per-component accent slots (`--hub-<comp>-accent` + derived `-subtle` / `-emphasis` / `-on` roles, plus the per-item runtime slots). The convention was documented only generically; the new parity **check G** validates the annex against the slots actually declared/consumed in the libraries, so design-tool syncs (Figma) have an enumerable source of truth.

### Fixed

- **docs — duplicate rows removed**: the stale `PENDING`/`UX-EXCEL` duplicate of `--hub-table-head-bg` (the real row ships since paginable 22.5.0) and the `--hub-sys-border-color-default` duplicate inside the former "Borders and shadows" table (retitled **"Shadows"**; the canonical row lives in "Surfaces, text and borders"). The parity guard now fails on any token documented by two rows.

## [22.5.5] - 2026-07-09

### Changed

- **docs (token catalogue)** — documented the 23 `--hub-file-input-*` tokens added by the themeable dropzone chrome of `ng-hub-ui-forms` 22.7.0: the icon medallion (`-icon-bg`, `-icon-chip-size`, `-icon-chip-radius`), the browse action as a button (`-browse-bg`, `-browse-hover-bg`, `-browse-padding-x/-y`, `-browse-radius`, `-browse-font-size`, `-browse-text-decoration`, `-browse-gap`, `-browse-margin-top`, `-browse-icon`, `-browse-icon-display`, `-browse-icon-size`), the stacked prompt (`-prompt-direction`, `-prompt-align`, `-prompt-gap`) and the two invitation lines (`-drop-text-*`, `-drop-subtext-*`). Documentation-only — no token or compiled-CSS changes.

## [22.5.4] - 2026-07-09

### Changed

- **docs (token catalogue)** — documented the 66 `--hub-file-input-*` tokens shipped with `<hub-file-input>` in `ng-hub-ui-forms` 22.6.0 (dropzone surface and states, prompt/hint typography, the six swappable icon masks, file list, thumbnails, grid preview and upload progress), plus the internal `--hub-file-input-progress-value` relay, and resynced the Source-column line references shifted by the insertion. Documentation-only — no token or compiled-CSS changes.

## [22.5.3] - 2026-07-08

### Changed

- **docs (token catalogue)** — documented the tokens shipped in `ng-hub-ui-nav` 22.7.0 and `ng-hub-ui-panels` 22.7.0: `--hub-nav-border-radius`, `--hub-nav-box-shadow`, `--hub-nav-collapsed-justify` and `--hub-panels-tab-border-end-radius`, and resynced the Source-column line references to the shifted `nav-tokens.scss`. Documentation-only — no token or compiled-CSS changes.

## [22.5.2] - 2026-07-07

### Changed

- **docs (token catalogue)** — documented the new `<hub-table>` scroll/selected-row tokens shipped in `ng-hub-ui-paginable` 22.6.0: `--hub-table-container-overflow`, `--hub-table-selected-bar-width`, `--hub-table-selected-bar-color` (public), plus the internal `--hub-table-cell-bar-*` relays. Documentation-only — no token or compiled-CSS changes.

## [22.5.1] - 2026-07-07

### Changed

- **docs (token catalogue)** — documented the new `<hub-table>` header chrome tokens in `docs/variables-css-library.en.md`: `--hub-table-head-font-size`, `--hub-table-head-font-weight`, `--hub-table-head-padding-x`, `--hub-table-head-padding-y` and `--hub-table-head-position` (shipped in `ng-hub-ui-paginable` 22.5.0). Documentation-only — no token or compiled-CSS changes.

## [22.5.0] - 2026-07-04

### Added

- **One-call partial theming — `theme()` mixin** (`styles/mixins/_theme.scss`, forwarded by the root Sass entry): pass only the overrides as partial maps (`$accents`, `$space`, `$gap`, `$radius`, `$shadow`, `$font-family/-size/-weight`, `$line-height`, plus a raw `$tokens` escape hatch) and it emits the matching custom properties with the canonical names — everything derived (sys aliases, role families, utilities, components) re-derives at runtime through the var() chain. Scopeable to `:root`, a `[data-theme]` block or any subtree.
- **Radius tokens `xl` / `xxl`** (`--hub-ref-radius-xl: 1rem`, `--hub-ref-radius-xxl: 2rem` and their `--hub-sys-radius-*` aliases), completing Bootstrap's radius scale — `.rounded-4` / `.rounded-5` are now emitted by the surfaces sheet.
- **Breakpoints** (`styles/mixins/_breakpoints.scss`, forwarded by the root Sass entry): the Bootstrap-compatible `$hub-breakpoints` map (sm 576 · md 768 · lg 992 · xl 1200 · xxl 1400, retunable via `with (…)`) plus `media-breakpoint-up($name)` / `media-breakpoint-down($name)` mixins.
- **Responsive utility variants** (mobile-first, Bootstrap-exact names) generated for the highest-traffic groups: display (`.d-{bp}-*`), 12-column spans (`.col-{bp}-1…12`), spacing (`.p/.px/.py/.pt/.pb/.ps/.pe-{bp}-*`, `.m…-{bp}-*`, auto margins) and gap. Other groups get their responsive variant in consumer code with `media-breakpoint-up()`.
- **Focus ring**: `focus-ring()` helper mixin over the (previously unconsumed) `--hub-sys-focus-ring-width/color` tokens, plus the `.focus-ring` utility.
- **Background / text opacity hooks**: `bg()`, `text-bg()` and `text-color()` now emit their colour through the local custom properties `--hub-bg-opacity` / `--hub-text-opacity` (default 1, via `color-mix`), and the sheets add Bootstrap's `.bg-opacity-10/25/50/75/100` and `.text-opacity-25/50/75/100`.
- **Link utilities & mixin**: `link-color($variant)` (accent link with `-emphasis` hover) and the `.link-{variant}`, `.link-underline(-{variant})`, `.link-underline-opacity-0…100` (via `--hub-link-underline-opacity`), `.link-offset-1…3` and `.icon-link` classes.
- **`.bg-gradient`** and **print display utilities** (`.d-print-none/inline/inline-block/block/grid/table(-row/-cell)/flex/inline-flex`).
- **Surface mixins** (`styles/mixins/_surfaces.scss`, forwarded by the root Sass entry): `bg($variant, $subtle)` over the open accent map plus `body` / `transparent`, `text-bg($variant)` (accent background + guaranteed-contrast `-on` text), `border($width, $color)`, `border-color($variant)`, `radius($size)` (none | sm | md | lg | pill | circle) and `shadow($size)` (none | sm | md | lg | inset).
- **Helper mixins** (`styles/mixins/_helpers.scss`, forwarded by the root Sass entry): `visually-hidden()`, `stretched-link()`, `ratio($x, $y)` (native `aspect-ratio`) and `clearfix()`.
- **Surface utility sheet** (`styles/utilities/surfaces.scss` / `.css`, exported as `./styles/utilities/surfaces`): Bootstrap-exact helpers built on the surface mixins — backgrounds (`.bg-primary` … `.bg-dark`, `.bg-*-subtle`, `.bg-body`, `.bg-transparent`, `.bg-white/black`), `.text-bg-*`, borders (`.border`, per-side add/remove, `.border-{variant}` colours, `.border-1…5` widths), radii (`.rounded`, `.rounded-0…3`, `.rounded-circle`, `.rounded-pill`, per-side variants), shadows (`.shadow-sm/.shadow/.shadow-lg/.shadow-none`) and `.opacity-0/25/50/75/100`. `.rounded-4` / `.rounded-5` are not emitted — the ds radius scale has no xl/xxl tokens yet.
- **Layout sheet expansion** (`styles/utilities/layout.scss`), all Bootstrap-exact: per-side spacing (`.pt/.pb/.ps/.pe-*`, `.mt/.mb/.ms/.me-*` on the 0–5 scale, logical properties), auto margins (`.m-auto`, `.mx-auto`, `.ms-auto` …), `.row-gap-*` / `.column-gap-*`, table display helpers (`.d-table(-row/-cell)`), position (`.position-*`, `.top/bottom/start/end-0/50/100`, `.translate-middle(-x/-y)`, `.fixed-top/bottom`, `.sticky-top/bottom`), overflow (`.overflow-*` plus `-x`/`-y` axes), `.order-first/0…5/last`, `.align-content-*`, float (`.float-start/end/none`, `.clearfix`), `.visible`/`.invisible`, `.z-n1/0…3`, `.object-fit-*`, vertical alignment (`.align-baseline/top/middle/bottom/text-top/text-bottom`), interactions (`.user-select-*`, `.pe-none/.pe-auto`) and the behaviour helpers (`.visually-hidden`, `.visually-hidden-focusable`, `.stretched-link`, `.ratio` + `.ratio-1x1/4x3/16x9/21x9`).
- **Typography mixins** (`styles/mixins/_typography.scss`, forwarded by the root Sass entry): `text-truncate()`, `text-break()`, `font-family($family)`, `font-size($size)` — Bootstrap's heading scale 1–6 derived from the base token, or the xs/sm/base/lg steps —, `font-weight($weight)`, `line-height($height)` and `text-color($variant)` over the open accent map plus the `body` / `muted` document roles.
- **Text utility sheet** (`styles/utilities/text.scss` / `.css`, exported as `./styles/utilities/text`): Bootstrap-exact helpers built on the typography mixins — alignment (`.text-start/center/end`), wrapping (`.text-wrap/nowrap`, `.text-break`, `.text-truncate`), transform (`.text-lowercase/uppercase/capitalize`), decoration (`.text-decoration-none/underline/line-through`), weight & style (`.fw-lighter/light/normal/medium/semibold/bold/bolder`, `.fst-italic/normal`), size (`.fs-1…6`), line-height (`.lh-1/sm/base/lg`), `.font-monospace`, and semantic text colours (`.text-primary` … `.text-dark`, `.text-body`, `.text-muted`, `.text-white`, `.text-black`, `.text-reset`).
- **Native-element reset** (`styles/base/reset.scss` / `.css`, exported as `./styles/base/reset`): an opt-in, token-driven reboot of the browser defaults — `box-sizing: border-box`, body typography/surface from `--hub-ref-*` / `--hub-sys-*`, heading/paragraph/list margins on the spacing scale, link colors from `--hub-sys-link-*`, monospace for `code`/`pre`, form controls inheriting the document font, and sensible `hr`/`table`/`fieldset` normalization. Load it only when the host app does not already ship a reset (e.g. Bootstrap's Reboot).

### Removed

- **BREAKING**: the `hub-`-prefixed utility sheet (`styles/utilities/layout.hub.scss` / `.css`) and its `./styles/utilities/layout.hub` package exports. The ds now ships a single, unprefixed utility sheet: `styles/utilities/layout`, whose helper names mirror Bootstrap's exactly. Migration: update imports from `ng-hub-ui-ds/styles/utilities/layout.hub` to `ng-hub-ui-ds/styles/utilities/layout` and rename classes — `.hub-stack` → `.stack`, `.hub-d-flex` → `.d-flex`, `.hub-gap-3` → `.gap-3`, `.hub-row`/`.hub-col-6` → `.row`/`.col-6`, `.hub-w-50` → `.w-50`, `.hub-justify-*` → `.justify-content-*`, `.hub-items-*` → `.align-items-*`, `.hub-self-*` → `.align-self-*`, and `.hub-grid` → `.grid-auto`. Do not load the sheet AND Bootstrap globally in the same document (the names now overlap by design; the spacing scale already matched Bootstrap's).
- **BREAKING**: the Tailwind-style flex aliases `.flex-1`, `.flex-auto`, `.flex-initial` and `.flex-none` — helper classes mirror Bootstrap exactly, which has no such utilities. Use `.flex-fill` / `.flex-grow-*` / `.flex-shrink-*` instead.

### Changed

- **Size scales are now generated from public Sass maps** — `$hub-space-scale`, `$hub-radius-scale` and `$hub-gap-steps` (`!default`, retunable via `with (…)`) are the single source for the `--hub-ref-space-*` / `--hub-ref-radius-*` blocks and their `sys` aliases, mirroring the `$hub-accents` pattern. Emitted CSS is unchanged except `--hub-sys-radius-pill`'s dead-code fallback, normalized from `9999px` to the ref value `50rem`.
- The layout primitives of the utility sheet (`.stack`, `.cluster`, `.grid-auto`, `.row`, `.col-*`, `.center`) are now emitted from the canonical layout mixins instead of duplicating their CSS — no behaviour change; the mixins remain the single source of truth.
- **BREAKING**: the flexbox alignment utilities of the unprefixed sheet now use Bootstrap's exact names — `.justify-start|end|center|between|around|evenly` → `.justify-content-*`, `.items-start|end|center|baseline|stretch` → `.align-items-*`, `.self-auto|start|end|center|baseline|stretch` → `.align-self-*`.

## [22.4.5] - 2026-07-02

### Added

- Token-spec MD: new `INTERNAL` status in the Components legend for variables the component writes at runtime (from inputs/config/state) — inventoried so every variable in code has a row, but explicitly not themable hooks.
- Token-spec MD: documented 35 previously missing component variables — the `--hub-dropdown-header-*` / `--hub-dropdown-divider-color` hooks (buttons), the `--hub-nav-mobile-*` drawer hooks, the `--hub-milestone-pulse-*` / `--hub-milestone-reveal-*` animation hooks, `--hub-stepper-nav-title-max-width`, and the `INTERNAL` runtime variables of badges (`--hub-badge-group-*`), nav (`--hub-nav-sticky-top`), skeleton (`--hub-skeleton-node-*`), milestones (`--hub-milestone-index`), panels (`--hub-panels-multiple-vertical-panel-min-width`) and forms slider (`--hub-slider-from/-to/-percent`).

### Changed

- Token-spec MD: the formal component-token regex required three name segments (`{2,}`), invalidating the dominant `--hub-{component}-{property}` pattern (89 legitimate tokens like `--hub-badge-bg`); relaxed to `{1,}`.
- Token-spec MD: the "Tokenization coverage" appendix was a stale snapshot (e.g. `paginable` listed at 22.4% — it is now 84.8%); regenerated with current per-library numbers, dated methodology notes and updated priorities (`buttons` is now the lowest at 70.6%).
- Token-spec MD: the "Standalone neutral colors" table wrongly claimed `secondary` / `light` / `dark` derive no role family — they are `$hub-accents` variants and derive the full family like every other variant. Split into "Neutral variant accents" (with `neutral` added) and "Standalone brand aliases" (`--hub-sys-color-brand-default` / `-on-default`, the only true base-only tokens).
- Token-spec MD: the "Directional spacing rule" now records the grandfathered logical-suffix exceptions (modal margin cascade, `--hub-nav-mobile-*-padding-inline`, `--hub-table-batch-actions-margin-inline-end`) and clarifies that single-value spacing tokens may keep the bare `-padding` suffix.
- Token-spec MD: 213 "Initial value" cells re-synchronized from the actual code declarations (new value-parity guard below) — including the canonical accent-slot derivations (oklch, 12% subtle / 80% emphasis) that panels, toast and nav now share, and the new `--hub-speed-dial-label-bg` / `--hub-speed-dial-label-color` tokens from buttons 22.7.0.
- `tokens-parity.mjs` guard extended: library scan now covers `.ts` / `.html` (inline component styles count as public API), consumed-only hooks (`var(--hub-x, fallback)` without a declaration) must now have an MD row, and `INTERNAL` rows are checked for existence in code like `IN_USE` ones. A new **value-parity check (D)** compares every component row's "Initial value" cell against the token's declaration in the file named by its Source column (tolerant normalization; `url(data:)` icons and Sass-interpolated values exempt), and `--write` rewrites drifted cells from code.

- Token-spec MD: `--hub-table-filter-count-bg` / `--hub-table-filter-count-color` were still marked `PENDING` but have shipped in paginable — promoted to `IN_USE` (a new parity sub-check now flags any PENDING/PROPOSAL row whose token is declared in code).

- Token-spec MD: adversarial re-audit fixes — 27 `Source` cells pointed at ghost files (24 legacy `accordion/*` rows → retargeted to the panels bridge `panels.variables.scss`; 3 `form/*` → the real forms fieldset component) and 60% of `Source` line numbers had drifted (675 cells renumbered); `url(data:)` icon values are no longer exempt from value parity (3 had drifted — `--hub-check-input-checked-icon` documented a different glyph entirely) and the descriptive icon placeholders were replaced by the real data URIs; the Figma-mapping sections now use real tokens as examples; `--hub-avatar-size` reclassified `IN_USE` → `INTERNAL` (written from the `size` input; a CSS override is overruled by the inline host style); the three `--hub-form-fieldset-border-*` values re-synced to the fallbacks the fieldset actually consumes.
- `tokens-parity.mjs`: two more guards — **check E** validates every `Source` cell (file exists, contains the token, right line; `--write` retargets/renumbers) and **check F** keeps each library's `docs/css-variables-reference.md` "Default" cells in sync with the code declarations (254 cells resynchronized on first run).

### Removed

- Token-spec MD: the superseded `tabs` proposal section (23 `--hub-tabs-tab-*` PENDING rows) — the tabs UI shipped in `ng-hub-ui-panels` as `--hub-panels-tab-*`; a tombstone note now points there.
- Token-spec MD: 49 superseded PENDING rows in the `select` section — the `--hub-select-btn-*` block shipped as the `--hub-select-button-*` tokens, and the `--hub-select-checkbox-input-*` / `--hub-select-radio-input-*` proposals were dropped in favour of the `check` component tokens the implemented select actually uses.

## [22.4.4] - 2026-07-01

### Changed

- Token-spec MD: documented the `<hub-input>` affix and clear-button tokens added in `ng-hub-ui-forms` 22.3.0 — `--hub-input-icon-color` / `--hub-input-icon-size`, `--hub-input-affix-inset` / `--hub-input-affix-gap`, and `--hub-input-clear-icon` / `--hub-input-clear-size` / `--hub-input-clear-color` / `--hub-input-clear-hover-color`. Docs only — no change to the emitted tokens.

## [22.4.3] - 2026-07-01

### Changed

- Token-spec MD: documented the six `--hub-icon-*` component tokens (`size`, `color` and the variable-font axes `fill` / `weight` / `grade` / `optical-size`), added by the new `ng-hub-ui-icons` 22.0.0 library. Docs only — no change to the emitted tokens.

## [22.4.2] - 2026-06-29

### Changed

- Token-spec MD: documented the `--hub-breadcrumb-max-item-width` component token (added in `ng-hub-ui-breadcrumbs` 22.3.0 for opt-in item truncation). Docs only — no change to the emitted tokens.

## [22.4.1] - 2026-06-29

### Changed

- Token-spec MD: documented the `--hub-badge-max-width` component token (added in `ng-hub-ui-badges` 22.4.0 for content truncation). Docs only — no change to the emitted tokens.

## [22.4.0] - 2026-06-26

### Added

- **Open, user-extensible semantic accent map.** The set of variant names is no longer hard-coded: it is driven by a configurable `$hub-accents` Sass map (`!default`). Consumers can redefine the defaults or **add any number of custom variants** (e.g. `brand`, `accent`, `tertiary`) — each one automatically gets its full derived role family (`-subtle`, `-border-subtle`, `-emphasis`, `-on`). Two entry points, no per-library recompile:
    - `@use 'ng-hub-ui-ds/styles/tokens/hub-tokens' with ($hub-accents-extra: (brand: #ff6b00))` — additive: keeps the defaults and merges your variants (recommended).
    - `with ($hub-accents: (...))` or defining `$hub-accents` before importing — full replacement.
- **Neutral variants in the default set.** `secondary`, `neutral`, `light` and `dark` are now first-class accents that derive the same role family as the chromatic ones (9 default variants total).
- **`--hub-sys-color-{variant}-on` contrast pair** for every variant. A grayscale on-color derived from the accent's own lightness via relative-color syntax (`oklch(from … )`), so dark accents resolve to white text and light accents to near-black — recomputed live with the accent, no second token to maintain.
- **Canonical structural layer.** New tokens: `--hub-ref-space-6/7`, sizing (`--hub-sys-size-full/-auto/-min/-max/-fit` and fractions `-1-2/-1-3/-2-3/-1-4/-3-4`), responsive container widths (`--hub-sys-container-max-width-sm…xxl`), grid (`--hub-sys-grid-columns/-gutter-x/-gutter-y`) and a semantic gap scale (`--hub-sys-gap-0…5`).
- **Layout mixins** (`@use 'ng-hub-ui-ds' as hub`): `hub.stack`, `hub.cluster`, `hub.grid`, `hub.grid-fixed`, `hub.row` + `hub.col($span)` (12-column grid) and `hub.center`.
- **Opt-in utility sheets** in two flavours sharing one naming rule — canonical `hub-` prefixed (`styles/utilities/layout.hub`) and unprefixed (`styles/utilities/layout`): a 12-column grid (`row` + `col-1…12`), display/flex helpers, directional padding/margin (`p/px/py`, `m/mx/my` 0–5), gap, and width/height sizing (`w-auto`, `w-25/50/75/100`, `vw-100`, `vh-100`, `min-vh-100`, …).
- **External-system bridge mixins** (opt-in): `hub.bridge-bootstrap`, `hub.bridge-tailwind`, `hub.bridge-material`, `hub.bridge-open-props`, each with `$mode: adopt | project | both` (hub adopts the host's tokens, or projects its theme onto the host).
- The canonical token spec (`docs/variables-css-library.en.md`) now ships **inside this package** as the single source of truth.

### Changed

- Semantic role derivation (`-subtle` / `-border-subtle` / `-emphasis`) now mixes `in oklch` instead of `in srgb` for perceptually smoother tints.
- `package.json` exposes new `exports` (`.`/`styles`, `styles/mixins/*`, `styles/utilities/*`) and a `build:styles` script that compiles tokens **and** the utility sheets.

### Removed

- **`--hub-sys-color-{variant}-dark`** (legacy back-compat alias of `-emphasis`). Consume `-emphasis` (or the new `-on` for contrast text).

## [22.3.1] - 2026-06-25

### Fixed

- The default / `light` theme accents are no longer silently overridden by the Bootstrap bridge: `:root` and `[data-theme='light']` now re-assert the ref-based accents (and surfaces/text/border) after the bridge block, instead of resolving through `--bs-*` when Bootstrap is present.
- Removed the stray `--hub-sys-color-primary-dark` Bootstrap override so all five variants derive `-dark` from the canonical `-emphasis` alias.

## [22.3.0] - 2026-06-24

### Added

- `--hub-sys-color-brand-default` and `--hub-sys-color-brand-on-default` semantic tokens. `brand` is the default accent consumed by component theme mixins (e.g. `ng-hub-ui-buttons` / `ng-hub-ui-badges`); it aliases the active theme's `primary`, so it re-colours automatically per theme.

## [22.2.0] - 2026-06-24

### Added

- **`body` / `main` base (shell) layer**: new inheritable tokens that standardise the application-shell layout so a vertical or horizontal aside reads one consistent token set.
    - **`--hub-body-*`** — the outer app/page wrapper. Twelve tokens (`width`, `margin-x/-y`, `padding-x/-y`, `row-gap`, `column-gap`, `bg`, `border-color`, `border-style`, `border-width`, `border-radius`) that **inherit from the matching `--hub-container-*` tokens** (with `sys`/`ref` fallbacks), so the container spacing system drives the whole page.
    - **`--hub-main-*`** — the content region: `bg`, `border-radius`, `padding-x`, `padding-y`.
    - **`--hub-main-wrapper-*`** — the centered wrapper around the content region: `bg`, `border-radius`, `gap`, `padding-x`, `padding-y` and `max-width` (default `1200px`).
- All tokens are live, re-basable CSS custom properties; paired spacing uses the canonical directional `-x` / `-y` form only (no `padding`/`margin` shorthand).

### Added

- **`container` base layer**: 22 inheritable `--hub-container-*` tokens (typography, visual and layout) bridging `sys` tokens to concrete containers/slots. Acts as a **re-base hook layer** with real spacing defaults (`padding: space-3`, gaps `space-2`): overriding one container token on a subtree re-bases every descendant container that reads it (e.g. `panels`). Paired spacing uses the canonical directional `-x`/`-y` form only — `--hub-container-padding-x/-y` and `--hub-container-margin-x/-y`, with no `padding`/`margin` shorthand.
- **Primitive tokens**: `--hub-ref-font-size-xs` and `--hub-ref-font-weight-semibold`, completing the canonical font scales.
- **`--hub-sys-color-ink`**: per-theme contrast target that flips `-emphasis` toward white on dark/terminal surfaces.
- **`build:tokens` script** (+ `prepublishOnly`) so `hub-tokens.css` is always recompiled from `hub-tokens.scss`, never hand-edited or stale.

### Changed

- **Semantic colour families are now CSS-variable-first.** A theme sets only the accent (`--hub-sys-color-{variant}`); `-subtle`, `-border-subtle` and `-emphasis` are derived once in `:root` with `color-mix()` against the contextual `--hub-sys-surface-page` / `--hub-sys-color-ink`. Overriding a single accent — even on a subtree — recomputes the whole family at runtime, with no per-theme boilerplate. Replaces the per-theme ramp maps + `hub-semantic-colors` mixin (now `hub-color-accents` + `hub-color-derive`).
- Regenerated `hub-tokens.css` from source (was stale: missing the `sys` radius/shadow-md/surface aliases already present in the SCSS).

### Notes

- `--hub-sys-color-{variant}-dark` is kept as a back-compat alias of `-emphasis`.

## [22.0.0] - 2026-06-17

### Changed

- Aligned with Angular 22.
- README documentation standardized.

## [1.0.0] - 2026-06-16

Initial release. The shared design-token foundation for the ng-hub-ui family,
extracted from the documentation app so every library reads one source of truth.

### Added

- **Primitive (`ref`) tokens**: full colour ramps (`--hub-ref-color-*`), spacing, radii, border widths, typography and icon sizing.
- **Semantic (`sys`) tokens**: surfaces, text, borders, shadows, focus ring, z-index, opacity, state overlays, transitions, and the semantic colour families.
- **Semantic colour families** generated from a per-theme SCSS map by the `hub-semantic-colors` mixin — each of `primary` / `success` / `danger` / `warning` / `info` exposes a uniform set: base, `-subtle`, `-dark`, `-border-subtle`, `-emphasis`.
- **8 built-in themes**: `light` / `base`, `bootstrap` (+ Bootstrap bridge), `dark`, `sunset`, `forest`, `mono`, `terminal` — switched with `[data-theme='…']`.
- **Two consumption paths**: the compiled `hub-tokens.css` (drop-in for any app) and the `hub-tokens.scss` source (override tokens via standard CSS custom properties).
