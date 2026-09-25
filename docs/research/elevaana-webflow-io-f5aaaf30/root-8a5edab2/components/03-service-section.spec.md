# 03 — Service Section spec

## Overview

| Item | Value |
| --- | --- |
| Target file | `src/components/sites/elevaana-webflow-io-f5aaaf30/root-8a5edab2/ServicesSection.tsx` (named export `ServicesSection`) |
| Screenshot | `docs/design-references/elevaana-webflow-io-f5aaaf30/root-8a5edab2/section-03-service-section.png` |
| Desktop tree (1440px) | `components/03-service-section.tree.json` |
| Tablet tree (768px) | `components/03-service-section.tablet.tree.json` |
| Mobile tree (390px) | `components/03-service-section.mobile.tree.json` |
| CSS source | `webflow.css` (grepped `.service-section`, `.service-content-wrapper`, `.service-section-title-wrap`, `.service-subtext`, `.service-card-wrapper`, `.services-collection-list`, `.service-card`, `.hero-image-wrap`, `.hero-image`, `.work-card-overlay`, `.services-arrow-icon-wrap`, `.service-title-wrap`, `.service-title`, `.services-description`) |
| Behaviour source | `BEHAVIORS.json → serviceCardHover` + Webflow IX2 action lists `a-60` / `a-61` / `a-62` / preset `slideInBottom` (extracted from the published page JS `webflow.facc2713.1f684ae672bd7cfd.js`) |

**Interaction model (global rules honoured):** page is not sticky, scroll reveal implemented with a local
`IntersectionObserver` inside the component (elements start at `opacity: 0`), the Webflow
“Get This Template / Unlock 100+ Templates / Access 4200+ Components” overlay is never rendered.

The section = centred heading + subtext, then a 3-column card grid. Every card is an `<a>` linking to a
`/services-posts/…` detail page.

> Note on the desktop tree: the `.service-card` nodes were captured with an empty `c: []` array, so the
> card internals (image / overlay / arrow / title / description) were reconstructed from `webflow.css`,
> `ASSETS.json`, `BEHAVIORS.json` and the published DOM of the live page (identical markup for all 3 cards).

## DOM structure

```html
<section class="service-section">
  <div class="container w-container">                     <!-- max-w 1280, centred -->
    <div class="service-content-wrapper">                 <!-- flex column, align-items center, gap 56 -->
      <div class="service-section-title-wrap">            <!-- flex column, align-items center, gap 16, max-w 606 -->
        <h2 class="align-center">Our Renovation Services</h2>
        <p class="service-subtext _01">From kitchen upgrades …</p>
      </div>
      <div class="service-card-wrapper">                  <!-- scroll-reveal target (IX2 slideInBottom) -->
        <div class="w-dyn-list">                          <!-- block wrapper, no styles -->
          <div role="list" class="services-collection-list">  <!-- grid, 3 cols, gap 24 -->
            <div role="listitem" class="w-dyn-item">      <!-- grid cell, no styles -->
              <a class="service-card" href="/services-posts/full-home-renovation">
                <div class="hero-image-wrap">             <!-- relative, overflow hidden, radius 12 -->
                  <img class="hero-image" alt="Hero Image" src="…Image (26).png">
                  <div class="work-card-overlay"></div>   <!-- white reveal curtain, z-100 -->
                  <div class="services-arrow-icon-wrap">  <!-- 40×40 circle, absolute top -60 right 24 -->
                    <img class="services-arrow-icon" alt="" src="…arrow-narrow-right.svg">
                  </div>
                </div>
                <div class="service-title-wrap">          <!-- flex column, gap 8 -->
                  <h3 class="service-title">Full Home Renovation</h3>
                  <p class="services-description">From reorganizing layouts …</p>
                </div>
              </a>
            </div>
            … <!-- identical cells: interior-exterior-upgrades, custom-carpentry-built-ins -->
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
```

Implemented 1:1 in JSX (the `.w-dyn-list` passthrough is collapsed into the reveal wrapper; roles are kept).

## Computed styles

### Section & layout

| Element | Property | Desktop 1440 | Tablet 768 | Mobile 390 |
| --- | --- | --- | --- | --- |
| `.service-section` | padding | `120px 30px` | `80px 30px` | `60px 20px` |
| | background / border | none (page white) | — | — |
| | height | 1069.52px | 1462.48px | 2003.61px |
| `.container .w-container` | max-width / width | `1280px` / 1280 (margin `0 50px`) | 1280 / 708 | 1280 / 350 |
| `.service-content-wrapper` | display / flex-direction / align-items | `flex` / `column` / `center` | same | same |
| | gap | `56px` (`--all-gap--gap-56`) | `56px` | `40px` (`≤767`) |
| `.service-section-title-wrap` | display / flex-direction / align-items / gap | `flex` / `column` / `center` / `16px` | same | same |
| | max-width / width | `606px` / 584.875 (shrink-to-fit) | 606 / 500 | 606 / 350 |
| `.service-card-wrapper` | display / gap / grid-template-columns | `grid` / `24px` / `1fr` | same | same |
| `.services-collection-list` | display / gap | `grid` / `24px` | same | same |
| | grid-template-columns | `1fr 1fr 1fr` (410.66 / 410.67 / 410.66) | `1fr 1fr` (342 / 342) | `1fr` (350) |
| | grid rows | 635.906px | 549.641px ×2 | 554px ×3 |
| `.w-dyn-item` | width × height | 410.656 × 635.906 | 342 × 549.641 | 350 × 554 |

### Type

| Element | Property | Desktop | Tablet (`≤991`) | Mobile (`≤479`) |
| --- | --- | --- | --- | --- |
| `h2.align-center` | font-family | `"Rethink Sans", sans-serif` | same | same |
| | font-size / line-height | `56px / 67.2px` (120%) | `44px / 52.8px` | `30px / 36px` |
| | font-weight / letter-spacing | `600` / `-1.5px` | `600` / `-1px` | `600` / `0px` |
| | color / text-align | `#112C23` / `center` | same | same |
| | margin | `0` | 0 | 0 |
| `p.service-subtext._01` | font-family | `"Instrument Sans", sans-serif` | same | same |
| | font-size / line-height | `16px / 27.2px` (170%) | same | same |
| | font-weight / color | `400` / `#47564E` (`--all-color--neutral-03`) | same | same |
| | text-align / max-width | `center` / `500px` | same | same (width 350 ⇒ 3 lines) |
| | rendered box | 500 × 54.406 (2 lines) | 500 × 54.406 | 350 × 81.609 (3 lines) |
| `h3.service-title` | font-family | `"Rethink Sans", sans-serif` | same | same |
| | font-size / line-height | `24px / 33.6px` (140%) | `24px / 33.6px` | `20px / 28px` |
| | font-weight / letter-spacing | `500` / `-0.5px` | same | `500` / `-0.5px` |
| | color | `#112C23` (inline `rgb(17,44,35)`) | same | same |
| `p.services-description` | font-family | `"Instrument Sans", sans-serif` | same | same |
| | font-size / line-height | `16px / 27.2px` (170%) | same | same |
| | color | `#47564E` (inherited from `p` rule) | same | same |
| `.service-title-wrap` | display / flex-direction / gap | `flex` / `column` / `8px` | same | same |

### Card / image / badge

| Element | Property | Value |
| --- | --- | --- |
| `a.service-card` | display / flex-direction / gap | `flex` / `column` / `24px` |
| | text-decoration / max-width / cursor | `none` / `100%` / `pointer` |
| | height (desktop / tablet / mobile) | 635.891 / 549.641 / 554 |
| `.hero-image-wrap` | position / overflow / border-radius / width / height | `relative` / `hidden` / `12px` / `100%` / `auto` (desktop 515.891px) |
| `img.hero-image` | width / height / border-radius | `100%` / `auto` / `12px`; intrinsic 796×1000 (aspect 0.796 ⇒ rendered height = width × 1.2563) |
| `.work-card-overlay` | position / inset / z-index / background | `absolute` / `0` / `100` / `white` (`--all-color--neutral-01`) |
| | border-radius / transform-origin | `12px` / `50% 100%` (bottom centre) |
| | transform (rest) | `matrix(1,0,0,0,0,0)` = `scaleY(0)` — invisible |
| `.services-arrow-icon-wrap` | position / top / right | `absolute` / `-60px` / `24px` |
| | width / height / border-radius | `40px` / `40px` / `100px` |
| | background / border / display | `white` / `1px solid #112c231a` / `flex` (centred) |
| | transform (rest → hover) | `translateY(0)` → `translateY(80px)` |
| `img.services-arrow-icon` | size | `33×33` (SVG intrinsic, stroke `#112C23`), `alt=""` |

Box arithmetic that validates the capture: desktop card `635.891 = 515.891 (image) + 24 (gap) + 96 (33.6 + 8 + 54.4)`;
tablet `549.641 = 429.641 + 24 + 96`; mobile `554 ≈ 439.7 + 24 + 90.4 (28 + 8 + 54.4)`.

## States & behaviors

### 1. Scroll reveal — heading / subtext / card grid

| | |
| --- | --- |
| Trigger | `IntersectionObserver` (threshold `0`) inside the component; element enters the viewport once (IX2 `SCROLL_INTO_VIEW`, offset 0%, direction BOTTOM) |
| Before | `opacity: 0` + `translateY(100px)` (IX2 preset `slideInBottom`, `useFirstGroupAsInitialState`) |
| After | `opacity: 1` + `translateY(0)` (desktop tree: `opacity: 1`, `transform: matrix(1,0,0,1,0,0)`) |
| Transition | `duration 1000ms`, easing `outQuart` = `cubic-bezier(0.165, 0.84, 0.44, 1)` |
| Stagger | h2 `delay 100ms` · subtext `delay 200ms` · card grid `delay 300ms` (event config `e-1156` / `e-1158` / `e-1160`) |
| Implementation | local `useInView()` hook (one `IntersectionObserver` per target, disconnect after firing); Tailwind `transition-[opacity,transform] duration-[1000ms] ease-[cubic-bezier(0.165,0.84,0.44,1)] delay-[100ms|200ms|300ms]` |

### 2. Image curtain reveal (per card, `.work-card-overlay`)

| | |
| --- | --- |
| Trigger | `IntersectionObserver` on `.hero-image-wrap` (IX2 `SCROLL_INTO_VIEW` → action list `a-60 “Work Card Animation”`) |
| Before | curtain `display: block`, `scaleY(1)` — white sheet fully covering the image |
| After | `scaleY(0)` — sheet collapsed towards the bottom edge (`transform-origin: 50% 100%`), image visible |
| Transition | `delay 200ms`, `duration 500ms`, IX2 easing `""` ⇒ CSS default `ease` |
| Implementation | `bg-white absolute inset-0 z-[100] origin-bottom scale-y-100 → scale-y-0`, `transition-transform delay-[200ms] duration-[500ms]` |

> This is the *only* thing the overlay does. Contrary to the “overlay darkens on hover” note in the brief,
> `BEHAVIORS.json → serviceCardHover.overlay` is `transform: matrix(1,0,0,0,0,0)` (scaleY 0) in **both**
> before and after states and IX2 `a-61`/`a-62` never touch it — the overlay is a white scroll-reveal
> curtain, not a hover tint. Implemented exactly as captured.

### 3. Card hover (IX2 `a-61 “Service Card Animation”` / `a-62 “… Out”`, trigger `MOUSE_OVER`/`MOUSE_OUT` on `.service-card`)

| Target | Resting | Hover | Transition |
| --- | --- | --- | --- |
| `img.hero-image` | `scale(1)` | `scale(1.1)` (`matrix(1.1,0,0,1.1,0,0)`) | `400ms`, easing `""` ⇒ `ease` (initial-state group uses `500ms`) |
| `.services-arrow-icon-wrap` | `translateY(0)` (badge clipped away above the image: `top:-60px` + `overflow:hidden`) | `translateY(80px)` ⇒ badge sits `20px` below the image top, `24px` from the right, sliding **into view** | `400ms`, `ease` |
| `h3.service-title` | `#112C23` | `#FF6C1F` (`--all-color--theme-color-01`, `rgb(255,108,31)`) | `400ms`, `ease` |
| `.work-card-overlay` | `scaleY(0)` | unchanged | — |

`MOUSE_OUT` reverses all three in `400ms` back to the resting values (`a-62`).
Implementation: `group` on the `<a>` + `group-hover:` variants
(`group-hover:scale-110`, `group-hover:translate-y-[80px]`, `group-hover:text-brand`) with
`transition-transform` / `transition-colors duration-[400ms] ease-[ease]`.

> Note: the brief describes the badge as “bottom-right, `translateY(80px → 0)` sliding up”.
> The source data is the opposite: CSS anchors it at `top:-60px` (hidden above the clipped image) and the
> IX2 hover state is `yValue: 80` (BEHAVIORS `after.arrow.transform = matrix(1,0,0,1,0,80)`), i.e.
> `0 → 80px` sliding down into view at the top-right. The clone follows `webflow.css` + `BEHAVIORS.json`.

## Assets

| Card | Local path (`ASSETS` key) | Intrinsic |
| --- | --- | --- |
| 1 | `ASSETS["692fd2dc4d63bf298d8f84f3_Image-26"]` → `/sites/elevaana-webflow-io-f5aaaf30/root-8a5edab2/images/692fd2dc4d63bf298d8f84f3_Image-26-1c704b.png` | 796×1000 |
| 2 | `ASSETS["692fd2dc4d63bf298d8f84f2_female-surveyor-with-clipboard-meeting-with-decorator-working-inside-property"]` → `…/692fd2dc4d63bf298d8f84f2_female-surveyor-with-clipboard-meet-75d186.png` | 796×1000 |
| 3 | `ASSETS["692fd2dc4d63bf298d8f84f1_Image-25"]` → `…/692fd2dc4d63bf298d8f84f1_Image-25-d3776a.png` | 796×1000 |
| arrow badge (×3) | `ASSETS["692fd2dc4d63bf298d8f8514_arrow-narrow-right"]` → `…/692fd2dc4d63bf298d8f8514_arrow-narrow-right-a2f725.svg` | 33×33 |

All `<img>` use `alt="Hero Image"` (source alt) and the arrow uses `alt=""`.

## Text content (verbatim)

- **h2:** `Our Renovation Services`
- **subtext:** `From kitchen upgrades to full-home remodels — we bring quality craftsmanship, timeless design, and your vision to life.`
- **card 1** — href `/services-posts/full-home-renovation`
  - title `Full Home Renovation`
  - description `From reorganizing layouts to building full home redesigns feels brand new.`
- **card 2** — href `/services-posts/interior-exterior-upgrades`
  - title `Interior & Exterior Upgrades`
  - description `From simple layout adjustments to entire home reinventions into every room.`
- **card 3** — href `/services-posts/custom-carpentry-built-ins`
  - title `Custom Carpentry & Built-ins`
  - description `From layout improvements to complete transformations into a space you’ll love.` (curly `’`)

## Responsive

| Token | Base (mobile ≤767, captured 390) | `md:` 768 (captured 768) | `lg:` 992+ (captured 1440) |
| --- | --- | --- | --- |
| section padding | `60px 20px` | `80px 30px` | `120px 30px` |
| container | `w-full max-w-[1280px] mx-auto` (350) | (708) | (1280) |
| content wrapper gap | `40px` | `56px` | `56px` |
| title wrap | `gap 16`, `max-w 606px` | same | same |
| h2 | `30px / 36px / 0 / 600` | `44 / 52.8 / -1px` | `56 / 67.2 / -1.5px` |
| subtext | `16 / 27.2`, `max-w 500px` | same | same |
| card grid | `1 column` | `2 columns` | `3 columns` |
| grid/card gap | `24px` | `24px` | `24px` |
| card size | 350 × 554 | 342 × 549.641 | 410.66 × 635.891 |
| image | `w-full h-auto` (796×1000 ⇒ 439.7px tall at 350) | 429.64 tall at 342 | 515.89 tall at 410.66 |
| card title | `20 / 28 / -0.5px / 500` | `24 / 33.6 / -0.5px` | `24 / 33.6 / -0.5px` |
| description | `16 / 27.2`, 2 lines | 2 lines | 2 lines |

Mapping notes (documented deviations):

- Webflow’s real media queries are `≤991` (2 cols) and `≤479` (1 col); per the project brief this is
  reproduced with Tailwind `lg:` (3 cols) / `md:` (2 cols) / base (1 col). Tailwind’s default `lg` is 1024px
  (no custom `screens` exist in `globals.css`), so 992–1023px renders 2 columns instead of 3.
- Between 480–767px the source switches h2 to `35/42/-0.5px` and the card title to `22px`; those
  intermediate sizes are not reproduced (base values come from the 390px mobile tree, as instructed).
- Section horizontal padding between 480–767px is `30px` in the source; base uses the captured `20px`.
