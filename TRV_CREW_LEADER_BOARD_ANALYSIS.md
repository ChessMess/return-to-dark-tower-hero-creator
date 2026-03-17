# Thunder Road Vendetta — Crew Leader Board Analysis

> Analysis of the official Choppe Shoppe crew leader boards vs. current creator implementation.
> Primary source: `src/trv/local/official_crew_leader_boards.jpg` (photo of 10 physical boards)
> SVG source: `src/trv/assets/trv_board_bg.svg` (viewBox: `0 0 1039.3707 789.92139`)

---

## 1. Game Context

**Thunder Road Vendetta** (Restoration Games, 2022) is a car-combat racing game. The **Choppe Shoppe** expansion adds 10 named _Crew Leaders_ — characters who replace the standard command board with a custom one that modifies the four base abilities (REPAIR, NITRO, DRIFT, AIRSTRIKE) in cost, text, or both, plus adds a **unique special ability**.

Each crew leader's command board is a **double-sided punchboard** that physically replaces the generic command board for the player's turn.

Known crew leaders (Choppe Shoppe, 10 total):
| Name | Title |
|------|-------|
| Vince Vamp | The Nitromancer |
| Abigail | The Street Sergeant |
| Asha | The Road Mistriss |
| Ms. Betty | The Tinkerer |
| Bumpo the Clown | The Bumpmeister |
| Wong Lei Kong | The Marksman |
| Cris Crass | The Fastest of the Fast |
| Cruft | The ScrapMerchant |
| Machine Gun Joe Esq. | The Bullet King |
| Madame Boubreaux | The Prophet |

Additional leaders exist: **Em Berco** (Maximum Chrome exclusive), **Proud Mary** (promo).
All crew leader artwork by illustrator **Marie Bergeron**.

---

## 2. Board Structure

Each board is a **single punchboard piece**. The SVG template shows three zones:

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│  LEFT (x: 0–519)         │  RIGHT (x: 519–1039)     │  OFF-SCREEN (x: 1039+)   │
│  = FRONT (game face)     │  = (secondary side)       │  = BACK (metadata)        │
│  portrait, name, title,  │  die-line shapes,         │  app title, headshot,     │
│  special ability,        │  mask layer               │  version, author info,    │
│  4 effect slots,         │                           │  contact, description     │
│  command tokens          │                           │                           │
└──────────────────────────────────────────────────────────────────────────────────┘
```

The LEFT side contains **all user-editable game content**. The RIGHT side is structural (mask/die-line). The OFF-SCREEN area (x > 1039) holds **back-of-board metadata** similar to the RTDT hero board back.

---

## 3. Front Board (LEFT side, x=0–519) — Guide Positions

All positions below are from user-placed Inkscape guide rectangles in the `position guides` layer.

### Portrait

| Guide | x | y | w | h | Center |
|-------|---|---|---|---|--------|
| `guide-portrait` | 220.4 | 53.6 | 181.2 | 243.4 | (311.0, 175.3) |

- Crew leader portrait image, clipped to guide area
- Single image used for both front portrait and back headshot

### Special Ability (top of board, unique per leader)

| Guide | x | y | w | h | Center |
|-------|---|---|---|---|--------|
| `guide-special-ability-name` | 69.0 | 124.5 | 133.6 | 23.7 | (135.9, 136.3) |
| `guide-special-ability-desc` | 71.2 | 154.6 | 128.8 | 117.4 | (135.6, 213.3) |

- **Ability name** — editable (e.g., "JURY RIGGING", "DARK AFFAIR", "LONG ARM OF THE LAW")
- **Ability description** — rules text, multi-line
- This is NOT always "JURY RIGGING" — it varies per crew leader

### Crew Leader Name

| Guide | x | y | w | h | Center |
|-------|---|---|---|---|--------|
| `guide-name` | 96.6 | 313.4 | 276.0 | 69.3 | (234.5, 348.0) |

- Font: **Knockout** (heavy weight), very large (~32–36px)
- Text color: `#fff6d3` (cream)
- Alignment: centered in guide area
- Style: all-caps

### Title / Descriptor

| Guide | x | y | w | h | Center |
|-------|---|---|---|---|--------|
| `guide-title` | 104.2 | 388.0 | 246.3 | 19.0 | (227.4, 397.6) |

- Font: **Compacta BT** bold italic, smaller (~11px)
- Example values: "THE STREET SERGEANT", "THE FASTEST OF THE FAST"
- Color: `#fff6d3` (cream)

### 2×2 Effect Grid (Slots 1–4)

The lower portion of the front board contains a **2×2 grid of 4 effect slots**. Effect names are NOT fixed to positions — they vary per crew leader, sorted by dice value (lowest → Slot 1, highest → Slot 4).

```
┌─────────────────┬─────────────────┐
│  Slot 1         │  Slot 2         │   ← Row 1 (y ≈ 488–574)
│  Lowest dice    │  Next lowest    │
│  e.g. ANY / 1   │  e.g. 1-3 / 2  │
├─────────────────┼─────────────────┤
│  Slot 3         │  Slot 4         │   ← Row 2 (y ≈ 592–661)
│  Next highest   │  Highest dice   │
│  e.g. 3-5       │  e.g. 6         │
└─────────────────┴─────────────────┘
```

**Slot guide positions:**

| Guide | x | y | w | h | Center |
|-------|---|---|---|---|--------|
| `guide-front-slot-1-dice` | 59.4 | 438.3 | 44.7 | 32.7 | (81.7, 454.6) |
| `guide-front-slot-2-dice` | 353.0 | 439.2 | 44.8 | 30.8 | (375.4, 454.6) |
| `guide-front-slot-1-name` | 126.5 | 488.8 | 92.4 | 22.4 | (172.7, 500.0) |
| `guide-front-slot-2-name` | 230.6 | 488.8 | 98.7 | 22.3 | (280.0, 500.0) |
| `guide-front-slot-1-desc` | 104.1 | 518.9 | 114.1 | 55.5 | (161.2, 546.7) |
| `guide-front-slot-2-desc` | 231.2 | 519.6 | 114.2 | 54.4 | (288.3, 546.8) |
| `guide-front-slot-3-name` | 104.7 | 592.9 | 114.1 | 22.1 | (161.7, 603.9) |
| `guide-front-slot-4-name` | 232.7 | 592.9 | 114.4 | 22.1 | (289.9, 603.9) |
| `guide-front-slot-3-desc` | 122.9 | 620.3 | 96.2 | 41.0 | (170.9, 640.8) |
| `guide-front-slot-4-desc` | 233.8 | 620.7 | 98.9 | 40.2 | (283.3, 640.8) |
| `guide-front-slot-3-dice` | 59.4 | 683.3 | 44.7 | 32.7 | (81.7, 699.6) |
| `guide-front-slot-4-dice` | 353.0 | 683.3 | 44.7 | 32.7 | (375.4, 699.6) |

**Sorting rule:** Slots are assigned by dice value — **lowest/ANY goes Slot 1**, ascending to **highest in Slot 4**.

**Possible effect types:** REPAIR, NITRO, DRIFT, AIRSTRIKE, and a **Star icon** (★).

Each slot contains:
1. **Dice value** — Compacta BT bold italic, positioned at slot dice guide
2. **Effect name** — editable live text (varies per leader)
3. **Description** — rules text, 1–3 lines, Gotham Book
4. **Subtitle / Modifier** — optional short condition text (e.g., "ONCE PER ROUND")

### Command Tokens

| Guide | x | y | w | h | Center |
|-------|---|---|---|---|--------|
| `guide-front-command-tokens` | 200.8 | 725.4 | 21.9 | 21.6 | (211.7, 736.2) |

- Count: **0–9** (single digit)
- Position: bottom center of front board

---

## 4. Back Board (OFF-SCREEN, x > 1039) — Metadata

The back of the board contains metadata about the creator/designer, positioned off-screen in the SVG template. Layout mirrors the RTDT hero board back.

| Guide | x | y | w | h | Center |
|-------|---|---|---|---|--------|
| `guide-back-app-title` | 1197.3 | 95.6 | 218.7 | 30.1 | (1306.7, 110.7) |
| `guide-headshot` | 1261.7 | 133.6 | 89.9 | 78.5 | (1306.7, 172.9) |
| `guide-back-version` | 1233.1 | 224.2 | 147.0 | 23.0 | (1306.6, 235.7) |
| `guide-back-author-name` | 1176.1 | 484.5 | 261.1 | 29.7 | (1306.7, 499.4) |
| `guide-back-contact-info` | 1165.5 | 519.9 | 282.3 | 29.5 | (1306.7, 534.7) |
| `guide-back-author-description` | 1157.9 | 551.6 | 297.3 | 151.1 | (1306.6, 627.2) |

**Back fields:**
- **App title** — application/tool branding
- **Headshot** — small portrait reuse (same image as front)
- **Version** — revision number
- **Author name** — designer credit
- **Contact info** — URL, email, etc.
- **Author description** — multi-line bio/notes

---

## 5. Data Model

### Current (needs refactoring)

Uses fixed named fields (`repairDice`, `nitroDice`, etc.) which assumes each effect is always in the same position.

### Proposed

```js
export const defaultCrewLeader = {
  schemaVersion: 2,
  crewLeaderName: 'CREW LEADER',
  crewLeaderTitle: '',
  portraitDataUrl: null,

  // Special ability (top of front board, unique per leader)
  specialAbilityName: '',
  specialAbilityDescription: '',

  // 4 positional effect slots — sorted by dice value (lowest → slot 1)
  slots: [
    { effectName: 'AIRSTRIKE', dice: 'ANY', subtitle: '', description: '' },  // Slot 1
    { effectName: 'NITRO', dice: '1-3', subtitle: '', description: '' },       // Slot 2
    { effectName: 'DRIFT', dice: '3-5', subtitle: '', description: '' },       // Slot 3
    { effectName: 'REPAIR', dice: '6', subtitle: '', description: '' },        // Slot 4
  ],

  // Command token count (0-9)
  commandTokens: 0,

  // Back metadata
  author_name: '',
  revision_no: '',
  contact_info: '',
  author_description: '',
};
```

---

## 6. Typography Summary

| Element | Font | Weight | Style | Approx Size | Fill |
|---------|------|--------|-------|-------------|------|
| Crew Leader Name | Knockout | 900 | normal | 32–36px | `#fff6d3` (cream) |
| Title/Descriptor | Compacta BT | 700 | italic | 10–12px | `#fff6d3` (cream) |
| Dice values | Compacta BT | 700 | italic | 23px | `#58595e` (gray) |
| Effect name | Gotham | 700 | normal | 8–9px | `#fff6d3` (cream) |
| Ability subtitle | Gotham | 700 | normal | 7–8px | `#fff6d3` (cream) |
| Ability description | Gotham | 400 | normal | 6–7px | `#fff6d3` (cream) |
| Command token count | Compacta BT | 700 | italic | 16–20px | `#fff6d3` (cream) |

> **Color note:** The board background is very dark, so text uses cream/gold `#fff6d3` rather than near-black `#231f20`.

---

## 7. Color Palette

| Element | Color |
|---------|-------|
| Board background | Very dark (near-black with warm tone) |
| Text (name, title, abilities) | `#fff6d3` (warm cream/gold) |
| Dice value text | `#58595e` (dark gray) |
| Ability heading labels | `#fff6d3` — vector path outlines in SVG |
| Diamond indicator backgrounds | Warm amber/gold accents |

---

## 8. SVG Vectorized Text Positions (Reference)

These are the vectorized (path outline) text elements baked into the SVG template's "text" layer. They are NOT editable — the creator app overlays live text at the guide positions above.

### Left side (x < 519)

| Element | x | y |
|---------|---|---|
| Special ability heading (template: JURY RIGGING) | 75.5 | 145.4 |
| (special ability description text) | 77.6 | 165.0 |
| (decorative/template text) | 476.5 | 419.2 |
| Slot 1/2 name row (template: REPAIR \| NITRO) | 157.5 / 240.0 | 509.5 |
| (description text) | 252.9 / 292.1 | 529.1 |
| (divider/decorative) | 208.2 | 566.4 |
| Slot 3/4 name row (template: DRIFT \| AIRSTRIKE) | 168.2 / 240.0 | 613.6 |
| (description text) | 114.5 / 247.8 | 633.2 |

### Right side (x ≥ 519)

| Element | x | y |
|---------|---|---|
| AIRSTRIKE label | 720.9 | 509.2 |
| (text) | 833.5 | 529.1 |
| DRIFT label | 753.1 | 613.3 |
| REPAIR/SPOTTER/NITRO labels | 820.6 | 613.3 |
| (text) | 699.4 | 632.9 |
| (text) | 866.3 | 670.2 |

---

## 9. Changes Implemented (Phase 1)

### `src/trv/data/defaultCrewLeader.js`
- Added `crewLeaderTitle: ''` field

### `src/trv/utils/boardLayout.js`
- Portrait, name, title, dice, ability positions with CALIBRATE markers

### `src/trv/components/CrewLeaderBoard.jsx`
- SVG overlay with portrait, name, title, dice values, ability sections
- Text fill `#fff6d3` (cream on dark background)
- Headshot portrait with ellipse clip-path

### `src/trv/components/CrewLeaderForm.jsx`
- Name, title, portrait upload, dice requirements, ability text sections

---

## 10. Pending Work (Phase 2)

1. **Refactor data model** — fixed named fields → slots array + special ability + command tokens (see §5)
2. **Update `boardLayout.js`** — use exact guide coordinates from §3/§4
3. **Update `CrewLeaderBoard.jsx`** — slot-based rendering, command tokens, back metadata
4. **Update `CrewLeaderForm.jsx`** — editable effect names per slot, special ability fields, command token input, back metadata fields
5. **Visual calibration** — tune any remaining positions after code refactoring

---

_Last updated: 2026-03-15_
_Based on: official photo + SVG geometry analysis + user Inkscape guide positions + BGG/Restoration Games research_
