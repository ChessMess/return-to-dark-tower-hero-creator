import boardBgUrl from '../assets/hero_board_bg.svg';
import advantageSvgUrl from '../assets/virtue_advantage.svg';
import standardSvgUrl from '../assets/virtue_standard.svg';
import championSvgUrl from '../assets/virtue_champion.svg';

// Slot positions in board coordinates (from Phase 0.6 analysis)
const SLOT_POSITIONS = [
  { x: 703.10, y: 177.61 },  // slot 1 (left col, row 1)
  { x: 969.00, y: 176.77 },  // slot 2 (right col, row 1)
  { x: 703.93, y: 309.59 },  // slot 3 (left col, row 2)
  { x: 968.21, y: 309.59 },  // slot 4 (right col, row 2)
  { x: 703.93, y: 440.52 },  // slot 5 (left col, row 3)
  { x: 968.21, y: 440.52 },  // slot 6 (right col, row 3)
];

// Artwork bounding boxes in board pixels (derived from SVG wrapper transforms)
// Advantage: home at slot 1 area
const ADV_HOME = { x: 665.0, y: 51.6, w: 259.3, h: 129.1 };
const ADV_HOME_SLOT = SLOT_POSITIONS[0]; // slot 1

// Standard: home at slot 2 area
const STD_HOME = { x: 930.32, y: 51.63, w: 259.25, h: 129.12 };
const STD_HOME_SLOT = SLOT_POSITIONS[1]; // slot 2

// Champion: same home as advantage (slot 1 area) — same wrapper transforms
const CHP_HOME = { x: 665.0, y: 51.6, w: 259.3, h: 129.1 };
const CHP_HOME_SLOT = SLOT_POSITIONS[0]; // slot 1

// Text offsets relative to slot position (derived from template text elements)
// Advantage text (from slot 1: title at 768.708,92.221; desc at 722.623,148.753)
const ADV_TITLE_OFFSET = { x: 65.61, y: -85.39 };
const ADV_DESC_OFFSET = { x: 19.52, y: -28.86 };

// Standard text (from slot 2: title at 1032.529,92.221; desc at 999.932,121.420)
const STD_TITLE_OFFSET = { x: 63.53, y: -84.55 };
const STD_DESC_OFFSET = { x: 20.93, y: -55.35 };

// Champion text — 2-line title needs higher start, body text below
const CHP_TITLE_OFFSET = { x: 93.0, y: -90.0 };
const CHP_DESC_OFFSET = { x: 30.0, y: -30.0 };

// Empty placeholder path data (from virtue_empty.svg, single path)
const EMPTY_PATH_D = "M 0,0 C -2.894,0 -5.242,2.344 -5.242,5.237 L -5.25,6.654 c 0,1.768 -1.442,3.198 -3.211,3.198 h -3.718 c -2.893,0 -5.237,2.348 -5.237,5.241 v 2.585 c 0,1.936 -1.12,3.64 -2.842,4.352 -2.55,1.039 -4.336,3.606 -4.336,6.225 v 5.353 c 0,1.713 -0.708,3.533 -2.107,5.4 -0.421,0.571 -0.412,1.344 0.025,1.932 1.276,1.696 1.945,3.507 1.945,5.242 l 0.137,6.679 c 0,2.735 1.726,5.242 4.284,6.267 1.731,0.696 2.894,2.447 2.894,4.371 v 2.584 c 0,2.893 2.353,5.241 5.237,5.241 h 3.516 c 1.837,0 3.361,1.494 3.395,3.331 l 0.026,1.258 c 0,2.92 2.357,5.268 5.242,5.268 h 137.613 c 2.885,0 5.241,-2.348 5.241,-5.242 l 0.026,-1.284 c 0.034,-1.837 1.555,-3.331 3.391,-3.331 h 3.516 c 2.885,0 5.241,-2.348 5.241,-5.241 v -2.584 c 0,-1.924 1.159,-3.675 2.894,-4.371 2.558,-1.025 4.28,-3.532 4.28,-6.232 l 0.142,-6.749 c 0,-1.7 0.67,-3.511 1.944,-5.207 0.439,-0.588 0.446,-1.361 0.026,-1.932 -1.4,-1.867 -2.112,-3.687 -2.112,-5.4 v -5.353 c 0,-2.619 -1.782,-5.186 -4.332,-6.225 -1.725,-0.712 -2.842,-2.416 -2.842,-4.352 v -2.585 c 0,-2.893 -2.356,-5.241 -5.241,-5.241 h -3.718 c -1.763,0 -3.206,-1.43 -3.215,-3.198 V 5.246 C 142.854,2.344 140.498,0 137.613,0 Z";

function EmptyPlaceholder({ slotPos }) {
  return (
    <path
      d={EMPTY_PATH_D}
      style={{ fill: '#2a443e', fillOpacity: 1, fillRule: 'nonzero', stroke: 'none' }}
      opacity="0.55"
      transform={`matrix(1.3333333,0,0,-1.3333333,${slotPos.x},${slotPos.y})`}
    />
  );
}

function AdvantageArtwork({ slotPos }) {
  const dx = slotPos.x - ADV_HOME_SLOT.x;
  const dy = slotPos.y - ADV_HOME_SLOT.y;
  return (
    <image
      href={advantageSvgUrl}
      x={ADV_HOME.x + dx}
      y={ADV_HOME.y + dy}
      width={ADV_HOME.w}
      height={ADV_HOME.h}
    />
  );
}

function StandardArtwork({ slotPos }) {
  const dx = slotPos.x - STD_HOME_SLOT.x;
  const dy = slotPos.y - STD_HOME_SLOT.y;
  return (
    <image
      href={standardSvgUrl}
      x={STD_HOME.x + dx}
      y={STD_HOME.y + dy}
      width={STD_HOME.w}
      height={STD_HOME.h}
    />
  );
}

function ChampionArtwork({ slotPos }) {
  const dx = slotPos.x - CHP_HOME_SLOT.x;
  const dy = slotPos.y - CHP_HOME_SLOT.y;
  return (
    <image
      href={championSvgUrl}
      x={CHP_HOME.x + dx}
      y={CHP_HOME.y + dy}
      width={CHP_HOME.w}
      height={CHP_HOME.h}
    />
  );
}

// Simple word-wrap: split text into lines that fit roughly within maxChars
function wrapText(text, maxChars = 22) {
  if (!text) return [];
  const words = text.split(/\s+/);
  const lines = [];
  let current = '';
  for (const word of words) {
    if (current && (current.length + 1 + word.length) > maxChars) {
      lines.push(current);
      current = word;
    } else {
      current = current ? current + ' ' + word : word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function VirtueTitle({ slotPos, offset, children, fontSize = '11.25px' }) {
  return (
    <text
      transform={`matrix(1.3333333,0,0,1.0666667,${slotPos.x + offset.x},${slotPos.y + offset.y})`}
      style={{
        fontFamily: 'Karma, serif',
        fontWeight: 700,
        fontSize,
        fill: '#000000',
      }}
    >
      <tspan x="0" y="0">{children}</tspan>
    </text>
  );
}

function VirtueSlot({ slotIndex, virtue, slotPos, hero }) {
  if (!virtue) {
    return <EmptyPlaceholder slotPos={slotPos} />;
  }

  const isChampion = virtue.type === 'champion';
  const isAdvantage = virtue.type === 'advantage';

  // Champion uses its own artwork frame and text offsets
  if (isChampion) {
    const kingdom = virtue.kingdom || hero.championKingdom || '';
    const titleLine1 = kingdom ? 'CHAMPION OF' : 'CHAMPION';
    const titleLine2 = kingdom ? `THE ${kingdom}` : 'ABILITY';
    return (
      <g>
        <ChampionArtwork slotPos={slotPos} />
        {/* 2-line champion title (centered) */}
        <text
          transform={`matrix(1.3333333,0,0,1.0666667,${slotPos.x + CHP_TITLE_OFFSET.x},${slotPos.y + CHP_TITLE_OFFSET.y})`}
          textAnchor="middle"
          style={{
            fontFamily: 'Karma, serif',
            fontWeight: 700,
            fontSize: '9.5px',
            fill: '#000000',
          }}
        >
          <tspan x="0" y="0">{titleLine1}</tspan>
          <tspan x="0" y="12">{titleLine2}</tspan>
        </text>
        {/* Champion body text */}
        <text
          transform={`matrix(1.3333333,0,0,1.3333333,${slotPos.x + CHP_DESC_OFFSET.x},${slotPos.y + CHP_DESC_OFFSET.y})`}
          style={{
            fontFamily: 'Karma, serif',
            fontWeight: 700,
            fontSize: '9px',
            fill: '#ffffff',
          }}
        >
          <tspan x="0" y="0">+2 Wild Advantages</tspan>
          <tspan x="0" y="10.5">{`in ${hero.championTerrain || 'terrain'}`}</tspan>
        </text>
      </g>
    );
  }

  const titleOffset = isAdvantage ? ADV_TITLE_OFFSET : STD_TITLE_OFFSET;
  const descOffset = isAdvantage ? ADV_DESC_OFFSET : STD_DESC_OFFSET;

  return (
    <g>
      {isAdvantage ? (
        <AdvantageArtwork slotPos={slotPos} />
      ) : (
        <StandardArtwork slotPos={slotPos} />
      )}

      {/* Virtue name */}
      <VirtueTitle slotPos={slotPos} offset={titleOffset}>
        {virtue.name}
      </VirtueTitle>

      {/* Body text */}
      {isAdvantage ? (
        <text
          transform={`matrix(1.3333333,0,0,1.2345679,${slotPos.x + descOffset.x},${slotPos.y + descOffset.y})`}
          style={{
            fontFamily: 'Karma, serif',
            fontWeight: 700,
            fontSize: '9.72px',
            fill: '#ffffff',
          }}
        >
          <tspan x="0" y="0">{`+1 ${virtue.advantageType || 'TYPE'} Advantage`}</tspan>
        </text>
      ) : (
        <text
          transform={`matrix(1.3333333,0,0,1.3333333,${slotPos.x + descOffset.x},${slotPos.y + descOffset.y})`}
          style={{
            fontFamily: 'Karma, serif',
            fontWeight: 700,
            fontSize: '9px',
            fill: '#ffffff',
          }}
        >
          {wrapText(virtue.description).map((line, i) => (
            <tspan key={i} x="0" y={i * 10.5}>{line}</tspan>
          ))}
        </text>
      )}
    </g>
  );
}

export default function HeroBoard({ hero }) {
  return (
    <svg
      viewBox="0 0 1213.228 807.6853"
      xmlns="http://www.w3.org/2000/svg"
      style={{ fontFamily: 'Karma, serif' }}
    >
      {/* Static background */}
      <image href={boardBgUrl} width="1213.228" height="807.6853" />

      {/* Portrait */}
      <defs>
        <clipPath id="portraitClip">
          <rect x="27.94" y="100" width="291.47" height="568.75" />
        </clipPath>
      </defs>
      {hero.portraitDataUrl && (
        <image
          href={hero.portraitDataUrl}
          x="27.94"
          y="100"
          width="291.47"
          height="568.75"
          preserveAspectRatio="xMidYMin slice"
          clipPath="url(#portraitClip)"
        />
      )}

      {/* 6 virtue slots */}
      {SLOT_POSITIONS.map((pos, i) => (
        <VirtueSlot
          key={i}
          slotIndex={i}
          virtue={hero.virtues[i]}
          slotPos={pos}
          hero={hero}
        />
      ))}

      {/* Hero name */}
      <text
        transform="matrix(1.333,0,0,1.235,28.66,50.53)"
        style={{
          fontFamily: 'Karma, serif',
          fontWeight: 700,
          fontSize: '25.92px',
          fill: '#ffffff',
        }}
      >
        <tspan x="0" y="0">{hero.name}</tspan>
      </text>

      {/* Starts-with warriors value */}
      <text
        transform="matrix(1.3333333,0,0,1.3333333,104.18,89.68)"
        textAnchor="end"
        style={{
          fontFamily: 'Karma, serif',
          fontWeight: 700,
          fontSize: '7.5px',
          fill: '#f0e9dc',
        }}
      >
        <tspan x="0" y="0">{hero.warriors}</tspan>
      </text>

      {/* Starts-with spirit value */}
      <text
        transform="matrix(1.3333333,0,0,1.3333333,138.40,89.50)"
        style={{
          fontFamily: 'Karma, serif',
          fontWeight: 700,
          fontSize: '7.5px',
          fill: '#f0e9dc',
        }}
      >
        <tspan x="0" y="0">{hero.spirit}</tspan>
      </text>

      {/* Banner action text */}
      <text
        transform="matrix(1.333,0,0,1.333,410.58,90.96)"
        style={{
          fontFamily: 'Karma, serif',
          fontWeight: 600,
          fontSize: '9px',
          fill: '#ffffff',
        }}
      >
        <tspan x="0" y="0">{hero.bannerAction}</tspan>
      </text>

      {/* Flavor text */}
      <g opacity="0.4">
        <text
          transform="matrix(1.333,0,0,1.359,115.03,684.92)"
          style={{
            fontFamily: 'Aleo, serif',
            fontStyle: 'italic',
            fontWeight: 'normal',
            fontSize: '9.45px',
            fill: '#ffffff',
          }}
        >
          <tspan x="0" y="0">{hero.flavorLine1}</tspan>
          <tspan x="0" y="12.2661">{hero.flavorLine2}</tspan>
        </text>
      </g>
    </svg>
  );
}
