# Elevana clone — builder brief (read this first, in full)

You are one of several parallel builder agents reconstructing **https://elevaana.webflow.io/** (Webflow "Elevana" home-renovation template) as a Next.js 16 App Router app.

**Working directory (use as workdir for every command):** `C:\Users\CH&SAH\Desktop\cases\mnv`

## What you own (strict)

- ONE component file: `src/components/sites/elevaana-webflow-io-f5aaaf30/root-8a5edab2/<YourComponent>.tsx`
- ONE spec file you must write FIRST: `docs/research/elevaana-webflow-io-f5aaaf30/root-8a5edab2/components/<your-component-name>.spec.md`

Do **not** modify any other file — no `globals.css`, no `layout.tsx`, no `page.tsx`, no `shared/*`, no other components. Other agents own those in parallel.

## Inputs (exact source of truth)

| What | Path (relative to repo root) |
| --- | --- |
| Desktop DOM + computed styles (1440px) | `docs/research/elevaana-webflow-io-f5aaaf30/root-8a5edab2/components/0X-name.tree.json` |
| Mobile 390px styles | `.../components/0X-name.mobile.tree.json` |
| Tablet 768px styles | `.../components/0X-name.tablet.tree.json` |
| Section screenshot 1440px | `docs/design-references/elevaana-webflow-io-f5aaaf30/root-8a5edab2/section-0X-name.png` |
| Full original Webflow CSS | `docs/research/elevaana-webflow-io-f5aaaf30/root-8a5edab2/webflow.css` (grep by class for any missing value) |
| Behavior capture | `docs/research/elevaana-webflow-io-f5aaaf30/root-8a5edab2/BEHAVIORS.json` |
| Asset URL map | `src/components/sites/elevaana-webflow-io-f5aaaf30/shared/assets.ts` (`ASSETS` record, keys = original asset names) |

Tree JSON node shape: `{ tag, cls, text, st: {computed styles}, img?, video?, href?, c: [children] }`.
The desktop tree was captured **after** scroll reveals, so values are the final/resting state.
If your section has multiple states (FAQ open, hover), there may be a sibling file like `09-faq-section.open.json` or `hover-*.json`.

## Assets

Local files live under `/sites/elevaana-webflow-io-f5aaaf30/root-8a5edab2/images/` and `.../videos/` (public dir).
Import the map: `import { ASSETS } from "../shared/assets";` then e.g. `src={ASSETS["692fd2dc4d63bf298d8f84f3_Image-26"]}`.
Find the right key by grepping `assets.ts` for a distinctive part of the original filename (from the tree JSON `img.src`).

## Design tokens (extracted from the original)

- Colors: ink/dark green `#112C23` · brand orange `#FF6C1F` · muted slate text `#47564E` · cream `#F7F6F3` · white · near-black `#0B0707` · divider `rgba(71,86,78,0.2)` (`#47564e33`)
- Fonts: default/body = **Rethink Sans** (already on `body`, Tailwind class `font-heading`), secondary body copy = **Instrument Sans** (Tailwind class `font-sans`). Both loaded in the root layout. Match `st.fontFamily` in the tree exactly.
- Type scale (px / line-height / letter-spacing / weight): display `68/78.2/-2px/700` · h1 `64` · h2 `56/67.2/-1.5px/600` · h3 `36` · h4 `24/33.6/-0.5px/500` · body-20 · body-18/30.6 · body-16/27.2 · body-14/23.8 · body-12
- Layout: container `max-w-[1280px] mx-auto`; section padding `120px 30px` (desktop) — verify per section in the tree.
- Breakpoints (Webflow): desktop ≥992, tablet 768–991, mobile ≤767. Use Tailwind `md:` (768px) and `lg:` (992px) to reproduce, and read the `.mobile`/`.tablet` trees for exact values.

## Code style (enforced)

- TypeScript strict, **no `any`**, named export, PascalCase.
- Tailwind utility classes only. Use exact arbitrary values for pixel parity (`text-[68px] leading-[78.2px] tracking-[-2px] rounded-[12px]`). No `style={}` attributes unless truly impossible in Tailwind (keyframes/custom properties) — and then keep them to animation only.
- `cn()` from `@/lib/utils` when conditionally merging classes.
- `"use client"` only if the component needs state/effects; otherwise keep it a server component.
- Text content must be **verbatim** from the tree JSON (including punctuation and the `’` characters).
- Plain `<img>` tags with the local paths (set `alt` as in source). No remote URLs.
- Do **not** run `npm run build`. Verify with `npx tsc --noEmit` and fix any error caused by your file.

## Global interaction model (verified against the live site)

1. **The header is NOT sticky** — the whole page scrolls normally, no sticky nav, no shrink-on-scroll.
2. **Scroll reveal**: inner elements start at `opacity: 0` (+ sometimes `translateY`) and fade/slide in when they enter the viewport (Webflow IX2). Implement a small local IntersectionObserver hook inside your component (you may add it in the same file). Final state = values in the desktop tree.
3. **Primary button hover** (`.button-primary`): the label area holds two stacked copies of the text (`.primary-button-text`, `.primary-button-text-hover`). On hover **both translate Y by −30px over ~300ms ease**, revealing the second copy. Reproduce this exactly (overflow-hidden wrapper, 30px line box).
4. **Service card hover**: image `scale(1.0 → 1.1)`, arrow badge slides up (`translateY(80px → 0)`), overlay darkens.
5. Ignore the floating "Get This Template / Unlock 100+ Templates / Access 4200+ Components" widget visible in screenshots — it is a Webflow overlay, **not** part of the design. Never render it.

## Spec file template

Write `docs/research/.../components/<name>.spec.md` with sections: Overview (target file, screenshot, interaction model) · DOM structure · Computed styles (container + each child, exact values) · States & behaviors (trigger / before / after / transition / implementation) · Assets (local paths) · Text content (verbatim) · Responsive (desktop/tablet/mobile + breakpoint). Fill every section; write "N/A" only where genuinely absent.

## When done

Run `npx tsc --noEmit` (must be clean for your file) and reply with: file created, spec path, behaviors implemented, assets used, and anything you could not reproduce.
