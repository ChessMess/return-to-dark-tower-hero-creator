---
name: svg-sync
description: Audit the sync between hero_board_template.svg, HeroBoard.jsx, and boardLayout.js. Use when the SVG template changes, when coordinates may be out of sync, or when virtue slot positions or text offsets need to be verified.
allowed-tools: Read, Grep, Glob
context: fork
agent: Explore
---

Audit the SVG template sync for the RTDT Hero Creator. CLAUDE.md has a CRITICAL note that `hero_board_template.svg`, `src/v2/components/HeroBoard.jsx`, and `src/v2/utils/boardLayout.js` must stay in sync.

## Step 1 — Read boardLayout.js

Read `src/v2/utils/boardLayout.js` in full. Extract and list all constants:
- `SLOT_POSITIONS` (6 entries, x/y each)
- `ADV_HOME`, `STD_HOME`, `CHP_HOME` bounding boxes (x, y, w, h each)
- `ADV_HOME_SLOT`, `STD_HOME_SLOT`, `CHP_HOME_SLOT` slot references
- All `*_TITLE_OFFSET` and `*_DESC_OFFSET` values (x, y each)

## Step 2 — Read HeroBoard.jsx

Read `src/v2/components/HeroBoard.jsx`. Note:
- How `SLOT_POSITIONS` drives each virtue slot's position
- How artwork bounding boxes position the SVG artwork images
- How text offsets position title and description text
- The SVG `viewBox` on the root element

## Step 3 — Sample the SVG template

The SVG template (`hero_board_template.svg`) is ~69k lines. Do NOT read the whole file. Use Grep to find:
- The `viewBox` attribute (search for `viewBox` in the file)
- Any `transform="translate(` values near the virtue slot region (x ~665–970, y ~50–450)

## Step 4 — Report findings

Produce a clear report with two sections:

**Current Constants** — list every value from boardLayout.js in a table for manual comparison against the SVG.

**Potential Issues** — flag anything suspicious:
- Does the SVG `viewBox` match the expected 1213×808?
- Are the 6 slot x-positions plausible? Left column should be ~703, right ~969.
- Do the text offsets land within the artwork bounding boxes?
- Any obvious copy-paste errors (e.g. values that should differ between columns but are identical)?

Close with: "To fully verify, open `hero_board_template.svg` in Inkscape and cross-reference slot group positions against SLOT_POSITIONS in boardLayout.js."
