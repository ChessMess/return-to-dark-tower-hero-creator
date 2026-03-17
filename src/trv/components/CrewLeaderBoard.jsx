import boardBg from "../assets/trv_board_bg.svg";
import {
  PORTRAIT,
  NAME_POS,
  TITLE_POS,
  SPECIAL_ABILITY_NAME_POS,
  SPECIAL_ABILITY_DESC_POS,
  SLOT_DICE_POS,
  SLOT_NAME_POS,
  SLOT_DESC_POS,
  COMMAND_TOKENS_POS,
  BACK_APP_TITLE_POS,
  BACK_HEADSHOT,
  BACK_VERSION_POS,
  BACK_AUTHOR_NAME_POS,
  BACK_CONTACT_POS,
  BACK_AUTHOR_DESC_POS,
} from "../utils/boardLayout";

// Simple word-wrap: split text into lines fitting roughly maxChars per line
function wrapText(text, maxChars = 28) {
  if (!text) return [];
  const words = text.split(/\s+/);
  const lines = [];
  let current = "";
  for (const word of words) {
    if (current && current.length + 1 + word.length > maxChars) {
      lines.push(current);
      current = word;
    } else {
      current = current ? current + " " + word : word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

// 5-point star polygon centered at origin, radius 12
const STAR_POINTS = (() => {
  const R = 12,
    r = 5,
    pts = [];
  for (let i = 0; i < 5; i++) {
    const aOuter = Math.PI / 2 + (2 * Math.PI * i) / 5;
    const aInner = aOuter + Math.PI / 5;
    pts.push(`${R * Math.cos(aOuter)},${-R * Math.sin(aOuter)}`);
    pts.push(`${r * Math.cos(aInner)},${-r * Math.sin(aInner)}`);
  }
  return pts.join(" ");
})();

// Dice value text — Compacta BT bold italic
function DiceValue({ pos, value, color = "green" }) {
  if (!value) return null;
  if (value === "\u2605" || value === "★") {
    return (
      <polygon
        points={STAR_POINTS}
        transform={`translate(${pos.x}, ${pos.y - 12})`}
        fill={color}
      />
    );
  }
  return (
    <text
      x={pos.x}
      y={pos.y}
      textAnchor="middle"
      style={{
        fontFamily: "'Compacta BT', 'Compacta', sans-serif",
        fontWeight: 700,
        fontSize: "30px",
        fontStyle: "normal",
        fill: color,
      }}
    >
      {value}
    </text>
  );
}

// Multi-line text block — Acumin Variable Concept
function TextBlock({
  x,
  y,
  text,
  maxChars = 20,
  fontSize = "9px",
  fontWeight = 300,
  anchor = "middle",
}) {
  if (!text) return null;
  const lines = wrapText(text, maxChars);
  const lineHeight = Math.round(parseFloat(fontSize) * 1.3);
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      style={{
        fontFamily: "'Acumin Variable Concept', sans-serif",
        fontWeight,
        fontSize,
        fill: "#fff6d3",
      }}
    >
      {lines.map((line, i) => (
        <tspan key={i} x={x} dy={i === 0 ? 0 : lineHeight}>
          {line}
        </tspan>
      ))}
    </text>
  );
}

export default function CrewLeaderBoard({ leader }) {
  const slots = leader.slots || [];
  const accent = leader.accentColor || "#00ff00";
  const nameClr = leader.nameColor || "#fff6d3";

  return (
    <svg
      viewBox="0 0 1027.3709 789.92139"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block", width: "100%", height: "100%" }}
    >
      {/* Background — full punchboard */}
      <image href={boardBg} width="1027.3709" height="789.92139" />

      {/* ══════════════════════════════════════════════════════════ */}
      {/* LEFT SIDE = FRONT (game face — all editable content)     */}
      {/* x ≈ 0–519                                                */}
      {/* ══════════════════════════════════════════════════════════ */}

      {/* Portrait */}
      <defs>
        <clipPath id="trvPortraitClip">
          {(() => {
            const B = 5; // bleed beyond guide to cover background frame art
            const C = 15; // chamfer inset for cut corners
            const l = PORTRAIT.x - B,
              t = PORTRAIT.y - B;
            const r = PORTRAIT.x + PORTRAIT.w + B,
              b = PORTRAIT.y + PORTRAIT.h + B;
            return (
              <polygon
                points={`${l + C},${t} ${r - C},${t} ${r},${t + C} ${r},${b - C} ${r - C},${b} ${l + C},${b} ${l},${b - C} ${l},${t + C}`}
              />
            );
          })()}
        </clipPath>
        <clipPath id="trvHeadshotClip">
          <ellipse
            cx={BACK_HEADSHOT.x + BACK_HEADSHOT.w / 2}
            cy={BACK_HEADSHOT.y + BACK_HEADSHOT.h / 2}
            rx={BACK_HEADSHOT.w / 2}
            ry={BACK_HEADSHOT.h / 2}
          />
        </clipPath>
      </defs>
      {leader.portraitDataUrl && (
        <image
          href={leader.portraitDataUrl}
          x={PORTRAIT.x - 5}
          y={PORTRAIT.y - 5}
          width={PORTRAIT.w + 10}
          height={PORTRAIT.h + 10}
          preserveAspectRatio="xMidYMid slice"
          clipPath="url(#trvPortraitClip)"
        />
      )}

      {/* Special ability name */}
      {leader.specialAbilityName && (
        <text
          x={SPECIAL_ABILITY_NAME_POS.x}
          y={SPECIAL_ABILITY_NAME_POS.y}
          textAnchor={SPECIAL_ABILITY_NAME_POS.anchor}
          style={{
            fontFamily: "'Compacta TRV', sans-serif",
            fontWeight: 400,
            fontSize: "26px",
            fontStyle: "italic",
            fill: "#fff6d3",
          }}
        >
          {leader.specialAbilityName}
        </text>
      )}

      {/* Special ability description */}
      <TextBlock
        x={SPECIAL_ABILITY_DESC_POS.x}
        y={SPECIAL_ABILITY_DESC_POS.y}
        text={leader.specialAbilityDescription}
        maxChars={22}
        anchor="start"
      />

      {/* Crew leader name — large Compacta TRV text */}
      <text
        x={NAME_POS.x}
        y={NAME_POS.y}
        textAnchor={NAME_POS.anchor}
        transform={`translate(${NAME_POS.x} ${NAME_POS.y}) scale(1.45 1) translate(${-NAME_POS.x} ${-NAME_POS.y})`}
        style={{
          fontFamily: "'Compacta TRV', sans-serif",
          fontWeight: 400,
          fontSize: "74px",
          fontStyle: "italic",
          letterSpacing: "-2px",
          fill: nameClr,
        }}
      >
        {leader.crewLeaderName}
      </text>

      {/* Crew leader nickname / catchphrase */}
      {leader.crewLeaderTitle && (
        <text
          x={TITLE_POS.x}
          y={TITLE_POS.y}
          textAnchor={TITLE_POS.anchor}
          style={{
            fontFamily: "'Compacta BT', 'Compacta', sans-serif",
            fontWeight: 700,
            fontStyle: "italic",
            fontSize: "17px",
            fill: accent,
          }}
        >
          {leader.crewLeaderTitle}
        </text>
      )}

      {/* ── 2×2 Effect Slot Grid ── */}
      {slots.map((slot, i) => (
        <g key={i}>
          {/* Dice value */}
          <DiceValue pos={SLOT_DICE_POS[i]} value={slot.dice} color={accent} />

          {/* Effect name */}
          {slot.effectName && (
            <text
              x={SLOT_NAME_POS[i].x}
              y={SLOT_NAME_POS[i].y}
              textAnchor={SLOT_NAME_POS[i].anchor}
              transform={`translate(${SLOT_NAME_POS[i].x} ${SLOT_NAME_POS[i].y}) scale(0.8 1) translate(${-SLOT_NAME_POS[i].x} ${-SLOT_NAME_POS[i].y})`}
              style={{
                fontFamily: "'Compacta TRV', sans-serif",
                fontWeight: 400,
                fontStyle: "italic",
                fontSize: "26px",
                fill: "#fff6d3",
              }}
            >
              {slot.effectName}
            </text>
          )}

          {/* Description */}
          <TextBlock
            x={SLOT_DESC_POS[i].x}
            y={SLOT_DESC_POS[i].y}
            text={slot.description}
            maxChars={Math.round((SLOT_DESC_POS[i].w || 100) / 4)}
          />
        </g>
      ))}

      {/* Command token count */}
      {leader.commandTokens > 0 && (
        <text
          x={COMMAND_TOKENS_POS.x}
          y={COMMAND_TOKENS_POS.y}
          textAnchor="middle"
          style={{
            fontFamily: "'Compacta BT', 'Compacta', sans-serif",
            fontWeight: 700,
            fontStyle: "italic",
            fontSize: "18px",
            fill: "#fff6d3",
          }}
        >
          {leader.commandTokens}
        </text>
      )}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* OFF-SCREEN = BACK METADATA (x > 1039)                   */}
      {/* ══════════════════════════════════════════════════════════ */}

      {/* App title */}
      <text
        x={BACK_APP_TITLE_POS.x}
        y={BACK_APP_TITLE_POS.y}
        textAnchor={BACK_APP_TITLE_POS.anchor}
        style={{
          fontFamily: "'Compacta TRV', sans-serif",
          fontWeight: 400,
          fontSize: "22px",
          fill: "#fff6d3",
        }}
      >
        CREW LEADER CREATOR
      </text>

      {/* Back headshot */}
      {leader.portraitDataUrl && (
        <image
          href={leader.portraitDataUrl}
          x={BACK_HEADSHOT.x}
          y={BACK_HEADSHOT.y}
          width={BACK_HEADSHOT.w}
          height={BACK_HEADSHOT.h}
          preserveAspectRatio="xMidYMid slice"
          clipPath="url(#trvHeadshotClip)"
        />
      )}

      {/* Crew leader name — below headshot */}
      {leader.crewLeaderName && (
        <text
          x={BACK_HEADSHOT.x + BACK_HEADSHOT.w / 2}
          y={BACK_HEADSHOT.y + BACK_HEADSHOT.h + 20}
          textAnchor="middle"
          style={{
            fontFamily: "'Compacta TRV', sans-serif",
            fontWeight: 400,
            fontStyle: "italic",
            fontSize: "20px",
            fill: "#fff6d3",
          }}
        >
          {leader.crewLeaderName}
        </text>
      )}

      {/* Version */}
      {leader.revision_no && (
        <text
          x={BACK_VERSION_POS.x}
          y={BACK_VERSION_POS.y}
          textAnchor={BACK_VERSION_POS.anchor}
          style={{
            fontFamily: "'Acumin Variable Concept', sans-serif",
            fontWeight: 300,
            fontSize: "14px",
            fill: "#fff6d3",
          }}
        >
          {"Version: " + leader.revision_no}
        </text>
      )}

      {/* Author name */}
      {leader.author_name && (
        <text
          x={BACK_AUTHOR_NAME_POS.x}
          y={BACK_AUTHOR_NAME_POS.y}
          textAnchor={BACK_AUTHOR_NAME_POS.anchor}
          style={{
            fontFamily: "'Acumin Variable Concept', sans-serif",
            fontWeight: 600,
            fontSize: "18px",
            fill: "#fff6d3",
          }}
        >
          {"Designed by: " + leader.author_name}
        </text>
      )}

      {/* Contact info */}
      {leader.contact_info && (
        <text
          x={BACK_CONTACT_POS.x}
          y={BACK_CONTACT_POS.y}
          textAnchor={BACK_CONTACT_POS.anchor}
          style={{
            fontFamily: "'Acumin Variable Concept', sans-serif",
            fontWeight: 300,
            fontSize: "13px",
            fill: "#fff6d3",
          }}
        >
          {"Contact: " + leader.contact_info}
        </text>
      )}

      {/* Author description */}
      <TextBlock
        x={BACK_AUTHOR_DESC_POS.x}
        y={BACK_AUTHOR_DESC_POS.y}
        text={leader.author_description}
        maxChars={35}
        fontSize="14px"
      />
    </svg>
  );
}
