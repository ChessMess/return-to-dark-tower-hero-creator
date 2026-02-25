# RTDT Hero Card Creator

Create custom hero boards for [Return to Dark Tower](https://restorationgames.com/return-to-dark-tower/).

![Hero Card Preview](hero_card_template.svg)

## Requirements

- [Node.js](https://nodejs.org/) v20 or higher

## Install & Run

```bash
git clone https://github.com/YOUR_USERNAME/return-to-dark-tower-hero-creator.git
cd return-to-dark-tower-hero-creator
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

## Build (standalone)

```bash
npm run build
```

The `dist/` folder is a self-contained static site. Host it anywhere, or serve it locally with:

```bash
npm run preview
```

## Usage

1. **Hero Identity** — Enter your hero's name and set starting Warriors and Spirit
2. **Portrait** — Upload a custom portrait image (JPG, PNG, etc.)
3. **Flavor Text** — Add two lines of atmospheric flavor text
4. **Virtues** — Define up to 5 virtues:
   - Virtue 1: choose a name and advantage type (e.g. "Stealth", "Magic", "Humanoid")
   - Virtues 2–5: add a name and two lines of ability text
5. **Champion** — Set the terrain type for your champion ability
6. Click **Download PDF** to save your hero board as a print-ready PDF

## Project Structure

```
src/
├── App.jsx            — Layout and state management
├── index.css          — Global styles
├── components/
│   ├── HeroCard.jsx   — Live SVG preview
│   └── HeroForm.jsx   — Editor form
└── data/
    └── defaultHero.js — Default hero values
```

## Contributing

Pull requests welcome. Please open an issue first to discuss larger changes.
