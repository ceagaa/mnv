# 04 — Metrics section ("What Sets Us Apart") — build spec

## Overview

| | |
| --- | --- |
| Target file | `src/components/sites/elevaana-webflow-io-f5aaaf30/root-8a5edab2/MetricsSection.tsx` (named export `MetricsSection`) |
| Screenshot | `docs/design-references/elevaana-webflow-io-f5aaaf30/root-8a5edab2/section-04-metrics-section.png` |
| DOM source (desktop 1440) | `components/04-metrics-section.tree.json` |
| DOM source (tablet 768) | `components/04-metrics-section.tablet.tree.json` |
| DOM source (mobile 390) | `components/04-metrics-section.mobile.tree.json` |
| CSS source | `webflow.css` (`.metrics-*`, `.counter-*`, `.background-video`, `.text-span-7`, `.heading-4`, `.body-text-16`) |
| Behavior capture | `BEHAVIORS.json` → `initialHidden`, `afterFullScrollHidden`; `components/hover-countercard.json` |

**Interaction model (global rules apply):** page is not sticky, section reveals on scroll
(IntersectionObserver, local hook in the file), no hover styles on the counter cards
(`hover-countercard.json` shows zero before/after delta), the Webflow floating
"Get This Template" widget is never rendered.

**Section role:** cream band with a two-column intro row (h2 left, sub-headline + paragraph
right), a full-bleed rounded background video with a hover-revealed play/pause control, and a
row of four stat cards split by 1px vertical rules. Numbers count up the first time each card
scrolls into view.

## DOM structure

```
section.metrics-section                          <section> cream, padding
└─ div.container                                 max-w 1280, mx-auto
   └─ div.metrics-content-wrapper                flex-col, gap 95/60/40
      ├─ div.metrics-section-content-wrap        flex row (col ≤767), space-between, gap 30
      │  ├─ h2.metrics-section-title             "What Sets Us Apart"
      │  └─ div.metrics-section-text-wrap        flex-col gap 24, max-w 500
      │     ├─ h3.heading-4                      sub-headline
      │     └─ p.body-text-16                    body copy (Instrument Sans)
      ├─ div.background-video                    relative, rounded 12, overflow hidden, z 3
      │  ├─ video                                absolute, object-cover, poster, autoPlay/loop/muted/playsInline
      │  └─ div.bg-video                         absolute inset-0, flex center
      │     └─ button.play-pause-button          80×80 white circle, opacity 0 → 1 on hover/focus
      │        ├─ img.play-image "Pause video"   24×24 (visible while playing)
      │        └─ img.play-image "Play video"    24×24 (visible while paused)
      └─ div.counter-card-wrap                   flex row ≥992 · grid 2×2 768–991 · grid 1×1 ≤767
         ├─ div.counter-card                     h1.counter-number ("250" + span "+") + h2.heading-4
         ├─ div.counter-card._02                 "98" + "%"   (border removed ≤991)
         ├─ div.counter-card                     "12" + "yrs"
         └─ div.counter-card-02                  "63" + "%"   (never bordered)
```

Element tags are reproduced verbatim from the tree (counter numbers are `h1`, labels `h2`,
sub-headline `h3`).

## Computed styles

### Section & container (`.metrics-section`, `.container`)

| Property | Desktop ≥992 | Tablet 768–991 | Mobile ≤767 |
| --- | --- | --- | --- |
| background-color | `#F7F6F3` | `#F7F6F3` | `#F7F6F3` |
| padding | `120px 30px` | `80px 30px` | `60px 20px` |
| container width / max-width | `1280px` / `1280px` | `708px` / `1280px` | `350px` / `1280px` |
| display | `block` | `block` | `block` |

### `.metrics-content-wrapper` (flex column)

| Property | Desktop | Tablet | Mobile |
| --- | --- | --- | --- |
| gap | `95px` | `60px` | `40px` |

### `.metrics-section-content-wrap` (header row)

| Property | Desktop | Tablet | Mobile |
| --- | --- | --- | --- |
| display / flex-direction | `flex` / `row` | `flex` / `row` | `flex` / `column` |
| justify-content | `space-between` | `space-between` | `space-between` |
| align-items | `flex-start` | `flex-start` | `flex-start` |
| gap | `30px` | `30px` | `30px` |

### `.metrics-section-title` (`h2`)

Base `h2` rule: `font-family Rethink Sans; color #112C23; font-weight 600; line-height 120%;
margin 0`; class adds `max-width: 600px`.

| Property | Desktop | Tablet | Mobile |
| --- | --- | --- | --- |
| font-size / line-height | `56px` / `67.2px` | `44px` / `52.8px` | `30px` / `36px` |
| letter-spacing | `-1.5px` | `-1px` | `0px` |
| font-weight | `600` | `600` | `600` |
| color | `#112C23` | `#112C23` | `#112C23` |
| max-width | `600px` | `600px` | `600px` |
| used width (1440/768/390) | `470.16px` (1 line) | `288.64px` (2 lines) | `266.34px` (1 line) |

### `.metrics-section-text-wrap` (flex column, gap `24px`)

| Property | Desktop | Tablet | Mobile |
| --- | --- | --- | --- |
| width | `auto` (used `500px`) | `71%` → shrinks to `389.36px` | `100%` |
| max-width | `500px` | `500px` | `100%` |

### `h3.heading-4` (sub-headline)

`.heading-4 { color:#112C23; font-size: var(--heading-4); line-height:140%; font-weight:500;
letter-spacing:-0.5px }`

| Property | Desktop | Tablet | Mobile |
| --- | --- | --- | --- |
| font-size / line-height | `24px` / `33.6px` | `24px` / `33.6px` | `20px` / `28px` |
| letter-spacing / weight / color | `-0.5px` / `500` / `#112C23` | same | same |

### `p.body-text-16`

| Property | All breakpoints |
| --- | --- |
| font-family | `"Instrument Sans", sans-serif` |
| font-size / line-height | `16px` / `27.2px` |
| font-weight | `400` |
| color | `#47564E` |

### `.background-video` (video shell)

`.w-background-video { color:#fff; height:500px; position:relative; overflow:hidden }` +
`.background-video { z-index:3; border-radius:12px; justify-content:center; align-items:center;
width:100%; min-height:630px; display:flex }`

| Property | Desktop | Tablet | Mobile |
| --- | --- | --- | --- |
| height | `630px` | `500px` | `300px` |
| min-height | `630px` | `400px` | `200px` |
| border-radius / overflow / z-index | `12px` / `hidden` / `3` | same | same |

`video`: `position:absolute; width:100%; height:100%; object-fit:cover; z-index:-100;
background-size:cover` (Webflow's `inset:-100%` + `margin:auto` trick resolves to "fill the
shell"); poster frame image comes from the `poster` attribute.

`.bg-video`: `position:absolute` and geometrically centred (55×55 box at 612.5/287.5 inside
1280×630), `justify-content:center; align-items:center; display:flex; color:#fff`.

`.play-pause-button`: `background-color:#FFFFFF; border-radius:100px; width:80px; height:80px;
position:relative; cursor:pointer; opacity:0` (rest state — also listed in
`BEHAVIORS.afterFullScrollHidden`, i.e. it only appears on hover); `:focus-visible` →
`outline:2px solid #3b79c3; outline-offset:2px; border-radius:50%`.

### `.counter-card-wrap`

Base rule: `display:flex; justify-content:space-between; gap:60px` (grid template props are
inert leftovers).

| Property | Desktop | Tablet | Mobile |
| --- | --- | --- | --- |
| display | `flex` | `grid` | `grid` |
| columns | — | `1fr 1fr` (334px each) | `1fr` (350px) |
| gap | `60px` | `40px` | `24px` |
| used height | `171.19px` | `298.38px` | `392px` |

### `.counter-card` / `.counter-card-02` / `.counter-card._02`

| Property | Desktop | Tablet | Mobile |
| --- | --- | --- | --- |
| padding-right (card 1–3) | `36px` | `36px` | `20px` |
| padding-right (card 4 `.counter-card-02`) | `36px` | `36px` | `36px` |
| border-right (card 1) | `1px solid #47564e33` | `1px solid #47564e33` | none |
| border-right (card 2 `._02`) | `1px solid #47564e33` | **none** (`.counter-card._02{border-right-width:0}`) | none |
| border-right (card 3) | `1px solid #47564e33` | `1px solid #47564e33` | none |
| border-right (card 4) | none | none | none |
| used width (desktop) | 337.69 / 251.86 / 253.89 / 256.56 px | 334 / 334 / 334 / 334 | 350 (all) |

Desktop widths are shrink results of `flex` + `gap:60px` (1100 + 180 = 1280), which is what
drives the two-line label wrap seen in the screenshot.

### `h1.counter-number` + `span.text-span-7`

`.counter-number { color:#FF6C1F; font-size:90px; line-height:100%; font-weight:500;
letter-spacing:0 }` · `.text-span-7 { font-size: var(--heading-2-smal) }`

| Property | Desktop | Tablet | Mobile |
| --- | --- | --- | --- |
| number font-size / line-height | `90px` / `90px` | `56px` / `56px` | `40px` / `40px` |
| suffix (`+`, `%`, `yrs`) font-size | `48px` | `38px` | `28px` |
| suffix line-height / weight / color | inherits `90px` / `500` / `#FF6C1F` | `56px` / `500` / `#FF6C1F` | `40px` / `500` / `#FF6C1F` |
| weight / color / letter-spacing | `500` / `#FF6C1F` / `0` | same | same |

Rendered box: the number line box is taller than the line-height (104px at desktop) because the
48px suffix is baseline-aligned with the 90px strut — reproduced automatically by keeping the
suffix an inline `span` inside the `h1`.

### `h2.heading-4` (counter labels)

| Property | Desktop | Tablet | Mobile |
| --- | --- | --- | --- |
| font-size / line-height | `24px` / `33.6px` | `24px` / `33.6px` | `20px` / `28px` |
| letter-spacing / weight / color | `-0.5px` / `500` / `#112C23` | same | same |

## States & behaviors

| # | Trigger | Before | After | Transition | Implementation |
| --- | --- | --- | --- | --- | --- |
| 1 | `h2.metrics-section-title` enters viewport | `opacity:0`, `translateY(24px)` | `opacity:1`, `translateY(0)` | `all 700ms ease-out` (`motion-reduce:none`) | local `useInView` IntersectionObserver (`threshold:0.25`), one instance per target |
| 2 | `.metrics-section-text-wrap` enters viewport | same as #1 | same as #1 | same | own `useInView` instance |
| 3 | `.background-video` enters viewport | same as #1 | same as #1 | same | own `useInView` instance |
| 4 | each `.counter-card` enters viewport | same as #1 **and** its number shows `0` | `opacity:1` and number reaches its final tree value | reveal `700ms`; count-up `1500ms`, ease-out cubic, `requestAnimationFrame` | `CounterCard` sub-component: `useInView` + `useCountUp` |
| 5 | hover anywhere over the video shell (`group-hover`) or keyboard focus on the control | play/pause button `opacity:0` | button `opacity:1` | `opacity 300ms` | `group` on `.background-video`, `group-hover:opacity-100 focus-visible:opacity-100` |
| 6 | click play/pause button | playing ⇄ paused | toggles `<video>` playback; icon swaps pause-circle ⇄ play | none (instant icon swap via `hidden`) | `videoRef.play()/pause()`, state synced from `play`/`pause` DOM events |
| 7 | page restored with JS unavailable / `IntersectionObserver` missing | — | elements are shown immediately, counters render final values | — | hook falls back to `visible = true`; count-up state initialises at the final value |
| 8 | `prefers-reduced-motion: reduce` | — | no reveal transition, counters jump to final value | — | `motion-reduce:transition-none` + `matchMedia` guard in `useCountUp` |

Counter values are `250`, `98`, `12`, `63` — the rendered text after the animation is always
exactly the tree value (the effect ends with `setValue(target)`).

## Assets (local, via `ASSETS` from `../shared/assets`)

| Key | Local path | Used for |
| --- | --- | --- |
| `692fd2dc4d63bf298d8f851c_4808420_Apartment_Improvement_3840x2160_mp4` | `/sites/elevaana-webflow-io-f5aaaf30/root-8a5edab2/videos/692fd2dc4d63bf298d8f851c_4808420_Apartment_Improvement_3840x-a3a219.mp4` | `<video src>` |
| `692a9171c1893782dd4aa9ba692c021a042f850b65b67c97_4808420_Apartment_Improvement_3840x2160_poster.0000000` | `/sites/.../videos/692a9171c1893782dd4aa9ba692c021a042f850b65b67c97_4808420_Apa-e9520c.jpg` | `poster` attribute |
| `692fd2dc4d63bf298d8f851d_pause-circle` | `/sites/.../images/692fd2dc4d63bf298d8f851d_pause-circle-70cb29.svg` | pause icon, `alt="Pause video"` (24×24) |
| `692fd2dc4d63bf298d8f851e_play` | `/sites/.../images/692fd2dc4d63bf298d8f851e_play-b8f874.svg` | play icon, `alt="Play video"` (24×24) |

No remote URLs; no other images in this section.

## Text content (verbatim)

- `What Sets Us Apart`
- `We don’t believe in cookie-cutter solutions. Every home and homeowner is unique — and so is our approach.`
- `With Elavana, you get transparent communication, detailed planning, high-end finishes, and a team that respects your space as much as their craft. We handle everything in-house, ensuring consistency from the first sketch to the final clean-up.`
- `250` `+` — `Successful Renovation Projects Completed`
- `98` `%` — `Overall Client Satisfaction Rate`
- `12` `yrs` — `Combined Industry Experience`
- `63` `%` — `Projects From Repeated Clients`

Button labels: `Pause video` / `Play video` (image `alt`, toggled with the icon).

## Responsive

Breakpoints used: Tailwind `md:` = 768px (Webflow tablet floor) and `lg:` = 992px (Webflow
desktop floor); base styles = Webflow mobile (captured at 390px).

| Piece | base ≤767 | `md:` 768–991 | `lg:` ≥992 |
| --- | --- | --- | --- |
| section padding | `60px 20px` | `80px 30px` | `120px 30px` |
| content-wrapper gap | `40px` | `60px` | `95px` |
| header row | `flex-col` | `flex-row` | `flex-row` |
| title | `30/36, 0px` | `44/52.8, -1px` | `56/67.2, -1.5px` |
| text-wrap width | `100%` | `71%` (max 500) | `auto` (max 500) |
| heading-4 | `20/28` | `24/33.6` | `24/33.6` |
| video shell | `300px` (min 200) | `500px` (min 400) | `630px` (min 630) |
| counter wrap | grid 1 col, gap 24 | grid 2×2, gap 40 | flex row, gap 60, space-between |
| card padding-right | `20px` (card 4 `36px`) | `36px` | `36px` |
| card borders | none | right border on cards 1 & 3 | right border on cards 1, 2, 3 |
| number / suffix | `40/40` · `28` | `56/56` · `38` | `90/90` · `48` |

Notes / accepted deviations:

- Webflow also has a 479px step (e.g. heading-4 22px and content-wrapper gap 60px for
  480–767px). Tailwind only exposes `md`/`lg` per the brief, so the 480–767px range inherits
  the 390px capture values; only the three captured viewports (390/768/1440) are pixel-exact.
- The play/pause control is centred in the video shell (the original's Webflow control box sits
  ~1.5px off-centre because of `margin:0 -25px -25px 0` + `left/top:-14px`). It is `opacity:0`
  in the resting state, so this is invisible in the section screenshot.
