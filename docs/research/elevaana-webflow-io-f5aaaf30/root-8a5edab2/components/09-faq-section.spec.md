# 09 — FAQ section — build spec

## Overview

| | |
| --- | --- |
| Target file | `src/components/sites/elevaana-webflow-io-f5aaaf30/root-8a5edab2/FaqSection.tsx` (named export `FaqSection`) |
| Screenshot | `docs/design-references/elevaana-webflow-io-f5aaaf30/root-8a5edab2/section-09-faq-section.png` |
| Open-state screenshot | `docs/design-references/elevaana-webflow-io-f5aaaf30/root-8a5edab2/state-faq-open.png` |
| DOM source (desktop 1440) | `components/09-faq-section.tree.json` |
| Open-state diff (desktop) | `components/09-faq-section.open.json` (item 1 open) |
| DOM source (tablet 768) | `components/09-faq-section.tablet.tree.json` |
| DOM source (mobile 390) | `components/09-faq-section.mobile.tree.json` |
| CSS source | `webflow.css` (`.faq-section`, `.faq-content-wrapper`, `.faq-title-left`, `.faq-wrapper`, `.single-faq`, `.faq-question*`, `.faq-icon*`, `.faq-answer*`, `.faq-paragraph`, `.hero-subtitle`, `.heading-2`, `.w-dropdown*`) |
| Behavior capture | `BEHAVIORS.json → initialHidden` (h2.heading-2 + the five .single-faq) |
| IX2 source | `webflow.facc2713.1f684ae672bd7cfd.js` (events `e-1146…e-1153`, action lists `a-70` / `a-71`, scroll events `e-1228`, `e-1230…e-1238`) |

**Interaction model (verified against the live HTML + IX2 data):**

1. **Scroll reveal.** `p.hero-subtitle` ("FAQ") is *not* hidden. Two reveal groups, both
   `SCROLL_INTO_VIEW` with `scrollOffsetValue:0`, `scrollOffsetUnit:"%"`,
   `mediaQueries:["main","medium","small","tiny"]`:
   - `h2.heading-2` → action list `slideInBottom`, **delay 200ms** (event `e-1228`, `direction:"BOTTOM"`).
   - each `div.single-faq` → action list `slideInRight`, **delays 300 / 400 / 600 / 700 / 800ms**
     (events `e-1230 / e-1232 / e-1234 / e-1236 / e-1238`, `direction:"RIGHT"`), targets
     `882c9457…41f1`, `334523b0…c3b5`, `c89893bc…8bcf`, `5bb19d17…ab17`, `bf560a1a…cd7e`.
   Reproduced with a local `useInView` IntersectionObserver hook per target and the team's
   standard reveal (`opacity 0 → 1`, **700ms ease-out**, `motion-reduce:transition-none`), plus
   the direction-specific offset: heading `translateY(24px)`, items `translateX(24px)` (Webflow's
   preset distances are compiled into the runtime; the 24px offset is the clone convention).
   Each item keeps its own instance so the stagger survives. Final state = the desktop tree
   (`opacity:1`, `transform:matrix(1,0,0,1,0,0)`).
2. **Accordion — single open.** Each `.single-faq` is a Webflow dropdown
   (`data-hover="false" data-delay="0"`). Clicking a `.faq-question` toggles it; Webflow's
   dropdown source closes every *other* dropdown first (`l.each(... r.is(i) || r.has(i).length ||
   r.triggerHandler("w-close.w-dropdown"))`), so **at most one panel is open at a time**, and
   clicking an open question closes it. Every item ships closed (`<nav style="height:0px">`).
   The open item gets `z-index: 901` (closed = `900`, from `.w-dropdown`), `w--open` on the
   toggle and the list, and `aria-expanded="true"` on the toggle.
3. **Open animation — IX2 `a-70` "Single Faq Open"** (`useFirstGroupAsInitialState:true`):
   group 1 (the reset state, applied instantly) = `.faq-answer` `height:0px` /
   `.faq-icon` `rotateZ(0)` / `.faq-question` `background:#fff`, all **500ms**;
   group 2 (the animated target) =
   | property | from | to | duration | easing |
   | --- | --- | --- | --- | --- |
   | `.faq-answer` height | `0px` | `AUTO` | **400ms** | `""` |
   | `.faq-icon` rotateZ | `0deg` | **`180deg`** | **400ms** | `""` |
   | `.faq-question` background-color | `#fff` | **`#F7F6F3`** (`--all-color--neutral-02`) | **400ms** | `""` |
4. **Close animation — IX2 `a-71` "Single Faq Close"** (`useFirstGroupAsInitialState:false`),
   single group:
   | property | from | to | duration | easing |
   | --- | --- | --- | --- | --- |
   | `.faq-answer` height | auto | `0px` | **400ms** | `""` |
   | `.faq-icon` rotateZ | `180deg` | `0deg` | **400ms** | `""` |
   | `.faq-question` background-color | `#F7F6F3` | `#fff` (`--all-color--neutral-01`) | **500ms** | `""` |
5. **Easing is linear.** Every action item stores `easing:""` (the only other easings used on the
   page are `"outQuart"` and `"outBounce"`). In the Webflow runtime `applyEasing(name, t, custom)`
   resolves an unknown/empty name to the raw float
   (`u(t>0 && e && a[e] ? a[e](t) : t)` → `u(t)`), and the IX3/GSAP path maps it to `"none"`.
   Both engines therefore interpolate **linearly** → `ease-linear` / `transition-timing-function: linear`.
6. **Outside click closes the open item.** The Webflow dropdown component registers a document
   `mouseup` handler once open (`mouseUpOutside`) and calls `N(dropdown)` when the target is not
   inside that dropdown. Reproduced with a single `mouseup` listener that is only bound while an
   item is open. The component's `focusout` handler is inert (it short-circuits on
   `dropdown.contains(event.target)`, and `event.target` is always the toggle), so no blur-close
   is implemented.
7. Header is not sticky; the floating Webflow "Get This Template" widget is never rendered.

**Section role:** cream-free white band — left column `FAQ` eyebrow + 56px heading (430px max),
right column a 660px accordion of five bordered rows; stacks vertically below 992px.

## DOM structure

```
section.faq-section                          <section>, transparent, padding
└─ div.container.w-container                 max-w 1280, mx-auto, w-full
   └─ div.faq-content-wrapper                flex row (≥992) / column (<992), gap 56/56/40
      ├─ div.faq-title-left                  max-w 430 (≥992) / 100%
      │  ├─ p.hero-subtitle                  "FAQ"
      │  └─ h2.heading-2                     "Frequently Asked Questions" (reveal)
      └─ div.faq-wrapper                     flex column, gap 8, max-w 660 / 100%
         └─ (×5) div.single-faq.w-dropdown   relative, z 900 (901 open), border-b, reveal
            ├─ div.faq-question.w-dropdown-toggle   → rendered as <button>
            │  └─ span (block/flex) .faq-question-wrapper   flex row, space-between, align-start, w-full
            │     ├─ span .faq-title                       the question (width 93% / 86%)
            │     └─ span .faq-icon-wrapper                24×30, pt 6, flex center
            │        └─ img.faq-icon                       24×24 chevron, rotates 180° when open
            └─ nav.faq-answer.w-dropdown-list              relative, overflow-hidden, h 0 ↔ auto
               └─ div.faq-answer-text                      rounded 16, padding
                  └─ p.faq-paragraph                       the answer
```

Tags are reproduced from the tree with two deliberate substitutions:

- the source `div.faq-question` becomes a `<button type="button">` — Webflow's own JS writes
  `aria-expanded` on it, binds `Space`/`ENTER`, and sets `cursor:pointer`, i.e. it behaves as a
  button. Box, layout and computed styles are unchanged (`w-full`, `text-left`, `cursor-pointer`,
  `outline` only on `:focus-visible`).
- the three descendants of the toggle are `span`s with `block`/`flex` display (a `<button>` may
  only contain phrasing content). They carry exactly the `.faq-question-wrapper`, `.faq-title`
  and `.faq-icon-wrapper` boxes.

The Webflow markup ships `style="opacity:0"` on `h2.heading-2` and every `.single-faq`, plus
`style="height:0px"` on every `nav.faq-answer` and `background-color:rgb(255,255,255)"` on every
`.faq-question`.

## Computed styles

### Section & container (`.faq-section`, `.container`)

| Property | Desktop ≥992 | Tablet 768–991 | Mobile ≤767 |
| --- | --- | --- | --- |
| background | transparent (unset) | transparent | transparent |
| padding | `0px 30px 120px` | `0px 30px 80px` | `0px 20px 60px` |
| container width (measured) | `1280px` (cap) | `708px` | `350px` |
| inherited font | Rethink Sans 14/20 #333 | same | same |
| section height (closed, measured) | `469.969px` | `585.969px` | `631.547px` |
| section height (item 1 open) | `591.578px` | — | — |

There is **no top padding** — the eyebrow starts flush with the section top edge.

### `.faq-content-wrapper`

CSS: `.faq-content-wrapper{grid-column-gap:56px;grid-row-gap:56px;flex-flow:row;
justify-content:space-between;align-items:flex-start;width:100%;display:flex}`
→ `@media ≤991: flex-flow:column; align-items:center` → `@media ≤767: gap 40px`.

| Property | Desktop | Tablet | Mobile |
| --- | --- | --- | --- |
| flex-direction | `row` | `column` | `column` |
| justify-content | `space-between` | (n/a) | (n/a) |
| align-items | `flex-start` | `center` | `center` |
| gap | `56px` | `56px` | `40px` |
| measured size | `1280 × 349.969` | `708 × 505.969` | `350 × 571.547` |

### `.faq-title-left` / `p.hero-subtitle` / `h2.heading-2`

| Property | Desktop | Tablet | Mobile |
| --- | --- | --- | --- |
| title-left max-width | `430px` | `100%` | `100%` |
| title-left measured size | `430 × 181.609` | `708 × 100` | `350 × 119.203` |
| `.hero-subtitle` font | Instrument Sans 600 `16px/27.2px` `#FF6C1F` `uppercase`, `margin-bottom:20px` | same | same |
| `h2.heading-2` font-size / line-height | `56px / 67.2px` | `44px / 52.8px` | `30px / 36px` |
| `h2.heading-2` letter-spacing | `-1.5px` | `-1px` | `0px` |
| `h2.heading-2` weight / color / family | `600` / `#112C23` / Rethink Sans | same | same |
| `h2.heading-2` measured height | `134.406px` (2 lines) | `52.797px` (1 line) | `72px` (2 lines) |

### `.faq-wrapper`

CSS: `flex-flow:column; grid gap 8px; max-width 660px` → `@media ≤991: max-width 100%`.

| Property | Desktop | Tablet | Mobile |
| --- | --- | --- | --- |
| flex-direction / gap | `column` / `8px` | `column` / `8px` | `column` / `8px` |
| max-width | `660px` | `100%` | `100%` |
| measured height (closed) | `349.969px` | `349.969px` | `412.344px` |

### `.single-faq`

CSS: `white-space:pre-wrap; word-break:keep-all; border-bottom:1px solid #47564e29;
flex-flow:column; align-items:flex-start; width:100%; display:flex; position:relative;
overflow:hidden` + `.w-dropdown{z-index:900;position:relative}` (open → `901`, set by JS).

| Property | Value |
| --- | --- |
| display / flex-direction | `flex` / `column` |
| width | `100%` |
| border-bottom | `1px solid #47564E29` (rgba(71,86,78,0.16)) |
| overflow / position | `hidden` / `relative` |
| z-index | `900` closed → `901` open |
| measured height (closed) | `63.5938px` desktop/tablet · `82.1875px` mobile (2-line question) · `51.5938px` mobile (1-line question, item 4) |
| measured height (item 1 open) | `185.203px` desktop |

### `.faq-question` (toggle)

CSS: `.faq-question{background-color:var(--all-color--neutral-01)=#fff; border-radius:12px;
flex-flow:row; justify-content:space-between; align-items:center; width:100%;
padding:16px 24px; display:flex; overflow:hidden}` → `@media ≤479: padding:10px 15px`
→ `.w-dropdown-toggle{cursor:pointer; user-select:none}` and `:focus{outline:0}`.

| Property | Desktop | Tablet | Mobile |
| --- | --- | --- | --- |
| padding | `16px 24px` | `16px 24px` | `10px 15px` |
| background (closed / open) | `#fff` / `#F7F6F3` | same | same |
| border-radius | `12px` | `12px` | `12px` |
| overflow / cursor | `hidden` / `pointer` | same | same |
| measured height | `62.5938px` | `62.5938px` | `81.1875px` (2-line) / `50.5938px` (1-line) |
| computed font | Rethink Sans 14/20 `#222` | same | same |

### `.faq-question-wrapper` / `.faq-title` / `.faq-icon-wrapper` / `img.faq-icon`

CSS: `.faq-question-wrapper{white-space:pre-wrap;word-break:keep-all;flex-flow:row;
justify-content:space-between;align-items:flex-start;width:100%;display:flex}`
· `.faq-title{font-family:Instrument Sans;color:#112C23;font-size:18px;line-height:170%;
font-weight:500;width:93%}` → `≤767: width:92%` → `≤479: width:86%;font-size:18px`
· `.faq-icon-wrapper{flex-flow:column;justify-content:center;align-items:center;padding-top:6px}`

| Property | Desktop | Tablet | Mobile |
| --- | --- | --- | --- |
| wrapper width (measured) | `612px` | `660px` | `320px` |
| `.faq-title` width | `93%` → `569.156px` | `93%` → `613.797px` | `86%` → `275.188px` |
| `.faq-title` font | Instrument Sans 500 `18px/30.6px` `#112C23` | same | same |
| `.faq-icon-wrapper` size / padding | `24 × 30px` / `padding-top:6px` | same | same |
| `img.faq-icon` box | `24 × 24px` | `24 × 24px` | `24 × 24px` |
| `img.faq-icon` transform | `rotateZ(0)` closed → `rotateZ(180deg)` open | same | same |

### `.faq-answer` (nav) / `.faq-answer-text` / `.faq-paragraph`

CSS: `.faq-answer{background-color:#ddd0;flex-flow:column;align-items:flex-start;width:100%;
display:flex;position:relative;overflow:hidden}` + `.w-dropdown-list{display:none;
position:absolute}` → `.w--open{display:block}`. The clone always uses `block` + `overflow:hidden`
and drives `height` (`0px` ↔ measured content height), which is what IX2 animates.
`.faq-answer-text{white-space:normal;border-radius:16px;padding:16px 24px 24px}`
→ `≤991: width:97%` → `≤767: width:100%` → `≤479: padding-bottom:16px; padding-left:15px;
padding-right:15px`.
`.faq-paragraph{color:#3b3b3b;font-size:16px;font-weight:400;line-height:170%}` (Instrument Sans).

| Property | Desktop | Tablet | Mobile |
| --- | --- | --- | --- |
| nav width (measured) | `660px` | `708px` | `350px` |
| nav height closed / open | `0px` (inline) / `121.609px` | `0px` / `94.4–121.609px` | `0px` / `168.016–195.219px` |
| `.faq-answer-text` width | `100%` → `660px` | `97%` → `686.75px` | `100%` → `350px` |
| `.faq-answer-text` padding | `16px 24px 24px` | `16px 24px 24px` | `16px 15px 16px` |
| `.faq-answer-text` border-radius | `16px` | `16px` | `16px` |
| `.faq-paragraph` font | Instrument Sans 400 `16px/27.2px` `#3B3B3B` | same | same |
| `.faq-paragraph` measured height | `81.609px` (3 lines) | `54.406–81.609px` | `136.016–163.219px` |

Measured heights are the values the clone must reproduce through the natural text flow (no fixed
heights); the accordion animates between `0px` and that measured content height.

## States & behaviors

| # | Trigger | Before | After | Transition | Implementation |
| --- | --- | --- | --- | --- | --- |
| 1 | `h2.heading-2` enters viewport | `opacity:0`, `translateY(24px)` | `opacity:1`, `translateY(0)` | `all 700ms ease-out`, **delay 200ms** | local `useInView` + `delay-[200ms]` |
| 2 | item 1 / 2 / 3 / 4 / 5 enters viewport | `opacity:0`, `translateX(24px)` | `opacity:1`, `translateX(0)` | `all 700ms ease-out`, **delay 300 / 400 / 600 / 700 / 800ms** | own `useInView` instance per item + `delay-[Nms]` |
| 3 | click a closed `.faq-question` | nav `height:0`, icon `rotateZ(0)`, bg `#fff`, item `z:900` | nav `height:auto`, icon `rotateZ(180deg)`, bg `#F7F6F3`, item `z:901` | nav height **400ms**, icon transform **400ms**, bg **400ms**, all **linear** | React state (`openIndex`), `style={{height}}` measured via `useLayoutEffect` + `ResizeObserver`, `transition-[height] duration-[400ms] ease-linear`, `transition-transform duration-[400ms] ease-linear`, `transition-colors duration-[400ms] ease-linear` |
| 4 | click the open `.faq-question` | open state | closed state | nav height **400ms**, icon **400ms**, bg **500ms**, all **linear** | same, `duration-[500ms]` on the toggle when it is closing |
| 5 | click another `.faq-question` while one is open | the open item stays open | the previously open item closes (Webflow fires `w-close` on it) and the clicked one opens | both of the above, concurrently | `openIndex` is a single number, so the old item unmounts to `closed` at the same time the new one mounts to `open` |
| 6 | keyboard `Space` / `ENTER` on the toggle | — | same as click | same | native `<button>` activation |
| 7 | `mouseup` outside the open item | open | closed | same as #4 | per-item `document` `mouseup` listener, bound only while that item is open and ignored when the target is inside its `.single-faq` |
| 8 | hover on `.faq-question` | **no change** (`data-hover="false"`; no `:hover` rule for `.faq-question` in `webflow.css`) | — | — | nothing implemented |
| 9 | focus moves out of an open item | open | **stays open** (Webflow's `focusout` handler short-circuits on `dropdown.contains(event.target)`) | — | nothing implemented |
| 10 | `IntersectionObserver` unavailable / JS off | — | elements render in their final (visible) state; accordion still works (state-driven) | — | hook falls back to `visible = true` after a timeout |
| 11 | `prefers-reduced-motion: reduce` | — | reveals and the height/rotation snap to their final state | — | `motion-reduce:transition-none` |

Accepted deviations:

- Webflow's reveal presets re-arm when the element leaves the viewport (`autoStopEventId`
  `e-1229`/`e-1231`/…); this build reveals once and keeps the final state, like every other
  section of the clone.
- The preset travel distance (`slideInBottom` / `slideInRight`) is compiled into the Webflow
  runtime and is not in the captured data; the clone uses the team-standard `24px`.
- The source toggle is a `div` driven by JS (with `:focus{outline:0}`); the clone uses a real
  `<button>` (with `span` children) and a `:focus-visible` outline — identical box, better
  semantics. The toggle's computed `color:#222` is not reproduced because no text inherits it
  (`.faq-title` sets `#112C23`, the chevron SVG carries its own `#47564E` stroke).
- Webflow has a 480–767px step where `.faq-title` is `92%` wide and `.faq-answer-text` is
  `100%`; only `md`/`lg` are exposed by the brief, so the base styles carry the ≤479 capture
  values (86% / `16px 15px 16px`). Only the three captured viewports are pixel-exact.
- The `.single-faq` reveal wrapper carries `transition-all`; its own height is `auto` (not an
  interpolable computed value), so the accordion's 400ms height animation on the child `nav` is
  unaffected.

## Assets (local, via `ASSETS` from `../shared/assets`)

| Key | Local path | Used for |
| --- | --- | --- |
| `692fd2dc4d63bf298d8f853f_chevron-down-4` | `/sites/elevaana-webflow-io-f5aaaf30/root-8a5edab2/images/692fd2dc4d63bf298d8f853f_chevron-down-4-d7d72d.svg` | `img.faq-icon` in all five rows (24×24, `alt="Icon"`, `loading="lazy"`) |

The SVG is `viewBox="0 0 24 24"`, path `M6 9L12 15L18 9`, `stroke:#47564E`, `stroke-width:2`,
`stroke-linecap/linejoin:round`. `chevron-down-2` / `chevron-down-3` belong to the project-card
buttons and are not used here. No remote URLs; no background images.

## Text content (verbatim)

Eyebrow / heading:

- `FAQ`
- `Frequently Asked Questions`

Questions and answers (all five rows, in order):

1. `How long does a typical renovation take?`
   `Project timelines vary depending on the scope, but most single-room renovations take 2–4 weeks, while full-home projects can range from 8–12 weeks. We provide a detailed timeline before starting so you know what to expect.`
2. `Do you provide free consultations?`
   `Depending on scope, smaller room projects take around 2–4 weeks, whereas complete home renovations can take 8–12 weeks. We outline everything in advance to keep things transparent.`
3. `Can I live in my home during the renovation?`
   `Duration varies by project size. Most individual rooms are completed within 2–4 weeks, while full-home remodels take 8–12 weeks. We provide a detailed plan before starting.`
4. `What areas do you serve?`
   `The timeline depends on how extensive the work is. Room remodels generally take 2–4 weeks, and full-home projects can take 8–12 weeks. We make sure you receive a full schedule ahead of time.`
5. `Are your renovations fully insured and licensed?`
   `Project length is based on scope. A single-room transformation is usually finished in 2–4 weeks, and complete home renovations may take 8–12 weeks. You’ll get a full timeline before we begin.`

The dashes in `2–4` / `8–12` are **en dashes** (U+2013) and the apostrophe in `You’ll` is the
typographic `’` (U+2019), as stored in the tree JSON (`[char] 8211` / `8217`). Image `alt` is
`Icon` (from the source `alt="Icon"`).

## Responsive

Breakpoints: Tailwind `md:` = 768px (Webflow tablet floor) and `lg:` = 992px (Webflow desktop
floor); base styles = Webflow mobile (captured at 390px).

| Piece | base ≤767 | `md:` 768–991 | `lg:` ≥992 |
| --- | --- | --- | --- |
| section padding | `0 20px 60px` | `0 30px 80px` | `0 30px 120px` |
| content-wrapper | `column`, `items-center`, gap `40px` | `column`, `items-center`, gap `56px` | `row`, `items-start`, `justify-between`, gap `56px` |
| title-left max-width | `100%` | `100%` | `430px` |
| wrapper max-width | `100%` | `100%` | `660px` |
| `h2.heading-2` | `30/36`, `0px` | `44/52.8`, `-1px` | `56/67.2`, `-1.5px` |
| toggle padding | `10px 15px` | `16px 24px` | `16px 24px` |
| `.faq-title` width | `86%` | `93%` | `93%` |
| `.faq-answer-text` width / padding | `100%` / `16px 15px 16px` | `97%` / `16px 24px 24px` | `100%` / `16px 24px 24px` |
| measured closed item height | `82.1875px` (2 lines) / `51.5938px` (1 line) | `63.5938px` | `63.5938px` |

Everything else (colors, fonts, radii, the 8px row gap, the 24px chevron, the 6px icon offset,
the border color, all animation timings) is identical at every breakpoint.
