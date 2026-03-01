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

The app is versioned with **react-router-dom**. Two versions live side by side:

- **V1** (`/v1` route) — Hero **Card** creator (910×606px). Fully working, preserved as-is.
- **V2** (`/` route) — Hero **Board** creator (1213×808px). Under development.

Routing shell: `src/RouterApp.jsx` → `BrowserRouter` with `basename={import.meta.env.BASE_URL}`.

### Directory structure
```
src/
  main.jsx           # mounts RouterApp
  RouterApp.jsx      # BrowserRouter with /v1 and / routes
  index.css          # shared Tailwind entry
  v1/                # complete, self-contained v1 app
    App.jsx
    components/HeroCard.jsx, HeroForm.jsx
    data/defaultHero.js
    utils/heroIO.js
  v2/                # new hero board version
    App.jsx          # stub for now
    components/
    data/
```

### V1 details

Left sidebar (editor) + right main area (live SVG preview).

**Data flow:** `v1/App.jsx` owns all state via `useState`. It passes `hero`, `updateHero`, and `updateVirtue` down to `HeroForm` and `hero` down to `HeroCard`. Every state change is persisted to `localStorage` key `"rtdt-hero"`.

**State shape** (canonical source: `src/v1/data/defaultHero.js`):
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

**PDF export** (`v1/App.jsx:handleDownloadPdf`): queries `#hero-card-container svg`, passes it to `svg2pdf.js` + `jspdf` at 910×606px landscape. No rasterization — the output is vector.

### V2 details

Uses `hero_board_template.svg` (1213×808px) as the design source. localStorage key: `"rtdt-hero-v2"` (separate from v1).

## Tailwind

Uses Tailwind CSS v4 via `@tailwindcss/vite` plugin. There is **no** `tailwind.config.js` or `postcss.config.js`. The single CSS entry point is `src/index.css` which contains only `@import "tailwindcss"`.

## SVG Template Sync — CRITICAL

### V1: `hero_card_template.svg` ↔ `src/v1/components/HeroCard.jsx`
### V2: `hero_board_template.svg` ↔ `src/v2/components/HeroBoard.jsx` (when created)

- The SVG template is the authoritative design source — all visual structure, coordinates, gradients, fonts, and layout live there.
- The React component is the implementation of that template, with hero data bound into SVG elements.
- Any visual change **must be made in both files**. Never update one without the other.
- Do not delete the SVG templates — they are the source of truth for each version's design.

## Key Constraints

- Portrait images are stored as base64 data URLs in state (and localStorage). Large images will bloat localStorage.
- V1 SVG filters `#parchment` and `#cardShadow` are defined in `HeroCard.jsx` but never applied — harmless dead code.
- GitHub Pages SPA routing uses `public/404.html` redirect + `index.html` decode script.

## Git

Remote: `https://github.com/ChessMess/return-to-dark-tower-hero-creator.git`
