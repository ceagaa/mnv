# 11 — Top label / CTA ticker ("Call us today" strip) — build spec

## Overview

| | |
| --- | --- |
| Target file | `src/components/sites/elevaana-webflow-io-f5aaaf30/root-8a5edab2/TopLabelSection.tsx` (named export `TopLabelSection`) |
| Screenshot | `docs/design-references/elevaana-webflow-io-f5aaaf30/root-8a5edab2/section-11-top-label.png` |
| DOM source (desktop 1440) | `components/11-top-label.tree.json` |
| DOM source (tablet 768) | `components/11-top-label.tablet.tree.json` |
| DOM source (mobile 390) | `components/11-top-label.mobile.tree.json` |
| CSS source | `webflow.css` (`.top-label`, `.top-label-text-block`, `.top-label-text-wrap`, `.top-label-dot`, `.cta-phone-text-wrap`, `.cta-contact-title`) |
| Behavior capture | `BEHAVIORS.json` → **no entry for this section** (it is not in `initialHidden` and not in `afterFullScrollHidden` ⇒ no scroll reveal). Real behaviour recovered from the live site's Webflow IX2 bundle (`js/webflow.facc2713.*.js`: action lists `a-27` "Top Label Animation" and `a-59` "Cta Ticker") and confirmed with a live Playwright probe. |

**INTERACTION MODEL: auto-scrolling marquee (ticker), two layered movements — no scroll reveal, no hover state on the strip itself.**

1. **Auto marquee (primary, IX2 `a-27` "Top Label Animation", `PAGE_START`, `loop: true`)**
   `.top-label-text-block` starts at `translateX(0)` and animates to `translateX(-100%)`
   (% of the block's own width = 100vw) over **20 000 ms, linear, infinite loop**, i.e. it
   slides **left** at **72 px/s at 1440 vw** (measured live: −231.6 px → −810.0 px in 8 s ⇒
   72.3 px/s = 1440/20). Because the block's width equals the viewport width, the distance per
   cycle is `100%` of the viewport (1440 px desktop / 768 px tablet / 390 px mobile), so the
   strip runs slower in absolute px on smaller breakpoints but always takes 20 s per cycle.
   Implemented with **CSS `@keyframes` + `animation: … 20s linear infinite`** (keyframes are
   injected by a `<style>` tag inside the component because `globals.css` is owned by another
   agent). There are **no** ticker `@keyframes` in `webflow.css` — the original is JS/IX2 driven.
2. **Scroll-linked parallax (IX2 `a-59` "Cta Ticker", `SCROLLING_IN_VIEW` continuous,
   `smoothing: 70`, keyframes 0 → −120 vw)**
   The outer `.cta-ticker` moves `translateX(0)` → `translateX(-120vw)` as the section travels
   from entering the bottom of the viewport to leaving the top, with easing/smoothing.
   **Live-verified mapping** (1440×900 viewport, section height 97.6 px):
   `p = clamp01((viewportHeight − sectionTop) / (viewportHeight + sectionHeight))`,
   `x = −120vw × p`. Measured points: sectionTop 900 → 0 px, 800 → −172.3 px, 700 → −345.5 px,
   600 → −518.7 px, 500 → −691.9 px, 400 → −865.1 px, 310 (page bottom) → −1021.0 px
   (= 0.591 × −1728; (900−310)/997 = 0.5918 ✓). Smoothing ≈ 500 ms, reproduced with a
   `requestAnimationFrame` lerp (factor 0.12/frame). Implemented with an inline
   `style={{ transform }}` because a scroll-driven value is impossible in Tailwind.
   The desktop tree's `.cta-ticker` shows `matrix(1,0,0,1,0,0)` — that snapshot was taken
   before IX2's scroll handler updated (the block was captured mid-tween at −644 px ≈ 9 s after
   load); `translateX(0)` is the correct **initial** state (page top / section below viewport).

**Not present:** scroll reveal (opacity is `1` in all three trees, section absent from
`initialHidden`), hover styles on the ticker, the floating Webflow "Get This Template" widget
(never rendered).

**Section role:** full-bleed orange band between the CTA section and the footer carrying an
endless "Call us today – (416) 555-0192" ticker with phone icons and white dot separators.

## DOM structure

```
section.top-label                            block, bg #FF6C1F, padding 20px 0, overflow hidden
└─ div.cta-ticker                            block, full width  ← scroll-linked translateX(0 → −120vw)
   └─ div.top-label-text-block               flex row, items-center, gap 20  ← auto marquee (0 → −100%, 20s)
      ├─ div.top-label-text-wrap             flex, flex:none, items-center, gap 20   (×4)
      │  ├─ div.cta-phone-text-wrap          flex, gap 12
      │  │  ├─ img.phone-icon                40×(line box) svg, alt ""
      │  │  └─ a.cta-contact-title           "Call us today - (416) 555-0192"  href tel:…
      │  ├─ div > div.top-label-dot          12×12 white circle
      │  └─ div.cta-phone-text-wrap          (2nd copy: icon + link)
      ├─ div > div.top-label-dot             separator between wraps  (3×, i.e. 4 wraps → 3 dots)
      ├─ div.top-label-text-wrap             …
      ├─ div > div.top-label-dot
      └─ div.top-label-text-wrap             …
```

Exactly **4** `.top-label-text-wrap` groups separated by **3** dot wrappers (verified identical
in the desktop, tablet and mobile trees, and in the live DOM: 8 link instances = 4 × 2).
Each wrap holds **2** icon+link pairs with a dot between them, so the visible sequence is a
perfectly regular `🔗 text • 🔗 text • 🔗 text • …` rhythm (gaps: 20 px around every dot,
12 px between icon and text).

## Computed styles

### `section.top-label` (container)

| Property | Desktop ≥992 | Tablet 768–991 | Mobile ≤767 |
| --- | --- | --- | --- |
| background-color | `#FF6C1F` (`rgb(255,108,31)`, `--all-color--theme-color-01`) | same | same |
| padding | `20px 0` | `20px 0` | `20px 0` |
| overflow | `hidden` (both axes) | `hidden` | `hidden` |
| display / width | `block` / full width | `block` / full width | `block` / full width |
| height (content driven) | `97.5938px` | `85.5938px` | `80px` |
| font | `14px/20px "Rethink Sans", sans-serif`, weight 400 | same | same |

### `div.cta-ticker` (outer, scroll-linked)

| Property | Value |
| --- | --- |
| display / width / height | `block` / full width / content height (`57.59` / `45.59` / `40`) |
| transform | `translateX(0)` at rest → `translateX(-120vw)` at scroll progress 1 (see interaction model) |
| CSS rule in `webflow.css` | **none** — plain wrapper, only targeted by IX2 |

### `div.top-label-text-block` (marquee track)

| Property | Value |
| --- | --- |
| display | `flex`, `flex-direction: row`, `align-items: center` |
| gap | `20px` |
| width | full width (1440 / 768 / 390) — children overflow it and are clipped by the section |
| transform | `translateX(0)` → `translateX(-100%)`, 20 s linear infinite |
| height | `57.5938` / `45.5938` / `40` px (line box height) |

### `div.top-label-text-wrap` (one group)

| Property | Value |
| --- | --- |
| display | `flex`, `align-items: center` |
| gap | `20px` (`--all-gap--gap-20`) |
| flex | `none` (`0 0 auto`) ⇒ content sized, never shrinks |
| width | `1425.78` (desktop) / `1172.5` (tablet) / `949.219` (mobile) px |
| height | `57.5938` / `45.5938` / `40` px |

### `div.cta-phone-text-wrap` (icon + link)

| Property | Value |
| --- | --- |
| display | `flex`, `flex-direction: row`, `align-items: stretch` (default) |
| gap | `12px` |
| width | `686.891` / `560.25` / `448.609` px |
| height | `57.5938` / `45.5938` / `40` px (cross size = tallest item) |

### `img.phone-icon`

| Property | Value |
| --- | --- |
| natural size | 40 × 40 (SVG) |
| rendered | `40px × 57.59` desktop, `40 × 45.59` tablet, `40 × 40` mobile (stretched by the flex line's cross size; `object-fit: fill`, `max-width: 100%`, `overflow: clip`) |
| alt | `""` |

### `a.cta-contact-title`

| Property | Desktop ≥992 | Tablet 768–991 | Mobile ≤767 |
| --- | --- | --- | --- |
| font-family | `"Rethink Sans", sans-serif` (Tailwind `font-heading`) | same | same |
| font-size | `48px` | `38px` | `28px` |
| line-height | `57.6px` (120%) | `45.6px` | `33.6px` |
| letter-spacing | `-1.5px` | `-1px` | `0px` (computed `normal`) |
| font-weight | `600` | `600` | `600` |
| color | `#FFFFFF` | `#FFFFFF` | `#FFFFFF` |
| text-decoration | `none` (`:hover` → `underline`) | same | same |
| display / cursor | `block` / `pointer` | same | same |

### `div.top-label-dot`

| Property | Value (all breakpoints) |
| --- | --- |
| size | `12px × 12px` |
| background-color | `#FFFFFF` (`--all-color--neutral-01`) |
| border-radius | `100px` |
| wrapper div | plain `12 × 12` block (no class in source, reproduced) |

## States & behaviors

| # | Trigger | Before | After | Transition | Implementation |
| --- | --- | --- | --- | --- | --- |
| 1 | Page load (`PAGE_START`, loops forever) | `.top-label-text-block` `translateX(0)` | `translateX(-100%)` (= −100% of its own width) | 20 000 ms, linear, infinite restart | CSS `@keyframes elevaana-top-label-marquee` + `animation: elevaana-top-label-marquee 20s linear infinite` injected via a `<style>` tag in the component (keyframes cannot live in `globals.css`, which this agent does not own) |
| 2 | Section scrolls through the viewport (`SCROLLING_IN_VIEW`, smoothing 70) | `.cta-ticker` `translateX(0)` (section below viewport / page top) | `translateX(-120vw)` when the section has fully passed the top of the viewport | continuous, ≈500 ms smoothing | `useEffect` + `scroll`/`resize` listeners + `requestAnimationFrame` lerp (factor 0.12/frame); inline `style={{ transform: translate3d(x,0,0) }}` (dynamic value, impossible in Tailwind) |
| 3 | Hover on any `a.cta-contact-title` | `text-decoration: none` | `text-decoration: underline` | browser default | `hover:underline` |
| 4 | Scroll reveal | — | — | — | **N/A** — section is absent from `BEHAVIORS.json → initialHidden`; opacity is `1` in every tree ⇒ rendered visible immediately |
| 5 | Hover on the strip / dots / icons | — | — | — | N/A (no rules in `webflow.css`) |

## Assets

| Key in `ASSETS` | Local path | Used for |
| --- | --- | --- |
| `692fd2dc4d63bf298d8f850b_phone-receiver-silhouette-1` | `/sites/elevaana-webflow-io-f5aaaf30/root-8a5edab2/images/692fd2dc4d63bf298d8f850b_phone-receiver-silhouette-1-5fb40a.svg` | `img.phone-icon` (40 × 40 phone receiver silhouette, rendered 8 times — 2 per group × 4 groups) |

Original CDN URL: `…/692fd2dc4d63bf298d8f850b_phone-receiver-silhouette%201.svg`.

## Text content (verbatim)

Single string, repeated **8 times** (4 groups × 2):

```
Call us today - (416) 555-0192
```

- Plain hyphen `-` (not an en dash), ASCII digits, parentheses exactly as shown.
- `href` (verbatim from source, odd but faithful): `tel:835:+1-395-385-4819`
- Image `alt`: `""` (empty, as in source).

## Responsive

| | Desktop ≥992 (`lg:`) | Tablet 768–991 (`md:`) | Mobile ≤767 (base) |
| --- | --- | --- | --- |
| Section height | 97.59 px | 85.59 px | 80 px |
| Ticker line box | 57.59 px | 45.59 px | 40 px |
| Link type | 48 / 57.6 / −1.5px / 600 | 38 / 45.6 / −1px / 600 | 28 / 33.6 / 0px / 600 |
| Groups rendered | 4 | 4 | 4 |
| Marquee distance per 20 s cycle | −1440 px (100% of block) | −768 px | −390 px |
| Scroll parallax range | 0 → −120vw | 0 → −120vw | 0 → −120vw |

Breakpoints follow Webflow: desktop ≥992 → `lg:`, tablet 768–991 → `md:`, mobile ≤767 → base.
No wrapping/stacking occurs at any breakpoint — the strip is a single horizontal line that is
clipped by `overflow: hidden` on the section.

## Gaps / notes

- The exact IX2 smoothing curve is approximated with a rAF lerp (0.12/frame ≈ 500 ms settle);
  the end positions (0 and −120vw) and the mapping formula are measured from the live site.
- The original marquee has a tiny discontinuity every 20 s (block travels 100% of the viewport
  while the repeating unit is `wrap + gap` ≈ 1445.78 px at 1440 vw); reproduced as-is rather
  than "fixed", to stay 1:1 with the source.
- No floating "Get This Template" widget is rendered.
