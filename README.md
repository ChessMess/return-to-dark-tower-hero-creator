# RTDT Hero Board Creator

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Live Site](https://img.shields.io/badge/Live%20Site-GitHub%20Pages-blue)](https://chessmess.github.io/return-to-dark-tower-hero-creator/)

Create custom hero boards for [Return to Dark Tower](https://restorationgames.com/return-to-dark-tower/).

## Just want to use it?

**[Open the app in your browser](https://chessmess.github.io/return-to-dark-tower-hero-creator/)** — no installation required.

---

![Hero Board Preview](HeroBoardEmpty.png)

## Features

- **Live SVG Preview** — See your hero board update in real time as you edit
- **Vector PDF Export** — Download a print-ready PDF powered by jspdf + svg2pdf.js
- **Snapshot Export** — Click the camera icon to copy the board as a PNG to your clipboard; hold for 3 seconds to copy and download simultaneously
- **Custom Portraits** — Drag-and-drop or click-to-upload with automatic clip-path framing
- **Dynamic Virtue System** — 0–6 freely assignable virtue slots, each with a selectable type:
  - **Standard** — name and description text
  - **Advantage** — +1 type advantage
  - **Champion** — +2 wild advantages with kingdom selection
- **Banner Action** — Editable text for the hero's banner action
- **Flavor Text** — Single textarea with auto-wrapping and live character counter
- **Collapsible Editor** — Form sections collapse/expand with persistent state
- **Color Theming** — 6 preset themes matching official heroes, plus a custom base-color picker and advanced individual color controls
- **Community Gallery** — Share your heroes with the community and browse others' creations
- **No Backend Required** — Runs entirely in the browser as a static site (gallery uses Firebase free tier)

## Requirements

- [Node.js](https://nodejs.org/) v20 or higher

## Install & Run

```bash
git clone https://github.com/ChessMess/return-to-dark-tower-hero-creator.git
cd return-to-dark-tower-hero-creator
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

## Firebase Setup (Required For Gallery)

The gallery/auth features use Firebase. Configuration is loaded from Vite environment variables.
If these values are not provided, the app still builds and runs, but gallery/share/admin features are disabled.

1. Copy `.env.example` to `.env.local`
2. Fill in your Firebase values:

```bash
cp .env.example .env.local
```

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_DATABASE_URL=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

Security notes:

- Never commit real `.env` or `.env.local` files.
- Restrict your Firebase API key to expected referrers/APIs in Google Cloud.
- If a key is exposed, rotate it immediately in Google Cloud Console.

### GitHub Pages Deploy Secrets

If you deploy via `.github/workflows/deploy.yml`, add these repository secrets so gallery/auth works on the live site:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_DATABASE_URL`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

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
2. **Portrait** — Upload a custom portrait image (drag-and-drop or click to browse)
3. **Banner Action** — Set your hero's banner action text
4. **Flavor Text** — Add atmospheric flavor text (120 characters, auto-wraps on the board)
5. **Virtues** — Add up to 6 virtues and choose a type for each (Standard, Advantage, or Champion)
6. Click **Download PDF** to save your hero board as a print-ready PDF

## Sharing Heroes to the Gallery

You can share your custom hero with the community directly from the app:

1. Create and customize your hero — give it a unique name and at least one custom virtue
2. Click the **Share** button in the sidebar
3. Sign in with your Google account (prompted automatically if not already signed in)
4. Confirm the submission — your hero is sent for review
5. Once approved by an admin, it will appear in the **Gallery** for everyone to browse, view, and download

**What gets shared:** Hero name, stats, virtues, flavor text, banner action, portrait, and author info. Portrait images must be under 2 MB.

**What doesn't get shared:** Contact info is not included in gallery submissions.

**Requirements:** A Google account is required to submit. Heroes with default names or default virtue names will be rejected.

**Duplicate prevention:** Submitting the same hero twice is automatically blocked. If you make changes to your hero, you can submit the updated version as a new entry.

## Project Structure

```
src/
├── main.jsx              — Mounts RouterApp
├── RouterApp.jsx          — BrowserRouter with / route
├── index.css              — Shared Tailwind entry
└── v2/                    — Hero board creator
    ├── App.jsx
    ├── components/
    │   ├── HeroBoard.jsx  — Live SVG preview
    │   └── HeroForm.jsx   — Editor form
    ├── data/
    │   └── defaultHero.js — Default hero values
    └── utils/
        └── heroIO.js      — Save/load/import/export
```

## Contributing

Pull requests welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for development workflow, code standards, and the release process. Open an [issue](https://github.com/ChessMess/return-to-dark-tower-hero-creator/issues) first to discuss larger changes.

## License

[MIT](LICENSE) — see [LICENSE](LICENSE) for details.
