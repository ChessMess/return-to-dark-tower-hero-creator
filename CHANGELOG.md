# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/), and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

-   **Collapsible Sidebar** — Toggle button (« / ») in the preview panel collapses and expands the editor sidebar with a smooth slide animation; sidebar state persists across page reloads via localStorage

## [1.3.1] - 2026-02-26

### Changed

-   **Portrait Import** — Hero JSON paste and file import now only accept JPEG, PNG, and GIF portrait images; other formats are silently ignored
-   **Portrait Upload** — Portrait file picker restricted to JPEG, PNG, and GIF; SVG and other formats are rejected
-   **Import Validation** — Hero data loaded from storage or imported via file/paste now enforces field length limits consistent with the editor

## [1.3.0] - 2026-02-26

### Added

-   **Author Info** — New sidebar section to record author name, revision number, contact info, and design notes/description
-   **Author / Revision Badge** — Preview panel shows a subtle badge in the top-left corner when author name or revision is set
-   **Contact Badge** — Preview panel shows a contact badge in the bottom-left corner with a one-click copy button when contact info is set

### Changed

-   **Move Icon** — Replaced placeholder chevron with authentic boot silhouette matching the official RTDT hero board design
-   **Portrait Alignment** — Portrait images now align to the top of the frame instead of centering, so faces and heads are visible first
-   **Portrait Drag & Drop** — Portrait upload area now accepts drag-and-drop in addition to click-to-browse; you can also drag a new image onto an existing portrait to replace it
-   **Zoom Controls** — Tightened button sizing for a more compact feel

## [1.2.0] - 2026-02-25

### Changed

-   **Virtue Editor** — Condensed the 5 separate virtue sections into a single unified section with a dropdown selector and ◀ ▶ arrow buttons to cycle between virtues

## [1.1.0] - 2026-02-25

### Added

-   **Save / Load Hero** — Save hero data to a JSON file and load it back; filename prompt pre-fills with the hero name
-   **Copy / Paste Hero** — Copy hero JSON to clipboard; paste via a modal textarea for easy sharing
-   **Portrait Image Optimization** — Uploaded portraits are automatically resized (max 540×740px) and compressed to JPEG at 80% quality, keeping file sizes small without visible quality loss
-   **Zoom Controls** — Preview panel now has +/− zoom buttons (25%–300%) with a click-to-reset percentage indicator
-   **Status Feedback** — Transient success/error messages for save, load, copy, and paste operations

## [1.0.0] - 2026-02-25

### Added

-   **Hero Card Creator SPA** — React 19 + Vite 6 + Tailwind CSS v4 single-page app for designing custom Return to Dark Tower hero boards
-   **Live SVG Preview** — Real-time inline SVG rendering of the hero card as you edit
-   **PDF Download** — One-click vector PDF export via jspdf + svg2pdf.js
-   **Hero Identity** — Editable hero name, starting Warriors, and Spirit values
-   **Portrait Upload** — Custom portrait image with SVG clip-path framing
-   **Flavor Text** — Two lines of atmospheric flavor text
-   **Virtues System** — Up to 5 virtues: virtue 1 with advantage type, virtues 2–5 with name and two description lines
-   **Champion Terrain** — Selectable terrain type for champion ability

[1.3.1]: https://github.com/ChessMess/return-to-dark-tower-hero-creator/releases/tag/v1.3.1
[1.3.0]: https://github.com/ChessMess/return-to-dark-tower-hero-creator/releases/tag/v1.3.0
[1.2.0]: https://github.com/ChessMess/return-to-dark-tower-hero-creator/releases/tag/v1.2.0
[1.1.0]: https://github.com/ChessMess/return-to-dark-tower-hero-creator/releases/tag/v1.1.0
[1.0.0]: https://github.com/ChessMess/return-to-dark-tower-hero-creator/releases/tag/v1.0.0
