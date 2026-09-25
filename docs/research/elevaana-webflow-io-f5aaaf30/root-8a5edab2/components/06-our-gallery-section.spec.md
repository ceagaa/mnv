# 06 — Our Gallery Section (`our-gallery-section`)

## 1. Overview

| Item | Value |
| --- | --- |
| Target component file | `src/components/sites/elevaana-webflow-io-f5aaaf30/root-8a5edab2/GallerySection.tsx` |
| Named export | `GallerySection` |
| Source DOM tree (desktop 1440, post-reveal) | `components/06-our-gallery-section.tree.json` |
| Tablet tree (768) | `components/06-our-gallery-section.tablet.tree.json` |
| Mobile tree (390) | `components/06-our-gallery-section.mobile.tree.json` |
| Screenshot | `docs/design-references/elevaana-webflow-io-f5aaaf30/root-8a5edab2/section-06-our-gallery-section.png` |
| Original CSS | `webflow.css` (rules: `.our-gallery-section`, `.our-gallery-content-wrapper`, `.our-gallery-section-content`, `.our-gallery-section-title-wrap`, `.gallery-card-wrapper`, `.gallery-card-lists`, `.gallery-card-01`, `.gallery-card-02`, `.gallery-shape`, `.gallery-text-wrapper`, `.gallery-title`, `.gallery-category-text`, `.project-button*`, `.hero-subtitle`, `.hero-image._01`) |
| Behaviour capture | `BEHAVIORS.json` → `initialHidden[]`, `afterFullScrollHidden[]` |

### Interaction model (verified)

**Static grid + scroll reveal + hover-only caption overlay. There is NO marquee, no auto-scrolling strip, no carousel, no lightbox, no click behaviour.**

1. **Scroll reveal (Webflow IX2)** — `BEHAVIORS.json.initialHidden` lists, inside this section:
   - `h2` `"Our Work Gallery"`
   - `div` `"See All Projects"` (the button wrapper)
   - 4 × `w-dyn-list` (the four gallery cards), text = the four project titles
   - 4 × `gallery-shape` — but these are **also** in `afterFullScrollHidden`, i.e. they stay hidden after a full scroll. They are not scroll-reveal targets; they are the desktop hover gradient (base CSS `opacity:0`).

   Everything else (section eyebrow `OUR GALLERY`, the card images themselves) is visible from the start.
   Final/resting state = the desktop tree values (`opacity:1`, `transform: identity`).
2. **Card hover (desktop only)** — inferred from `webflow.css` resting values, which are deliberately "off-screen" states:
   - `.gallery-text-wrapper` rests at `bottom:-90px` (clipped by the card's `overflow:hidden`); at ≤991px it is statically parked at `bottom:24px`.
   - `.gallery-shape` rests at `opacity:0; bottom:-30px`; at ≤991px `opacity:1; bottom:0`.
   → Desktop hover slides the caption up to `bottom:24px` and fades the gradient in to `opacity:1; bottom:0`. (No hover state was captured in `BEHAVIORS.json`; this is the only reading consistent with the CSS and the resting screenshot, which shows no caption and no gradient.)
3. **"See All Projects" button hover** — `.project-button-icon-wrap` is `overflow:hidden` with two stacked icons: `.project-button-icon` (centred) and `.project-button-icon-hover` parked at `left:-32px` (fully outside). Both carry `transition: all`. On hover both slide right by 36px (conveyor), swapping the dark chevron for the orange one. Link href = `/projects`.
4. **Never rendered:** the floating Webflow "Get This Template" widget visible in the screenshot (Webflow overlay, not part of the design).

## 2. DOM structure

```text
section.our-gallery-section
└─ div.w-layout-blockcontainer.container.w-container   (max-width 1280, centred)
   └─ div.our-gallery-content-wrapper                  (flex column, gap 64/60/40)
      ├─ div.our-gallery-section-content               (flex, gap 30, justify-between, align-items flex-end; wraps ≤767)
      │  ├─ div.our-gallery-section-title-wrap          (block, shrink-to-fit = max-content of h2)
      │  │  ├─ p.hero-subtitle                          "Our Gallery"   (uppercase)
      │  │  └─ h2                                       "Our Work Gallery"   ← reveal target
      │  └─ div                                         (button wrapper)     ← reveal target
      │     └─ a.project-button[href=/projects]
      │        ├─ p.project-button-text                 "See All Projects"
      │        └─ div.project-button-icon-wrap          (32×32, rounded-full, overflow hidden)
      │           ├─ img.project-button-icon            chevron (dark #112C23)
      │           └─ img.project-button-icon-hover      chevron (orange #FF6C1F, parked left:-32px)
      └─ div.gallery-card-wrapper                       (flex column, gap 40/20/20)
         ├─ div.gallery-card-lists                      (row 1)  ← 2 × reveal target
         │  ├─ [card-01]  700×425 (desktop) / 344×425 (tablet) / 350×255 (mobile 390)
         │  └─ [card-02]  500×425 (desktop) / 344×425 (tablet) / 350×255 (mobile 390)
         └─ div.gallery-card-lists                      (row 2)  ← 2 × reveal target
            ├─ [card-02]  500×425 / 344×425 / 350×255
            └─ [card-01]  700×425 / 344×425 / 350×255

each card (rebuilt from CSS; the tree's `w-dyn-item` children were not captured):
div.gallery-card-01 | div.gallery-card-02   (position:relative; overflow:hidden; border-radius:12px)
├─ img.hero-image._01                       (width:100%; object-fit:cover; min/max-height 420 → 300 → 250)
├─ div.gallery-shape                        (absolute; gradient; h:180; radius:12)
└─ div.gallery-text-wrapper                 (absolute; flex column; gap:8; z-index:2)
   ├─ p.gallery-title
   └─ p.gallery-category-text
```

Notes:
- The original wraps each card in `w-dyn-list > w-dyn-items > w-dyn-item` (Webflow CMS collection wrappers). They are pure pass-through `display:block` boxes with zero styling, so they are flattened away in the rebuild.
- The original rows are `display:flex` with `gap:40` and children `700 + 40 + 500 = 1240px` inside a `1280px` container → **the rows are 40px short on the right** (visible in the screenshot: images stop at x≈1320 while the heading row reaches x≈1360). Reproduced by keeping the explicit 700/500 widths and `justify-content:flex-start`.

## 3. Computed styles (exact values)

### 3.1 Container / section

| Element | Property | Desktop ≥992 | Tablet 768–991 | Mobile ≤767 (390) |
| --- | --- | --- | --- | --- |
| `section.our-gallery-section` | padding | `120px 30px` | `80px 30px` | `60px 20px` |
| | width | `1440px` (100%) | `768px` | `390px` |
| | height | `1308.41px` | `1190px` | `1385.2px` |
| | background | transparent (page white) | same | same |
| `div.container` | width | `1280px` | `708px` | `350px` |
| | max-width | `1280px` | `1280px` | `1280px` |
| | margin | `0 50px` (centred) | centred | centred |
| `div.our-gallery-content-wrapper` | display / flex-flow | `flex / column` | same | same |
| | gap | `64px` | `60px` | `40px` |
| | height | `1068.41px` | `1030px` | `1265.2px` |
| `div.our-gallery-section-content` | display | `flex` | `flex` | `flex` |
| | flex-flow | `row nowrap` | `row nowrap` | `row wrap` (`flex-flow:wrap` at ≤767) |
| | gap | `30px` | `30px` | `30px` |
| | justify-content | `space-between` | `space-between` | `space-between` |
| | align-items | `flex-end` | `flex-end` | `flex-end` |
| | height | `114.406px` | `100px` | `145.203px` (two lines) |
| `div.our-gallery-section-title-wrap` | display | `block` | `block` | `block` |
| | width | `408.828px` | `324.078px` | `231.875px` (max-content of the h2) |
| | height | `114.406px` | `100px` | `83.2031px` |
| `div.gallery-card-wrapper` | flex-flow | `column` | `column` | `column` |
| | gap | `40px` | `20px` | `20px` |
| | height | `890px` | `870px` | `1080px` |
| `div.gallery-card-lists` | display | `flex` | `grid` | `grid` |
| | gap | `40px` | `20px` | `20px` |
| | grid-template-columns | n/a | `344px 344px` | `350px` |
| | height | `425px` | `425px` | `530px` |

### 3.2 Header block

| Element | Property | Desktop | Tablet | Mobile |
| --- | --- | --- | --- | --- |
| `p.hero-subtitle` | font-family | `"Instrument Sans", sans-serif` | same | same |
| | font-size / line-height | `16px / 27.2px` | same | same |
| | font-weight | `600` | `600` | `600` |
| | color | `rgb(255,108,31)` `#FF6C1F` | same | same |
| | text-transform | `uppercase` | `uppercase` | `uppercase` |
| | margin | `0 0 20px` | `0 0 20px` | `0 0 20px` |
| | letter-spacing | normal | normal | normal |
| `h2` (no class) | font-family | `"Rethink Sans", sans-serif` | same | same |
| | font-size | `56px` | `44px` | `30px` |
| | line-height | `67.2px` | `52.8px` | `36px` |
| | letter-spacing | `-1.5px` | `-1px` | *(absent → normal / `0px`)* |
| | font-weight | `600` | `600` | `600` |
| | color | `rgb(17,44,35)` `#112C23` | same | same |
| | width / height | `408.828 × 67.2031` | `324.078 × 52.7969` | `231.875 × 36` |
| button wrapper `div` | width × height | `170.375 × 32` | same | same |
| `a.project-button` | display / flex | `flex / row` | same | same |
| | align-items / gap | `center / 8px` | same | same |
| | max-width | `100%` | `100%` | `100%` |
| | text-decoration | `none` | `none` | `none` |
| | cursor | `pointer` | `pointer` | `pointer` |
| `p.project-button-text` | font-family | `"Instrument Sans", sans-serif` | same | same |
| | font-size / line-height | `18px / 30.6px` | same | same |
| | font-weight | `500` | `500` | `500` |
| | color | `#112C23` | same | same |
| | width | `130.375px` | same | same |
| `div.project-button-icon-wrap` | width × height | `32 × 32` | same | same |
| | background-color | `rgb(247,246,243)` `#F7F6F3` | same | same |
| | border-radius | `100px` | `100px` | `100px` |
| | display / justify / align | `flex / center / center` | same | same |
| | position / overflow | `relative / hidden` | same | same |
| `img.project-button-icon` | width × height | `24 × 24` | same | same |
| | transform | `identity` | `identity` | `identity` |
| `img.project-button-icon-hover` | width × height | `24 × 24` | same | same |
| | position | `absolute; top:4px; right:40px; bottom:4px; left:-32px` | same | same |

### 3.3 Cards

| Element | Property | Desktop | Tablet 768–991 | Mobile 480–767 | Mobile ≤479 (390) |
| --- | --- | --- | --- | --- | --- |
| card box (`.gallery-card-01`) | border-radius | `12px` | `12px` | `12px` | `12px` |
| | max-width | `700px` | `100%` | `100%` | `100%` |
| | width | `700px` | `344px` (grid col) | `350px` (grid col) | `350px` |
| | height (from `w-dyn-list`) | `425px` | `425px` | `305px` (`300 + 5` baseline) | `255px` (`250 + 5`) |
| card box (`.gallery-card-02`) | max-width | `500px` | `100%` | `100%` (+ `width:100%` ≤767) | `100%` |
| | width | `500px` | `344px` | `350px` | `350px` |
| | height | `425px` | `425px` | `305px` | `255px` |
| `img.hero-image._01` | width / height | `100%` / auto | `100%` / auto | `100%` / auto | `100%` / auto |
| | min-height / max-height | `420px / 420px` | `420px / 420px` | `300px / 300px` | `250px / 250px` |
| | object-fit | `cover` | `cover` | `cover` | `cover` |
| | border-radius | `12px` (inherited from `.hero-image`) | | | |
| `div.gallery-shape` | position | `absolute; bottom:-30px; left:0; right:0` | `absolute; bottom:0` | `bottom:0` | `bottom:0` |
| | opacity | `0` | `1` | `1` | `1` |
| | background-image | `linear-gradient(#0000, #000c)` | same | same | same |
| | width × height | `100% × 180px` | same | same | same |
| | border-radius | `12px` | `12px` | `12px` | `12px` |
| `div.gallery-text-wrapper` | position | `absolute; bottom:-90px; left:24px` | `absolute; bottom:24px; left:24px; right:24px` | `bottom:24px; left:24px; right:24px` | same |
| | z-index | `2` | `2` | `2` | `2` |
| | display / flex-flow | `flex / column` | same | same | same |
| | gap | `8px` | `8px` | `8px` | `8px` |
| `p.gallery-title` | color | `white` (`--all-color--neutral-01`) | same | same | same |
| | font-size / line-height | `24px / 33.6px` (heading-4, 140%) | same | same | same |
| | font-weight / letter-spacing | `500 / -0.5px` | same | same | same |
| `p.gallery-category-text` | color | `#F7F6F3` (`--all-color--neutral-02`) | same | same | same |
| | font-size / line-height | `16px / 27.2px` (body-16, 170%) | same | same | same |

> The `+5px` between the image's `min/max-height` (420/300/250) and the measured card height (425/305/255) is the inline-image baseline gap in the original markup. The rebuild closes it by giving the card the measured height and making the image `h-full`.

## 4. States & behaviors

### 4.1 Scroll reveal (IntersectionObserver)

| | |
| --- | --- |
| **Trigger** | Element enters the viewport (threshold 0.25, one-shot) |
| **Before** | `opacity:0` + `translateY(24px)` |
| **After** | `opacity:1` + `translateY(0)` — equals the desktop tree (`opacity:1`, `transform:matrix(1,0,0,1,0,0)`) |
| **Transition** | `all 700ms ease-out`, disabled under `prefers-reduced-motion` |
| **Targets** | `h2 "Our Work Gallery"`, the "See All Projects" wrapper `div`, and each of the four cards |
| **Implementation** | Local `useInView()` hook (same pattern as `MetricsSection.tsx`) inside `GallerySection.tsx` |

### 4.2 Card caption hover (desktop ≥992 only)

| | |
| --- | --- |
| **Trigger** | `:hover` on the card (`.group` / `group-hover:`) |
| **Before** | `.gallery-text-wrapper { bottom:-90px }`, `.gallery-shape { opacity:0; bottom:-30px }` |
| **After** | `.gallery-text-wrapper { bottom:24px }`, `.gallery-shape { opacity:1; bottom:0 }` |
| **Transition** | `all 300ms ease-out` |
| **Implementation** | Tailwind `lg:bottom-[-90px] lg:group-hover:bottom-[24px]`, `lg:opacity-0 lg:group-hover:opacity-100`, `lg:bottom-[-30px] lg:group-hover:bottom-0` |
| **≤991px** | Static "revealed" values from CSS — no hover needed |

### 4.3 "See All Projects" icon hover

| | |
| --- | --- |
| **Trigger** | `:hover` on `a.project-button` |
| **Before** | `.project-button-icon` centred in the 32×32 pill (`#112C23` chevron); `.project-button-icon-hover` at `left:-32px` (outside, clipped) |
| **After** | Both icons translate `+36px` on X — the dark chevron exits right, the orange (`#FF6C1F`) chevron enters the pill |
| **Transition** | `transform 300ms ease` (original declares `transition: all` on both) |
| **Note** | No hover capture exists in `BEHAVIORS.json`; the `left:-32px` parking position plus `overflow:hidden` makes the slide-in the only consistent reading |

### 4.4 Not present

- No marquee / infinite scroll strip, no drag or wheel scrolling of the gallery.
- No click/lightbox/carousel on the cards (cards are plain `div`s, not links).
- No sticky/pinned section, no parallax.
- `gallery-shape` is **not** a scroll-reveal element (it remains in `afterFullScrollHidden`).

## 5. Assets

| # | Card / role | ASSETS key | Local path (under `public/sites/elevaana-webflow-io-f5aaaf30/root-8a5edab2/`) | Natural size |
| --- | --- | --- | --- | --- |
| 1 | Row 1 left — `gallery-card-01` (700×425) | `692fd2dc4d63bf298d8f8505_modern-kitchen-design-interior` | `images/692fd2dc4d63bf298d8f8505_modern-kitchen-design-interior-8f7f24.png` | 1400×840 |
| 2 | Row 1 right — `gallery-card-02` (500×425) | `692fd2dc4d63bf298d8f8516_handyman-construction-site-process-drilling-wall-with-perforator-1` | `images/692fd2dc4d63bf298d8f8516_handyman-construction-site-process--304514.png` | 1000×840 |
| 3 | Row 2 left — `gallery-card-02` (500×425) | `692fd2dc4d63bf298d8f8517_female-surveyor-with-clipboard-meeting-with-decorator-working-inside-property-1` | `images/692fd2dc4d63bf298d8f8517_female-surveyor-with-clipboard-meet-6c309e.png` | 1000×840 |
| 4 | Row 2 right — `gallery-card-01` (700×425) | `692fd2dc4d63bf298d8f8518_modern-wooden-kitchen-scandinavian-interior-with-cooking-appliances-real-image` | `images/692fd2dc4d63bf298d8f8518_modern-wooden-kitchen-scandinavian--b2ec84.png` | 1400×840 |
| 5 | Button default chevron | `692fd2dc4d63bf298d8f8524_chevron-down-2` | `images/692fd2dc4d63bf298d8f8524_chevron-down-2-683822.svg` | 24×24, `stroke #112C23` |
| 6 | Button hover chevron | `692fd2dc4d63bf298d8f8525_chevron-down-3` | `images/692fd2dc4d63bf298d8f8525_chevron-down-3-3bd509.svg` | 24×24, `stroke #FF6C1F` |

Ordering evidence: `ASSETS.json` lists the four card images in exactly this DOM order, and the natural aspect ratios (1400×840 → the 700px cards, 1000×840 → the 500px cards) confirm the pairing. Image `alt` in the source is `"Hero Image"` for all four (per `ASSETS.json`); chevrons have `alt=""`.

## 6. Text content (verbatim)

| Element | Text |
| --- | --- |
| `p.hero-subtitle` | `Our Gallery` (rendered uppercase via `text-transform`) |
| `h2` | `Our Work Gallery` |
| `p.project-button-text` | `See All Projects` |
| Card 1 `p.gallery-title` | `Interior & Exterior Upgrades` |
| Card 2 `p.gallery-title` | `Indoor & Outdoor Improvements` |
| Card 3 `p.gallery-title` | `Home Interior & Exterior Updates` |
| Card 4 `p.gallery-title` | `Inside & Outside Remodeling` |
| All `p.gallery-category-text` | `California \| Home renovation` |

(Source of the four titles: `BEHAVIORS.json.initialHidden` `w-dyn-list` text nodes, concatenated `title + category`, in DOM order.)

## 7. Responsive

Webflow breakpoints → Tailwind: desktop ≥992 → `lg:`, tablet 768–991 → `md:`, mobile ≤767 → base; the extra Webflow `max-width:479px` step is reproduced with `min-[480px]:` (ordered before `md:` so precedence is deterministic).

| Concern | Mobile ≤479 | Mobile 480–767 | Tablet 768–991 (md) | Desktop ≥992 (lg) |
| --- | --- | --- | --- | --- |
| Section padding | `60px 20px` | `60px 20px` | `80px 30px` | `120px 30px` |
| Content-wrapper gap | `40px` | `40px` | `60px` | `64px` |
| Heading row | wraps (`flex-wrap`), button on line 2 | wraps | single row | single row, `space-between` |
| h2 | `30/36/0` | `30/36/0` | `44/52.8/-1px` | `56/67.2/-1.5px` |
| Card wrapper gap | `20px` | `20px` | `20px` | `40px` |
| Card row layout | `grid-cols-1`, gap 20 | `grid-cols-1`, gap 20 | `grid-cols-2`, gap 20 (344+20+344) | `flex`, gap 40 (700+40+500 = 1240 inside 1280) |
| Card size | 350×255 | 350×305 | 344×425 | 700×425 / 500×425 |
| Caption overlay | visible (`bottom:24`, gradient `opacity:1`) | visible | visible | hidden until hover |
