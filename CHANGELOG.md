# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/), and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- **Standard Default & Advantage Default Virtue Types** — Two new virtue frame styles (`virtue_standard_default.svg`, `virtue_advantage_default.svg`) added to the type selector alongside the existing Standard, Advantage, and Champion options.
- **Collapsible Form Sections** — Each editor section (Hero Identity, Banner Action, Virtues, Author Info) has a clickable header with a ▼/▲ toggle to collapse or expand its contents; section states persist across page reloads via localStorage.
- **Reset Confirmation Dialog** — Clicking the Reset button now warns you if any fields have been changed from their defaults, preventing accidental data loss.

### Changed

- **Reset Button Styling** — Reset button now has a visible border, rounded corners, and smaller text so it reads as a proper button instead of plain text.

- **Responsive Board Preview** — V2 hero board now automatically scales to fit the viewport; resizing the browser or toggling the sidebar reflows the card instantly. Toolbar (sidebar toggle, flip, zoom) moved to a dedicated row above the card so controls never overlap the preview. Zooming beyond 100% produces scrollbars for panning.
- **Flavor Text Redesign** — Replaced V2's two separate single-line flavor text inputs with a single textarea (120-character max, up from 2×35). The field includes a live character counter. On the board, text auto-wraps across up to three centered italic lines. Existing saves and V1 migrations are handled transparently.

## [2.0.0] - 2026-03-01

### Added

- **V2 Hero Board Creator** — All-new board creator based on the full 1213×808px hero board template, replacing the smaller 910×606px hero card as the default view. V1 card creator remains accessible at `/v1`.
- **Dynamic Virtue System** — 0–6 freely assignable virtue slots (up from V1's fixed 5). Each virtue has a type selector: **Standard** (description text), **Advantage** (+1 type advantage), or **Champion** (+2 wild advantages with kingdom selection).
- **Dedicated Virtue Artwork** — Three distinct SVG artwork frames (`virtue_standard.svg`, `virtue_advantage.svg`, `virtue_champion.svg`) rendered per-slot based on virtue type, with empty placeholder shapes for unassigned slots.
- **Champion Virtue Type** — Champion virtues display a centered 2-line title ("CHAMPION OF / THE {KINGDOM}" or "CHAMPION / ABILITY" for all-kingdom), with "+2 Wild Advantages in {terrain}" body text. Kingdom options: ALL, NORTH, SOUTH, EAST, WEST.
- **Banner Action** — New editable text field for the hero's banner action (e.g., "Gain 1 potion"), rendered on the board.
- **Hero Portrait** — Drag-and-drop or click-to-upload portrait image with clip-path framing, matching V1's `xMidYMin slice` approach.
- **PDF Export with Rasterization** — SVG `<image>` references are rasterized to high-res PNG (3× scale) before PDF generation, fixing corruption issues with complex SVG backgrounds in svg2pdf.js.
- **V1 Data Migration** — Automatically migrates V1 hero data from `rtdt-hero` localStorage key to V2 format on first load.

### Changed

- **Versioned Routing** — App now uses react-router-dom with V2 at `/` (default) and V1 preserved at `/v1`.
- **Separate Storage** — V2 uses `rtdt-hero-v2` localStorage key, independent of V1's `rtdt-hero`.
- **Google Fonts** — Added Karma (600, 700) and Aleo (italic) via CDN for accurate board text rendering.

## [1.4.0] - 2026-02-27

### Added

- **Card Flip Preview** — The hero preview card now features a flip effect: click the 'Show Back' button to flip the card and reveal a back side displaying author information, description, and a custom background image. The back layout adapts to only show fields that are filled in, and the flip animation is smooth and consistent. PDF export remains front-only.
- **Collapsible Sidebar** — Toggle button (« / ») in the preview panel collapses and expands the editor sidebar with a smooth slide animation; sidebar state persists across page reloads via localStorage

### Changed

- **Author / Revision Badge** — Badge is now hidden by default; only appears when at least one of author name or revision number is entered (default values cleared)
- **Kingdom Dropdown** — Added a blank "— none —" default option; when no kingdom is selected the champion ability tab on the card reads "CHAMPION ABILITY" instead of "CHAMPION OF THE [KINGDOM]"

## [1.3.1] - 2026-02-26

### Changed

- **Portrait Import** — Hero JSON paste and file import now only accept JPEG, PNG, and GIF portrait images; other formats are silently ignored
- **Portrait Upload** — Portrait file picker restricted to JPEG, PNG, and GIF; SVG and other formats are rejected
- **Import Validation** — Hero data loaded from storage or imported via file/paste now enforces field length limits consistent with the editor

## [1.3.0] - 2026-02-26

### Added

- **Author Info** — New sidebar section to record author name, revision number, contact info, and design notes/description
- **Author / Revision Badge** — Preview panel shows a subtle badge in the top-left corner when author name or revision is set
- **Contact Badge** — Preview panel shows a contact badge in the bottom-left corner with a one-click copy button when contact info is set

### Changed

- **Move Icon** — Replaced placeholder chevron with authentic boot silhouette matching the official RTDT hero board design
- **Portrait Alignment** — Portrait images now align to the top of the frame instead of centering, so faces and heads are visible first
- **Portrait Drag & Drop** — Portrait upload area now accepts drag-and-drop in addition to click-to-browse; you can also drag a new image onto an existing portrait to replace it
- **Zoom Controls** — Tightened button sizing for a more compact feel

## [1.2.0] - 2026-02-25

### Changed

- **Virtue Editor** — Condensed the 5 separate virtue sections into a single unified section with a dropdown selector and ◀ ▶ arrow buttons to cycle between virtues

## [1.1.0] - 2026-02-25

### Added

- **Save / Load Hero** — Save hero data to a JSON file and load it back; filename prompt pre-fills with the hero name
- **Copy / Paste Hero** — Copy hero JSON to clipboard; paste via a modal textarea for easy sharing
- **Portrait Image Optimization** — Uploaded portraits are automatically resized (max 540×740px) and compressed to JPEG at 80% quality, keeping file sizes small without visible quality loss
- **Zoom Controls** — Preview panel now has +/− zoom buttons (25%–300%) with a click-to-reset percentage indicator
- **Status Feedback** — Transient success/error messages for save, load, copy, and paste operations

## [1.0.0] - 2026-02-25

### Added

- **Hero Card Creator SPA** — React 19 + Vite 6 + Tailwind CSS v4 single-page app for designing custom Return to Dark Tower hero boards
- **Live SVG Preview** — Real-time inline SVG rendering of the hero card as you edit
- **PDF Download** — One-click vector PDF export via jspdf + svg2pdf.js
- **Hero Identity** — Editable hero name, starting Warriors, and Spirit values
- **Portrait Upload** — Custom portrait image with SVG clip-path framing
- **Flavor Text** — Two lines of atmospheric flavor text
- **Virtues System** — Up to 5 virtues: virtue 1 with advantage type, virtues 2–5 with name and two description lines
- **Champion Terrain** — Selectable terrain type for champion ability

[2.0.0]: https://github.com/ChessMess/return-to-dark-tower-hero-creator/releases/tag/v2.0.0
[1.4.0]: https://github.com/ChessMess/return-to-dark-tower-hero-creator/releases/tag/v1.4.0
[1.3.1]: https://github.com/ChessMess/return-to-dark-tower-hero-creator/releases/tag/v1.3.1
[1.3.0]: https://github.com/ChessMess/return-to-dark-tower-hero-creator/releases/tag/v1.3.0
[1.2.0]: https://github.com/ChessMess/return-to-dark-tower-hero-creator/releases/tag/v1.2.0
[1.1.0]: https://github.com/ChessMess/return-to-dark-tower-hero-creator/releases/tag/v1.1.0
[1.0.0]: https://github.com/ChessMess/return-to-dark-tower-hero-creator/releases/tag/v1.0.0
