# Contributing to RTDT Hero Card Creator

Thank you for your interest in contributing! This document covers the development workflow and code standards.

## Getting Started

```bash
# Clone the repository
git clone https://github.com/ChessMess/return-to-dark-tower-hero-creator.git
cd return-to-dark-tower-hero-creator

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open **http://localhost:5173** in your browser to verify everything works.

## Development Workflow

1. **Create a branch** from `main` for your changes
2. **Make your changes** following the code standards below
3. **Test locally** — verify the SVG preview and PDF export work correctly
4. **Open a Pull Request** into `main`

### Useful Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build |

## Code Standards

### React / JSX

- Functional components with hooks (no class components)
- Keep component files focused — one component per file
- Use Tailwind CSS v4 utility classes for styling

### Style

- Follow existing naming conventions and file structure
- Keep SVG markup in `HeroCard.jsx` — all dynamic bindings are inline
- State shape is defined in `src/data/defaultHero.js`

## Project Architecture

```
src/
├── App.jsx            — Layout, state management, PDF download
├── index.css          — Global styles (Tailwind imports)
├── components/
│   ├── HeroCard.jsx   — Inline SVG hero card (~600 lines)
│   └── HeroForm.jsx   — Editor form with all inputs
└── data/
    └── defaultHero.js — Canonical state shape and defaults
```

Key points:

- **No backend** — this is a purely client-side SPA
- **No state library** — plain React `useState` in `App.jsx`
- **PDF export** — uses `jspdf` + `svg2pdf.js` to convert the live SVG to a vector PDF

## Release Process

This project follows [GitHub Flow](https://docs.github.com/en/get-started/using-github/github-flow) with tagged releases.

### Steps

1. **Create a release branch** from `main`:
   ```bash
   git checkout -b release/vX.Y.Z
   ```

2. **Update version** in `package.json`

3. **Update `CHANGELOG.md`** with the new version's changes

4. **Build and verify**:
   ```bash
   npm run build
   npm run preview
   ```

5. **Open a Pull Request** from the release branch into `main`

6. **After merge, tag the release**:
   ```bash
   git checkout main && git pull
   git tag vX.Y.Z
   git push origin vX.Y.Z
   ```

7. **Create a GitHub Release** from the tag with the changelog content as release notes

8. **Delete the release branch**:
   ```bash
   git push origin --delete release/vX.Y.Z
   ```

### Versioning

This project follows [Semantic Versioning](https://semver.org/):

- **Major** (X.0.0) — Breaking changes or significant architectural changes
- **Minor** (0.X.0) — New features, backwards-compatible
- **Patch** (0.0.X) — Bug fixes, backwards-compatible

## Questions?

Open an [issue](https://github.com/ChessMess/return-to-dark-tower-hero-creator/issues) and we'll be happy to help.
