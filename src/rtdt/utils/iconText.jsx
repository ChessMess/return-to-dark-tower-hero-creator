// ---------------------------------------------------------------------------
// IconText — renders text with inline icon substitution for SVG overlays.
// Characters * (spirit), # (warriors), ^ (skull) are replaced with icons.
// ---------------------------------------------------------------------------

import { ICON_MAP, ICON_CHARS } from '../data/gameIcons.js';

/**
 * Parse a string into segments of plain text and icon tokens.
 * e.g. "Gain 1 *" → [{type:'text', value:'Gain 1 '}, {type:'icon', value:'*'}]
 */
function parseSegments(text) {
  const segments = [];
  let buf = '';
  for (const ch of text) {
    if (ICON_CHARS.has(ch)) {
      if (buf) segments.push({ type: 'text', value: buf });
      buf = '';
      segments.push({ type: 'icon', value: ch });
    } else {
      buf += ch;
    }
  }
  if (buf) segments.push({ type: 'text', value: buf });
  return segments;
}

/**
 * Estimate the rendered width of a plain-text string in SVG units.
 * Karma at fontSize px ≈ 0.48 × fontSize per character on average.
 */
function estimateTextWidth(str, fontSize = 9) {
  return str.length * fontSize * 0.48;
}

/**
 * Check whether a string contains any icon characters.
 */
export function hasIcons(text) {
  if (!text) return false;
  for (const ch of text) {
    if (ICON_CHARS.has(ch)) return true;
  }
  return false;
}

// Icon scale factor relative to font size (0.7 = 70% of font height)
const ICON_SCALE_FACTOR = 0.7;

/**
 * Render a single line of text that may contain icon characters.
 * Returns a <g> containing positioned <text> and icon <path> elements.
 */
export function IconTextLine({ text, x, y, style, textAnchor = 'middle', fontSize = 9 }) {
  if (!text) return null;

  // Fast path: no icons, render plain <text>
  if (!hasIcons(text)) {
    return (
      <text x={x} y={y} textAnchor={textAnchor} style={style}>
        <tspan x={x} y={y}>{text}</tspan>
      </text>
    );
  }

  const segments = parseSegments(text);
  const iconTargetH = fontSize * ICON_SCALE_FACTOR;

  // Calculate total width for centering
  let totalWidth = 0;
  const segWidths = segments.map((seg) => {
    if (seg.type === 'text') {
      const w = estimateTextWidth(seg.value, fontSize);
      totalWidth += w;
      return w;
    }
    const icon = ICON_MAP[seg.value];
    const scale = iconTargetH / icon.height;
    const w = icon.width * scale + 3.5; // gap after icon
    totalWidth += w;
    return w;
  });

  // Starting x based on anchor
  let curX = x;
  if (textAnchor === 'middle') curX = x - totalWidth / 2;
  else if (textAnchor === 'end') curX = x - totalWidth;

  const elements = [];
  segments.forEach((seg, i) => {
    if (seg.type === 'text') {
      elements.push(
        <text key={i} x={curX} y={y} textAnchor="start" style={style}>
          {seg.value}
        </text>,
      );
      curX += segWidths[i];
    } else {
      const icon = ICON_MAP[seg.value];
      const scale = iconTargetH / icon.height;
      const iconW = icon.width * scale;

      // translate so left edge of scaled path lands at curX
      const tx = curX + icon.originX * scale;
      // vertically: center the icon with text x-height
      // path center in path coords = (height/2 - originY) from path origin
      const pathCenterY = (icon.height / 2 - icon.originY);
      // text x-height center ≈ baseline - 0.3 × fontSize
      const textCenterY = y - fontSize * 0.3;
      const ty = textCenterY - pathCenterY * scale;

      const groupTransform = `translate(${tx},${ty}) scale(${scale})`;

      if (icon.layers) {
        // Multi-layer icon: render each layer as a separate <path>
        elements.push(
          <g key={i} transform={groupTransform}>
            {icon.layers.map((layer, li) => {
              const layerFill = layer.fill === '#231f20'
                ? (style?.fill || layer.fill)
                : layer.fill;
              return (
                <path
                  key={li}
                  d={layer.path}
                  fill={layerFill}
                  opacity={layer.opacity}
                />
              );
            })}
          </g>,
        );
      } else {
        // Single-path icon (backward compat)
        const iconFill = icon.fill === '#231f20' ? (style?.fill || icon.fill) : icon.fill;
        elements.push(
          <path
            key={i}
            d={icon.path}
            fill={iconFill}
            transform={groupTransform}
          />,
        );
      }
      curX += iconW + 3.5;
    }
  });

  return <g>{elements}</g>;
}

/**
 * Render multiline text with icon substitution.
 * Lines are split by \n, then each rendered via IconTextLine.
 */
export function IconTextBlock({ text, x, y, style, textAnchor = 'middle', fontSize = 9, lineHeight = 10.5 }) {
  if (!text) return null;
  const lines = text.split('\n');
  return (
    <g>
      {lines.map((line, i) => (
        <IconTextLine
          key={i}
          text={line}
          x={x}
          y={y + i * lineHeight}
          style={style}
          textAnchor={textAnchor}
          fontSize={fontSize}
        />
      ))}
    </g>
  );
}
