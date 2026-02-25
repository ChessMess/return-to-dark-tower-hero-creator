# Plan: RTDT Hero Card Creator — React Web App

## Context

The project already has a complete, professionally designed `hero_card_template.svg` (910×606px landscape) with all visual styling, gradients, and game mechanics laid out. The goal is to wrap this in a React+Vite app so users can fill in custom hero data, see a live preview, and download as a PDF — all locally, no backend.

## Recommended Tech Stack

- **React 19 + Vite 6** — fast dev server, single `npm run build` distributable
- **Tailwind CSS v4** — utility classes for the editor panel UI (uses `@tailwindcss/vite` plugin — no `tailwind.config.js` or `postcss.config.js` needed)
- **`jspdf` + `svg2pdf.js`** — one-click vector PDF download (no print dialog)
- **No backend** — entirely self-contained single-page app

---

## File Structure

```
return-to-dark-tower-hero-creator/
├── .gitignore
├── README.md                    (clear install/run instructions)
├── index.html
├── vite.config.js               (includes @tailwindcss/vite plugin)
├── package.json
├── public/
│   ├── hero-orphaned-scion.jpeg
│   ├── hero-relic-hunter.jpeg
│   └── hero-spymaster.jpeg
└── src/
    ├── main.jsx
    ├── App.jsx                  (layout + state owner)
    ├── index.css                (@import "tailwindcss" — Tailwind v4 CSS entry)
    ├── components/
    │   ├── HeroForm.jsx         (all form inputs)
    │   └── HeroCard.jsx         (inline SVG, ~550 lines JSX)
    └── data/
        └── defaultHero.js       (canonical initial state)
```

---

## State Shape (`src/data/defaultHero.js`)

Virtue 1 is the special "primary advantage" slot — the template only has space for the advantage type line ("+1 TYPE Advantage"), so it has **no** separate description lines. Virtues 2–5 have two description lines each.

```js
export const defaultHero = {
  name: 'HERO NAME',
  warriors: 7,
  spirit: 1,
  portraitDataUrl: null,
  flavorLine1: 'Italicised flavour text',
  flavorLine2: 'vague and mysterious.',
  virtues: [
    { name: 'VIRTUE 1', advantageType: 'TYPE' },
    { name: 'VIRTUE 2', line1: 'Virtue ability', line2: 'description here.' },
    { name: 'VIRTUE 3', line1: 'Virtue ability', line2: 'description here.' },
    { name: 'VIRTUE 4', line1: 'Virtue ability', line2: 'description here.' },
    { name: 'VIRTUE 5', line1: 'Virtue ability', line2: 'description here.' },
  ],
  championTerrain: 'terrain',
};
```

---

## PDF Export

Uses `jspdf` + `svg2pdf.js` for one-click vector PDF download at exactly 910×606px landscape.

---

## Verification

1. `npm run dev` → open localhost → fill in fields → live preview updates
2. Upload a JPEG portrait → portrait appears in card, silhouette disappears
3. Click "Download PDF" → `hero-card.pdf` saves to Downloads, opens as crisp vector landscape PDF
4. `npm run build` → `dist/` folder is self-contained
