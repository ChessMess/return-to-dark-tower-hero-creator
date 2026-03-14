// ---------------------------------------------------------------------------
// SVG Theming Engine — runtime color replacement + blob URL generation
// ---------------------------------------------------------------------------

import {
  BOARD_SOURCE_COLORS,
  HEADER_TEXT_SOURCE,
  HEADER_BG_SOURCE,
  ICON_SOURCE,
  VIRTUE_SOURCE_COLORS,
} from '../data/themes.js';

// Import SVGs as raw text strings via Vite's ?raw suffix
import boardBgRaw from '../assets/hero_board_bg.svg?raw';
import advantageRaw from '../assets/virtue_advantage.svg?raw';
import standardRaw from '../assets/virtue_standard.svg?raw';
import championRaw from '../assets/virtue_champion.svg?raw';
import standardDefaultRaw from '../assets/virtue_standard_default.svg?raw';
import advantageDefaultRaw from '../assets/virtue_advantage_default.svg?raw';

/**
 * Replace each source color with the corresponding target color in an SVG string.
 * Uses case-insensitive replaceAll so both `#2a443e` and `#2A443E` are caught.
 */
function replaceColors(svgString, sourceColors, targetColors) {
  let result = svgString;
  for (let i = 0; i < sourceColors.length; i++) {
    if (sourceColors[i].toLowerCase() !== targetColors[i].toLowerCase()) {
      result = result.replaceAll(
        new RegExp(escapeRegExp(sourceColors[i]), 'gi'),
        targetColors[i],
      );
    }
  }
  return result;
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Convert an SVG string to a blob: URL */
function svgToBlobUrl(svgString) {
  const blob = new Blob([svgString], { type: 'image/svg+xml' });
  return URL.createObjectURL(blob);
}

/**
 * Build themed blob URLs for all 6 SVGs.
 *
 * @param {object} theme — a resolved theme object (from THEME_PRESETS or deriveThemeFromBaseColor)
 * @returns {{ boardBgUrl, advantageUrl, standardUrl, championUrl, standardDefaultUrl, advantageDefaultUrl }}
 */
export function buildThemedSvgUrls(theme) {
  // Board background: replace 7 green-family colors + 2 header sentinels + 1 icon sentinel
  const boardSources = [
    ...BOARD_SOURCE_COLORS,
    HEADER_TEXT_SOURCE,
    HEADER_BG_SOURCE,
    ICON_SOURCE,
  ];
  const boardTargets = [
    ...theme.boardColors,
    theme.headerTextColor,
    theme.headerBgColor,
    theme.iconColor || '#f0e9dc',
  ];
  const themedBoard = replaceColors(boardBgRaw, boardSources, boardTargets);

  // Virtue SVGs: replace 2 dark fills
  const themedAdvantage = replaceColors(advantageRaw, VIRTUE_SOURCE_COLORS, theme.virtueColors);
  const themedStandard = replaceColors(standardRaw, VIRTUE_SOURCE_COLORS, theme.virtueColors);
  const themedChampion = replaceColors(championRaw, VIRTUE_SOURCE_COLORS, theme.virtueColors);
  const themedStandardDefault = replaceColors(standardDefaultRaw, VIRTUE_SOURCE_COLORS, theme.virtueColors);
  const themedAdvantageDefault = replaceColors(advantageDefaultRaw, VIRTUE_SOURCE_COLORS, theme.virtueColors);

  return {
    boardBgUrl: svgToBlobUrl(themedBoard),
    advantageUrl: svgToBlobUrl(themedAdvantage),
    standardUrl: svgToBlobUrl(themedStandard),
    championUrl: svgToBlobUrl(themedChampion),
    standardDefaultUrl: svgToBlobUrl(themedStandardDefault),
    advantageDefaultUrl: svgToBlobUrl(themedAdvantageDefault),
  };
}

/**
 * Revoke all blob URLs in a themed URLs object.
 * Call this before replacing with new URLs to avoid memory leaks.
 */
export function revokeThemedSvgUrls(urls) {
  if (!urls) return;
  Object.values(urls).forEach((url) => {
    if (url && url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
  });
}
