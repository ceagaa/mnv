# 10 — CTA section (`div.cta-section`) — build spec

## Overview

| | |
| --- | --- |
| Target file | `src/components/sites/elevaana-webflow-io-f5aaaf30/root-8a5edab2/CtaSection.tsx` (named export `CtaSection`) |
| Screenshot | `docs/design-references/elevaana-webflow-io-f5aaaf30/root-8a5edab2/section-10-cta-section.png` |
| DOM source (desktop 1440) | `components/10-cta-section.tree.json` |
| DOM source (tablet 768) | `components/10-cta-section.tablet.tree.json` |
| DOM source (mobile 390) | `components/10-cta-section.mobile.tree.json` |
| CSS source | `webflow.css` (`.cta-section`, `.cta-content-wrapper`, `.cta-section-content`, `.cta-title-wrap`, `.cta-title`, `.cta-subtext`, `.cta-buttons`, `.button-primary`, `.primary-button-*`, `.cta-bg-shape`) |
| Behavior capture | `BEHAVIORS.json` → `initialHidden` (`cta-title`, `cta-subtext`, `cta-buttons`), `primaryButtonHover` |
| Interaction source of truth | `webflow.js` IX2 page bundle (`elevaana.webflow.io/js/webflow.facc2713.*.js`) — action lists `a-57` / `a-58` (“Primary Button Animation” / “Primary Button Animation Out”), events `e-1794` / `e-1796` / `e-1798`, preset `slideInBottom` |

**Interaction model (global rules apply):** the page is not sticky, the section itself has no
reveal (the `div.cta-section` carries no `data-w-id`); three *inner* elements reveal on scroll
with an IntersectionObserver hook local to the file; the primary button uses the two-stacked-
text-copies hover; the Webflow floating "Get This Template / Unlock 100+ Templates / Access
4200+ Components" widget is **never** rendered.

**Section role:** full-bleed dark-green band, centred headline + sub-copy + one white
"Book A Free Consultation" pill, with a noise-texture image stretched across the whole box
behind the content (`z-index` of the content wrapper is `2`, the image is `z-auto`).

## DOM structure

```
div.cta-section                                    <div> #112C23, padding 124/30/144, position relative
├── div.container.w-container                      block, max-w 1280, mx-auto (computed margin 0 50px)
│   └── div.cta-content-wrapper                    flex, justify-center, position relative, z-index 2
│       └── div.cta-section-content                flex-col, center, gap 32 (30 ≤479), max-w 840, w-full
│           ├── div.cta-title-wrap                 flex-col, align-center, gap 24 (20 ≤479), w-full
│           │   ├── h2.cta-title                   heading, centred, 56/67.2/600/-1.5px, white
│           │   └── p.cta-subtext                  Instrument Sans, 16/27.2, #F7F6F3, centred, max-w 500
│           └── div.cta-buttons                    block, shrink-to-fit (253.016px)
│               └── a.button-primary → /contact-us inline-block, max-w 100%, cursor pointer
│                   └── div.primary-button-area    flex center, white, radius 12, p 16/32, overflow hidden
│                       ├── div.primary-button-text-wrap   relative, overflow hidden, 189.016 × 27.2031
│                       │   ├── p.primary-button-text        relative z-2, dark #112C23 label
│                       │   └── p.primary-button-text-hover  absolute bottom -30px, white label
│                       └── div.primary-button-bg           absolute left -2, h-full, orange, width 0 → 102%
└── img.cta-bg-shape                              absolute inset-0, w-full h-full, alt="", texture PNG
```

Element tags are reproduced verbatim from the tree (the section is a `div`, the two button
labels are `p` elements, the texture is an `img`). The `.cta-bg-shape` `<img>` is the **last**
child of `.cta-section`; `.cta-content-wrapper` wins the paint order because of `z-index: 2`.

## Computed styles

### `.cta-section` (root)

| Property | Desktop ≥992 | Tablet 768–991 | Mobile ≤767 (captured 390, ≤479) |
| --- | --- | --- | --- |
| display / position | `block` / `relative` | same | same |
| background-color | `#112C23` | `#112C23` | `#112C23` |
| padding | `124px 30px 144px` | `80px 30px` | `60px 20px` |
| font (inherited) | Rethink Sans 14/20 | same | same |
| used height | `572.016px` | `435.203px` | `418.812px` |

CSS source: `.cta-section{padding:124px var(--all-gap--gap-30p) 144px; background-color:
var(--all-color--neutral-04); position:relative}` + `@media ≤991 { padding-top/bottom:80px }` +
`@media ≤479 { padding-top/bottom:60px }`; `--all-gap--gap-30p` = `30px` (≥480) / `20px` (≤479).

### `.container` (Webflow block container)

| Property | Desktop | Tablet | Mobile |
| --- | --- | --- | --- |
| width (used) | `1280px` (margin `0 50px`) | `708px` | `350px` |
| max-width | `1280px` | `1280px` | `1280px` |

Reproduced with `mx-auto w-full max-w-[1280px]` inside the section's horizontal padding.

### `.cta-content-wrapper` (flex row)

| Property | All breakpoints |
| --- | --- |
| display / justify-content | `flex` / `center` |
| position / z-index | `relative` / `2` |
| width (used) | container width (1280 / 708 / 350) |
| height (used) | 304.016 / 275.203 / 298.812 px |

### `.cta-section-content` (flex column)

| Property | Desktop | Tablet | Mobile |
| --- | --- | --- | --- |
| display / flex-direction | `flex` / `column` | same | same |
| justify-content / align-items | `center` / `center` | same | same |
| gap | `32px` | `32px` | `30px` (≤479 rule) |
| width (used) / max-width | `840px` / `840px` | `708px` / `840px` | `350px` / `840px` |
| height (used) | `304.016px` | `275.203px` | `298.812px` |

`.cta-section-content{grid-column-gap:32px;grid-row-gap:32px;flex-flow:column;justify-content:
center;align-items:center;max-width:840px;display:flex}` + `@media ≤479 { gap:30px }`.
Rendered as `w-full max-w-[840px]`.

### `.cta-title-wrap` (flex column)

| Property | Desktop | Tablet | Mobile |
| --- | --- | --- | --- |
| display / flex-direction | `flex` / `column` | same | same |
| align-items | `center` | `center` | `center` |
| gap | `24px` | `24px` | `20px` (≤479) |
| width (used) | `840px` | `708px` | `350px` |

Gap comes from `var(--all-gap--gap-24)` = `24px` (≥480) / `20px` (≤479).

### `h2.cta-title`

`.cta-title{font-family:var(--all-font-family--primary-font);color:var(--all-color--neutral-01);
font-size:var(--all-heading--heading-2);line-height:var(--line-height--120);font-weight:
var(--all-font-weight--semibold);text-align:center;letter-spacing:var(--all-letter-spacing--1-5)}`

| Property | ≥992 | 768–991 | 480–767 | ≤479 (390 capture) |
| --- | --- | --- | --- | --- |
| font-size | `56px` | `44px` | `35px` | `30px` |
| line-height | `67.2px` | `52.8px` | `42px` | `36px` |
| letter-spacing | `-1.5px` | `-1px` | `-0.5px` | `0px` (key absent in mobile tree) |
| font-weight / color | `600` / `#FFFFFF` | same | same | same |
| text-align | `center` | `center` | `center` | `center` |
| width / height (used) | `840` / `134.406` (2 lines) | `708` / `105.594` (2) | — | `350` / `108` (3 lines) |

The four steps come from the `body` CSS-variable overrides of `--all-heading--heading-2` and
`--all-letter-spacing--1-5` at 991 / 767 / 479.

### `p.cta-subtext`

`.cta-subtext{opacity:.7;color:var(--all-color--neutral-02);font-size:var(--all-heading--
body-16);line-height:var(--line-height--170);text-align:center;max-width:500px}`

| Property | All breakpoints (captured values identical) |
| --- | --- |
| font-family | `"Instrument Sans", sans-serif` → `font-sans` |
| font-size / line-height / weight | `16px` / `27.2px` / `400` |
| color | `#F7F6F3` |
| text-align | `center` |
| max-width | `500px` (used: 500 / 500 / 350) |
| opacity | **`1`** in the desktop tree — the class says `.7`, but the IX2 reveal animates the
computed opacity to `1` and leaves it inline; the final state therefore renders at full
opacity. Implemented as `opacity-100` in the revealed state. |
| height (used) | `54.406` (2 lines) / `54.406` / `81.609` (3 lines) |

### `.cta-buttons` + `.button-primary`

| Property | Value (all breakpoints) |
| --- | --- |
| `.cta-buttons` display / used size | `block` / `253.016 × 59.2031` (shrink-to-fit flex item) |
| `.button-primary` display | `inline-block`, `text-decoration:none`, `max-width:100%`, `cursor:pointer`, used `253.016 × 59.2031` |

### `.primary-button-area` (variant `w-variant-58c2e225…`)

| Property | Value |
| --- | --- |
| display / justify / align / gap | `flex` / `center` / `center` / `10px` |
| background-color | `#FFFFFF` (`--all-color--neutral-01`) |
| padding | `16px 32px` (variant override of the base `10px 15px`) |
| border-radius | `12px` |
| overflow | `hidden` |
| position | `relative` |
| transition | `background-color 0.5s` (inert — no CSS hover rule changes it) |
| used size | `253.016 × 59.2031` (= 189.016 content + 64 padding / 27.2031 + 32 padding) |

### `.primary-button-text-wrap` / `.primary-button-text` / `.primary-button-text-hover`

| Property | `.primary-button-text-wrap` | `.primary-button-text` | `.primary-button-text-hover` |
| --- | --- | --- | --- |
| position | `relative` | `relative` | `absolute`, `bottom:-30px`, `left:0` (used `top:30px`) |
| overflow | `hidden` | — | — |
| z-index | — | `2` | `2` |
| size | `189.016 × 27.2031` | `189.016 × 27.2031` (1 line) | `189.016 × 27.2031` |
| font | 14/20 (inherited, unused) | Rethink Sans `16px/27.2px` weight `500` | same |
| color | `#112C23` (variant `--neutral-04`) | `#112C23` | `#FFFFFF` (variant `--neutral-01`) |
| margin | — | `margin-bottom:0` (no `p` margins) | `margin-bottom:0` |

Because the wrap is `27.2031px` tall with `overflow:hidden` and the hover copy sits at
`top:30px`, the hover copy is completely clipped until the hover translation moves it up.

### `.primary-button-bg` (variant `w-variant-58c2e225…`)

| Property | Value |
| --- | --- |
| position / offsets | `absolute`, `left:-2px`, `top:0` (used `bottom:0.015625px`), `height:100%` |
| background-color | `#FF6C1F` (`--all-color--theme-color-01`) |
| width (rest / hover) | `0px` (computed `right:255.016px` with a `253.016px` container ⇒ used width 0) → `102%` |

It is empty content in an absolutely positioned box ⇒ `width:auto` collapses to `0`. The IX2
hover grows it to `102%` (the `102%` compensates the `left:-2px` so it fully covers the pill).

### `img.cta-bg-shape`

| Property | Value |
| --- | --- |
| position / inset | `absolute` / `inset:0%` |
| width / height | `100%` / `100%` (used `1440×572.016`, `768×435.203`, `390×418.812`) |
| max-width | `100%` |
| object-fit | `fill` (stretched to the section box) |
| alt | `""` |

## States & behaviors

| # | Trigger | Before | After | Transition | Implementation |
| --- | --- | --- | --- | --- | --- |
| 1 | `h2.cta-title` scrolls into view (IX2 `e-1794`, preset `slideInBottom`, delay **100ms**) | `opacity:0`, `translateY(100px)` | `opacity:1`, `translateY(0)` | `1000ms`, easing `outQuart` = `cubic-bezier(0.165,0.84,0.44,1)` | local `useInView` IntersectionObserver + `transition-[opacity,transform] duration-[1000ms] ease-[cubic-bezier(0.165,0.84,0.44,1)] delay-[100ms]` |
| 2 | `p.cta-subtext` scrolls into view (`e-1796`, same preset, delay **200ms**) | same as #1 (final opacity is `1`, overriding the class `.7`) | same | same, `delay-[200ms]` | own `useInView` instance |
| 3 | `div.cta-buttons` scrolls into view (`e-1798`, same preset, delay **300ms**) | same as #1 | same | same, `delay-[300ms]` | own `useInView` instance |
| 4 | hover anywhere over `a.button-primary` (IX2 `e-1096` → action list `a-57`) | `.primary-button-bg { width:0 }` | `.primary-button-bg { width:102% }` | `200ms` | `group` on the `<a>`, `w-0 group-hover:w-[102%] transition-[width] duration-200` |
| 5 | same hover | `.primary-button-text { translateY(0) }` | `translateY(-30px)` | `300ms`, easing default (`ease`) | `transition-transform duration-300 ease group-hover:-translate-y-[30px]` |
| 6 | same hover | `.primary-button-text-hover { translateY(0) }` (clipped at `top:30px`) | `translateY(-30px)` ⇒ visible at `top:0` | `300ms`, `ease` | identical classes on the absolutely positioned copy inside the `overflow-hidden` wrap |
| 7 | pointer leaves the button (`e-1097` → `a-58`) | — | bg width → `0`, both texts → `translateY(0)` | `200ms` (bg) / `300ms` (texts) | automatic: the `group-hover` reversal uses the same durations |
| 8 | JS unavailable / `IntersectionObserver` missing | — | elements are shown immediately | — | hook falls back to `visible = true` (same guard as `MetricsSection`) |
| 9 | `prefers-reduced-motion: reduce` | — | no reveal transition, content appears instantly on intersect | — | `motion-reduce:transition-none` |

Notes on the hover:

* The **two stacked text copies** are required: copy A is `relative` at `top:0`, copy B is
  `absolute bottom:-30px` (used `top:30px`), both inside a `27.2031px`-tall
  `overflow:hidden` wrap. On hover **both** translate Y by `-30px` over `300ms`, so A exits
  through the top and B lands exactly in the line box — this is the "30px line box" roll-over.
* The orange `.primary-button-bg` (width 0 at rest) is what makes the hover copy legible: it
  expands to `102%` in `200ms`, turning the white pill orange while the label turns white.
* `.primary-button-area`'s `transition: background-color .5s` is inert (no CSS `:hover` rule
  and no IX2 action targets it) — kept as a faithful no-op `transition-[background-color]
  duration-500`.
* No parallax / no background-motion behaviour exists for this section (`.cta-bg-shape`,
  `.cta-section`, `.cta-content-wrapper` are referenced by **zero** IX2 actions).

## Assets (local, via `ASSETS` from `../shared/assets`)

| Key | Local path | Used for |
| --- | --- | --- |
| `692fd2dc4d63bf298d8f850a_texture-1` | `/sites/elevaana-webflow-io-f5aaaf30/root-8a5edab2/images/692fd2dc4d63bf298d8f850a_texture-1-2da9b7.png` | `img.cta-bg-shape` — absolute full-bleed noise texture behind the content |

The original serves this via `srcset` (`-p-500/-p-800/-p-1080/-p-1600/-p-2000`); only one
local file exists in `shared/assets.ts`, so the single local copy is used at every viewport
(the image is a stretched, low-contrast grain — no visible difference).

No remote URLs. No other images/video in this section.

## Text content (verbatim)

- `Need a Renovation You Can Trust? Let’s Redesign Your Home` — `h2.cta-title`
- `Renovation experience that’s smooth from start to finish. Book your free consultation today — no pressure, just possibilities.` — `p.cta-subtext`
- `Book A Free Consultation` — `p.primary-button-text`
- `Book A Free Consultation` — `p.primary-button-text-hover` (identical second copy, required by the roll-over)
- `alt=""` on the texture `<img>`
- Button `href`: `/contact-us`

Punctuation is copied exactly, including the typographic apostrophes (`’`) and the em dash
(`—`).

## Responsive

Breakpoints: base styles = Webflow mobile ≤767 (captured at 390px, i.e. the ≤479 step);
`md:` = 768px (Webflow tablet floor); `lg:` = 992px (Webflow desktop floor). The extra
Webflow step at 479px (which only affects padding/gaps/type) is reproduced with
`max-[479px]:` and is never used in a variant-vs-variant conflict, so the cascade order is
deterministic.

| Piece | base ≤767 (≤479 values at 390) | `md:` 768–991 | `lg:` ≥992 | 480–767 note |
| --- | --- | --- | --- | --- |
| section padding | `60px 20px` (≤479) | `80px 30px` | `124px 30px 144px` | base is `80px 30px`, `max-[479px]:` drops it to `60px 20px` |
| `.cta-section-content` gap | `30px` (≤479) | `32px` | `32px` | base `32px`, `max-[479px]:gap-[30px]` |
| `.cta-title-wrap` gap | `20px` (≤479) | `24px` | `24px` | base `24px`, `max-[479px]:gap-[20px]` |
| `h2.cta-title` size | `30px / 36px / 0px` (≤479) | `44px / 52.8px / -1px` | `56px / 67.2px / -1.5px` | base `35px / 42px / -0.5px` |
| `p.cta-subtext` | `16/27.2`, width 350 (max 500) | `16/27.2`, width 500 | `16/27.2`, width 500 | identical at every step |
| button pill | `253.016 × 59.2031`, `p 16/32` | identical | identical | no change |
| texture `<img>` | absolute `inset:0`, `w-full h-full` | identical | identical | no change |

Accepted deviations:

- Webflow's `≤479` step is also expressed in the original as `≤767` media blocks for some
  unrelated selectors; here every rule was resolved to its actual enclosing `@media` block, so
  the 480–767 range is pixel-correct too (title 35px, padding `80px 30px`, gaps 32/24).
- The `srcset` width variants of the texture are collapsed to one local file (see Assets).
- Reveal easing is expressed as `cubic-bezier(0.165,0.84,0.44,1)` — the CSS approximation of
  Webflow's internal `outQuart` easing.
