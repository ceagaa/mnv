# 12 · Footer — reconstruction spec

## Overview

| Item | Value |
| --- | --- |
| Target component | `src/components/sites/elevaana-webflow-io-f5aaaf30/root-8a5edab2/Footer.tsx` (named export `Footer`) |
| Spec file | `docs/research/elevaana-webflow-io-f5aaaf30/root-8a5edab2/components/12-footer.spec.md` (this file) |
| Section screenshot | `docs/design-references/elevaana-webflow-io-f5aaaf30/root-8a5edab2/section-12-footer.png` (1440×492) |
| Desktop tree (resting state, 1440) | `components/12-footer.tree.json` |
| Tablet tree (768) | `components/12-footer.tablet.tree.json` |
| Mobile tree (390) | `components/12-footer.mobile.tree.json` |
| CSS source of truth | `webflow.css` (class rules + the 991 / 767 / 479 media blocks + CSS custom properties) |
| Behavior capture | `BEHAVIORS.json` → `initialHidden` (which footer nodes are scroll-revealed) |
| DOM gaps in the tree | the tree omits the contents of `.menu-item-list`, `form.footer-form`, `.link-block-01` and `.social-icons` (and the hidden `.w-form-done`/`.w-form-fail` children). Those were recovered from the live markup `https://elevaana.webflow.io/` (read-only fetch, see “Text content” and “Assets”) and cross-checked against `BEHAVIORS.json` `initialHidden[].text` (`"Quick LinksHomeAbout usServicesProjects"`, `"…Powered by Webflow"`). |

**Section role:** last block of the page — white band containing (a) logo + tagline + 4 social
icons, (b) two “Quick Links” columns, (c) newsletter signup, and (d) a bottom bar separated by a
2 px hairline with “SINCE. 2025” left and the copyright/Powered-by line right.

**Interaction model (per `BUILD_BRIEF.md` + `BEHAVIORS.json`):**

1. Page/header is not sticky; the footer scrolls with the document (no sticky, no back-to-top
   control — **N/A**).
2. **Scroll reveal** — exactly five footer nodes are marked `data-w-id` in the live DOM and are
   listed in `BEHAVIORS.json → initialHidden`: `.footer-content-left`, the two `.navitem-list-2`
   columns, `.footer-form-wrap`, `.footer-bottom-content`. They start hidden and fade/slide in
   through a local `IntersectionObserver` hook (same pattern as `MetricsSection.tsx`). Final state
   = the desktop tree (`opacity:1`, `transform: matrix(1,0,0,1,0,0)` — those five nodes are the
   only ones in the tree that carry a `transform` key).
3. **Link hovers** — `.navtext` (menu links) and `.link-3` (Webflow credit) transition to
   `#FF6C1F` over `color .5s`; `.social-icons` fade to `opacity .7` over `opacity .5s`;
   `.footer-submit-button` fades to `opacity .8` over `opacity .5s`.
4. **Newsletter form** — Webflow `w-form`: hidden success/error boxes live next to the form.
   Reproduced with local state (submit → form replaced by the success box).
5. The floating Webflow “Get This Template / Unlock 100+ Templates / Access 4200+ Components”
   widget visible in the screenshot is an overlay, **never rendered**.

No hover states exist for `.footer-menu-content`, `.footer-content-left`, the columns or the
bottom bar (`BEHAVIORS.json` contains no footer hover capture → N/A).

## DOM structure

Reproduced from the three trees + live markup (`section.footer` root, matching the tree `tag`):

```
section.footer                                        bg #fff, padding 76px 30px (=60px 20px ≤767/≤479)
└─ div.container.w-container                          w 100%, max-w 1280, mx auto
   └─ div.footer-content-wrapper                      flex col, gap 80 (40 ≤479, 60 md)
      └─ div.footer-content-wrap                      flex col, gap 80 (60 base)
         ├─ div.footer-menu-content                   row/justify-between/gap 30 (md: grid 2 cols; base: col, gap 40)
         │  ├─ div.footer-content-left  ★reveal       flex col, gap 40 (30 base, 40 ≤479), w 24% (100% ≤991, max-w 400)
         │  │  ├─ div.footer-logo-text                flex col, gap 24 (20 ≤767)
         │  │  │  ├─ a.link-block-01[href=/] w--current   block, w 218 h 37 (200 × 33.94 ≤479, max-w 100%)
         │  │  │  │  └─ img.project-logo              218×37 svg, alt "Image", max-w-full
         │  │  │  └─ p.footer-text                    “Renovation experience that’s smooth …” 3 lines (2 ≤767)
         │  │  └─ div.social-icon-wrap                flex row, gap 32 (24 ≤479), h 21
         │  │     └─ a.social-icons ×4                21×21, flex col center, overflow hidden, rel, href twitter/facebook/instagram/linkedin
         │  │        └─ img.icons                     24×24 svg → scales to 21 via max-w-full, alt "Social Icon"
         │  ├─ div.navitem-wrapper                    row justify-between gap 88 (40 md; base = grid 2 cols, gap 20 / 24 ≤479, w 100%)
         │  │  ├─ div.navitem-list-2  ★reveal         flex col gap 20, items-start (stretch ≤767)
         │  │  │  ├─ p.footer-menu-default-text       “Quick Links” 18/30.6 500 #112C23, mb 4
         │  │  │  └─ div.menu-item-list               flex col gap 12 → a.navtext ×4
         │  │  └─ div.navitem-list-2  ★reveal         (same shape, second column)
         │  └─ div.footer-form-wrap  ★reveal          flex col gap 40, w 32% (100% ≤991)
         │     ├─ div.footer-form-text-wrap           flex col gap 16
         │     │  ├─ h4                               “Join our newsletter” 24/33.6/-0.5 500 (20/28 ≤479, 22/30.8 480–767)
         │     │  └─ p.footer-form-default-text       “Join our email list …” 16/27.2 Rethink #47564E, mb 4
         │     └─ div.footer-form-block.w-form        block, w 100%, max-w 530, mb 0
         │        ├─ form.footer-form                 row, align-center, gap 10 (col ≤479), h 59
         │        │  ├─ input.footer-text-field.w-input   h 59, w 100%, type=email, required, placeholder “Your Email Address”
         │        │  └─ input.footer-submit-button.w-button  type=submit value “Subscribe”, min-h 59 (w 100% ≤479)
         │        ├─ div.footer-submit-button.w-form-done   (display:none until submitted)
         │        │  └─ div “Thank you! Your submission has been received!”
         │        └─ div.footer-error-button.w-form-fail    (display:none, never shown locally)
         │           └─ div “Oops! Something went wrong while submitting the form.”
         └─ div.footer-bottom-content  ★reveal        row justify-between center gap 8, border-top 2px #112c2338, pt 24 (col gap 20 ≤767)
            ├─ p.footer-bottom-text                   “SINCE. 2025”
            └─ p.footer-bottom-text                   “©Elevana. All rights reserved.Powered by ” + a.link-3[href=webflow.com/templates] “Webflow”
```

★ = one of the five scroll-reveal targets (each gets its own `useInView` instance).

## Computed styles

### Container / section

| Selector | Property (desktop 1440) | Tablet 768 | Mobile 390 |
| --- | --- | --- | --- |
| `section.footer` | `display:block; padding:76px 30px; background:#fff; width 1440; height 492.203` | `padding:76px 30px; height 698.609` | `padding:60px 20px; height 1026.77` |
| `.container` | `width 1280; max-width 1280; margin 0 50px` (auto centred) | `width 708` | `width 350` |
| `.footer-content-wrapper` | `flex col; gap 80; w 1280; h 340.203` | `gap 60; h 546.609` | `gap 40; h 906.766` |
| `.footer-content-wrap` | `flex col; gap 80; w 1280; h 340.203` | `gap 80; h 546.609` | `gap 60; h 906.766` |

### `.footer-menu-content`

| Breakpoint | Values |
| --- | --- |
| Desktop | `display:flex; flex-direction:row; justify-content:space-between; align-items:flex-start; gap:30px; w 1280; h 207` (children widths 307.188 / 275.938 / 409.594 → free space 227.28 split into two 113.64px cushions) |
| Tablet 768 | `display:grid; grid-template-columns:339px 339px; grid-template-rows:176.406px 207px; gap:30px; justify-content:space-between; align-items:flex-start; w 708; h 413.406` — **row 1 holds only `.footer-content-left`** (its `width:100%;max-width:400px` resolves against the full 708 area ⇒ 400px wide, i.e. it spans both columns), **row 2 = `.navitem-wrapper` (col 1) + `.footer-form-wrap` (col 2)** → reproduced with `md:col-span-2` on the left block. |
| Mobile 390 | `display:flex; flex-direction:column; gap:40px; justify-content:space-between; align-items:flex-start; w 350; h 719.156` |

### `.footer-content-left`

| Breakpoint | Values |
| --- | --- |
| Desktop | `flex col; gap 40; width 24% (=307.188); h 203.609; transform:matrix(1,0,0,1,0,0); opacity:1` |
| Tablet | `flex col; gap 40; width 400; max-width 400; h 176.406` |
| Mobile | `flex col; gap 40; width 100% (350); max-width 400; h 169.344` (480–767: `gap 30`) |

| Child | Desktop computed |
| --- | --- |
| `.footer-logo-text` | `flex col; align-items:flex-start; gap 24 (20 ≤767); w 307.188; h 142.609` |
| `a.link-block-01` | `display:block; w 218; h 37; max-width:100%; href="/"; w--current` (≤479: `max-width:200px` → img 200×33.9375) |
| `p.footer-text` | `16px/27.2px; font-family "Instrument Sans"; color #47564E; w 307.188; h 81.609` (3 lines; 54.406 = 2 lines at ≤767) |
| `.social-icon-wrap` | `display:flex; row; gap 32 (24 ≤479); w 307.188; h 21` |
| `a.social-icons` ×4 | `flex col; justify/align center; w 21; h 21; position:relative; overflow:hidden; transition:opacity .5s` |
| `img.icons` ×4 | natural 24×24 (23×24 LinkedIn) → `max-width:100%` ⇒ renders 21×21 inside the anchor |

### `.navitem-wrapper` / columns

| Selector | Desktop | Tablet | Mobile |
| --- | --- | --- | --- |
| `.navitem-wrapper` | `flex; row; justify-content:space-between; align-items:flex-start; gap 88; w 275.938; h 199.406` | `flex; gap 40; w 339; h 199.406` (grid cell, stretched) | `grid; grid-template-columns:163px 163px; gap 24; w 350; h 199.406; flex-wrap:wrap` (480–767: `gap 20`) |
| `.navitem-list-2` ★ | `flex col; align-items:flex-start; gap 20; w 93.9688; h 199.406; transform:matrix(1,0,0,1,0,0)` | same, w 93.9688 | `align-items:stretch; w 163` |
| `.footer-menu-default-text` | `18px/30.6px; 500; Rethink Sans; #112C23; margin-bottom 4px; w 93.9688; h 30.5938` | identical | identical (w 163) |
| `.menu-item-list` | `flex col; gap 12; w 66.2656 / 79.7656; h 144.812` (= 4 × 27.203 + 3 × 12) | identical | w 163 |
| `a.navtext` | `16px/27.2px; Instrument Sans; 400; #47564E; text-decoration:none; transition:color .5s` — `:hover`/`.w--current` → `#FF6C1F` | identical | identical |

### `.footer-form-wrap`

| Selector | Desktop | Tablet | Mobile |
| --- | --- | --- | --- |
| `.footer-form-wrap` ★ | `flex col; gap 40; width 32% (=409.594); h 207; transform:matrix(1,0,0,1,0,0)` | `width 339; h 207` | `width 350 (100%); h 270.406` |
| `.footer-form-text-wrap` | `flex col; gap 16; w 409.594; h 108` (h4 33.5938 + 16 + p 54.4062 + mb 4) | w 339; h 108 | w 350; h 102.406 |
| `h4` | `24px/33.6px; letter-spacing -0.5px; 500; Rethink Sans; #112C23; w 409.594; h 33.5938` | identical | `20px/28px` (480–767: `22px/30.8px` per `--all-heading--heading-4`) |
| `.footer-form-default-text` | `16px/27.2px; 400; Rethink Sans; #47564E; margin-bottom 4px; h 54.4062` | identical | identical |
| `.footer-form-block.w-form` | `display:block; w 409.594; max-width 530; margin-bottom 0; h 59` | w 339; h 59 | w 350; h 128 |
| `form.footer-form` | `flex; row; align-items:center; gap 10; h 59` | identical (w 339) | `flex col; align-items:center; h 128` |
| `input.footer-text-field` | `height 59; background #F7F6F3; border 1px solid #FFFFFF4D; padding 12px; Instrument Sans 14px/23.8px; color #47564E99; width 100% → flex remainder ≈271.6px` | ≈271.6 in a 339 row → ≈201 | `width 100% (350); h 59` |
| `input.footer-submit-button` | `background #112C23; color #FFF; Instrument Sans 18px/30.6px; 500; min-height 59; padding 8px 22px; transition opacity .5s; width ≈128px (single-word min-content ⇒ cannot shrink)` | ≈128 | `width 100%; h 59` |
| `.w-form-done` (hidden) | `background #112C23; color #FFF; 18/30.6; 500; padding 8px 22px; min-height 59; text-align center; transition opacity .5s` | identical | `width 100%` |
| `.w-form-fail` (hidden) | `background #FFDEDE; color #FFF; 16/27.2; 500; border 1px solid #FFFFFF4D; height 59; padding 16px 60px; margin-top 10px; transition opacity .5s` | identical | identical |

### `.footer-bottom-content`

| Selector | Desktop | Tablet | Mobile |
| --- | --- | --- | --- |
| `.footer-bottom-content` ★ | `flex; row; justify-content:space-between; align-items:center; gap 8; padding 24px 0 0; border-top 2px solid #112c2338; w 1280; h 53.2031; transform:matrix(1,0,0,1,0,0)` | identical (w 708) | `flex col; align-items:flex-start; gap 20; padding 24px 0 0; w 350; h 127.609` |
| `p.footer-bottom-text` | `16px/27.2px; Instrument Sans; 400; #47564E; text-align:left; margin-bottom 0` (w 91.6875 / 369.734) | identical | 2nd p wraps: w 350, h 54.406 |
| `a.link-3` | `inline; 16/27.2; Instrument Sans; #47564E; text-decoration:none; transition:color .5s` — `:hover` → `#FF6C1F` **and** `text-decoration:underline` | identical | identical |

### Palette / type tokens used

`#FFFFFF` (section bg) · `#112C23` (headings, button, hairline base `#112c2338`) · `#FF6C1F`
(hover/current) · `#47564E` (body copy) · `#47564E99` (input text) · `#999999` (placeholder,
`.w-input::placeholder`) · `#F7F6F3` (input bg) · `#FFFFFF4D` (input/button borders) ·
`#FFDEDE` (error box). Fonts: **Rethink Sans** (`font-heading`, default) and **Instrument Sans**
(`font-sans`, on `.footer-text`, `.navtext`, `.footer-bottom-text`, `.link-3`, input, button).

## States & behaviors

| # | Trigger | Before | After | Transition | Implementation |
| --- | --- | --- | --- | --- | --- |
| 1 | `.footer-content-left` enters viewport | `opacity 0`, `translateY(24px)` | `opacity 1`, `translateY(0)` | `all 700ms ease-out` (`motion-reduce:transition-none`) | local `useInView` IntersectionObserver (threshold 0.25), `cn(...)` class merge |
| 2 | first `.navitem-list-2` enters viewport | same as #1 | same as #1 | same | own `useInView` instance (sub-component `MenuColumn`) |
| 3 | second `.navitem-list-2` enters viewport | same as #1 | same as #1 | same | own `useInView` instance |
| 4 | `.footer-form-wrap` enters viewport | same as #1 | same as #1 | same | own `useInView` instance |
| 5 | `.footer-bottom-content` enters viewport | same as #1 | same as #1 | same | own `useInView` instance |
| 6 | hover a `.navtext` menu link | `color #47564E` | `color #FF6C1F` | `color .5s` | `hover:text-[#FF6C1F] transition-colors duration-500` |
| 7 | current page link (`Home`, `w--current`) | — | `color #FF6C1F` (static) | — | unconditional `text-[#FF6C1F]` on the current item |
| 8 | hover a `.social-icons` anchor | `opacity 1` | `opacity .7` | `opacity .5s` | `hover:opacity-70 transition-opacity duration-500` |
| 9 | hover `a.link-3` (“Webflow”) | `#47564E`, no underline | `#FF6C1F`, underlined | `color .5s` | `hover:text-[#FF6C1F] hover:underline transition-colors duration-500` |
| 10 | hover the Subscribe button | `opacity 1` | `opacity .8` | `opacity .5s` | `hover:opacity-80 transition-opacity duration-500` |
| 11 | submit a valid email | form visible, success box `display:none` | form replaced by success box (“Thank you! Your submission has been received!”) | none (instant swap) | local `useState(submitted)`; `onSubmit` calls `preventDefault()` (native `required`/`type=email` validation still runs first) |
| 12 | submit invalid email | — | browser native validation message (no state change) | — | `type="email" required` |
| 13 | form error path (`.w-form-fail`) | never shown | — | — | original only shows it when Webflow’s POST fails; reproduced as a permanently hidden node (no network in the clone) |
| 14 | input focus | original `.w-input:focus{outline:0}` + `.footer-text-field:focus{border-color:#FFFFFF4D}` ⇒ **no visible change** | — | — | clone keeps the browser focus ring (accessibility); the only intentional deviation, invisible in screenshots |
| 15 | IntersectionObserver unavailable / JS off | — | reveal targets rendered immediately | — | hook falls back to `visible = true` |
| 16 | `prefers-reduced-motion: reduce` | — | no reveal animation | — | `motion-reduce:transition-none` |
| 17 | back-to-top / sticky footer / marquee | — | — | — | **N/A** (absent in tree, CSS and `BEHAVIORS.json`) |

## Assets

| Role | `ASSETS` key | Local path (via `ASSETS[...]`) | Source URL | Intrinsic size | Rendered |
| --- | --- | --- | --- | --- | --- |
| Footer logo (`img.project-logo`, inside `a.link-block-01`) | `692fd2dc4d63bf298d8f8559_logo-main-1` | `/sites/elevaana-webflow-io-f5aaaf30/root-8a5edab2/images/692fd2dc4d63bf298d8f8559_logo-main-1-d4f400.svg` | `.../692fd2dc4d63bf298d8f8559_logo%20main%20(1).svg` | 218×37 | 218×37 (≤479: 200×33.9375 via `max-w-[200px]` + `max-w-full`) |
| X / Twitter (`img.icons`) | `692fd2dc4d63bf298d8f850f_Social-icons-9` | `.../images/692fd2dc4d63bf298d8f850f_Social-icons-9-61c052.svg` | `.../Social%20icons%20(9).svg` | 24×24 | 21×21 inside the 21×21 anchor |
| Facebook | `692fd2dc4d63bf298d8f850d_Social-icons-10` | `.../images/692fd2dc4d63bf298d8f850d_Social-icons-10-338298.svg` | `.../Social%20icons%20(10).svg` | 24×24 | 21×21 |
| Instagram | `692fd2dc4d63bf298d8f850e_instagram-1-3` | `.../images/692fd2dc4d63bf298d8f850e_instagram-1-3-953835.svg` | `.../instagram%201%20(3).svg` | 24×24 | 21×21 |
| LinkedIn | `692fd2dc4d63bf298d8f850c_Social-icons-11` | `.../images/692fd2dc4d63bf298d8f850c_Social-icons-11-2c28a2.svg` | `.../Social%20icons%20(11).svg` | 23×24 | 21×21 (0.7px clipped by the anchor’s `overflow:hidden`) |

All four social SVGs and the logo are already downloaded under
`public/sites/elevaana-webflow-io-f5aaaf30/root-8a5edab2/images/`; icons are `fill:#112C23`.
No `tag:"svg"` nodes appear in the footer tree, so **no inline SVG is needed** — everything is a
plain `<img>` with the `alt` text from the source (`"Image"` for the logo, `"Social Icon"` for the
four icons) and `loading="lazy"`. No remote URLs are used at runtime.

## Text content (verbatim)

Everything below is copied character-for-character (including `’`, the missing space after
`reserved.`, and both identical column headings).

**Left column**

- Tagline `p.footer-text`: `Renovation experience that’s smooth from start to finish. Book your consultation.`
- Logo link: `href="/"`, `aria-current="page"`, no text (image only).

**Column 1 — heading `Quick Links`**

| Label | href |
| --- | --- |
| `Home` | `/` (rendered orange — `w--current`) |
| `About us` | `/about` |
| `Services` | `/services` |
| `Projects` | `/projects` |

**Column 2 — heading `Quick Links`**

| Label | href |
| --- | --- |
| `Pricing` | `/pricing` |
| `Reviews` | `/reviews` |
| `Contact us` | `/contact-us` |
| `License` | `/license` |

**Social links** (in order): `https://twitter.com/`, `https://www.facebook.com/`,
`https://instagram.com/`, `https://linkedin.com/` — each `alt="Social Icon"`.

**Newsletter**

- `h4`: `Join our newsletter`
- `p.footer-form-default-text`: `Join our email list underneath and always hear about new changes first.`
- input: `placeholder="Your Email Address"` (`type="email"`, `name="email"`, `maxlength="256"`, `required`)
- submit: `value="Subscribe"`
- success box: `Thank you! Your submission has been received!`
- error box: `Oops! Something went wrong while submitting the form.`

**Bottom bar**

- `p.footer-bottom-text`: `SINCE. 2025`
- `p.footer-bottom-text`: `©Elevana. All rights reserved.Powered by ` +
  `<a href="https://webflow.com/templates" class="link-3">Webflow</a>`
  (the space before `Webflow` belongs to the text node; there is **no** space after
  `reserved.` — both confirmed by `BEHAVIORS.json` `initialHidden[].text` and the live DOM).

## Responsive

Webflow breakpoints → Tailwind: base (no variant) = **≤767**, `max-[479px]:` = **≤479**,
`md:` = **768–991**, `lg:` = **desktop ≥992** (per `BUILD_BRIEF.md`; the project uses the sibling
components’ `lg:` for the desktop styles).

| Element | Desktop ≥992 (tree 1440) | Tablet 768–991 (tree 768) | Mobile 480–767 (CSS only) | Mobile ≤479 (tree 390) |
| --- | --- | --- | --- | --- |
| `section.footer` padding | `76px 30px` | `76px 30px` | `60px 30px` | `60px 20px` |
| container | 1280 centred | 708 | 100% − 60 | 350 |
| `.footer-content-wrapper` gap | 80 | 60 | 80 | 40 |
| `.footer-content-wrap` gap | 80 | 80 | 60 | 60 |
| `.footer-menu-content` | flex row, space-between, gap 30 | **grid 2 cols, gap 30, left spans both columns** (rows 176.406 / 207) | flex column, gap 40 | flex column, gap 40 |
| `.footer-content-left` | w 24% (307.188), gap 40 | w 100% capped 400, gap 40, `col-span-2` | w 100%, max-w 400, gap 30 | w 100%, max-w 400, gap 40 |
| `.footer-logo-text` gap | 24 | 24 | 20 | 20 |
| logo anchor | 218×37 | 218×37 | 218×37 | max-width 200 → 200×33.9375 |
| `.footer-text` lines | 3 (81.609) | 2 (54.406) | 2 | 2 |
| `.social-icon-wrap` gap | 32 | 32 | 32 | 24 |
| `.navitem-wrapper` | flex row, gap 88, width 275.938 | flex row, gap 40, stretched to 339 | grid 2 cols (163/163), gap 20 | grid 2 cols (163/163), gap 24 |
| `.navitem-list-2` alignment | `flex-start` | `flex-start` | `stretch` | `stretch` |
| `.footer-form-wrap` | w 32% (409.594) | w 100% (339) | w 100% | w 100% |
| `h4` size | 24/33.6 | 24/33.6 | 22/30.8 | 20/28 |
| `form.footer-form` | row, gap 10 | row, gap 10 | row, gap 10 | column, gap 10 |
| submit button | hug content (≈128) | ≈128 | hug content | `width:100%` |
| `.footer-bottom-content` | row space-between, gap 8 | row space-between, gap 8 | column, gap 20 | column, gap 20 |
| `.footer-bottom-content` hairline | `border-top: 2px solid #112c2338` + `padding-top:24px` | same | same | same |

## Not reproduced / notes

- **IX2 timing**: `BEHAVIORS.json` only records *which* nodes are hidden initially, not the
  Webflow animation parameters. The reveal uses the project-wide convention already shipped in
  `MetricsSection.tsx` (`opacity-0 translate-y-[24px]` → `opacity-100 translate-y-0`,
  `duration-700 ease-out`, reduced-motion off) so every section animates identically.
- **Form delivery**: the original posts to Webflow’s form endpoint. The clone has no backend, so
  a successful submit only swaps in the success box; the error box is rendered but never shown.
- **Focus ring** on the email input: kept (see #14) instead of Webflow’s `outline:0`.
- **480–767 range**: values come from the `webflow.css` media blocks (no screenshot was captured
  there); everything else is taken from the 1440 / 768 / 390 trees.
- The floating Webflow “Get This Template” widget in the screenshot is ignored (global rule).
- **Internal links** (`/`, `/about`, …) are rendered with `next/link`, which emits exactly the
  same `<a href class>` element as the source — required by the project’s `no-html-link-for-pages`
  lint rule. External links (the four social URLs, `webflow.com/templates`) stay plain `<a>`.
