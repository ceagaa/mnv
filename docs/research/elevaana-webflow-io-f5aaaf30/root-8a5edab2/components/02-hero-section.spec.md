# 02 — Hero section (`HeroSection`)

## Overview

| | |
| --- | --- |
| Target file | `src/components/sites/elevaana-webflow-io-f5aaaf30/root-8a5edab2/HeroSection.tsx` (named export `HeroSection`) |
| Screenshot | `docs/design-references/elevaana-webflow-io-f5aaaf30/root-8a5edab2/section-02-hero-section.png` |
| Trees | `components/02-hero-section.tree.json` (1440), `.tablet.tree.json` (768), `.mobile.tree.json` (390) |
| CSS source | `webflow.css` — `.hero-section`, `.hero-content-wrapper`, `.hero-content-wrap`, `.hero-subtitle`, `.hero-display-heading`, `.hero-subtext`, `.hero-button-wrap`, `.hero-feature-card-wrapper`, `.hero-feature-card-wrap`, `.hero-feature-card`, `.hero-feature-title-wrap`, `.hero-feature-icon`, `.hero-feature-card-line`, `.body-16-semibold`, `.body-14-regular`, `.button-primary`, `.primary-button-*` |
| Interaction model | (1) header not sticky, (2) reveal on enter — here a **page-load** reveal, (3) `.button-primary` text-roll hover, (5) Webflow overlay widget is never rendered. |

Full-bleed photo hero: fixed background image, left column of copy (eyebrow → display heading → subtext → CTA), two white feature cards pinned bottom-right of the 1280px container.

## DOM structure

```
section.hero-section                     ← bg photo, padding 100/30/46
  div.container                           ← max-w 1280, mx-auto
    div.hero-content-wrapper              ← flex column, gap 70
      div.hero-content-wrap               ← max-w 720
        p.hero-subtitle                   ← orange uppercase eyebrow
        h1.hero-display-heading           ← 68px display heading (2 lines)
        p.hero-subtext                    ← 18px body copy, max-w 411
        div.hero-button-wrap
          a.button-primary[href=/contact-us]
            div.primary-button-area       ← orange pill, radius 12, overflow hidden
              div.primary-button-text-wrap ← overflow hidden, h 27.2031
                div.primary-button-text    ← label (in flow, z-2)
                div.primary-button-text-hover ← label copy, absolute bottom -30px, z-2
              div.primary-button-bg        ← #112C23 sliver, abs left -2px, w 0
      div.hero-feature-card-wrapper       ← flex, justify-content flex-end
        div.hero-feature-card-wrap        ← grid 1fr 1fr, gap 24, max-w 655
          div.hero-feature-card           ← white, radius 12, p 32/24, gap 16
            div.hero-feature-title-wrap   ← flex, gap 12, align center
              img.hero-feature-icon       ← 32×32, alt ""
              p.body-16-semibold
            div.hero-feature-card-line    ← dashed hairline divider
            p.body-14-regular
          div.hero-feature-card           ← (2nd card, same structure)
```

Deviation from the original DOM: the original wraps every word/letter of `.hero-subtitle`,
`.hero-display-heading` and `.hero-subtext` in `gsap_split_word` / `gsap_split_letter`
divs (SplitText). Those wrappers are **not** reproduced — the copy is plain text, so the
resting line boxes are identical while the reveal animates per block instead of per letter.

## Computed styles (desktop, 1440px — resting state = tree JSON)

### `section.hero-section`
`display:block` · `padding:100px 30px 46px` · `width:1440` · `height:827.984`
· `background-image:url(Hero (13).png)` · `background-size:cover` · `background-position:0 0`
· `background-repeat:no-repeat` · **`background-attachment:fixed`**
· inherits `Rethink Sans 14/20`, `color rgb(51,51,51)`.

### `.container` (`w-layout-blockcontainer container w-container`)
`display:block` · `max-width:1280` · `margin:0 50px` (auto-centred) · `width:1280` · `height:681.984`.

### `.hero-content-wrapper`
`display:flex` · `flex-direction:column` · `gap:70px` · `width:1280` · `height:681.984`.

### `.hero-content-wrap`
`display:block` · `max-width:720px` · `width:720` · `height:410.594`.

### `p.hero-subtitle`
`font: 600 16px/27.2px "Instrument Sans"` · `color:#FF6C1F` · `text-transform:uppercase`
· `margin:0 0 20px` · `width:720` · `height:27.2031` (1 line).

### `h1.hero-display-heading`
`font: 700 68px/78.2px "Rethink Sans"` · `letter-spacing:-2px` · `color:#112C23`
· `margin:0` · `width:720` · `height:156.406` (2 lines → "#1 Home Renovation" / "Company in Sao Paolo").

### `p.hero-subtext`
`font: 400 18px/30.6px "Instrument Sans"` · `color:#112C23` · `max-width:411px`
· `margin:24px 0 32px` · `width:411` · `height:91.781` (3 lines).

### `.hero-button-wrap`
`display:block` · `width:720` · `height:59.2031`.

### `a.button-primary`
`display:inline-block` · `max-width:100%` · `width:241.016` · `height:59.2031`
· `text-decoration:none` · `cursor:pointer`.

### `.primary-button-area` (variant `…cda33f01…`)
`display:flex` · `align-items:center` · `justify-content:center` · `gap:10px` · `position:relative`
· `padding:16px 26px` · `background:#FF6C1F` · `border-radius:12px` · `overflow:hidden`
· `transition:background-color .5s` · `cursor:pointer`.

- `.primary-button-text-wrap` — `position:relative` · `overflow:hidden` · `width:189.016` · `height:27.2031`.
- `.primary-button-text` — `600→500 16px/27.2px` (weight 500 = `--all-font-weight--medium`), `color:#fff`,
  `position:relative` · `z-index:2`.
- `.primary-button-text-hover` — same type, `position:absolute` · `bottom:-30px` · `z-index:2` (clipped by the wrap).
- `.primary-button-bg` — `position:absolute` · `left:-2px` · `height:100%` · `background:#112C23`
  · **width 0** (computed `right:243.016px` ⇒ `241.016 + 2 − 243.016 = 0`), i.e. an inert sliver in the resting/original state.

### `.hero-feature-card-wrapper`
`display:flex` · `justify-content:flex-end` · `width:1280` · `height:201.391`.

### `.hero-feature-card-wrap`
`display:grid` · `grid-template-columns:315.5px 315.5px` · `gap:24px` · `max-width:655px`
· `width:655` · `height:201.391`.

### `.hero-feature-card` ×2
`display:flex` · `flex-direction:column` · `gap:16px` · `padding:32px 24px`
· `background:#fff` · `border-radius:12px` · `width:315.5` · `height:201.391`.

- `.hero-feature-title-wrap` — `display:flex` · `align-items:center` · `gap:12px` · `width:267.5` · `height:32`.
- `img.hero-feature-icon` — `display:block` · `width:32` · `height:32` · `max-width:100%` · `alt:""`.
- `p.body-16-semibold` — `font:600 16px/27.2px "Instrument Sans"` · `color:#112C23` · `height:27.2031` (1 line).
- `.hero-feature-card-line` — `border:1px dashed #47564E` · `opacity:.3` · `height:1px` (CSS) which with
  `box-sizing:border-box` + 1px borders top/bottom resolves to a **2px** border box (matches
  `height:2px` in the tree and the card height math: 64+32+16+2+16+71.391 = 201.391).
- `p.body-14-regular` — `font:400 14px/23.8px "Instrument Sans"` · `color:#47564E` · `width:267.5` · `height:71.391` (3 lines).

### Typography / colour tokens used
`#FF6C1F` brand orange · `#112C23` ink · `#47564E` slate · `#FFFFFF` white.
Fonts: `font-heading` (Rethink Sans) for the section, heading and button label;
`font-sans` (Instrument Sans) for `.hero-subtitle`, `.hero-subtext`, `.body-16-semibold`,
`.body-14-regular` — matching `st.fontFamily` in every tree.

## States & behaviors

### 1. Page-load reveal (Webflow IX2, GSAP)
- **Trigger:** component mount (the hero is above the fold; the original fires on page load).
- **Before:** each revealed block `opacity:0` + `translateY(20px)`.
- **After:** `opacity:1` + `translateY(0)` — i.e. exactly the tree values (opacity `1`, transform `matrix(1,0,0,1,0,0)`).
- **Transition:** `transition-property:opacity,transform` · `600ms` · `ease-out`, staggered with
  literal Tailwind delays: eyebrow `0` → heading `delay-[80ms]` → subtext `delay-[160ms]`
  → button `delay-[240ms]` → card 1 `delay-[320ms]` → card 2 `delay-[400ms]`.
- **Implementation:** `"use client"` + `useState(false)` flipped in a `useEffect` timeout (50 ms).
  Resting layout is untouched (final classes are `opacity-100 translate-y-0`).
  `motion-reduce:transition-none` removes the animation for reduced-motion users.
  The per-letter SplitText DOM is intentionally not reproduced.

### 2. Primary button hover (`.button-primary`)
- **Trigger:** pointer hover on the `<a>` (`group`).
- **Before:** `.primary-button-text` at `translateY(0)` inside the 27.2031px window;
  `.primary-button-text-hover` parked at `bottom:-30px` (clipped).
- **After:** both labels translate `Y: -30px` — the visible label scrolls out, the second copy scrolls in.
- **Transition:** `transform 300ms ease` (`.primary-button-area` keeps `background-color .5s`, unchanged).
- **Implementation:** `overflow-hidden` wrapper + `relative` label + `absolute bottom-[-30px]` label,
  both with `group-hover:-translate-y-[30px] transition-transform duration-300 ease-out`.
- `.primary-button-bg` is rendered with `w-0` (as measured) and therefore never paints; the
  behavior capture (`BEHAVIORS.json → primaryButtonHover`) shows no width/left change on hover.

### 3. Scroll reveal — N/A for the copy (page-load only). The section itself has no hover state.

### 4. Webflow overlay widget — never rendered.

## Assets

| Key (`ASSETS`) | Local path | Used for |
| --- | --- | --- |
| `hero-background` | `/sites/elevaana-webflow-io-f5aaaf30/root-8a5edab2/images/hero-bg-692fd2dc.png` | section background (only value that needs `style`, since it comes from a JS constant) |
| `692fd2dc4d63bf298d8f8511_consultant-1` | `…/images/692fd2dc4d63bf298d8f8511_consultant-1-6ef767.svg` | card 1 icon (32×32, `alt=""`) |
| `692fd2dc4d63bf298d8f8512_legal-1` | `…/images/692fd2dc4d63bf298d8f8512_legal-1-1fdced.svg` | card 2 icon (32×32, `alt=""`) |

## Text content (verbatim)

- Eyebrow: `Crafting Beautiful Spaces` (uppercased by CSS)
- Heading: `#1 Home Renovation Company in Sao Paolo`
- Subtext: `From kitchen upgrades to full-home remodels — we bring quality craftsmanship, timeless design, and your vision to life.`
- CTA label: `Book A Free Consultation` → `href=/contact-us`
- Card 1: `Free In-Home Consultation` / `We’ll visit your space, listen to your goals, and provide expert advice — no pressure, no obligation.`
- Card 2: `Licensed & Insured Experts` / `Homeowners love our work — rated 4.9/5 on Google for quality, reliability, and stunning results.`

## Responsive

Webflow breakpoints: desktop `≥992`, tablet `max-width:991`, mobile `max-width:767`,
xs `max-width:479`. Tailwind v4 compiles `max-[N]` to `(width < N)`, so the classes are
`max-[992px]:`, `max-[768px]:`, `max-[480px]:` (base = desktop) — this reproduces the Webflow
media queries exactly for every integer width, whereas `lg:` (1024px) would not.

| Property | Desktop ≥992 | Tablet 768–991 | Mobile 480–767 | XS ≤479 (390 tree) |
| --- | --- | --- | --- | --- |
| section padding | `100px 30px 46px` | `80px 30px 46px` | `60px 30px 46px` | `60px 20px 46px` |
| background-position | `0 0` | `0 0` | `-65px 0` | `-65px 0` |
| background-attachment | `fixed` | `fixed` | `scroll` | `scroll` |
| container width (at 1440/768/390) | 1280 | 708 | full−60 | 350 |
| `.hero-content-wrapper` gap | 70 | 70 | 60 | 40 |
| `.hero-content-wrap` | max-w 720, h 410.594 | w 708, h 383 | full | w 350, h 459.594 |
| heading | 68 / 78.2 / -2px, 2 lines (156.406) | 56 / 64.4 / -1px, 2 lines (128.812) | 44 / 50.6 / -0.5px | 38 / 43.7 / -0.5px, 4 lines (174.812) |
| `.hero-subtext` | max-w 411, h 91.781 (3 lines) | max-w 411, h 91.781 (3 lines) | max-w 411 | w 350, h 122.375 (4 lines) |
| `.hero-feature-card-wrap` | grid 2 cols, max-w 655, h 201.391 | grid 2 cols, w 655 (right aligned) | grid 2 cols | grid **1 col**, w 350, h 378.781 |
| `.hero-feature-card` | p `32px 24px`, 315.5×201.391 | p `32px 24px`, 315.5×201.391 | p `32px 24px` | p `20px`, 350×177.391 |

Card internals (title row 32, gap 16, divider 2, body 3×23.8=71.391) are identical at every
breakpoint; only the card padding and column count change.

## Not reproduced
- SplitText `gsap_split_word` / `gsap_split_letter` wrapper divs (see DOM structure).
- The `.primary-button-bg` dark sweep (measured width 0, no hover change in `BEHAVIORS.json`).
- The floating "Get This Template / Unlock 100+ Templates / Access 4200+ Components" overlay.
