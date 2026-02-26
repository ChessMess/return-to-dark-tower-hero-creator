# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # start dev server at http://localhost:5173
npm run build    # production build → dist/
npm run preview  # preview the production build
```

No test suite exists. No linter is configured.

## Architecture

Single-page app: left sidebar (editor) + right main area (live SVG preview).

**Data flow:** `App.jsx` owns all state via `useState`. It passes `hero`, `updateHero`, and `updateVirtue` down to `HeroForm` and `hero` down to `HeroCard`. Every state change is persisted to `localStorage` immediately.

**State shape** (canonical source: `src/data/defaultHero.js`):
```js
{
  name, warriors, spirit, portraitDataUrl,
  flavorLine1, flavorLine2,
  virtues: [
    { name, advantageType },         // virtue[0] only — no description lines
    { name, line1, line2 },          // virtue[1..4]
  ],
  championTerrain
}
```

**`HeroCard.jsx`** renders a single 910×606px inline SVG with all hero data bound to SVG `<text>` elements and a `<image>` for the portrait. The SVG matches `hero_card_template.svg` (kept as a reference — do not delete). Virtue 1 (index 0) only has space for `name` + `advantageType`; it never shows description lines.

**PDF export** (`App.jsx:handleDownloadPdf`): queries `#hero-card-container svg`, passes it to `svg2pdf.js` + `jspdf` at 910×606px landscape. No rasterization — the output is vector.

## Tailwind

Uses Tailwind CSS v4 via `@tailwindcss/vite` plugin. There is **no** `tailwind.config.js` or `postcss.config.js`. The single CSS entry point is `src/index.css` which contains only `@import "tailwindcss"`.

## SVG Template Sync — CRITICAL

**`hero_card_template.svg` and `src/components/HeroCard.jsx` MUST always be kept in sync.** This is the single most important rule in this codebase.

- `hero_card_template.svg` is the authoritative design source — all visual structure, coordinates, gradients, fonts, and layout live here.
- `HeroCard.jsx` is the React implementation of that exact template, with hero data bound into the SVG elements.
- Any visual change (layout, geometry, colours, gradients, text positioning, new elements) **must be made in both files**. Never update one without updating the other.
- Before making any SVG change in `HeroCard.jsx`, read `hero_card_template.svg` to understand the intended design. Before editing `hero_card_template.svg`, check whether `HeroCard.jsx` needs a matching update.
- Do not delete `hero_card_template.svg` — it is the source of truth for the card design.

## Key Constraints

- Portrait images are stored as base64 data URLs in state (and localStorage). Large images will bloat localStorage.
- SVG filters `#parchment` and `#cardShadow` are defined in `HeroCard.jsx` but never applied — they are harmless dead code.

## Git

Remote: `https://github.com/ChessMess/return-to-dark-tower-hero-creator.git`
