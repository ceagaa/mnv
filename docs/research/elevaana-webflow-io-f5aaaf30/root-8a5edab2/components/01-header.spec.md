# 01 — header · spec

## Overview

| | |
| --- | --- |
| Target file | `src/components/sites/elevaana-webflow-io-f5aaaf30/root-8a5edab2/Header.tsx` (named export `Header`) |
| Desktop tree (1440) | `components/01-header.tree.json` |
| Tablet tree (768) | `components/01-header.tablet.tree.json` |
| Mobile tree (390) | `components/01-header.mobile.tree.json` |
| Screenshot (1440×154) | `docs/design-references/elevaana-webflow-io-f5aaaf30/root-8a5edab2/section-01-header.png` |
| Mobile screenshot (390×69) | `…/mobile-section-01-header.png` |
| State screenshots | `…/state-dropdown-open.png` (chevron flipped up), `…/state-button-hover.png` (CTA hover: full `#112C23` fill) |
| CSS source | `webflow.css` (`.header`, `.navbar-black`, `.nav-top-text-block`, `.header-content`, `.navitem-button`, `.nav-menu`, `.dropdoen-menu`, `.dropdown-menu-list`, `.menu-list`, `.header-button`, `.shop-cart`, `.button-wrap`, `.menu-button`, `.button-primary`, `.primary-button-*`) |
| Behavior capture | `BEHAVIORS.json` → `headerTop`, `headerScrolled400`, `headerScrolled1200`, `primaryButtonHover`, `dropdownOpen` |

**Interaction model (verified):**

1. **Not sticky.** `BEHAVIORS.json` shows `nav.rect.y` = 14 → −386 → −1186 as `scrollY` goes 0 → 400 → 1200; `header.position` stays `static`, `boxShadow: none`, `bg` transparent. No shrink, no shadow, no sticky. z-index only (`z-9` ≥992 / `z-10` <992).
2. **No scroll-reveal in this section.** Header nodes are all `opacity: 1` in the (post-reveal) desktop tree and none of them appear in `BEHAVIORS.initialHidden`. No IntersectionObserver is needed here.
3. **“All Pages” dropdown** (`data-hover="true" data-delay="0"` on `.dropdoen-menu`) → opens on **hover and click**, closes on mouse-leave / outside click / `Escape`.
4. **Primary button hover** — two-layer text roll + dark background sweep (see *States*).
5. **Nav collapses at ≤991px** (`data-collapse="medium"`): `.w-nav[data-collapse=medium] .w-nav-menu{display:none}` + `.w-nav-button{display:block}` (tablet tree confirms `nav-menu` hidden and `menu-button` `display:block` at 768px). The brief’s “≤767” mobile bucket is therefore implemented with arbitrary variants `min-[992px]:` / `max-[992px]:` (not Tailwind `lg:`, whose default is 1024px) as the collapse breakpoint so both the tablet and mobile trees match.
6. The floating “Get This Template / Unlock 100+ Templates / Access 4200+ Components” widget in full-page captures is a Webflow overlay — **never rendered**.

## DOM structure

```
section.header                                          (position: static, z 9/10)
└─ div.container (max-w 1280, mx-auto)
   └─ div.navbar-black.w-nav                            (relative, z 5, radius 18, bg transparent)
      ├─ div.nav-top-text-block                         (top utility bar, hairline bottom border)
      │  ├─ p.nav-date-text                             “Let’s build something beautiful together. Get a free quote today!”
      │  └─ div.nav-location-text
      │     ├─ div.email-link  → img.mail-icon + a.email-link-text   hello@renovapro.com
      │     ├─ div.top-label-line                       (2px vertical rule)
      │     ├─ div.email-link  → img.mail-icon + a.email-link-text   (555) 123-4567
      │     ├─ div.top-label-line
      │     └─ div.social-icon-lists → 4 × (a > img.social-icon)     X / Facebook / Instagram / LinkedIn
      ├─ div.container                                  (inner, max-w 1280)
      │  └─ div.header-content                          (flex, space-between, center)
      │     ├─ a.brand-logo > img.orginal-logo-black    (Elevana wordmark)
      │     └─ div.navitem-button                       (flex, gap 28)
      │        ├─ nav.nav-menu.w-nav-menu               (relative; ≥992 row, <992 collapsible panel)
      │        │  ├─ div.dropdoen-menu.w-dropdown       (relative, z 900, py 35 ≥992)
      │        │  │  ├─ button.dropdown-toggle-main     “All Pages” + chevron (`.icon-3`)
      │        │  │  └─ div/menu.dropdown-menu-list.w-dropdown-list
      │        │  │     └─ div.menu-list                (3 columns)
      │        │  │        ├─ div.menu-lists  (7 links) Home … Projects Details
      │        │  │        ├─ div.menu-lists  (7 links) Blog … Privacy Policy
      │        │  │        └─ div.menu-lists  (5 links) Terms & Conditions … 404 Not Found
      │        │  ├─ a.nav-link.gap-top._01  Services
      │        │  ├─ a.nav-link.gap-top      Reviews
      │        │  └─ a.nav-link              Company
      │        └─ div.header-button                     (flex, gap 30 ≥992 / 25 <992)
      │           ├─ div.shop-cart                      (46×29, cart icon + count badge “0”)
      │           ├─ div.button-wrap                    (hidden <768)
      │           │  └─ a.button-primary > div.primary-button-area
      │           │        ├─ div.primary-button-text-wrap
      │           │        │    ├─ p.primary-button-text       “Book A Free Consultation”
      │           │        │    └─ p.primary-button-text-hover “Book A Free Consultation”
      │           │        └─ div.primary-button-bg
      │           └─ div.menu-button.w-nav-button       (hamburger, visible <992)
      └─ div.w-nav-overlay                              (collapsed-menu overlay, position absolute top 100%)
```

Markup is reproduced from the live page (`https://elevaana.webflow.io/`) where the capture tree had empty `c: []` nodes (`.dropdoen-menu`, `.shop-cart`, `.button-wrap`, `.menu-button`).

## Computed styles (desktop, 1440px)

### Container / chrome

| Selector | Values (tree) | Tailwind used |
| --- | --- | --- |
| `.header` | `padding:14px 30px 0`, `width:1440`, `height:153.406`, `z-index:9`, font Rethink Sans 14/20, static | `relative z-[9] w-full px-[30px] pt-[14px] pb-0` |
| `.container` (outer) | `max-width:1280px; margin:0 50px; height:139.406` | `mx-auto w-full max-w-[1280px]` |
| `.navbar-black` | `position:relative; z-index:5; border-radius:18px; background-color:rgba(221,221,221,0); width:1280; height:139.406; display:block; justify-content:space-between` | `relative z-[5] w-full rounded-[18px] bg-transparent` |
| inner `.container` | `max-width:1280; width:1280; height:97.2031` | `mx-auto w-full max-w-[1280px]` |

### Row 1 — top utility bar (`.nav-top-text-block`)

`display:flex; flex-direction:row; justify-content:space-between; align-items:center; gap:30px; padding:0 0 14px; width:1280; height:42.2031; border-bottom:1px solid #112c231a` (rule from `webflow.css`; 42.2031 = 27.2 content + 14 padding + 1 border).

| Child | Values |
| --- | --- |
| `.nav-date-text` | `font-family:"Instrument Sans"; font-size:14px; line-height:23.8px; color:#112C23 (rgb(17,44,35)); width:406.234; height:23.7969` |
| `.nav-location-text` | `display:flex; align-items:center; gap:24px; flex-wrap:wrap; width:571.781; height:27.2031` |
| `.email-link` | `display:flex; align-items:center; gap:8px; height:27.2031` |
| `.mail-icon` (email) | `24×24` |
| `.mail-icon` (phone) | `19×20` |
| `.email-link-text` | `font-size:16px; line-height:27.2px; font-weight:500; color:#112C23; text-decoration:none` (`:hover → underline`) |
| `.top-label-line` | `width:2px; height:100%; background-color:#112C23; opacity:0.1` — the `height:100%` resolves against an auto-height flex parent ⇒ **0px** (invisible; verified white at x=1006/1201 in `section-01-header.png`), but the 2px layout width is real and is what makes `.nav-location-text` total 571.781px |
| `.social-icon-lists` | `display:flex; align-items:center; gap:22px; height:20.0312` |
| `.social-icon` | X `17×17`, Facebook `17×17`, Instagram `17×17`, LinkedIn `16×17`; `transition:opacity .5s`, `:hover → opacity .6` |

### Row 2 — main nav (`.header-content`, height 97.2031)

| Selector | Values |
| --- | --- |
| `.header-content` | `display:flex; justify-content:space-between; align-items:center; width:1280; height:97.2031` |
| `.brand-logo` | `display:block; position:relative; width:141; height:24` → `img.orginal-logo-black` `141×24` |
| `.navitem-button` | `display:flex; align-items:center; gap:28px; width:696.234; height:97.2031` |
| `.nav-menu` | `display:flex; align-items:center; gap:28px; position:relative; width:373.219; height:97.2031` |
| `.dropdoen-menu` | `display:block; position:relative; z-index:900; padding:35px 0; width:93.2656; height:97.2031; text-align:left` |
| `.dropdown-toggle-main` | `display:flex; align-items:center; gap:8px; opacity:.5; font-family:"Instrument Sans"; color:#112C23; font-size:16px; line-height:27.2px; font-weight:500; padding:0 25px 0 0; transition:opacity .5s; :hover → opacity 1` |
| `.icon-3` (chevron) | `.w-icon-dropdown-toggle` → `position:absolute; top:0; bottom:0; right:0; width:1em; height:1em; margin:auto 0` (+ `.icon-3{margin-right:0; right:0}`) |
| `.nav-link` | `opacity:.5; font-family:"Instrument Sans"; color:#112C23; font-size:16px; line-height:27.2px; font-weight:500; padding:0; position:relative; transition:opacity .5s; :hover → opacity 1` → widths: Services 63.05, Reviews 60.30, Company 72.61 |
| `.header-button` | `display:flex; align-items:center; gap:30px; width:295.016; height:47.2031` |
| `.shop-cart` | `display:block; z-index:10; width:46; height:29` (element also carries `w-commerce-commercecartwrapper` → `position:relative; display:inline-block`) |
| `.cart-button` | `.w-commerce-commercecartopenlink` `display:flex; align-items:center` + `.cart-button{padding:0; background-color:#3898ec00; position:relative; z-index:30}` |
| `.shop-icon` | `24×24; filter:invert()` (source SVG stroke `#C5C5C5` → renders ≈ `#3A3A3A`) |
| `.icon-2` (inline cart svg) | `display:none` — not rendered |
| `.text-block` “Cart” | `display:none` — not rendered |
| `.cart-quantity` (badge) | `display:flex; align-items:center; justify-content:center; width:22px; height:22px; border-radius:100px; background-color:#0b0707; color:#fff (neutral-01); font-size:13px; line-height:140%; font-weight:500; position:relative; bottom:14px; margin-left:0; padding-left/right:0` |
| `.button-wrap` | `display:flex; align-items:center; gap:12px; line-height:100%; width:219.016; height:47.2031` |
| `.primary-button-area` | `display:flex; align-items:center; justify-content:center; gap:10px; padding:10px 15px; border-radius:12px; background-color:#FF6C1F (theme-color-01); position:relative; overflow:hidden; transition:background-color .5s` → 219.016×47.2031 |
| `.primary-button-text-wrap` | `position:relative; overflow:hidden` (27.2px line box) |
| `.primary-button-text` | `position:relative; z-index:2; color:#fff (neutral-01); font-size:16px; line-height:27.2px; font-weight:500; font-family inherited → Rethink Sans` |
| `.primary-button-text-hover` | same, `position:absolute; bottom:-30px` → computed `top:30px` (i.e. parked one line below the clip) |
| `.primary-button-bg` | `position:absolute; left:-2px; height:100%; background-color:#112C23 (neutral-04); width:auto→0` (empty abs box) |
| `.menu-button` | `display:none` ≥992 (`padding:18px` from `.w-nav-button`, `position:relative; cursor:pointer; font-size:24px`) |

### Dropdown panel — closed vs open (`.dropdown-menu-list`)

| State | Rule | Values |
| --- | --- | --- |
| closed | `.w-dropdown-list` | `display:none; position:absolute; min-width:100%; background:#ddd` |
| **open** | `.dropdown-menu-list.w--open` | `display:block; background-color:#fff; border-radius:16px; padding:20px; top:90px; box-shadow:0 16px 48px #0000001f` (≈ `rgba(0,0,0,.12)`); `min-width:100%`; left = static position → left edge of `.dropdoen-menu` |
| open <992 | `@media 991 .dropdown-menu-list.w--open` | `position:static; margin-top:16px` |
| inner `.menu-list` | base | `display:flex; align-items:stretch; gap:50px` |
| inner `.menu-list` | ≤991 | `gap:60px` |
| inner `.menu-list` | ≤767 | `flex-flow:column; gap:9px; height:327px; overflow:auto` |
| `.menu-lists` | — | no CSS rule → plain block column |
| `.bottom-gap-16px` | — | `margin-bottom:16px` (omitted on last link of each column) |
| panel link | `.nav-link` + `.w-dropdown-link` | `display:block; font-size:16px; line-height:27.2px; font-weight:500; color:#112C23; opacity:.5; padding:0` (`w-dropdown-link{padding:10px 20px}` is overridden by `.nav-link{padding:0}`), `:hover → opacity 1`, `transition:opacity .5s` |

`BEHAVIORS.json → dropdownOpen` captured the **closed** box (`display:none`, `bg:rgb(221,221,221)`, `rect 0×0`) — the Webflow IX2 open state did not fire during capture, so the open styling above is taken from `webflow.css` (`.dropdown-menu-list.w--open`), corroborated by `state-dropdown-open.png` (chevron rotated 180°, panel not painted in that capture).

### Mega panel columns (verbatim link text)

1. Home · About Us · Pricing · Services · Services Details · Projects · Projects Details
2. Blog · Blog Details · Shop · Shop Details · Reviews · Contact Us · Privacy Policy
3. Terms & Conditions · License · Changelog · Styleguide · 404 Not Found

## States & behaviors

### 1. “All Pages” dropdown opens (hover ≥992 / click anywhere)

- **Trigger:** `mouseenter` on `.dropdoen-menu` **or** `click` on `.dropdown-toggle-main` (site uses `data-hover="true"`); closes on `mouseleave`, outside `mousedown`, `Escape`.
- **Before:** `.dropdown-menu-list` `display:none` (invisible); chevron points down; toggle `opacity:.5`.
- **After:** panel `display:block`, `background:#fff`, `border-radius:16px`, `padding:20px`, `top:90px` (≈7px above the header’s bottom edge — the panel overlaps the hero), `box-shadow:0 16px 48px #0000001f`, `min-width:100%`, columns `flex/50px`; chevron `rotate(180deg)`; toggle stays `opacity:.5` (`.dropdown-toggle-main:hover → 1`).
- **Transition:** none on the panel itself (Webflow toggles `display`), `transform .3s`-equivalent rotation for the chevron; `.nav-link` links keep `opacity .5s`.
- **Implementation:** local `useState` + `group`/`hover` handlers; panel classes `static mt-[16px] min-[992px]:absolute min-[992px]:left-0 min-[992px]:top-[90px] min-[992px]:mt-0 min-[992px]:min-w-full rounded-[16px] bg-white p-[20px] shadow-[0_16px_48px_#0000001f] z-[900]`. No `width:` utility — `.w-dropdown-list` sets only `min-width:100%`, so the absolute panel must use the browser’s shrink-to-fit (width: max-content bounded by the containing block), which `w-max` would overshoot.

### 2. Primary CTA hover (`.button-primary`)

- **Trigger:** `mouseenter` on the button (`group-hover`).
- **Before (rest):** `.primary-button-area` orange `#FF6C1F`, radius 12, padding `10px 15px`; label visible at `translateY(0)`; `.primary-button-text-hover` parked at `top:30px` (below the 27.2px clip); `.primary-button-bg` width 0 at `left:-2px`.
- **After (hover, from `state-button-hover.png` + `BEHAVIORS.primaryButtonHover.after`):** both text layers `transform: matrix(1,0,0,1,0,-30)` (roll up one 30px line — second copy replaces the first) and the dark `#112C23` `.primary-button-bg` sweeps in to fully cover the button (pixel-checked: `(218,23) = 17,44,35`, i.e. right edge is dark ⇒ width must reach `calc(100% + 4px)` given `left:-2px`).
- **Transition:** `transform 300ms ease` on both copies; `width 300ms ease` on the bg; `background-color .5s` on the area (base rule).
- **Implementation:** `overflow-hidden` wrapper around two absolutely stacked copies; Tailwind `group-hover:-translate-y-[30px] transition-transform duration-300 ease-out`; bg `w-0 group-hover:w-[calc(100%+4px)] transition-[width] duration-300 ease-out`.

### 3. Nav link hover

`.nav-link` / `.dropdown-toggle-main`: `opacity 0.5 → 1`, `transition: opacity .5s`. `.nav-link.w--current` stays at `1`.

### 4. Contact links hover

`.email-link-text:hover { text-decoration: underline }`.

### 5. Social icon hover

`.social-icon { transition: opacity .5s }`, `:hover { opacity: .6 }`.

### 6. Collapsed navigation (<992px) — hamburger

- **Trigger:** click `.menu-button` (`w-nav-button`).
- **Before:** `.nav-menu` `display:none`; `.menu-button` `display:block; padding:0; width:26px (25px ≤479); height:20.6 (20px); position:relative; cursor:pointer`; `.button-wrap` visible ≥768, `display:none` <768; `.nav-top-text-block` visible ≥768, `display:none` <768.
- **After:** panel opens directly under the navbar (Webflow moves it into `.w-nav-overlay` at `top:100%`, `.w-nav-overlay [data-nav-menu-open]{top:0}`): full navbar width, `background:#fff`, `padding:20px 30px` (480–991) / `20px` (≤479), links stacked with `margin:16px auto` (Services `16px auto`, Reviews `0 auto 16px`, Company `0 auto`), dropdown list `position:static; margin-top:16px`.
- **Implementation:** single `<nav>` — `hidden` when closed, `absolute left-0 top-full w-full bg-white px-[30px] py-[20px] max-[480px]:px-[20px] flex flex-col items-center z-50` when open, forced to the desktop row by `min-[992px]:static min-[992px]:flex min-[992px]:w-auto min-[992px]:flex-row min-[992px]:items-center min-[992px]:gap-[28px] min-[992px]:bg-transparent min-[992px]:p-0`. The original hamburger is a Lottie animation (`lottieflow-menu-nav-06-000000`); it is replaced by three CSS bars that morph into an “X” (animation only).

### 7. Non-sticky header

No `position:sticky/fixed`, no scroll listener, no shadow. z-index only: `9` ≥992, `10` <992 (header) / `5` (navbar).

## Assets (local, via `ASSETS` in `../shared/assets`)

| Element | `ASSETS` key | File | Size |
| --- | --- | --- | --- |
| Logo | `692fd2dc4d63bf298d8f848f_PressPoint` | `…/images/692fd2dc4d63bf298d8f848f_PressPoint-157155.svg` | 141×24 (120px ≤479) |
| Mail icon | `692fd2dc4d63bf298d8f8503_mail-1-1` | `…/images/692fd2dc4d63bf298d8f8503_mail-1-1-6ee5ce.svg` | 24×24 |
| Phone icon | `692fd2dc4d63bf298d8f8509_Group-3` | `…/images/692fd2dc4d63bf298d8f8509_Group-3-4643b3.svg` | 19×20 |
| X | `692fd2dc4d63bf298d8f8506_Social-icons-6` | `…/images/692fd2dc4d63bf298d8f8506_Social-icons-6-8050e9.svg` | 17×17 |
| Facebook | `692fd2dc4d63bf298d8f8504_Social-icons-7` | `…/images/692fd2dc4d63bf298d8f8504_Social-icons-7-8b5232.svg` | 17×17 |
| Instagram | `692fd2dc4d63bf298d8f8507_instagram-1-2` | `…/images/692fd2dc4d63bf298d8f8507_instagram-1-2-cd0c73.svg` | 17×17 |
| LinkedIn | `692fd2dc4d63bf298d8f8508_Social-icons-8` | `…/images/692fd2dc4d63bf298d8f8508_Social-icons-8-5bf534.svg` | 16×17 |
| Cart | `692fd2dc4d63bf298d83ab_shop-icon-main` | `…/images/692fd2dc4d63bf298d8f83ab_shop-icon-main-a62968.svg` | 24×24, rendered with `filter:invert()` |

No remote URLs; plain `<img>` tags with `alt` copied from source (logo `alt="Orginal Logo"`, all others `alt=""`).

## Text content (verbatim)

- “Let’s build something beautiful together. Get a free quote today!”
- “hello@renovapro.com” · “(555) 123-4567”
- “All Pages” · “Services” · “Reviews” · “Company”
- “Book A Free Consultation” (label + hover copy, both identical)
- “0” (cart count)
- Mega menu: “Home”, “About Us”, “Pricing”, “Services”, “Services Details”, “Projects”, “Projects Details”, “Blog”, “Blog Details”, “Shop”, “Shop Details”, “Reviews”, “Contact Us”, “Privacy Policy”, “Terms & Conditions”, “License”, “Changelog”, “Styleguide”, “404 Not Found”

Hrefs (from the live markup): `/`, `/about`, `/pricing`, `/services`, `/services-posts/full-home-renovation`, `/projects`, `/projects-posts/interior-and-exterior-design-upgrades`, `/blog`, `/blog-posts/how-to-plan-your-home-renovation-a-step-by-guide`, `/shop`, `/product/infinite-t-shirts`, `/reviews`, `/contact-us`, `/privacy-policy`, `/terms-conditions`, `/license`, `/changelog`, `/styleguide`, `/404`; contacts `mailto:f.rizvi93@gmail.com`, `tel:835:+1-395-385-4819`; socials `https://x.com/`, `https://www.facebook.com/`, `https://www.instagram.com/`, `https://www.linkedin.com/`.

## Responsive

| | Mobile ≤767 (`< md`) | Tablet 768–991 (`md` … `max-[992px]`) | Desktop ≥992 (`min-[992px]:`) |
| --- | --- | --- | --- |
| `.header` padding | `20px 0` (`z-10`) | `14px 0 14px` (`z-10`) | `14px 30px 0` (`z-9`) |
| `.navbar-black` padding | `0 20px` (≤479) / `0 30px` (768–991) | `0 30px` | `0` |
| Top utility bar | `display:none` | `flex column`, `align-items:center`, `gap:16px`, `margin-bottom:14px`, `height:82` | `flex row`, `space-between`, `gap:30px`, `height:42.2031`, hairline `border-bottom:1px solid #112c231a` |
| `.header-content` | `height:29` | `height:47.2031` | `height:97.2031` |
| Nav links | collapsed (panel) | collapsed (panel) | inline row, `gap:28px` |
| Logo | `120px` (≤479) / `141px` | `141px` (`max-width:240px`) | `141px` (`max-width:240px`) |
| `.header-button` gap | `25px` | `25px` | `30px` |
| Cart | shown, `46×29` | shown, `46×29` | shown, `46×29` |
| CTA (`.button-wrap`) | `display:none` | shown (`219.016×47.2031`) | shown |
| Hamburger (`.menu-button`) | `display:block; 25×20` (≤479) | `display:block; 26×20.6094` | `display:none` |
| Mega panel | static, `mt:16`, `menu-list` column `gap:9px; height:327px; overflow:auto` | static, `mt:16`, `menu-list` row `gap:60px` | absolute, `top:90px`, `menu-list` row `gap:50px` |
| Section height | `69px` (20+29+20) | `171.203` (14+82+14+47.203+14) | `153.406` (14+42.203+97.203) |

Breakpoint mapping (Webflow → Tailwind): ≤767 → `< md`, 768–991 → `md … max-[992px]`, ≥992 → `min-[992px]:` (Tailwind’s built-in `lg:` is 1024px here — no `--breakpoint-*` overrides exist in `globals.css`, so `lg:` must not be used for the 992px collapse); the ≤479 rules (logo 120px, navbar padding 20px, hamburger 25px) use `max-[480px]:` arbitrary variants (`max-[Xpx]` compiles to `(width < Xpx)`).

## Not reproduced / notes

- `.shop-cart{top:…; right:…}` values in the tablet/mobile trees (`35px/320px`, `22px/80px`, `22px/41px`) are **not** applied: pixel measurement of `full-mobile-390.png` shows the cart at its natural flex position (badge top ≈ y7 = `bottom:14px` lift inside the 29px box, not a +22px shift). Applying them would displace the cart below the 69px header.
- Same for `.nav-menu{top:156px / 41px}` — Webflow overrides with `top:0` when the menu is open (`.w-nav-overlay [data-nav-menu-open]{top:0}`); the panel is rendered flush under the navbar.
- The Lottie hamburger animation and Webflow Commerce cart modal/checkout are out of scope; the cart is a static icon + count badge (`href="#"`, `aria-label`), the panel is a static stacked menu.
