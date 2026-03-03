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

The app uses **react-router-dom** with a single active route:

- **V2** (`/`) — Hero **Board** creator (1213×808px).

Routing shell: `src/RouterApp.jsx` → `BrowserRouter` with `basename={import.meta.env.BASE_URL}`.

### Directory structure

```
src/
  main.jsx           # mounts RouterApp
  RouterApp.jsx      # BrowserRouter with / route
  index.css          # shared Tailwind entry
  v2/                # hero board app
    App.jsx          # state owner + layout + PDF export
    components/
      HeroBoard.jsx
      HeroForm.jsx
    data/defaultHero.js
    utils/heroIO.js
```

### V2 details

Uses `hero_board_template.svg` (1213×808px) as the design source. localStorage key: `"rtdt-hero-v2"`.

**Data flow:** `src/v2/App.jsx` owns state and passes `hero` + updater callbacks into `HeroForm` and `HeroBoard`. State is persisted via `src/v2/utils/heroIO.js`.

**Compatibility:** `src/v2/utils/heroIO.js` still supports importing/migrating legacy V1 JSON data when detected.

## Tailwind

Uses Tailwind CSS v4 via `@tailwindcss/vite` plugin. There is **no** `tailwind.config.js` or `postcss.config.js`. The single CSS entry point is `src/index.css` which contains only `@import "tailwindcss"`.

## SVG Template Sync — CRITICAL

### V2: `hero_board_template.svg` ↔ `src/v2/components/HeroBoard.jsx`

- The SVG template is the authoritative design source — all visual structure, coordinates, gradients, fonts, and layout live there.
- The React component is the implementation of that template, with hero data bound into SVG elements.
- Any visual change **must be made in both files**. Never update one without the other.
- Do not delete the SVG template — it is the source of truth.

## Key Constraints

- Portrait images are stored as base64 data URLs in state (and localStorage). Large images will bloat localStorage.
- GitHub Pages SPA routing uses `public/404.html` redirect + `index.html` decode script.

## Git

Remote: `https://github.com/ChessMess/return-to-dark-tower-hero-creator.git`
