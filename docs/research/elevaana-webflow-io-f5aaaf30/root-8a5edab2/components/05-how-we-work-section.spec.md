# 05 — "Our Renovation Process" (how we work) — build spec

## Overview

- **Target file:** `src/components/sites/elevaana-webflow-io-f5aaaf30/root-8a5edab2/HowWeWorkSection.tsx` (named export `HowWeWorkSection`)
- **Screenshot:** `docs/design-references/elevaana-webflow-io-f5aaaf30/root-8a5edab2/section-05-how-we-work-section.png`
- **Sources of truth:**
  - Desktop tree: `components/05-how-we-work-section.tree.json` (1440px, post-reveal / resting state)
  - Tablet tree: `components/05-how-we-work-section.tablet.tree.json` (768px)
  - Mobile tree: `components/05-how-we-work-section.mobile.tree.json` (390px)
  - CSS: `webflow.css` (`.how-we-work-section`, `.how-it-work-bg-shape`, `.how-we-work-content-wrapper`, `.how-we-work-section-content`, `.how-we-work-card-wrapper`, `.how-we-work-card`, `.how-we-work-card-number`, `.how-we-work-card-content-wrap`, `.how-we-work-card-title`, `.how-we-work-card-subtext`, `.white-color`, `.hero-subtitle`)
  - Behavior: `BEHAVIORS.json` → `initialHidden` (heading + all 4 cards start hidden), `components/hover-howweworkcard.json` (card initial `translateY(56.425px)` → rest `translateY(0)`)
- **Interaction model (global):** page scrolls normally (no sticky header); scroll reveal via local IntersectionObserver inside the component; no buttons/hover states inside this section (the Webflow "Get This Template" overlay in the screenshot is ignored and never rendered).

## DOM structure

```
section.how-we-work-section            (relative, bg #112C23, padding 120px 30px)
├── img.how-it-work-bg-shape           (absolute inset 0, w/h 100%, object-cover, alt "")
└── div.container                      (max-w 1280px, mx-auto, w-full)
    └── div.how-we-work-content-wrapper (relative, z-index 2, flex column, gap 177px)
        ├── div.how-we-work-section-content (block)
        │   ├── p.hero-subtitle        ("How we work", uppercase, orange, mb 20px)  ← always visible
        │   └── h2.white-color          ("Our Renovation Process")                 ← scroll-reveal
        └── div.how-we-work-card-wrapper (grid, 1fr 1fr, col-gap 60, row-gap 140)
            ├── div.how-we-work-card ×4 (flex, items-center, gap 40)               ← scroll-reveal each
            │   ├── img.how-we-work-card-number (natural size 134/143/143/154 × 200, alt "")
            │   └── div.how-we-work-card-content-wrap (flex column, gap 8, flex-1)
            │       ├── h3.how-we-work-card-title  (max-w 240)
            │       └── p.how-we-work-card-subtext (opacity .7)
```

GSAP split-word/letter wrappers around the eyebrow letters are not reproduced (no visual difference); the eyebrow renders as plain text with `text-transform: uppercase`.

## Computed styles (desktop ≥992, 1440px capture)

| Element | Values |
| --- | --- |
| `section.how-we-work-section` | `background-color: #112c23` (`--all-color--neutral-04`); `padding: 120px 30px` (`--all-gap--gap-120` / `--all-gap--gap-30p`); `position: relative`; width 100% |
| `img.how-it-work-bg-shape` | `position: absolute`; `inset: 0%`; `width: 100%`; `height: 100%`; `object-fit: cover`; `object-position: 50% 50%`; **`opacity: 1`** (translucency is baked into the PNG — no CSS opacity anywhere in `webflow.css`); rendered 1440×1071.41 from natural 1440×1083 |
| `div.container` | `max-width: 1280px`; centered (`margin: 0 50px` at 1440 → auto margins) |
| `div.how-we-work-content-wrapper` | `display: flex`; `flex-direction: column`; `gap: 177px`; `position: relative`; `z-index: 2` (sits above the absolutely-positioned texture) |
| `div.how-we-work-section-content` | `display: block`; height 114.406px |
| `p.hero-subtitle` | font `Instrument Sans` (Tailwind `font-sans`); `font-size: 16px`; `line-height: 27.2px` (170%); `font-weight: 600`; `text-transform: uppercase`; `color: #ff6c1f`; `margin: 0 0 20px` |
| `h2.white-color` | `Rethink Sans` (`font-heading`); `font-size: 56px`; `line-height: 67.2px` (120%); `letter-spacing: -1.5px`; `font-weight: 600`; `color: #fff` |
| `div.how-we-work-card-wrapper` | `display: grid`; `grid-template-columns: 1fr 1fr` (610px 610px at 1280); `grid-template-rows: auto`; `column-gap: 60px`; `row-gap: 140px` |
| `div.how-we-work-card` | `display: flex`; `flex-direction: row`; `align-items: center`; `gap: 40px`; width 610px; height 200px (row height = number image height) |
| `img.how-we-work-card-number` | natural size per asset: 134×200 (1), 143×200 (2), 143×200 (3), 154×200 (4); `max-width: 100%`; `overflow: clip` |
| `div.how-we-work-card-content-wrap` | `display: flex`; `flex-direction: column`; `gap: 8px`; width = remaining card width (436 / 427 / 427 / 416) → implemented as `flex-1 min-w-0` |
| `h3.how-we-work-card-title` | `font-size: 36px`; `line-height: 50.4px` (140%); `letter-spacing: -1px`; `font-weight: 500`; `color: #fff`; `max-width: 240px` |
| `p.how-we-work-card-subtext` | `font-size: 16px`; `line-height: 27.2px`; `font-weight: 400`; `font-family: Instrument Sans`; `color: #f7f6f3`; **`opacity: 0.7`** |

CSS variable redefinitions per breakpoint (drive all responsive type/spacing):

| Variable | ≥992 | ≤991 | ≤767 | ≤479 |
| --- | --- | --- | --- | --- |
| `--all-gap--gap-120` (section block padding) | 120px | 80px | 60px | 60px |
| `--all-gap--gap-30p` (section inline padding) | 30px | 30px | 30px | 20px |
| `--all-heading--heading-2` (h2) | 56px | 44px | 35px | 30px |
| `--all-letter-spacing--1-5` (h2 tracking) | -1.5px | -1px | -0.5px | 0px |
| `--all-heading--heading-3` (h3) | 36px | 36px | 30px | 28px |
| `--all-letter-spacing--1` (h3 tracking) | -1px | -1px | -0.5px | 0px |

Class-level overrides (from `webflow.css`, media owner verified by brace matching):

| Selector | Base | ≤991 | ≤767 | ≤479 |
| --- | --- | --- | --- | --- |
| `.how-we-work-content-wrapper` | gap 177px | gap 80px | gap 60px | — |
| `.how-we-work-card-wrapper` | 1fr 1fr, 60/140 | 1fr 1fr, 30/60 | 1fr, 40/40 | — |
| `.how-we-work-card` | flex row, gap 40, items-center | gap 20 | — | `flex-flow: column; align-items: flex-start` |
| `.how-we-work-card-number` | natural size | width 100px | width 100px | width 60px |
| `.how-we-work-card-title` | max-width 240px | — | — | max-width 100% |

## States & behaviors

### Scroll reveal (the only behavior in this section)

- **Trigger:** element enters the viewport (IntersectionObserver, `threshold: 0.15`, unobserve after first hit).
- **Before (captured initial state):** `opacity: 0`, `translateY(56px)` (exact capture: `matrix(1,0,0,1,0,56.425)` from `hover-howweworkcard.json`).
- **After (resting state = desktop tree):** `opacity: 1`, `translateY(0)`.
- **Transition:** `transition: all` (computed on the original elements), implemented as `transition-all duration-[600ms] ease-out`. Duration/easing are an assumption — the capture only records before/after states, Webflow IX2 timing is not in the sources.
- **Applies to:** `h2` "Our Renovation Process" and each of the 4 `.how-we-work-card` blocks (all listed in `BEHAVIORS.json → initialHidden`). The eyebrow `p.hero-subtitle` is **not** in `initialHidden` → always visible, no animation.
- **Implementation:** `"use client"` component; local `useInView` hook (ref + `IntersectionObserver`) inside the same file; visible class set → `translate-y-0 opacity-100`, otherwise `translate-y-[56px] opacity-0`. Cards observe individually, so they naturally stagger as the grid scrolls in.

### Not reproduced

- GSAP per-letter split of the eyebrow (`gsap_split_word/letter` nodes): pure DOM wrappers, identical rendered text.
- Webflow template overlay widget ("Get This Template …") — never rendered.

## Assets

All from `shared/assets.ts` (`ASSETS`), local files under `public/sites/elevaana-webflow-io-f5aaaf30/root-8a5edab2/images/`:

| Key | File | Used for |
| --- | --- | --- |
| `692fd2dc4d63bf298d8f8523_texture202-p-1600` | `…8523_texture202-p-1600-9f80d6.png` (natural 1440×1083) | dotted background texture (`.how-it-work-bg-shape`) |
| `692fd2dc4d63bf298d8f8520_1.` | `…8520_1.-fa1112.svg` (134×200) | step number 1 |
| `692fd2dc4d63bf298d8f8522_2.` | `…8522_2.-46231e.svg` (143×200) | step number 2 |
| `692fd2dc4d63bf298d8f851f_3.` | `…851f_3.-53f6ca.svg` (143×200) | step number 3 |
| `692fd2dc4d63bf298d8f8521_4.` | `…8521_4.-d37ee5.svg` (154×200) | step number 4 |

Note: the mobile/tablet captures reference `-p-500` / `-p-1080` texture variants that are **not** in `assets.ts`; the single `p-1600` asset is used at every breakpoint with `object-cover` (identical rendering, never tiles).

## Text content (verbatim)

- Eyebrow: `How we work` (rendered uppercase → "HOW WE WORK")
- Heading: `Our Renovation Process`
- Card 1: title `Discovery and Consultation` · body `We begin by listening — understanding your needs, lifestyle, and vision. We’ll visit your space, offer ideas, and discuss your goals in detail.`
- Card 2: title `Design and Planning` · body `Our team develops a custom renovation plan, complete with layout concepts, material suggestions, and clear timelines — all tailored to you.`
- Card 3: title `Estimate and Approval` · body `You’ll receive a detailed project quote with transparent pricing. Once approved, we finalize the schedule and begin preparing for the build.`
- Card 4: title `Construction Begins` · body `Our licensed professionals handle every phase of construction with precision, professionalism, and regular updates — so you're never late.` (straight apostrophe in `you're`, as captured)
- All images: `alt=""` (as in source).

## Responsive

Breakpoints mirror Webflow exactly via arbitrary max variants: `max-[992px:]` ≡ Webflow `max-width: 991px`, `max-[768px:]` ≡ `max-width: 767px`, `max-[480px:]` ≡ `max-width: 479px`.

| | Desktop ≥992 | Tablet 768–991 | Mobile ≤767 | Small ≤479 (390 capture) |
| --- | --- | --- | --- | --- |
| Section padding | 120px 30px | 80px 30px | 60px 30px | 60px 20px |
| Content wrapper gap | 177px | 80px | 60px | 60px |
| h2 | 56/67.2, -1.5px | 44/52.8, -1px | 35/42, -0.5px | 30/36, 0 |
| Card grid | 2 cols, gap 60/140 | 2 cols, gap 30/60 | 1 col, gap 40 | 1 col, gap 40 |
| Card | row, gap 40, items-center | row, gap 20 | row, gap 20 | **column, gap 20, items-start** |
| Number image | natural (134–154 × 200) | width 100px (height auto) | width 100px (height auto) | width 60px (height auto) |
| h3 | 36/50.4, -1px, max-w 240 | 36/50.4, -1px, max-w 240 | 30/42, -0.5px, max-w 240 | 28/39.2, 0, max-w 100% |
| Subtext | 16/27.2, opacity .7 | same | same | same |
| Texture img | absolute inset-0, cover | same | same | same |

Container: `max-w-[1280px] mx-auto w-full` at every breakpoint (Webflow `.container`, mobile width 350 = 390 − 2×20 padding).
