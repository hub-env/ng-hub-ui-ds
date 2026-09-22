# ng-hub-ui-ds

**Español** | [English](./README.md)

La **base de design tokens** compartida de la familia
[ng-hub-ui](https://hubui.dev/en/). Publica las variables CSS canónicas
`--hub-ref-*` (primitivas) y `--hub-sys-*` (semánticas) — rampas de color,
espaciado, radios, tipografía, superficies, colores semánticos, sombras, focus
ring y más — con claro/oscuro y **8 temas integrados**.

Impórtala **una vez** y cada librería de ng-hub-ui (panels, forms, calendar…)
lee la misma paleta. Re-tematizas en un sitio y toda la familia sigue.

> Agnóstica de framework — son solo variables CSS. Sin dependencia de Angular ni
> de JS; envía el CSS compilado o el código SCSS.

## Documentación y ejemplos en vivo

Este paquete forma parte de [Hub UI](https://hubui.dev/en/), una colección de
librerías de componentes Angular para aplicaciones standalone.

- Documentación: https://hubui.dev/en/design-system/
- Hub UI: https://hubui.dev/en/
- Hub UI en GitHub (incidencias, roadmap y cómo contribuir): https://github.com/hub-env/hub-ui

## 🧩 Familia de librerías `ng-hub-ui`

Este paquete es la base de design tokens de la que lee el resto del ecosistema
**ng-hub-ui**:

- [**ng-hub-ui-action-sheet**](https://www.npmjs.com/package/ng-hub-ui-action-sheet)
- [**ng-hub-ui-avatar**](https://www.npmjs.com/package/ng-hub-ui-avatar)
- [**ng-hub-ui-badges**](https://www.npmjs.com/package/ng-hub-ui-badges)
- [**ng-hub-ui-board**](https://www.npmjs.com/package/ng-hub-ui-board)
- [**ng-hub-ui-breadcrumbs**](https://www.npmjs.com/package/ng-hub-ui-breadcrumbs)
- [**ng-hub-ui-buttons**](https://www.npmjs.com/package/ng-hub-ui-buttons)
- [**ng-hub-ui-calendar**](https://www.npmjs.com/package/ng-hub-ui-calendar)
- [**ng-hub-ui-ds**](https://www.npmjs.com/package/ng-hub-ui-ds) ← Estás aquí
- [**ng-hub-ui-forms**](https://www.npmjs.com/package/ng-hub-ui-forms)
- [**ng-hub-ui-history**](https://www.npmjs.com/package/ng-hub-ui-history)
- [**ng-hub-ui-icons**](https://www.npmjs.com/package/ng-hub-ui-icons)
- [**ng-hub-ui-loading**](https://www.npmjs.com/package/ng-hub-ui-loading)
- [**ng-hub-ui-metrics**](https://www.npmjs.com/package/ng-hub-ui-metrics)
- [**ng-hub-ui-milestones**](https://www.npmjs.com/package/ng-hub-ui-milestones)
- [**ng-hub-ui-modal**](https://www.npmjs.com/package/ng-hub-ui-modal)
- [**ng-hub-ui-nav**](https://www.npmjs.com/package/ng-hub-ui-nav)
- [**ng-hub-ui-paginable**](https://www.npmjs.com/package/ng-hub-ui-paginable)
- [**ng-hub-ui-panels**](https://www.npmjs.com/package/ng-hub-ui-panels)
- [**ng-hub-ui-portal**](https://www.npmjs.com/package/ng-hub-ui-portal)
- [**ng-hub-ui-signature**](https://www.npmjs.com/package/ng-hub-ui-signature)
- [**ng-hub-ui-skeleton**](https://www.npmjs.com/package/ng-hub-ui-skeleton)
- [**ng-hub-ui-sortable**](https://www.npmjs.com/package/ng-hub-ui-sortable)
- [**ng-hub-ui-stepper**](https://www.npmjs.com/package/ng-hub-ui-stepper)
- [**ng-hub-ui-toast**](https://www.npmjs.com/package/ng-hub-ui-toast)
- [**ng-hub-ui-utils**](https://www.npmjs.com/package/ng-hub-ui-utils)

---

## 📋 Índice

1. [🧩 ¿Qué es y para qué sirve?](#-qué-es-y-para-qué-sirve)
2. [📦 Instalación](#-instalación)
3. [🚀 Importación](#-importación)
4. [🧱 Arquitectura: las capas](#-arquitectura-las-capas)
5. [🎨 Los colores semánticos](#-los-colores-semánticos)
6. [🌗 Temas](#-temas)
7. [🧰 Utilidades y mixins opt-in](#-utilidades-y-mixins-opt-in)
8. [🛠️ Cómo modificarlo](#️-cómo-modificarlo)
9. [🧩 Funciones SCSS (cómo se genera por dentro)](#-funciones-scss-cómo-se-genera-por-dentro)
10. [📋 Tabla de referencia rápida](#-tabla-de-referencia-rápida)
11. [📊 Changelog](#-changelog)
12. [🤝 Contribución](#-contribución)
13. [☕ Apoyo](#-apoyo)
14. [📄 Licencia](#-licencia)

---

## 🧩 ¿Qué es y para qué sirve?

Cada librería de ng-hub-ui se tematiza con variables CSS `--hub-*`, pero **no
define** los colores: solo los **consume** (con _fallbacks_ sensatos). Este
paquete es **la fuente de verdad única** de esas variables.

Sin él, cada librería usaría sus valores de respaldo de forma aislada. Con él:

- **Una sola paleta** alimenta panels, forms, calendar, board… a la vez.
- **Re-tematizas una vez** (un token) y el cambio se propaga a toda la familia.
- **Modo oscuro y 8 temas** listos, conmutables con un atributo.
- Lo usas también en **tu propio CSS** (`var(--hub-sys-color-info-subtle)`), así
  tu UI casa con los componentes.

---

## 📦 Instalación

```bash
npm install ng-hub-ui-ds
```

No tiene dependencias. Es CSS/SCSS puro.

---

## 🚀 Importación

Impórtalo **una sola vez**, en la raíz de tu aplicación. Elige una vía:

### CSS drop-in (cualquier app, sin Sass)

```css
@import 'ng-hub-ui-ds/styles/tokens/hub-tokens.css';
```

o en `angular.json`:

```json
"styles": [
  "node_modules/ng-hub-ui-ds/styles/tokens/hub-tokens.css",
  "src/styles.scss"
]
```

### Código SCSS (si usas Sass)

Emite exactamente las mismas reglas `:root`, y te deja referenciar la fuente:

```scss
@use 'ng-hub-ui-ds/styles/tokens/hub-tokens';
```

Cada componente de ng-hub-ui ya lee estas variables. Refiérelas también en tus
propios estilos:

```css
.mi-aviso {
	background: var(--hub-sys-color-info-subtle);
	color: var(--hub-sys-color-info-emphasis);
	border: 1px solid var(--hub-sys-color-info-border-subtle);
}
```

---

## 🧱 Arquitectura: las capas

Los tokens siguen un sistema por capas:

| Capa            | Prefijo             | Qué es                                                       | Ejemplos                                                                |
| --------------- | ------------------- | ------------------------------------------------------------ | ----------------------------------------------------------------------- |
| **Referencia**  | `--hub-ref-*`       | Valores crudos, sin contexto                                 | `--hub-ref-color-blue-500`, `--hub-ref-space-3`, `--hub-ref-radius-md`  |
| **Sistema**     | `--hub-sys-*`       | Asignaciones con significado que consumen los componentes    | `--hub-sys-color-primary`, `--hub-sys-surface-page`, `--hub-sys-text-primary` |
| **Container**   | `--hub-container-*` | Puente heredable de `sys` a contenedores/slots concretos — un **re-base hook** | `--hub-container-bg`, `--hub-container-padding-x`, `--hub-container-gap` |
| **Base / shell** | `--hub-body-*` · `--hub-main-*` · `--hub-main-wrapper-*` | Layout del _application shell_: el wrapper exterior de la página, la región de contenido y su wrapper centrado. `--hub-body-*` **hereda los valores por defecto de `--hub-container-*`** | `--hub-body-padding-x`, `--hub-main-bg`, `--hub-main-wrapper-max-width` (`1200px`) |

Regla de oro: **los componentes referencian solo tokens `sys`**. Los `sys`
apuntan a los `ref`. Así, cambiar un `sys` re-tematiza; cambiar un `ref` ajusta
la paleta base.

```text
--hub-ref-color-blue-500  →  --hub-sys-color-primary  →  (lo usan los componentes)
```

La capa opcional `container` se apoya sobre `sys` como **re-base hook**:
sobrescribir un token `--hub-container-*` en un subárbol re-basa cada contenedor
descendiente que lo lee (p. ej. `ng-hub-ui-panels`), sin tocar `sys`. El espaciado
emparejado usa solo la forma direccional `-x` / `-y` (`--hub-container-padding-x/-y`,
`--hub-container-margin-x/-y`) — sin atajo.

La capa `base` / shell estandariza el **layout del _application shell_** para que
un aside vertical u horizontal lea un único conjunto de tokens coherente:

- `--hub-body-*` — el wrapper exterior de la app/página. **Hereda los valores por
  defecto de `--hub-container-*`** (`--hub-body-padding-x` recurre a
  `--hub-container-padding-x`, y así sucesivamente), de modo que el sistema de
  espaciado del container gobierna toda la página.
- `--hub-main-*` — la región de contenido (`bg`, `border-radius`, `padding-x/-y`).
- `--hub-main-wrapper-*` — el wrapper centrado alrededor de la región de contenido,
  con un `--hub-main-wrapper-max-width: 1200px` por defecto.

También son variables CSS vivas y re-basables, con la misma convención de
espaciado direccional `-x` / `-y`.

---

## 🎨 Los colores semánticos

Cada variante semántica expone una **familia uniforme** de cinco tokens. El conjunto por
defecto es `primary` · `secondary` · `success` · `danger` · `warning` · `info` · `neutral` ·
`light` · `dark`, y es **abierto**: cada variante que añadas obtiene la misma familia (ver
[Cómo modificarlo](#️-cómo-modificarlo)).

| Token                               | Uso típico                                     |
| ----------------------------------- | ---------------------------------------------- |
| `--hub-sys-color-<v>`               | Color sólido (acento, icono, borde fuerte)     |
| `--hub-sys-color-<v>-subtle`        | Fondo tenue (banners, alertas)                 |
| `--hub-sys-color-<v>-border-subtle` | Borde tenue sobre el fondo subtle              |
| `--hub-sys-color-<v>-emphasis`      | Texto legible sobre el fondo subtle            |
| `--hub-sys-color-<v>-on`            | Color de texto/icono con contraste **sobre** el acento |

Ejemplo de uso (un aviso a juego con el resto de la familia):

```css
.mi-aviso {
	background: var(--hub-sys-color-info-subtle);
	color: var(--hub-sys-color-info-emphasis);
	border: 1px solid var(--hub-sys-color-info-border-subtle);
}
```

---

## 🌗 Temas

Activa un tema con el atributo `data-theme` en `<html>` (o en cualquier
contenedor para tematizar una zona):

```html
<html data-theme="dark">
  <!-- light (por defecto) · base · bootstrap · dark · sunset · forest · mono · terminal -->
</html>
```

Como cada tema **redefine los mismos tokens** con sus valores, todo lo que lee
`--hub-sys-*` se re-colorea automáticamente, incluido tu propio CSS.

---

## 🧰 Utilidades y mixins opt-in

Además de los tokens, el paquete incluye una capa de estilos opt-in — no se emite nada salvo que la importes.

**Hojas de utilidades** — los nombres de clase son **exactamente los de Bootstrap** y cada valor resuelve a los tokens canónicos. No cargues estas hojas Y Bootstrap globalmente en el mismo documento. Cada hoja tiene además su gemela `.css` compilada para apps sin Sass:

```scss
@use 'ng-hub-ui-ds/styles/utilities/layout';    // display/flex (+ responsive), grid de 12 col + offsets, spacing, sizing, position, overflow, order, .vr, .ratio-*, .visually-hidden…
@use 'ng-hub-ui-ds/styles/utilities/text';      // .fs-1…6, .h1…6, .fw-*, .lh-*, .text-truncate, colores de texto semánticos
@use 'ng-hub-ui-ds/styles/utilities/surfaces';  // .bg-* (+ -subtle), .text-bg-*, .border*, .rounded*, .shadow*, .opacity-*
```

Los únicos nombres fuera de Bootstrap son los primitivos de layout que reflejan los mixins: `.stack`, `.cluster`, `.grid-auto`, `.center`.

**Reset de elementos nativos** — una normalización estilo reboot, dirigida por tokens, para apps que no traigan ya un reset (p. ej. el Reboot de Bootstrap):

```scss
@use 'ng-hub-ui-ds/styles/base/reset';
```

**Mixins Sass** — las utilidades son wrappers finos sobre ellos; úsalos para acuñar tus propias variantes con los mismos primitivos:

```scss
@use 'ng-hub-ui-ds' as hub;

.toolbar     { @include hub.cluster($gap: 2); }
.card__title { @include hub.font-size(4); @include hub.font-weight(semibold); }
.card--brand { @include hub.text-bg(brand); @include hub.radius(lg); @include hub.shadow(sm); }
.sr-label    { @include hub.visually-hidden(); }
```

Grupos: **tema** (`theme()` — tematización parcial en una llamada: pásale solo las escalas/acentos cambiados como mapas), **breakpoints** (`media-breakpoint-up/down` sobre el mapa `$hub-breakpoints` — de él se generan las variantes responsive `.d-md-*`, `.col-lg-*`, `.p-sm-*`…), **layout** (`stack`, `cluster`, `grid`, `grid-fixed`, `row`, `col`, `offset`, `center`), **tipografía** (`font-family`, `font-size`, `font-weight`, `line-height`, `text-color`, `link-color`, `text-truncate`, `text-break`), **superficies** (`bg`, `text-bg`, `border`, `border-color`, `radius`, `shadow`), **helpers** (`focus-ring`, `focus-ring-color`, `visually-hidden`, `stretched-link`, `ratio`, `clearfix`) y los **puentes** (`bridge-bootstrap` / `bridge-material` / `bridge-tailwind` / `bridge-open-props`).

El catálogo completo con demos en vivo está documentado en [hubui.dev/design-system](https://hubui.dev/en/design-system/).

---

## 🛠️ Cómo modificarlo

Hay tres mecanismos, de más simple a más avanzado.

### 1. Sobrescribir un token (CSS) — el camino principal

Como cada valor es una variable CSS, re-tematizar es una línea, y **cascada a
toda la familia**:

```css
:root {
	--hub-sys-color-primary: #7c3aed;
	--hub-sys-color-primary-subtle: #ede9fe;
	--hub-sys-color-primary-emphasis: #5b21b6;
}
```

Puedes hacerlo global (`:root`), por tema (`[data-theme='dark']`) o por zona
(`.mi-seccion`).

### 2. Añadir tu propio acento

Define una familia `--hub-sys-color-<nombre>` y los componentes que aceptan una
variante semántica la recogen **sin cambios**. Por ejemplo, el alert de panels
(`<hub-panel appearance="alert" variant="brand">`):

```css
:root {
	--hub-sys-color-brand: #9333ea;
	--hub-sys-color-brand-subtle: #f3e8ff;
	--hub-sys-color-brand-border-subtle: #d8b4fe;
	--hub-sys-color-brand-emphasis: #6b21a8;
}
```

> Con solo `--hub-sys-color-brand` (el acento base) ya funciona: los componentes
> derivan el resto con `color-mix`. Define la familia completa cuando quieras
> tintes exactos.

### 3. Crear un tema propio

Reúne tus overrides bajo un atributo de tema y actívalo cuando quieras:

```css
[data-theme='corporate'] {
	--hub-sys-color-primary: #0033a0;
	--hub-sys-surface-page: #fbfcff;
	--hub-sys-text-primary: #0a1f44;
	/* …el resto de tokens que difieran del tema base */
}
```

---

## 🧩 Funciones SCSS (cómo se genera por dentro)

Las familias de color semántico **no se escriben a mano**, y un tema solo fija el
**acento** de cada variante — `-subtle`, `-border-subtle`, `-emphasis` y `-on` se
derivan **una sola vez** en `:root` a partir del acento, la superficie y el _ink_
vivos. Los nombres de las variantes viven en un único mapa Sass **abierto**, así
que añadir un color o un tema es uniforme y sin _boilerplate_.

```scss
// El ÚNICO sitio que enumera los nombres de variante. Es `!default`, así que puedes
// reemplazarlo entero antes del import — o, mejor, fusionar con $hub-accents-extra.
$hub-accents: (
	primary: var(--hub-ref-color-blue-500, #0d6efd),
	secondary: var(--hub-ref-color-gray-600, #6c757d),
	success: var(--hub-ref-color-green-500, #198754),
	danger:  var(--hub-ref-color-red-500, #dc3545),
	warning: var(--hub-ref-color-yellow-500, #ffc107),
	info:    var(--hub-ref-color-cyan-500, #0dcaf0),
	neutral: var(--hub-ref-color-gray-600, #6c757d),
	light:   var(--hub-ref-color-gray-100, #f8f9fa),
	dark:    var(--hub-ref-color-gray-900, #212529)
) !default;

// Override aditivo — pasa SOLO las variantes que añades o retocas, conserva las demás.
$hub-accents-extra: () !default;
$hub-accents: map.merge($hub-accents, $hub-accents-extra);

// Fija SOLO --hub-sys-color-<variante> (el acento). Se llama en cada bloque de tema
// con el mapa propio del tema, así que un tema emite justo las variantes que retinta.
@mixin hub-color-accents($accents) {
	@each $name, $color in $accents {
		--hub-sys-color-#{$name}: #{$color};
	}
}

// Deriva la familia de roles del acento + superficie + ink vivos. Se emite UNA vez
// en :root sobre el conjunto abierto, así que cada variante — incluidas las tuyas —
// obtiene su familia completa gratis.
@mixin hub-color-derive() {
	@each $name in map.keys($hub-accents) {
		--hub-sys-color-#{$name}-subtle:        color-mix(in oklch, var(--hub-sys-color-#{$name}) 12%, var(--hub-sys-surface-page, #fff));
		--hub-sys-color-#{$name}-border-subtle: color-mix(in oklch, var(--hub-sys-color-#{$name}) 35%, var(--hub-sys-surface-page, #fff));
		--hub-sys-color-#{$name}-emphasis:      color-mix(in oklch, var(--hub-sys-color-#{$name}) 80%, var(--hub-sys-color-ink, #212529));
		// Volteo de contraste en escala de grises según la luminosidad del propio acento:
		// los acentos oscuros (L < .62) resuelven a texto blanco; los claros, a casi negro.
		--hub-sys-color-#{$name}-on:            oklch(from var(--hub-sys-color-#{$name}) clamp(0, (0.62 - l) * 1000, 1) 0 h);
	}
}

:root,
[data-theme='light'] {
	@include hub-color-accents($hub-accents);
	@include hub-color-derive();
}
```

> Casi nunca necesitas tocar el SCSS: como la familia se deriva del **acento
> único** en tiempo de ejecución, sobrescribir `--hub-sys-color-<variante>` en CSS
> plano — incluso en un subárbol — recalcula `-subtle` / `-border-subtle` /
> `-emphasis` / `-on` automáticamente. Los mapas + mixins son solo la mecánica
> interna, útil si contribuyes al paquete o compilas tu propia variante de la paleta.

---

## 📋 Tabla de referencia rápida

| Quiero…                    | Cómo                                                        |
| -------------------------- | ----------------------------------------------------------- |
| Usar la paleta             | `@import '…/hub-tokens.css'` una vez                        |
| Cambiar un color global    | `:root { --hub-sys-color-primary: … }`                      |
| Cambiar el modo oscuro     | `[data-theme='dark'] { --hub-sys-… : … }`                   |
| Añadir un acento propio    | define `--hub-sys-color-<x>` (+ familia opcional)           |
| Crear un tema              | `[data-theme='<nombre>'] { … }` y actívalo                  |
| Ver todos los tokens       | la página de tokens en [hubui.dev](https://hubui.dev/en/design-system/) |

---

## 📊 Changelog

Consulta [CHANGELOG.md](./CHANGELOG.md).

## 🤝 Contribución

Las contribuciones son bienvenidas.

1. **Haz un fork** del repositorio.
2. **Crea** una rama de característica: `git checkout -b feature/amazing-feature`.
3. **Haz commit** de tus cambios: `git commit -m 'Add amazing feature'`.
4. **Haz push** a tu rama: `git push origin feature/amazing-feature`.
5. **Abre** un pull request.

Repositorio: https://github.com/hub-env/ng-hub-ui-ds

## ☕ Apoyo

¿Te gusta este paquete? Puedes apoyar el proyecto invitándome a un café ☕:
[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://buymeacoffee.com/carlosmorcillo)

## 💼 Soporte comercial

Mantengo estas librerías yo mismo: soy [Carlos Morcillo Fernández](https://www.carlosmorcillo.com), arquitecto frontend autónomo, y trabajo con equipos que construyen y mantienen aplicaciones Angular.

Si tu equipo depende de Hub-UI y necesita más de lo que se resuelve en un hilo de incidencias, eso es a lo que me dedico: auditorías de arquitectura, sistemas de diseño, migraciones de Angular y mentoría de equipos. Cuando el proyecto pide además diseño y un equipo completo, lo llevo por [Frog Hub](https://froghub.es), mi estudio de desarrollo.

Aquí están [los servicios](https://www.carlosmorcillo.com/servicios/) y aquí puedes [contarme tu proyecto](https://www.carlosmorcillo.com/contacto/).

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT.

MIT © [Carlos Morcillo Fernández](https://www.carlosmorcillo.com)
</content>
