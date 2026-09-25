# 08 — Our expertise section — build spec

## Overview

| | |
| --- | --- |
| Target file | `src/components/sites/elevaana-webflow-io-f5aaaf30/root-8a5edab2/ExpertiseSection.tsx` (named export `ExpertiseSection`) |
| Screenshot | `docs/design-references/elevaana-webflow-io-f5aaaf30/root-8a5edab2/section-08-our-expertise-section.png` |
| DOM source (desktop 1440) | `components/08-our-expertise-section.tree.json` |
| DOM source (tablet 768) | `components/08-our-expertise-section.tablet.tree.json` |
| DOM source (mobile 390) | `components/08-our-expertise-section.mobile.tree.json` |
| CSS source | `webflow.css` (`.our-expertise-section`, `.our-expertise-content-*`, `.our-expart-*`, `.hero-image-wrap.our-expertise`, `.work-card-overlay-02`, `.primary-button-*`) |
| Behavior capture | `BEHAVIORS.json` → `initialHidden`, `primaryButtonHover`; `components/hover-ourexpartcard.json` |

**Interaction model (verified against the live IX2 data in `webflow.facc2713.1f684ae672bd7cfd.js`
plus the local captures):**

1. **Scroll reveal — opacity/slide.** `h2.our-expart-title`, `p.our-expart-description`, the
   button wrapper `div`, and the three `.our-expart-card`s all ship inline `style="opacity:0"`
   in the source HTML and are listed in `BEHAVIORS.json → initialHidden`. Each has its own
   `SCROLL_INTO_VIEW → SLIDE_EFFECT slideInBottom` event with these delays:
   **title 200ms · description 300ms · button 400ms · card1 100ms · card2 200ms · card3 300ms**
   (events `e-1216 / e-1218 / e-1220 / e-1222 / e-1224 / e-1226`, `scrollOffsetValue:0%`,
   `mediaQueries:["main","medium","small","tiny"]`).
   Reproduced with a local IntersectionObserver hook (`useInView`, one instance per target) and
   the team's standard reveal (`opacity 0 → 1` + `translateY(24px)`, `700ms ease-out`,
   `motion-reduce:transition-none`) plus the exact Webflow delays above. Final state = the
   values in the desktop tree (`opacity:1`, `transform:matrix(1,0,0,1,0,0)`).
2. **White curtain wipe over the photo.** `.hero-image-wrap.our-expertise` carries
   `data-w-id="95f81681-…"`, event `e-1137` = `SCROLL_INTO_VIEW → actionList a-69`
   ("Work Card Animation 2"). Action list `a-69`:
   group 1 (initial state) sets `.work-card-overlay-02` `display:block` + `scale3d(1,1,1)`;
   group 2 animates `x: 1 → 0` with **delay 200ms, duration 500ms**. The element's source HTML
   is `style="display:block; … scale3d(1, 1, 1) …"`, i.e. the image starts fully covered by a
   white panel and the panel collapses horizontally when the image scrolls into view.
   `transform-origin:100%` (`.work-card-overlay-02`) → it retracts toward the right edge.
   The final desktop-tree state is `transform: matrix(0,0,0,1,0,0)` (= `scaleX(0)`).
3. **Primary button hover** (`a-57` / `a-58`, `MOUSE_OVER`/`MOUSE_OUT` on
   `data-w-id="8d75dbfa-…"`): `.primary-button-bg` `width 0% → 102%` over **200ms**;
   `.primary-button-text` and `.primary-button-text-hover` both `translateY 0 → -30px` over
   **300ms** (reverse on mouse-out). The label area is an `overflow:hidden` 30px line box with
   the second copy parked at `bottom:-30px`. Matches `BEHAVIORS.json → primaryButtonHover`
   (`txt.transform: matrix(1,0,0,1,0,-30)` after hover) and the global brief.
4. **No card hover.** `hover-ourexpartcard.json` shows a zero before/after delta for
   `.our-expart-card`, and the card `data-w-id`s only appear in `SCROLL_INTO_VIEW` events —
   no `MOUSE_OVER` interaction exists for the cards.
5. Header is not sticky; the floating Webflow "Get This Template" widget is never rendered.

**Section role:** white band, two-column intro (540px rounded photo left / heading + copy +
orange CTA right), followed by a 3-column row of icon cards (2 columns on tablet, 1 on mobile).

## DOM structure

```
section.our-expertise-section                  <section>, transparent, padding
└─ div.container.w-container                   max-w 1280, mx-auto
   └─ div.our-expertise-content-wrapper        flex-col, gap 96/80/60
      ├─ div.our-expertise-content-wrap        flex row ≥992 · column ≤991, align center, gap 60/60/40
      │  ├─ div.hero-image-wrap.our-expertise  w-full, max-w 540/80%/100%, rounded 12, relative, overflow hidden
      │  │  ├─ img.hero-image                  1440×1466, w-full h-auto, rounded 12, alt=""
      │  │  └─ div.work-card-overlay-02        absolute inset-0, white, rounded 12, z-100, origin-right, scaleX 1→0
      │  └─ div.our-expart-content-flex        flex-col, items-start, gap 32, max-w 601/80%/100%
      │     ├─ div.our-expart-title-wrap       flex-col, gap 16
      │     │  ├─ h2.our-expart-title          "Our experienced team handles …"
      │     │  └─ p.our-expart-description     "Whether you’re updating …" (max-w 475)
      │     └─ div (unnamed, opacity reveal)   shrink-to-fit
      │        └─ a.button-primary             href="/contact-us", inline-block, no-underline
      │           └─ div.primary-button-area   orange, rounded 12, p 16/26, overflow hidden, relative
      │              ├─ div.primary-button-text-wrap    relative, overflow hidden (30px line box)
      │              │  ├─ p.primary-button-text        "Get a Free Quote" (relative, white)
      │              │  └─ p.primary-button-text-hover  "Get a Free Quote" (absolute, bottom -30px)
      │              └─ div.primary-button-bg           absolute, left -2px, h-full, w 0 → 102%, #112C23
      └─ div.our-expart-card-lists             grid 3 cols ≥992 · 2 cols 768–991 · 1 col ≤767, gap 24
         └─ (×3) div.our-expart-card           flex-col, gap 24/24/20, pr 32/0/0
            ├─ div.our-expart-icon-wrap        80/80/60 square, #F7F6F3, rounded 12, flex center
            │  └─ img.our-expart-icon          32/32/24, alt=""
            └─ div.our-expart-text-wrap        flex-col, gap 12
               ├─ p.our-expertise-title        16/27.2 semibold #112C23 (Instrument Sans)
               └─ p.our-expertise-subtext      16/27.2 regular #47564E (Instrument Sans)
```

Tags are reproduced verbatim from the tree (heading is `h2`, all copy blocks are `p`).
`h2` inherits the Webflow base rule `h2{font-family:Rethink Sans; color:#112C23; font-weight:600;
line-height:120%; letter-spacing:var(--all-letter-spacing--1-5); margin:0}`; `p` inherits
`p{font-family:Instrument Sans; color:#47564E; font-weight:400; line-height:170%; margin:0}`.

## Computed styles

### Section & container (`.our-expertise-section`, `.container`)

| Property | Desktop ≥992 | Tablet 768–991 | Mobile ≤767 |
| --- | --- | --- | --- |
| background-color | transparent (none set) | transparent | transparent |
| padding | `120px 30px` | `80px 30px` | `60px 20px` |
| container width / max-width | `1280px` / `1280px` | `708px` / `1280px` | `350px` / `1280px` |
| font (inherited) | Rethink Sans 14/20 #333 | same | same |
| section height (measured) | `1110.81px` | `1676.22px` | `1577.12px` |

### `.our-expertise-content-wrapper` (flex column)

| Property | Desktop | Tablet | Mobile |
| --- | --- | --- | --- |
| display / flex-direction | `flex` / `column` | `flex` / `column` | `flex` / `column` |
| gap | `96px` | `80px` | `60px` |

### `.our-expertise-content-wrap` (photo + copy row)

| Property | Desktop | Tablet | Mobile |
| --- | --- | --- | --- |
| display | `flex` | `flex` | `flex` |
| flex-direction | `row` | `column` | `column` |
| align-items | `center` | `center` | `center` |
| gap | `60px` | `60px` | `40px` |
| measured height | `550px` | `962.594px` | `746.688px` |

### `.hero-image-wrap.our-expertise` + `img.hero-image`

CSS: `.hero-image-wrap{border-radius:12px;width:100%;height:auto;position:relative;overflow:hidden}`
· `.hero-image-wrap.our-expertise{max-width:540px}` → `80%` ≤991 → `100%` ≤767 ·
`.hero-image{border-radius:12px;width:100%;height:auto}`

| Property | Desktop | Tablet | Mobile |
| --- | --- | --- | --- |
| wrap width (measured) | `540px` | `566.391px` (80% of 708) | `350px` |
| wrap max-width | `540px` | `80%` | `100%` |
| wrap height (measured) | `550px` | `577px` | `356.297px` |
| border-radius / overflow / position | `12px` / `hidden` / `relative` | same | same |
| img natural size | 1440 × 1466 (aspect ≈ 0.982) | same | same |

The height is purely the intrinsic aspect ratio of the image (`width:100%;height:auto`), so no
fixed height is set; with Tailwind preflight the `<img>` is `display:block`, which reproduces the
measured wrapper height exactly (no inline baseline gap).

### `.work-card-overlay-02`

CSS: `display:none; z-index:100; background-color:#fff; transform-origin:100%; border-radius:12px;
width/height:100%; position:absolute; inset:0`

| State | Computed |
| --- | --- |
| page load (source inline style) | `display:block; transform: translate3d(0,0,0) scale3d(1,1,1)` → covers the photo with white |
| after scroll-into-view (desktop tree) | `display:block; transform: matrix(0,0,0,1,0,0)` → `scaleX(0)`, `opacity:1`, `background:#fff`, `z-index:100`, `border-radius:12px` |

### `.our-expart-content-flex` / `.our-expart-title-wrap`

| Property | Desktop | Tablet | Mobile |
| --- | --- | --- | --- |
| display / flex-direction | `flex` / `column` | `flex` / `column` | `flex` / `column` |
| align-items | `flex-start` | `flex-start` | `flex-start` |
| gap | `32px` | `32px` | `32px` |
| max-width | `601px` | `80%` | `100%` |
| used width (measured) | `601px` | `566.391px` | `350px` |
| title-wrap gap | `16px` | `16px` | `16px` |

### `h2.our-expart-title`

| Property | Desktop | Tablet | Mobile |
| --- | --- | --- | --- |
| font-size / line-height | `48px` / `57.6px` | `38px` / `45.6px` | `28px` / `33.6px` |
| letter-spacing | `-1.5px` | `-1px` | `0px` |
| font-weight / family | `600` / Rethink Sans | `600` / Rethink Sans | `600` / Rethink Sans |
| color | `#112C23` | `#112C23` | `#112C23` |
| used width / height | `601px` / `172.781px` (3 lines) | `566.391px` / `136.781px` | `350px` / `134.375px` |

### `p.our-expart-description`

| Property | Desktop | Tablet | Mobile |
| --- | --- | --- | --- |
| font-size / line-height | `16px` / `27.2px` | `16px` / `27.2px` | `16px` / `27.2px` |
| font-weight / family | `400` / Instrument Sans | same | same |
| color | `#47564E` | `#47564E` | `#47564E` |
| max-width | `475px` | `475px` | `475px` |
| used width / height | `475px` / `81.609px` (3 lines) | `475px` / `81.609px` | `350px` / `108.813px` (4 lines) |

### Primary button (`.button-primary`, variant `w-variant-cda33f01-…`)

| Part | Style |
| --- | --- |
| `a.button-primary` | `display:inline-block; text-decoration:none; max-width:100%; cursor:pointer`; measured `178.109 × 59.2031px` |
| `.primary-button-area` | `display:flex; justify-content:center; align-items:center; gap:10px; background:#FF6C1F; border-radius:12px; padding:16px 26px; overflow:hidden; position:relative; transition:background-color .5s` |
| `.primary-button-text-wrap` | `position:relative; overflow:hidden` (line box = 27.2px) |
| `.primary-button-text` | `position:relative; z-index:2; color:#fff; font: Rethink Sans 500 16px/27.2px; white-space:nowrap` |
| `.primary-button-text-hover` | same + `position:absolute; bottom:-30px; left:0` |
| `.primary-button-bg` | `position:absolute; left:-2px; top:0; height:100%; background:#112C23; width:0%` → `102%` on hover |

### `.our-expart-card-lists` + `.our-expart-card`

| Property | Desktop | Tablet | Mobile |
| --- | --- | --- | --- |
| display | `grid` | `grid` | `grid` |
| grid-template-columns | `1fr 1fr 1fr` (410.656 / 410.672 / 410.656) | `1fr 1fr` (342 / 342) | `1fr` (350) |
| gap | `24px` | `24px` | `24px` |
| measured height | `224.812px` | `473.625px` (2 rows) | `650.438px` (3 rows) |
| card gap | `24px` | `24px` | `20px` |
| card padding-right | `32px` | `0` | `0` |
| card measured height | `224.812px` | `224.812px` | `200.812px` |

### `.our-expart-icon-wrap` / `img.our-expart-icon`

| Property | Desktop | Tablet | Mobile |
| --- | --- | --- | --- |
| icon-wrap size | `80 × 80px` | `80 × 80px` | `60 × 60px` |
| icon-wrap background / radius | `#F7F6F3` / `12px` | same | same |
| icon-wrap layout | `flex; justify-content:center; align-items:center` | same | same |
| icon size | `32 × 32px` | `32 × 32px` | `24 × 24px` |

### `.our-expertise-title` / `.our-expertise-subtext`

| Property | Value (all breakpoints) |
| --- | --- |
| font-size / line-height | `16px` / `27.2px` |
| family | Instrument Sans |
| title | `font-weight:600; color:#112C23` |
| subtext | `font-weight:400; color:#47564E` |
| text-wrap gap | `12px` |
| used width / height | desktop `378.656px` (card 410.656 − pr 32) · tablet `342px` · mobile `350px`; block heights `27.203` + `81.609` |

## States & behaviors

| # | Trigger | Before | After | Transition | Implementation |
| --- | --- | --- | --- | --- | --- |
| 1 | `h2.our-expart-title` enters viewport | `opacity:0`, `translateY(24px)` | `opacity:1`, `translateY(0)` | `all 700ms ease-out`, **delay 200ms** | local `useInView` (`threshold:0.25`) + `delay-[200ms]` |
| 2 | `p.our-expart-description` enters viewport | same | same | same, **delay 300ms** | own `useInView` instance |
| 3 | button wrapper `div` enters viewport | same | same | same, **delay 400ms** | own `useInView` instance |
| 4 | card 1 / 2 / 3 enters viewport | same | same | same, **delay 100 / 200 / 300ms** | own `useInView` instance per card |
| 5 | photo wrap enters viewport | `.work-card-overlay-02` `display:block; scaleX(1)` (white panel covers photo) | `scaleX(0)` (panel retracts to the right, photo revealed) | `transform 500ms ease-out`, **delay 200ms**; `transform-origin:right` | own `useInView`; `scale-x-100` → `scale-x-0`, `origin-right` |
| 6 | pointer over `.primary-button-area` (`group-hover`) | bg `width:0`; both labels at `translateY(0)` (second copy parked at `bottom:-30px`, hidden by the clipped wrapper) | bg `width:102%` (`#112C23` wipes across); both labels `translateY(-30px)` (first copy exits the top, second copy fills the line box) | bg `width 200ms`; labels `transform 300ms` | `group` on the `<a>`; `group-hover:w-[102%]`, `group-hover:-translate-y-[30px]` |
| 7 | pointer leaves the button | reverse of #6 (Webflow `a-58`: bg → 0% / 200ms, labels → 0 / 300ms) | — | same durations | CSS `:hover` reversal |
| 8 | hover on `.our-expart-card` | **no change** (`hover-ourexpartcard.json` delta is zero; no `MOUSE_OVER` event targets the cards) | — | — | nothing implemented |
| 9 | `IntersectionObserver` unavailable / JS off | — | elements are rendered in their final (visible) state | — | hook falls back to `visible = true` |
| 10 | `prefers-reduced-motion: reduce` | — | reveals and the curtain snap to their final state | — | `motion-reduce:transition-none` |

Accepted deviation: on the live site each reveal is stopped/re-armed when the element leaves the
viewport again (`autoStopEventId`); this build reveals once and keeps the final state, matching
the other sections of the clone.

## Assets (local, via `ASSETS` from `../shared/assets`)

| Key | Local path | Used for |
| --- | --- | --- |
| `692fd2dc4d63bf298d8f853b_Image-27` | `/sites/elevaana-webflow-io-f5aaaf30/root-8a5edab2/images/692fd2dc4d63bf298d8f853b_Image-27-40a58b.png` | `.hero-image` (1440×1466, `alt=""`, `loading="lazy"`) |
| `692fd2dc4d63bf298d8f853c_consultant-1-1` | `/sites/.../images/692fd2dc4d63bf298d8f853c_consultant-1-1-263400.svg` | card 1 + card 3 icon (32×32, `alt=""`) |
| `692fd2dc4d63bf298d8f853d_legal-1-1` | `/sites/.../images/692fd2dc4d63bf298d8f853d_legal-1-1-fae8f8.svg` | card 2 icon (32×32, `alt=""`) |

No `-p-500` / `-p-800` responsive variants exist in `assets.ts`, so the single 1080w photo is
used at every breakpoint (the source `srcset` sizes are not available locally). No remote URLs;
no background images; the `.work-card-overlay-02` panel is a plain white `div` (not an asset).

## Text content (verbatim)

- `Our experienced team handles every detail with care, precision, and passion`
- `Whether you’re updating a single room or transforming your entire home, we’re committed to delivering results that reflect your lifestyle and exceed your expectations.`
- Button label (both stacked copies): `Get a Free Quote` — link target `/contact-us`
- `Craftsmanship You Can Count`
- `We respect your time and your investment — with clear timelines, accurate estimates, and no hidden costs.`
- `Structural Knowledge & Sense`
- `From floor plans to finishes, we merge technical precision with creative vision to create functional, beautiful spaces.`
- `On-Time & On-Budget Delivery`
- `We respect your time and your investment — with clear timelines, accurate estimates, and no hidden costs.` (same copy as card 1)

All apostrophes are the typographic `’` and the dashes are em dashes `—`, as in the tree JSON.
Image `alt` attributes are empty strings in the source.

## Responsive

Breakpoints used: Tailwind `md:` = 768px (Webflow tablet floor) and `lg:` = 992px (Webflow
desktop floor); base styles = Webflow mobile (captured at 390px).

| Piece | base ≤767 | `md:` 768–991 | `lg:` ≥992 |
| --- | --- | --- | --- |
| section padding | `60px 20px` | `80px 30px` | `120px 30px` |
| content-wrapper gap | `60px` | `80px` | `96px` |
| content-wrap direction / gap | `column` / `40px` | `column` / `60px` | `row` / `60px` |
| photo wrap max-width | `100%` | `80%` | `540px` |
| content flex max-width | `100%` | `80%` | `601px` |
| h2 | `28/33.6, 0px` | `38/45.6, -1px` | `48/57.6, -1.5px` |
| description | `max-w 475`, 4 lines | `max-w 475`, 3 lines | `max-w 475`, 3 lines |
| card grid | 1 column, gap 24 | 2 columns, gap 24 | 3 columns, gap 24 |
| card gap / padding-right | `20px` / `0` | `24px` / `0` | `24px` / `32px` |
| icon wrap / icon | `60px` / `24px` | `80px` / `32px` | `80px` / `32px` |
| button (unchanged at all widths) | `178.109 × 59.2031`, padding `16px 26px` | same | same |

Notes / accepted deviations:

- Webflow also has a 479px step (content-wrapper gap 60px, card grid 1 column, icon 60px are
  ≤479 rules; 480–767px would use the ≤991 values). Per the brief only `md`/`lg` are exposed, so
  the 480–767px range inherits the 390px capture values; only the three captured viewports
  (390 / 768 / 1440) are pixel-exact.
- The reveal uses the team-standard `translateY(24px)` instead of Webflow's internal
  `slideInBottom` preset distance (the preset's exact offset is compiled into the Webflow
  runtime and is not part of the captured data); the final resting state matches the tree.
