# Functionalities of the DS Library

This table details the functionalities of the `ng-hub-ui-ds` package and indicates which ones are covered by interactive examples.

Unlike the rest of the family, this package ships **no components**: it is CSS and Sass. Its documentation page is the design-system guide at [hubui.dev](https://hubui.dev/en/design-system/), where "example covered" means a live, theme-reactive demo rather than a component playground.

## Tokens (`styles/tokens/hub-tokens`)

| Category          | Functionality                                                                                                                                                  | Example Covered |
| :---------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------: |
| **Layers**        | Reference layer (`--hub-ref-*`)                                                                                                                                |       ✅        |
|                   | System layer (`--hub-sys-*`)                                                                                                                                   |       ✅        |
|                   | Container re-base hook (`--hub-container-*`)                                                                                                                   |       ❌        |
|                   | Application shell (`--hub-body-*`, `--hub-main-*`, `--hub-main-wrapper-*`)                                                                                     |       ❌        |
| **Colour**        | Nine default accents (`primary` · `secondary` · `success` · `danger` · `warning` · `info` · `neutral` · `light` · `dark`)                                      |       ✅        |
|                   | Derived role `-subtle`                                                                                                                                         |       ✅        |
|                   | Derived role `-border-subtle`                                                                                                                                  |       ✅        |
|                   | Derived role `-emphasis` — steered into the theme's lightness window (`--hub-sys-emphasis-lightness-min` / `-max`), so it stays readable on a dark surface too |       ✅        |
|                   | Derived contrast pair `-on`                                                                                                                                    |       ✅        |
|                   | Open accent set — `$hub-accents-extra` adds variants with their full family                                                                                    |       ✅        |
|                   | Theme-aware expressive gradient (`--hub-sys-gradient-1…3`)                                                                                                     |       ❌        |
| **Structure**     | Spacing scale (`--hub-ref-space-0…7`)                                                                                                                          |       ✅        |
|                   | Gap scale (`--hub-sys-gap-0…5`)                                                                                                                                |       ✅        |
|                   | Size keywords and fractions (`--hub-sys-size-*`)                                                                                                               |       ✅        |
|                   | Container max widths (`--hub-sys-container-max-width-*`)                                                                                                       |       ✅        |
|                   | Grid (`--hub-sys-grid-columns`, `-gutter-x`, `-gutter-y`)                                                                                                      |       ✅        |
|                   | Radius, border width, shadow scales                                                                                                                            |       ✅        |
|                   | Control boundary colour (`--hub-sys-border-color-strong`), separate from the decorative hairline                                                               |       ❌        |
|                   | Typography scales (family, size, weight, line height)                                                                                                          |       ✅        |
|                   | Focus ring (`--hub-sys-focus-ring-*`)                                                                                                                          |       ✅        |
|                   | Z-index layers                                                                                                                                                 |       ❌        |
|                   | Breakpoint values (read from Sass, not usable inside `@media`)                                                                                                 |       ❌        |
| **Themes**        | `light` (default, on `:root`)                                                                                                                                  |       ✅        |
|                   | `base`                                                                                                                                                         |       ✅        |
|                   | `bootstrap`                                                                                                                                                    |       ✅        |
|                   | `dark`                                                                                                                                                         |       ✅        |
|                   | `sunset`                                                                                                                                                       |       ✅        |
|                   | `forest`                                                                                                                                                       |       ✅        |
|                   | `mono`                                                                                                                                                         |       ✅        |
|                   | `terminal`                                                                                                                                                     |       ✅        |
|                   | Region theming — `data-theme` on any container, not just `<html>`                                                                                              |       ✅        |
| **Delivery**      | Compiled `hub-tokens.css` for Sass-less apps                                                                                                                   |       ❌        |
|                   | SCSS source with `@use … with ($hub-accents-extra: …)`                                                                                                         |       ✅        |
| **Accessibility** | Contrast guard over the shipped defaults (`npm run check:contrast`)                                                                                            |       ❌        |

## Sass mixins (`@use 'ng-hub-ui-ds' as hub`)

The page states it plainly: its demos consume the utility classes, never the mixins. Every
mixin is therefore documented as a catalogue row plus a code snippet, and none has a live demo.

| Category        | Functionality                                                                                                                                             | Example Covered |
| :-------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------: |
| **Theme**       | `theme()` — partial theming from maps (`$accents`, `$space`, `$gap`, `$radius`, `$shadow`, `$surfaces`, `$borders`, `$font-*`, `$line-height`, `$tokens`) |       ❌        |
| **Breakpoints** | `media-breakpoint-up()` · `media-breakpoint-down()`                                                                                                       |       ❌        |
| **Layout**      | `stack()` · `cluster()` · `grid()` · `grid-fixed()`                                                                                                       |       ❌        |
|                 | `row()` · `col()` · `offset()` · `center()`                                                                                                               |       ❌        |
| **Typography**  | `font-family()` · `font-size()` · `font-weight()` · `line-height()`                                                                                       |       ❌        |
|                 | `text-color()` · `link-color()`                                                                                                                           |       ❌        |
|                 | `text-truncate()` · `text-break()`                                                                                                                        |       ❌        |
| **Surfaces**    | `bg()` · `text-bg()`                                                                                                                                      |       ❌        |
|                 | `border()` · `border-color()`                                                                                                                             |       ❌        |
|                 | `radius()` · `shadow()`                                                                                                                                   |       ❌        |
| **Helpers**     | `focus-ring()` · `focus-ring-color($variant)`                                                                                                             |       ❌        |
|                 | `visually-hidden()` · `stretched-link()`                                                                                                                  |       ❌        |
|                 | `ratio()` · `clearfix()`                                                                                                                                  |       ❌        |
| **Bridges**     | `bridge-bootstrap($mode)` · `bridge-material($mode)`                                                                                                      |       ❌        |
|                 | `bridge-tailwind($mode)` · `bridge-open-props($mode)`                                                                                                     |       ❌        |

## Utility sheets (opt-in)

| Category              | Functionality                                                     | Example Covered |
| :-------------------- | :---------------------------------------------------------------- | :-------------: |
| **Layout primitives** | `.stack` · `.cluster` · `.grid-auto` · `.center`                  |       ✅        |
| **Layout**            | Display (`.d-*`)                                                  |       ✅        |
|                       | Flex direction, wrap, grow/shrink/fill                            |       ✅        |
|                       | Justify content, align items                                      |       ✅        |
|                       | Align self, align content                                         |       ❌        |
|                       | 12-column grid (`.row` + `.col-1…12`) and offsets                 |       ✅        |
|                       | Spacing (`.p*`, `.m*` 0–5, axis and side variants)                |       ✅        |
|                       | Auto margins (`.ms-auto`, `.mx-auto`)                             |       ✅        |
|                       | Sizing (`.w-25/50/75/100`, `.w-auto`)                             |       ✅        |
|                       | Height, viewport units (`.vh-100`, `.min-vh-100`), `.min-w-0`     |       ❌        |
|                       | Position and inset (`.position-*`, `.top-0`, `.translate-middle`) |       ✅        |
|                       | Overflow                                                          |       ✅        |
|                       | Order, float, visibility, z-index                                 |       ❌        |
|                       | Vertical rule (`.vr`)                                             |       ✅        |
|                       | Object fit, vertical align, `.stretched-link`, `.clearfix`        |       ❌        |
|                       | Interactions (`.user-select-*`, `.pe-none`)                       |       ✅        |
|                       | `.ratio` / `.ratio-*`                                             |       ✅        |
|                       | `.visually-hidden`                                                |       ✅        |
|                       | `.focus-ring`                                                     |       ✅        |
|                       | `.focus-ring-*` accent re-tints                                   |       ❌        |
|                       | Print display (`.d-print-*`)                                      |       ❌        |
|                       | Responsive variants of every applicable family                    |       ✅        |
| **Text**              | Size (`.fs-1…6`) and heading classes (`.h1…6`)                    |       ✅        |
|                       | Weight and style                                                  |       ✅        |
|                       | Alignment                                                         |       ✅        |
|                       | Transform, decoration, family                                     |       ✅        |
|                       | Tabular numerals                                                  |       ✅        |
|                       | Truncation, wrapping, breaking                                    |       ✅        |
|                       | Line height                                                       |       ✅        |
|                       | Semantic colours and the de-emphasis ramp                         |       ✅        |
|                       | Text opacity and link utilities                                   |       ✅        |
| **Surfaces**          | Backgrounds (`.bg-*`, `.bg-*-subtle`) and the surface ramp        |       ✅        |
|                       | `.text-bg-*` (background + guaranteed contrast)                   |       ✅        |
|                       | Borders — sides, colours, widths                                  |       ✅        |
|                       | Border opacity                                                    |       ❌        |
|                       | Radius, including side-scoped and RTL-safe logical corners        |       ✅        |
|                       | Shadows                                                           |       ✅        |
|                       | Opacity (`.opacity-*`, `.bg-opacity-*`)                           |       ✅        |
| **Delivery**          | Compiled `.css` twin of each sheet                                |       ❌        |

## Native-element reset (`styles/base/reset`)

| Category   | Functionality                                 | Example Covered |
| :--------- | :-------------------------------------------- | :-------------: |
| **Reboot** | Token-driven normalisation of native elements |       ❌        |
|            | Compiled `reset.css` twin                     |       ❌        |

---

_Note: ✅ indicates an active interactive example or playground control is available in the documentation. ❌ indicates functionality exists but is only shown as a code snippet, or not shown at all._
