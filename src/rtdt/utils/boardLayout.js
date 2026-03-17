// Board layout constants derived from hero_board_template.svg.
// When the SVG template changes, update these values to match.

// Slot anchor positions in board coordinates (Phase 0.6 analysis)
export const SLOT_POSITIONS = [
  { x: 703.10, y: 177.61 },  // slot 1 (left col, row 1)
  { x: 969.00, y: 176.77 },  // slot 2 (right col, row 1)
  { x: 703.93, y: 309.59 },  // slot 3 (left col, row 2)
  { x: 968.21, y: 309.59 },  // slot 4 (right col, row 2)
  { x: 703.93, y: 440.52 },  // slot 5 (left col, row 3)
  { x: 968.21, y: 440.52 },  // slot 6 (right col, row 3)
];

// Artwork bounding boxes in board pixels (derived from SVG wrapper transforms)
export const ADV_HOME = { x: 665.0, y: 51.6, w: 259.3, h: 129.1 };
export const ADV_HOME_SLOT = SLOT_POSITIONS[0]; // slot 1

export const STD_HOME = { x: 930.32, y: 51.63, w: 259.25, h: 129.12 };
export const STD_HOME_SLOT = SLOT_POSITIONS[1]; // slot 2

export const CHP_HOME = { x: 665.0, y: 51.6, w: 259.3, h: 129.1 };
export const CHP_HOME_SLOT = SLOT_POSITIONS[0]; // slot 1

// Text offsets relative to slot position (derived from template text elements)
export const ADV_TITLE_OFFSET = { x: 91.03, y: -85.39 };
export const ADV_DESC_OFFSET  = { x: 91.55, y: -38.86 };

export const STD_TITLE_OFFSET = { x: 91.03, y: -84.55 };
export const STD_DESC_OFFSET  = { x: 90.95, y: -55.35 };

export const CHP_TITLE_OFFSET = { x: 93.0,  y: -90.0  };
export const CHP_DESC_OFFSET  = { x: 91.55, y: -40.0  };

// ---------------------------------------------------------------------------
// Board text overlay positions (derived from baked text transforms in SVG)
// All coordinates are in the board's 1213×808 viewBox space.
// ---------------------------------------------------------------------------

// Move section — subtitle right of "MOVE 3" header, instructions below
export const MOVE_SUBTITLE_POS      = { x: 485, y: 178 };
export const MOVE_INSTRUCTIONS_POS   = { x: 415, y: 191 };

// Heroic action subtitles — left-aligned with header text start
export const CLEANSE_SUBTITLE_POS    = { x: 451, y: 277 };
export const BATTLE_SUBTITLE_POS     = { x: 451, y: 335 };
export const QUEST_SUBTITLE_POS      = { x: 451, y: 382 };

// Reinforce subtitle — left-aligned with REINFORCE header text
export const REINFORCE_SUBTITLE_POS  = { x: 413, y: 454 };

// Location instruction blocks — right column, right of location name labels
export const CITADEL_INSTRUCTIONS_POS    = { x: 518, y: 481 };
export const SANCTUARY_INSTRUCTIONS_POS  = { x: 518, y: 524 };
export const VILLAGE_INSTRUCTIONS_POS    = { x: 518, y: 581 };
export const BAZAAR_INSTRUCTIONS_POS     = { x: 518, y: 620 };

// End of turn — left-aligned under header
export const END_OF_TURN_POS = { x: 377, y: 709 };
