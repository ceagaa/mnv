# 07 — Testimonial section ("Trusted by 310k+ Customers") — build spec

## Overview

| | |
| --- | --- |
| Target file | `src/components/sites/elevaana-webflow-io-f5aaaf30/root-8a5edab2/TestimonialSection.tsx` (named export `TestimonialSection`) |
| Screenshot | `docs/design-references/elevaana-webflow-io-f5aaaf30/root-8a5edab2/section-07-testimonial-section.png` |
| DOM source (desktop 1440) | `components/07-testimonial-section.tree.json` |
| DOM source (tablet 768) | `components/07-testimonial-section.tablet.tree.json` |
| DOM source (mobile 390) | `components/07-testimonial-section.mobile.tree.json` |
| CSS source | `webflow.css` (`.testimonial-section`, `.testimonial-content-wrapper`, `.testimonial-section-title-wrap`, `.testimonial-card-lists`, `.testimonial-card`, `.star-wrap`, `.star-icon`, `.testimonial-title`, `.testimonial-author-details`, `.testimonial-image`, `.testimonial-info`, `.testimonial-name`, `.testimonial-position`, `.testimonial-subtext`, `.align-center`, `.container`) |
| Behavior capture | `BEHAVIORS.json` → `initialHidden` (8 nodes of this section); `components/hover-testimonialcard.json` |

**INTERACTION MODEL: STATIC RESPONSIVE GRID — no carousel, no slider, no arrows, no dots, no autoplay, no drag, no scroll-driven translation.**

Evidence used to reach this conclusion:

1. The desktop tree contains exactly one `.testimonial-card-lists` element with **six** `.testimonial-card`
   children rendered simultaneously — every card's full text/author/avatar is present in the DOM at rest.
   There is no `.w-slider`, `.w-slider-mask`, `.w-slider-slide`, `.slider-*`, `.swiper-*`, arrow or dot
   element anywhere in the section tree.
2. `webflow.css` only carries Webflow's unused framework rules for `.w-slider` / `.w-slider-arrow-*` /
   `.w-slider-nav`; there is **no authored rule** for a testimonial slider, arrows or dots
   (the only authored layout rule is `.testimonial-card-lists{display:grid;grid-template-columns:1fr 1fr 1fr;gap:25px}`).
3. `BEHAVIORS.json` contains **no** carousel/slider/autoplay/drag entry. The only testimonial-related
   behavior capture is `initialHidden` (scroll reveal) and `components/hover-testimonialcard.json`
   (hover — zero delta).
4. The section screenshot shows a 3 × 2 grid of six cards, all visible at once.

So the section is: cream band → centered title block → **static CSS grid of 6 rating cards**
(3 cols desktop / 2 cols tablet / 1 col mobile).

**Other global rules applied:** page is not sticky; scroll reveal = `opacity 0 → 1`
(+ `translateY`) via a local IntersectionObserver hook in the file, final state = desktop tree values;
the Webflow floating "Get This Template / Unlock 100+ Templates / Access 4200+ Components" widget is
**never** rendered (visible in the screenshot, ignore it).

**Section role:** social-proof band between the gallery (06) and "Our experienced team" (07b/08).

## DOM structure

```
section.testimonial-section                     <section> cream, padding, overflow hidden
└── div.w-layout-blockcontainer.container        max-w 1280, mx-auto
    └── div.testimonial-content-wrapper          flex-col, gap 64/60/40
        ├── div.testimonial-section-title-wrap   flex-col, items-center, gap 16
        │   ├── h2.align-center                  "Trusted by 310k+ Customers"
        │   └── p.testimonial-subtext            sub-copy, max-w 510, centered
        └── div.testimonial-card-lists           grid 3 / 2 / 1 cols, gap 25/25/16
            ├── div.testimonial-card (1)
            │   ├── div.star-wrap                flex, gap 4 → 5 × img.star-icon (32×32)
            │   ├── h3.testimonial-title         quote
            │   └── div.testimonial-author-details   flex, items-center, gap 12, mt 8
            │       ├── img.testimonial-image    48×48 avatar (max-w 48)
            │       └── div.testimonial-info     flex-col
            │           ├── p.testimonial-name
            │           └── p.testimonial-position
            ├── div.testimonial-card (2) … (6)   identical structure
```

Element tags reproduced verbatim from the tree (quote is `h3`, name/role are `p`,
stars are `img` with `alt=""`).

There is no `.testimonial-card._01` variant in the tree (that rule in `webflow.css` — cream card
background — is unused; all six cards are white).

## Computed styles

### Section (`.testimonial-section`) & container (`.container`)

| Property | Desktop ≥992 | Tablet 768–991 | Mobile ≤767 |
| --- | --- | --- | --- |
| background-color | `#F7F6F3` | `#F7F6F3` | `#F7F6F3` |
| padding | `120px 30px` | `80px 30px` | `60px 20px` |
| overflow | `hidden` | `hidden` | `hidden` |
| container width (1440 / 768 / 390) | `1280px` | `708px` | `350px` |
| container max-width | `1280px` | `1280px` | `1280px` |
| container margins | `0 50px` (auto-centred) | auto | auto |

Breakpoints come from the Webflow design variables (`--all-gap--gap-120` = 120/80/60,
`--all-gap--gap-30p` = 30/30/20).

### `.testimonial-content-wrapper` (flex column)

| Property | Desktop | Tablet | Mobile |
| --- | --- | --- | --- |
| display / direction | `flex` / `column` | same | same |
| gap | `64px` | `60px` | `40px` |

### `.testimonial-section-title-wrap` (flex column)

| Property | Desktop | Tablet | Mobile |
| --- | --- | --- | --- |
| display / direction | `flex` / `column` | same | same |
| align-items | `center` | `center` | `center` |
| gap | `16px` | `16px` | `16px` |

### `h2.align-center`

| Property | Desktop | Tablet | Mobile |
| --- | --- | --- | --- |
| font-family | Rethink Sans (`font-heading`) | same | same |
| font-size / line-height | `56px / 67.2px` | `44px / 52.8px` | `30px / 36px` |
| letter-spacing | `-1.5px` | `-1px` | `0px` (capture omits it; `--all-letter-spacing--1-5:0px` at ≤479) |
| font-weight | `600` | `600` | `600` |
| color | `#112C23` | `#112C23` | `#112C23` |
| text-align | `center` | `center` | `center` |
| measured width | `695.27px` (natural) | `550.92px` | `350px` (wraps to 2 lines, h 72) |

### `p.testimonial-subtext`

| Property | Desktop | Tablet | Mobile |
| --- | --- | --- | --- |
| font-family | Instrument Sans (`font-sans`) | same | same |
| font-size / line-height | `16px / 27.2px` | `16px / 27.2px` | `16px / 27.2px` |
| font-weight | `400` | `400` | `400` |
| color | `#47564E` | `#47564E` | `#47564E` |
| text-align | `center` | `center` | `center` |
| max-width | `510px` | `510px` | `510px` |
| measured width / height | `510 / 54.41` | `510 / 54.41` | `350 / 81.61` (3 lines) |

### `.testimonial-card-lists` (grid)

| Property | Desktop | Tablet | Mobile |
| --- | --- | --- | --- |
| display | `grid` | `grid` | `grid` |
| grid-template-columns | `410px 410px 410px` (= `1fr 1fr 1fr`) | `341.5px 341.5px` (= `1fr 1fr`) | `350px` (= `1fr`) |
| grid-template-rows (measured) | `351.781px × 2` | `353.375px × 3` | `255px × 6` |
| gap | `25px` | `25px` | `16px` |
| total size | `1280 × 728.56` | `708 × 1110.12` | `350 × 1610` |

CSS rules: base `.testimonial-card-lists{gap:25px;grid-template-columns:1fr 1fr 1fr}`;
`@media (max-width:991px){grid-template-columns:1fr 1fr}`; `@media (max-width:767px){grid-template-columns:1fr}`;
`@media (max-width:479px){gap:16px}` → the 390 capture shows `gap:16px`.

### `.testimonial-card`

| Property | Desktop | Tablet | Mobile |
| --- | --- | --- | --- |
| display / direction | `flex` / `column` | same | same |
| justify-content | `space-between` | `space-between` | `space-between` |
| align-items | `flex-start` | `flex-start` | `flex-start` |
| gap | `40px` | `40px` | `20px` |
| padding | `40px` | `24px` | `20px` |
| background-color | `white` | `white` | `white` |
| border-radius | `12px` | `12px` | `12px` |
| border / box-shadow | none / none | none / none | none / none |
| measured size | `410 × 351.781` | `341.5 × 353.375` `350 × 255` |

(`justify-content:space-between` never actually spreads: content height + gaps + padding equals the
measured height exactly at all three breakpoints, so natural height reproduces the capture.)

### `.star-wrap` / `img.star-icon`

| Property | All breakpoints |
| --- | --- |
| display / direction | `flex` / `row` |
| gap | `4px` |
| measured width / height | `176px × 32px` (5 × 32 + 4 × 4) |
| star img | `32 × 32`, `max-width:100%`, `overflow:clip`, `alt=""` |

Star counts are **per card** (filled = `…8528_Star-icon`, empty = `…8529_Star-icon-1`):

| # | Author | Filled | Empty |
| --- | --- | --- | --- |
| 1 | Brooklyn Simmons | 4 | 1 |
| 2 | Robart Fox | 3 | 2 |
| 3 | Sophia Martinez | 3 | 2 |
| 4 | Emily Carter | 5 | 0 |
| 5 | Ava Thompson | 4 | 1 |
| 6 | Mia Robinson | 5 | 0 |

### `h3.testimonial-title`

| Property | Desktop | Tablet | Mobile |
| --- | --- | --- | --- |
| font-family | Rethink Sans (`font-heading`) | same | same |
| font-size / line-height | `24px / 33.6px` | `24px / 33.6px` | `20px / 28px` |
| letter-spacing | `-0.5px` | `-0.5px` | `-0.5px` |
| font-weight | `500` | `500` | `500` |
| color | `#112C23` | `#112C23` | `#112C23` |
| text-align | `start` | `start` | `start` |
| measured width / height | `330 × 100.78` (3 lines) | `293.5 × 134.38` (4 lines) | `310 × 84` (3 lines) |

Width = card content box (`410−80`, `341.5−48`, `350−40`) → rendered as `w-full`
(safe because `align-items:flex-start` would otherwise shrink-wrap a long line anyway).

### `.testimonial-author-details`, `.testimonial-image`, `.testimonial-info`, `.testimonial-name`, `.testimonial-position`

| Property | Value (all breakpoints) |
| --- | --- |
| author-details | `display:flex; flex-direction:row; align-items:center; gap:12px; margin-top:8px`; height `51px` |
| avatar img | `48 × 48`, `max-width:48px`, `overflow:clip`, `alt=""` (round shape is baked into the SVG) |
| info | `display:flex; flex-direction:column` |
| name | Instrument Sans `16px / 27.2px`, weight `600`, color `#112C23` |
| position | Instrument Sans `14px / 23.8px`, weight `400`, color `#47564E` |

## States & behaviors

### 1. Scroll reveal (only dynamic behavior)

| | |
| --- | --- |
| Trigger | Element enters the viewport (IntersectionObserver, `threshold 0.25`, fires once) |
| Before | `opacity: 0`, `translateY(24px)` |
| After | `opacity: 1`, `translateY(0)` — matches the desktop tree (`opacity: 1`, `transform: matrix(1,0,0,1,0,0)`) |
| Transition | `all 700ms ease-out`, disabled under `prefers-reduced-motion` |

`BEHAVIORS.json → initialHidden` lists exactly 8 nodes from this section (nothing else in the
section is hidden):

1. `h2.align-center` — "Trusted by 310k+ Customers"
2. `p.testimonial-subtext` — sub-copy
3–8. the six `div.testimonial-card`

The wrapper (`.testimonial-content-wrapper`), the title wrap and `.testimonial-card-lists` are **not**
in `initialHidden` and stay visible.

Implementation: a local `useInView` hook inside `TestimonialSection.tsx` (same pattern as
`MetricsSection.tsx`). Each of the six cards gets its own observer ref.

**Assumption (documented):** the cards reveal with a small stagger (`delay-[0/80/160/240/320/400ms]`),
the same convention already used in `HeroSection.tsx`. `BEHAVIORS.json` records only the hidden
flag, not IX2 timing, so exact per-card delay is unverifiable from the capture.

### 2. Card hover — NONE

`components/hover-testimonialcard.json` before/after are **byte-identical**:

```
before: bg #fff, transform none, boxShadow none, transition all, opacity 1, color #333, border 0px none
after : bg #fff, transform none, boxShadow none, transition all, opacity 1, color #333, border 0px none
```

→ zero delta. No lift, no shadow, no scale, no color change. **Do not invent a hover state.**

### 3. Carousel / slider / autoplay / drag / arrows / dots

**N/A — does not exist.** See "INTERACTION MODEL" above.

### 4. Links / buttons

N/A. The section contains no anchors, no buttons, no form controls.

## Assets

All imported through `ASSETS` from `../shared/assets` (local `/sites/…` paths, no remote URLs):

| Original asset | `ASSETS` key | Local path suffix | Used for |
| --- | --- | --- | --- |
| `692fd2dc4d63bf298d8f8528_Star icon.svg` | `692fd2dc4d63bf298d8f8528_Star-icon` | `…8528_Star-icon-da5343.svg` | filled star (32×32) |
| `692fd2dc4d63bf298d8f8529_Star icon (1).svg` | `692fd2dc4d63bf298d8f8529_Star-icon-1` | `…8529_Star-icon-1-81906b.svg` | empty/gray star (32×32) |
| `692fd2dc4d63bf298d8f8527_Group 34606.svg` | `692fd2dc4d63bf298d8f8527_Group-34606` | `…8527_Group-34606-ca4c6a.svg` | avatar — Brooklyn Simmons |
| `…Group 34606 (1).svg` | `692fd2dc4d63bf298d8f8536_Group-34606-1` | `…8536_Group-34606-1-e31740.svg` | avatar — Robart Fox |
| `…Group 34606 (2).svg` | `692fd2dc4d63bf298d8f8537_Group-34606-2` | `…8537_Group-34606-2-127f29.svg` | avatar — Sophia Martinez |
| `…Group 34606 (3).svg` | `692fd2dc4d63bf298d8f8538_Group-34606-3` | `…8538_Group-34606-3-e1a8b5.svg` | avatar — Emily Carter |
| `…Group 34606 (4).svg` | `692fd2dc4d63bf298d8f8539_Group-34606-4` | `…8539_Group-34606-4-9a65c4.svg` | avatar — Ava Thompson |
| `…Group 34606 (5).svg` | `692fd2dc4d63bf298d8f853a_Group-34606-5` | `…853a_Group-34606-5-51593e.svg` | avatar — Mia Robinson |

`alt` is `""` for every image, exactly as captured in the tree (avatars sit next to the visible
name, so they are decorative).

## Text content (verbatim — all six cards)

**Title:** `Trusted by 310k+ Customers`

**Subtext:** `Together, we can make a real impact in communities around the world. Help us bring hope and support.`

| # | Quote (`h3`) | Name | Position |
| --- | --- | --- | --- |
| 1 | `“This charity provided critical medical aid to our community. The healthcare support.”` | `Brooklyn Simmons` | `Product Manager` |
| 2 | `“I’ve had the privilege to volunteer here, and seeing the difference we make in life.”` | `Robart Fox` | `UX/UI Designer` |
| 3 | `“Their transparency inspire us to give more and make a bigger real impact together.”` | `Sophia Martinez` | `Creative Director` |
| 4 | `“After losing our home to a flood, they helped us rebuild and find stability again.”` | `Emily Carter` | `Senior Project Manager` |
| 5 | `“My children now have access to clean water and meals thanks to this organization.”` | `Ava Thompson` | `Lead Interior Designer` |
| 6 | `“Knowing my monthly donations supporting children’s education gives me immense.”` | `Mia Robinson` | `Marketing Manager` |

Quotes use typographic curly quotes `“ ”` and the curly apostrophe `’` (cards 2 and 6) — copy them
byte-for-byte from the tree JSON.

## Responsive

Webflow breakpoints → Tailwind: desktop ≥992 → `lg:`, tablet 768–991 → `md:`, mobile ≤767 → base.
`lg:` is always written explicitly for every property that differs between tablet and desktop, so
the `md:`/`lg:` overlap band (992–1023) resolves to desktop values.

| Knob | Base (≤767, values from the 390 tree) | `md:` (768–991, from the 768 tree) | `lg:` (≥992, from the 1440 tree) |
| --- | --- | --- | --- |
| section padding | `60px 20px` | `80px 30px` | `120px 30px` |
| content-wrapper gap | `40px` | `60px` | `64px` |
| h2 size / lh / ls | `30 / 36 / —` | `44 / 52.8 / -1px` | `56 / 67.2 / -1.5px` |
| grid columns | `1` | `2` | `3` |
| grid gap | `16px` | `25px` | `25px` |
| card padding | `20px` | `24px` | `40px` |
| card gap | `20px` | `40px` | `40px` |
| h3 size / lh | `20 / 28` | `24 / 33.6` | `24 / 33.6` |

Unchanged at all breakpoints: `max-w-[1280px] mx-auto` container, title-wrap gap `16`,
subtext `16/27.2` + `max-w-[510px]`, star row `gap-4` / `32px` stars, avatar `48px`,
name `16/27.2/600`, position `14/23.8`, card radius `12px`, card background `white`,
section background `#F7F6F3`, colors `#112C23` / `#47564E`.

Intermediate range 480–767 in the original uses card `gap:32px` + `padding:40px`
(`@media (max-width:767px){.testimonial-card{gap:32px}}`) and grid `gap:25px`; this is approximated
by the mobile (390) base values per the project convention (base = mobile tree).
