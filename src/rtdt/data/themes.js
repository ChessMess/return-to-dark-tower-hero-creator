// ---------------------------------------------------------------------------
// Board Color Theming — preset palettes, source color maps, HSL derivation
// ---------------------------------------------------------------------------

// Source colors from the Orphaned Scion (green) SVG — visible layer only.
// These are the 7 green-family hex values that get bulk-replaced in the SVG.
export const BOARD_SOURCE_COLORS = [
  '#3e5c4f', // Main board background
  '#2a443e', // Section panel backgrounds + title text fills
  '#90a390', // Light sage green accents
  '#79937c', // Medium sage green accents
  '#607769', // Grid lines, section borders
  '#516d5e', // Muted gray-green borders
  '#4b8ea4', // Teal accent
];

// Sentinel colors (applied in Phase 0 Inkscape prep).
// These exist ONLY in the header elements and are replaced independently.
export const HEADER_TEXT_SOURCE = '#efe0cd'; // was #f0e9dc before sentinel
export const HEADER_BG_SOURCE = '#78927b';   // was #79937c before sentinel

// Icon sentinel color — applied to all game-mechanic icons (battle, move,
// quest, cleanse, village, sanctuary, citadel, bazaar, banner, reinforce)
// and related text labels (skull, skulls, move).
export const ICON_SOURCE = '#f0e9da';

// Virtue SVG dark fills to replace
export const VIRTUE_SOURCE_COLORS = ['#2a443e', '#07131b'];

// ── Preset Themes ──────────────────────────────────────────────────────────
//
// Each preset maps 1:1 with the source color arrays above.
//   boardColors[7]  — replacement for BOARD_SOURCE_COLORS
//   headerBgColor   — replacement for HEADER_BG_SOURCE
//   headerTextColor — replacement for HEADER_TEXT_SOURCE
//   virtueColors[2] — replacement for VIRTUE_SOURCE_COLORS
//   textPrimary     — hero name, banner action, virtue descriptions (JSX)
//   textSecondary   — warriors/spirit values (JSX)
//   virtueTitleFill  — virtue title text (JSX)
//   emptyPlaceholderFill — empty virtue slot fill (JSX)
//   flavorOpacity   — flavor text <g> opacity (JSX)

export const THEME_PRESETS = {
  orphaned_scion: {
    name: 'Orphaned Scion',
    boardColors: ['#3e5c4f', '#2a443e', '#90a390', '#79937c', '#607769', '#516d5e', '#4b8ea4'],
    headerBgColor: '#78927b',
    headerTextColor: '#efe0cd',
    virtueColors: ['#2a443e', '#07131b'],
    iconColor: '#b8d4c0',
    textPrimary: '#ffffff',
    textSecondary: '#f0e9dc',
    virtueTitleFill: '#000000',
    emptyPlaceholderFill: '#2a443e',
    flavorOpacity: 0.4,
  },

  relic_hunter: {
    name: 'Relic Hunter',
    boardColors: ['#2d5884', '#1a3a5c', '#90a3b5', '#7993a3', '#607789', '#516d80', '#4b7ea4'],
    headerBgColor: '#7993a3',
    headerTextColor: '#efe0cd',
    virtueColors: ['#1a3a5c', '#071320'],
    iconColor: '#a8c8e0',
    textPrimary: '#ffffff',
    textSecondary: '#f0e9dc',
    virtueTitleFill: '#000000',
    emptyPlaceholderFill: '#1a3a5c',
    flavorOpacity: 0.4,
  },

  brutal_warlord: {
    name: 'Brutal Warlord',
    boardColors: ['#5c3a3e', '#442a2e', '#a39095', '#937c82', '#776069', '#6d515e', '#a44b6e'],
    headerBgColor: '#937c82',
    headerTextColor: '#efe0cd',
    virtueColors: ['#442a2e', '#1b0710'],
    iconColor: '#d4a8b0',
    textPrimary: '#ffffff',
    textSecondary: '#f0e9dc',
    virtueTitleFill: '#000000',
    emptyPlaceholderFill: '#442a2e',
    flavorOpacity: 0.4,
  },

  spymaster: {
    name: 'Spymaster',
    boardColors: ['#7a6a52', '#5c4e3a', '#b0a690', '#98907c', '#807464', '#726858', '#a48e5a'],
    headerBgColor: '#98907c',
    headerTextColor: '#efe0cd',
    virtueColors: ['#5c4e3a', '#1b1508'],
    iconColor: '#d4c4a0',
    textPrimary: '#ffffff',
    textSecondary: '#f0e9dc',
    virtueTitleFill: '#000000',
    emptyPlaceholderFill: '#5c4e3a',
    flavorOpacity: 0.4,
  },

  archwright: {
    name: 'Archwright',
    boardColors: ['#8a7a3a', '#6c5e2a', '#b8ac80', '#a09478', '#887c60', '#7e7458', '#a4984b'],
    headerBgColor: '#a09478',
    headerTextColor: '#2a2410',
    virtueColors: ['#6c5e2a', '#1b1508'],
    iconColor: '#d4cc90',
    textPrimary: '#ffffff',
    textSecondary: '#f0e9dc',
    virtueTitleFill: '#000000',
    emptyPlaceholderFill: '#6c5e2a',
    flavorOpacity: 0.4,
  },

  haunted_recluse: {
    name: 'Haunted Recluse',
    boardColors: ['#2e2c2a', '#1e1c1a', '#5e5c5a', '#4e4c4a', '#3e3c3a', '#363432', '#7a6e4a'],
    headerBgColor: '#4e4c4a',
    headerTextColor: '#efe0cd',
    virtueColors: ['#1e1c1a', '#0a0908'],
    iconColor: '#b0aaa0',
    textPrimary: '#ffffff',
    textSecondary: '#f0e9dc',
    virtueTitleFill: '#000000',
    emptyPlaceholderFill: '#1e1c1a',
    flavorOpacity: 0.4,
  },

  print_friendly: {
    name: 'Print Friendly',
    boardColors: ['#d8d2c8', '#6b6358', '#b0a898', '#8a8278', '#7a7268', '#706860', '#6a7a80'],
    headerBgColor: '#8a8278',
    headerTextColor: '#f0ece4',
    virtueColors: ['#6b6358', '#3a3530'],
    iconColor: '#5a5248',
    textPrimary: '#ffffff',
    textSecondary: '#f0e9dc',
    virtueTitleFill: '#000000',
    emptyPlaceholderFill: '#6b6358',
    flavorOpacity: 0.5,
  },
};

// ── HSL Utilities ──────────────────────────────────────────────────────────

/** Parse "#rrggbb" → [r, g, b] each 0-255 */
function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff];
}

/** [r, g, b] 0-255 → "#rrggbb" */
function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(c => Math.round(Math.min(255, Math.max(0, c)))
    .toString(16).padStart(2, '0')).join('');
}

/** [r, g, b] 0-255 → [h 0-360, s 0-1, l 0-1] */
function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return [h * 360, s, l];
}

/** [h 0-360, s 0-1, l 0-1] → [r, g, b] 0-255 */
function hslToRgb(h, s, l) {
  h /= 360;
  if (s === 0) { const v = Math.round(l * 255); return [v, v, v]; }
  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1; if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return [
    Math.round(hue2rgb(p, q, h + 1/3) * 255),
    Math.round(hue2rgb(p, q, h) * 255),
    Math.round(hue2rgb(p, q, h - 1/3) * 255),
  ];
}

function hexToHsl(hex) { return rgbToHsl(...hexToRgb(hex)); }

function hslToHex(h, s, l) { return rgbToHex(...hslToRgb(h, s, l)); }

// ── Theme Derivation ───────────────────────────────────────────────────────

/**
 * Given a single user-chosen base color (hex string), derive a complete theme
 * by shifting the Orphaned Scion palette's hue/saturation to match.
 *
 * The base color maps to BOARD_SOURCE_COLORS[0] (#3e5c4f — main board bg).
 * All other colors are shifted by the same hue delta, with saturation and
 * lightness scaled proportionally.
 */
export function deriveThemeFromBaseColor(baseHex) {
  const source = THEME_PRESETS.orphaned_scion;
  const [srcH, srcS, srcL] = hexToHsl(BOARD_SOURCE_COLORS[0]);
  const [tgtH, tgtS, tgtL] = hexToHsl(baseHex);

  const dH = tgtH - srcH;
  const sScale = srcS > 0.01 ? tgtS / srcS : 1;
  const lScale = srcL > 0.01 ? tgtL / srcL : 1;

  const shift = (hex) => {
    const [h, s, l] = hexToHsl(hex);
    return hslToHex(
      ((h + dH) % 360 + 360) % 360,
      Math.min(1, s * sScale),
      Math.min(1, Math.max(0, l * lScale)),
    );
  };

  const boardColors = BOARD_SOURCE_COLORS.map(shift);

  // Derive icon color: take the source preset's icon color and shift it
  const iconColor = shift(source.iconColor);

  return {
    name: 'Custom',
    boardColors,
    headerBgColor: shift(HEADER_BG_SOURCE),
    headerTextColor: source.headerTextColor, // keep cream text by default
    virtueColors: VIRTUE_SOURCE_COLORS.map(shift),
    iconColor,
    textPrimary: source.textPrimary,
    textSecondary: source.textSecondary,
    virtueTitleFill: source.virtueTitleFill,
    emptyPlaceholderFill: boardColors[1], // match panel bg
    flavorOpacity: source.flavorOpacity,
  };
}

/**
 * Resolve a hero's theme + customTheme into a concrete theme object.
 * - preset ID → THEME_PRESETS[id]
 * - 'custom' → customTheme (must be a full theme object)
 * - fallback → orphaned_scion
 */
export function resolveTheme(themeId, customTheme) {
  if (themeId === 'custom' && customTheme) return customTheme;
  return THEME_PRESETS[themeId] || THEME_PRESETS.orphaned_scion;
}

const HEX_RE = /^#[0-9a-f]{6}$/i;

/**
 * Validate an imported theme object.
 * Returns { valid: true, theme } with sanitized data, or { valid: false, error }.
 */
export function validateThemeData(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return { valid: false, error: 'Invalid data: expected a JSON object.' };
  }

  if (!Array.isArray(data.boardColors) || data.boardColors.length !== 7 ||
      !data.boardColors.every(c => typeof c === 'string' && HEX_RE.test(c))) {
    return { valid: false, error: 'boardColors must be an array of 7 hex color strings.' };
  }

  const hexFields = ['headerBgColor', 'headerTextColor', 'textPrimary',
    'textSecondary', 'virtueTitleFill', 'emptyPlaceholderFill'];
  for (const field of hexFields) {
    if (typeof data[field] !== 'string' || !HEX_RE.test(data[field])) {
      return { valid: false, error: `${field} must be a hex color string.` };
    }
  }

  // iconColor is optional for backward compatibility
  if (data.iconColor !== undefined && (typeof data.iconColor !== 'string' || !HEX_RE.test(data.iconColor))) {
    return { valid: false, error: 'iconColor must be a hex color string.' };
  }

  if (!Array.isArray(data.virtueColors) || data.virtueColors.length !== 2 ||
      !data.virtueColors.every(c => typeof c === 'string' && HEX_RE.test(c))) {
    return { valid: false, error: 'virtueColors must be an array of 2 hex color strings.' };
  }

  const opacity = typeof data.flavorOpacity === 'number' ? data.flavorOpacity : 0.4;

  return {
    valid: true,
    theme: {
      name: typeof data.name === 'string' ? data.name.slice(0, 30) : 'Imported',
      boardColors: [...data.boardColors],
      headerBgColor: data.headerBgColor,
      headerTextColor: data.headerTextColor,
      virtueColors: [...data.virtueColors],
      iconColor: data.iconColor || '#f0e9dc',
      textPrimary: data.textPrimary,
      textSecondary: data.textSecondary,
      virtueTitleFill: data.virtueTitleFill,
      emptyPlaceholderFill: data.emptyPlaceholderFill,
      flavorOpacity: Math.max(0.1, Math.min(1, opacity)),
    },
  };
}
