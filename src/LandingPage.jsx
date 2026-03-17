import { useState } from "react";
import { useNavigate } from "react-router-dom";
import rtdtCover from "./rtdt/assets/rtdt_cover2.jpg";
import azkolWoff2 from "./rtdt/assets/azkolskerning7-webfont.woff2";
import compactaFont from "./trv/assets/fonts/CompactaBT-BoldItalic.woff2";
import knockoutFont from "./trv/assets/fonts/Knockout-70.woff2";
import trvBoardBg from "./trv/assets/trv_board_bg.svg";
import trvWallpaper from "./trv/assets/trv_wallpaper.jpeg";

const BASE = import.meta.env.BASE_URL;
const HERO_IMGS = [
  `${BASE}hero-relic-hunter.jpeg`,
  `${BASE}hero-spymaster.jpeg`,
  `${BASE}hero-orphaned-scion.jpeg`,
];

const SPOKES = [0, 30, 60, 90, 120, 150];

export default function LandingPage() {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);

  const handleSelect = (app) => {
    navigate(`/${app}`, { replace: true });
  };

  const rtdtFlex =
    hovered === "trv" ? "0 0 38%" : hovered === "rtdt" ? "0 0 62%" : "0 0 50%";
  const trvFlex =
    hovered === "rtdt" ? "0 0 38%" : hovered === "trv" ? "0 0 62%" : "0 0 50%";

  return (
    <>
      <style>{`
        @font-face {
          font-family: 'AzkolsKerning';
          src: url('${azkolWoff2}') format('woff2');
          font-weight: normal; font-style: normal;
        }
        @font-face {
          font-family: 'CompactaBT';
          src: url('${compactaFont}') format('woff2');
          font-weight: bold; font-style: italic;
        }
        @font-face {
          font-family: 'KnockoutHTF';
          src: url('${knockoutFont}') format('woff2');
          font-weight: normal; font-style: normal;
        }

        /* ── Entrance animations ──────────────────────────────── */
        @keyframes ldg-in-left {
          from { opacity: 0; transform: translateX(-28px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes ldg-in-right {
          from { opacity: 0; transform: translateX(28px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes ldg-in-divider {
          from { opacity: 0; transform: scaleY(0.15); }
          to   { opacity: 1; transform: scaleY(1); }
        }
        @keyframes ldg-in-portraits {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Shared panel ─────────────────────────────────────── */
        .ldg-panel {
          overflow: hidden;
          transition: flex 0.55s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          outline: none;
        }
        .ldg-scanlines {
          position: absolute; inset: 0; z-index: 5; pointer-events: none;
          background: repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.025) 3px, rgba(0,0,0,0.025) 4px);
        }

        /* ── RTDT ─────────────────────────────────────────────── */
        .ldg-rtdt { position: relative; background: #060210; }
        .ldg-rtdt-bg {
          position: absolute; inset: 0;
          background-image: url('${rtdtCover}');
          background-size: cover;
          background-position: center 18%;
          opacity: 0.82;
          transform-origin: center;
          transition: transform 7s ease-out, opacity 0.5s ease;
        }
        .ldg-rtdt:hover .ldg-rtdt-bg { transform: scale(1.05); opacity: 0.94; }
        .ldg-rtdt-grad {
          position: absolute; inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(4, 1, 18, 0.85) 0%,
            rgba(4, 1, 18, 0.08) 30%,
            rgba(4, 1, 18, 0.08) 60%,
            rgba(4, 1, 18, 0.97) 100%
          );
        }
        .ldg-rtdt-sides {
          position: absolute; inset: 0;
          background: linear-gradient(to right, rgba(4,1,18,0.65) 0%, transparent 28%, transparent 72%, rgba(4,1,18,0.65) 100%);
        }
        .ldg-rtdt-ambient {
          position: absolute; inset: 0;
          box-shadow: inset 0 0 160px rgba(180, 120, 0, 0);
          transition: box-shadow 0.55s ease;
        }
        .ldg-rtdt:hover .ldg-rtdt-ambient {
          box-shadow: inset 0 0 160px rgba(180, 120, 0, 0.2), inset 0 0 60px rgba(180, 120, 0, 0.1);
        }
        .ldg-rtdt-body {
          position: relative; z-index: 10;
          height: 100%;
          display: flex; flex-direction: column;
          justify-content: space-between;
          padding: 2.5rem clamp(1.4rem, 3vw, 3rem);
          animation: ldg-in-left 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.05s both;
        }

        /* ── TRV ──────────────────────────────────────────────── */
        .ldg-trv { position: relative; background: #090604; }
        .ldg-trv-board {
          position: absolute; inset: 0;
          background-image: url('${trvWallpaper}');
          background-size: cover;
          background-position: center;
          opacity: 0.45;
          filter: brightness(0.6);
          transform-origin: center;
          transition: transform 7s ease-out, opacity 0.5s ease;
        }
        .ldg-trv:hover .ldg-trv-board { transform: scale(1.05); opacity: 0.55; }
        .ldg-trv-stripes {
          position: absolute; inset: 0;
          background: repeating-linear-gradient(
            -52deg,
            transparent 0px, transparent 38px,
            rgba(190, 55, 0, 0.045) 38px, rgba(190, 55, 0, 0.045) 40px
          );
        }
        .ldg-trv-radial {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 90% 55% at 50% 82%, rgba(200, 50, 0, 0.2) 0%, transparent 65%);
          opacity: 0.5; transition: opacity 0.5s ease;
        }
        .ldg-trv:hover .ldg-trv-radial { opacity: 1; }
        .ldg-trv-ambient {
          position: absolute; inset: 0;
          box-shadow: inset 0 0 160px rgba(200, 60, 0, 0);
          transition: box-shadow 0.55s ease;
        }
        .ldg-trv:hover .ldg-trv-ambient {
          box-shadow: inset 0 0 160px rgba(200, 60, 0, 0.18), inset 0 0 60px rgba(200, 60, 0, 0.09);
        }

        /* Ghost wheel */
        .ldg-wheel {
          position: absolute;
          right: -10%; top: 50%; transform: translateY(-50%);
          width: 75%; aspect-ratio: 1;
          border-radius: 50%;
          border: 2px solid rgba(190, 55, 0, 0.07);
          box-shadow: 0 0 0 14px rgba(190,55,0,0.04), 0 0 0 32px rgba(190,55,0,0.025), 0 0 0 58px rgba(190,55,0,0.015);
          pointer-events: none;
          transition: border-color 0.55s, box-shadow 0.55s;
        }
        .ldg-trv:hover .ldg-wheel {
          border-color: rgba(190, 55, 0, 0.2);
          box-shadow: 0 0 0 14px rgba(190,55,0,0.08), 0 0 0 32px rgba(190,55,0,0.05), 0 0 0 58px rgba(190,55,0,0.03);
        }
        .ldg-wheel::before {
          content: ''; position: absolute; inset: 12%; border-radius: 50%;
          border: 1px solid rgba(190,55,0,0.07);
        }
        .ldg-wheel::after {
          content: ''; position: absolute; inset: 36%; border-radius: 50%;
          background: rgba(190,55,0,0.04); border: 1px solid rgba(190,55,0,0.1);
        }
        .ldg-spoke {
          position: absolute;
          top: 50%; left: 50%;
          width: 50%; height: 1px;
          background: linear-gradient(to right, rgba(190,55,0,0.09), transparent);
          transform-origin: left center;
        }

        .ldg-trv-body {
          position: relative; z-index: 10;
          height: 100%;
          display: flex; flex-direction: column;
          justify-content: space-between;
          padding: 2.5rem clamp(1.4rem, 3vw, 3rem);
          animation: ldg-in-right 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both;
        }

        /* ── Divider ──────────────────────────────────────────── */
        .ldg-divider {
          flex-shrink: 0; width: 1px;
          position: relative; z-index: 20;
          background: linear-gradient(
            to bottom,
            transparent 0%,
            rgba(255, 200, 55, 0.6) 20%,
            rgba(255, 200, 55, 0.92) 50%,
            rgba(255, 200, 55, 0.6) 80%,
            transparent 100%
          );
          box-shadow: 0 0 10px rgba(255, 200, 55, 0.4);
          animation: ldg-in-divider 0.65s ease 0.3s both;
        }
        .ldg-gem {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%) rotate(45deg);
          width: 10px; height: 10px;
          background: #ffcc38;
          box-shadow: 0 0 18px rgba(255,200,55,0.95), 0 0 36px rgba(255,200,55,0.5);
        }

        /* ── RTDT typography ──────────────────────────────────── */
        .ldg-rtdt-sup {
          font-family: 'AzkolsKerning', Georgia, serif;
          font-size: clamp(0.5rem, 0.85vw, 0.65rem);
          letter-spacing: 0.45em;
          color: rgba(255, 200, 80, 0.4);
          text-transform: uppercase;
          margin-bottom: 0.55rem;
        }
        .ldg-rtdt-title {
          font-family: 'AzkolsKerning', Georgia, serif;
          font-size: clamp(1.5rem, 2.9vw, 2.75rem);
          letter-spacing: 0.14em;
          color: rgba(255, 200, 65, 0.93);
          text-shadow: 0 0 50px rgba(255, 150, 0, 0.65), 0 2px 8px rgba(0,0,0,0.95);
          text-transform: uppercase;
          line-height: 1.1;
        }
        .ldg-rtdt-sub {
          font-family: 'AzkolsKerning', Georgia, serif;
          font-size: clamp(0.5rem, 0.85vw, 0.65rem);
          letter-spacing: 0.45em;
          color: rgba(255, 200, 80, 0.4);
          text-transform: uppercase;
          margin-top: 0.6rem;
        }

        /* ── TRV typography ───────────────────────────────────── */
        .ldg-trv-sup {
          font-family: 'KnockoutHTF', 'Arial Narrow', sans-serif;
          font-size: clamp(0.5rem, 0.85vw, 0.65rem);
          letter-spacing: 0.45em;
          color: rgba(215, 95, 35, 0.4);
          text-transform: uppercase;
          margin-bottom: 0.55rem;
        }
        .ldg-trv-title {
          font-family: 'CompactaBT', 'Arial Black', sans-serif;
          font-size: clamp(1.9rem, 4vw, 4rem);
          letter-spacing: 0.02em;
          color: #de4800;
          text-shadow: 0 0 55px rgba(220, 68, 0, 0.8), 0 2px 10px rgba(0,0,0,0.97), 0 0 100px rgba(220, 68, 0, 0.35);
          text-transform: uppercase;
          line-height: 0.88;
        }
        .ldg-trv-sub {
          font-family: 'KnockoutHTF', 'Arial Narrow', sans-serif;
          font-size: clamp(0.5rem, 0.85vw, 0.65rem);
          letter-spacing: 0.45em;
          color: rgba(215, 95, 35, 0.4);
          text-transform: uppercase;
          margin-top: 0.6rem;
        }

        /* ── Separator ────────────────────────────────────────── */
        .ldg-sep {
          height: 1px;
          opacity: 0.22;
          margin: 0.75rem 0 0.8rem;
        }
        .ldg-sep-rtdt { background: linear-gradient(to right, rgba(255,200,55,1), transparent); }
        .ldg-sep-trv  { background: linear-gradient(to right, rgba(220,68,0,1), transparent); }

        /* ── Enter buttons ────────────────────────────────────── */
        .ldg-enter {
          display: inline-flex; align-items: center; gap: 0.65em;
          padding: 0.6rem 1.7rem 0.55rem;
          font-size: clamp(0.5rem, 0.8vw, 0.65rem);
          letter-spacing: 0.55em;
          text-transform: uppercase;
          transition: all 0.35s ease;
        }
        .ldg-enter-pip {
          display: inline-block;
          width: 5px; height: 5px;
          transform: rotate(45deg);
          background: currentColor;
          flex-shrink: 0;
          opacity: 0.7;
        }
        .ldg-enter-rtdt {
          font-family: 'AzkolsKerning', Georgia, serif;
          color: rgba(255, 200, 75, 0.6);
          border: 1px solid rgba(255, 200, 75, 0.18);
          background: rgba(255, 180, 0, 0.04);
        }
        .ldg-rtdt:hover .ldg-enter-rtdt {
          color: rgba(255, 220, 100, 1);
          border-color: rgba(255, 200, 75, 0.8);
          background: rgba(255, 180, 0, 0.1);
          box-shadow: 0 0 26px rgba(255, 180, 0, 0.25), inset 0 0 10px rgba(255,180,0,0.04);
        }
        .ldg-enter-trv {
          font-family: 'KnockoutHTF', 'Arial Narrow', sans-serif;
          color: rgba(200, 75, 15, 0.6);
          border: 1px solid rgba(200, 75, 15, 0.18);
          background: rgba(200, 60, 0, 0.04);
        }
        .ldg-trv:hover .ldg-enter-trv {
          color: rgba(255, 120, 45, 1);
          border-color: rgba(200, 75, 15, 0.8);
          background: rgba(200, 60, 0, 0.13);
          box-shadow: 0 0 26px rgba(200, 75, 15, 0.28), inset 0 0 10px rgba(200,60,0,0.04);
        }

        /* ── Hero portraits ───────────────────────────────────── */
        .ldg-portraits {
          display: flex; gap: 0.65rem;
          align-items: flex-end;
          animation: ldg-in-portraits 0.9s ease 0.5s both;
        }
        .ldg-portrait {
          width: clamp(52px, 6.5vw, 86px);
          aspect-ratio: 2/3;
          overflow: hidden;
          flex-shrink: 0;
          border: 1px solid rgba(255, 175, 45, 0.12);
          box-shadow: 0 4px 22px rgba(0,0,0,0.7);
          transition: transform 0.45s ease, border-color 0.45s ease, box-shadow 0.45s ease;
        }
        .ldg-portrait img {
          width: 100%; height: 100%;
          object-fit: cover; object-position: top center;
          display: block;
          filter: saturate(0.75) brightness(0.82);
          transition: filter 0.45s ease;
        }
        .ldg-portrait:nth-child(1) { transform: rotate(-3.5deg) translateY(5px); }
        .ldg-portrait:nth-child(2) { transform: none; z-index: 2; }
        .ldg-portrait:nth-child(3) { transform: rotate(3.5deg) translateY(5px); }
        .ldg-rtdt:hover .ldg-portrait:nth-child(1) {
          transform: rotate(-5deg) translateY(2px);
          border-color: rgba(255,175,45,0.5); box-shadow: 0 8px 30px rgba(255,140,0,0.22);
        }
        .ldg-rtdt:hover .ldg-portrait:nth-child(2) {
          transform: translateY(-7px);
          border-color: rgba(255,175,45,0.6); box-shadow: 0 12px 34px rgba(255,140,0,0.28);
        }
        .ldg-rtdt:hover .ldg-portrait:nth-child(3) {
          transform: rotate(5deg) translateY(2px);
          border-color: rgba(255,175,45,0.5); box-shadow: 0 8px 30px rgba(255,140,0,0.22);
        }
        .ldg-rtdt:hover .ldg-portrait img { filter: saturate(1.05) brightness(1); }

        /* ── TRV ghost type ───────────────────────────────────── */
        .ldg-ghost {
          font-family: 'CompactaBT', 'Arial Black', sans-serif;
          font-size: clamp(4.5rem, 9.5vw, 10rem);
          line-height: 0.8;
          color: rgba(195, 50, 0, 0.08);
          letter-spacing: -0.01em;
          white-space: nowrap;
          overflow: hidden;
          pointer-events: none;
          user-select: none;
          transition: color 0.5s ease;
        }
        .ldg-trv:hover .ldg-ghost { color: rgba(195, 50, 0, 0.17); }

        /* ── Footer ───────────────────────────────────────────── */
        .ldg-footer {
          position: fixed; bottom: 1rem; left: 50%;
          transform: translateX(-50%);
          z-index: 40; pointer-events: none; user-select: none;
          white-space: nowrap;
          font-family: 'KnockoutHTF', 'Arial Narrow', sans-serif;
          font-size: 0.52rem;
          letter-spacing: 0.4em;
          color: rgba(255,255,255,0.12);
          text-transform: uppercase;
        }
      `}</style>

      <div
        style={{
          display: "flex",
          height: "100vh",
          overflow: "hidden",
          background: "#000",
        }}
      >
        {/* ── RTDT Panel ───────────────────────────────────────── */}
        <div
          className="ldg-panel ldg-rtdt"
          style={{ flex: rtdtFlex }}
          onMouseEnter={() => setHovered("rtdt")}
          onMouseLeave={() => setHovered(null)}
          onClick={() => handleSelect("rtdt")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && handleSelect("rtdt")}
          aria-label="Open Hero Board Creator — Return to Dark Tower"
        >
          <div className="ldg-rtdt-bg" />
          <div className="ldg-rtdt-grad" />
          <div className="ldg-rtdt-sides" />
          <div className="ldg-rtdt-ambient" />
          <div className="ldg-scanlines" />

          <div className="ldg-rtdt-body">
            {/* Identity */}
            <div>
              <p className="ldg-rtdt-sup">Board Game Companion</p>
              <h2 className="ldg-rtdt-title">
                Return
                <br />
                to Dark
                <br />
                Tower
              </h2>
              <div className="ldg-sep ldg-sep-rtdt" />
              <p className="ldg-rtdt-sub">Hero Board Creator</p>
            </div>

            <div style={{ flex: 1, minHeight: 0 }} />

            {/* Portraits + CTA */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.1rem",
              }}
            >
              <div className="ldg-portraits">
                {HERO_IMGS.map((src, i) => (
                  <div key={i} className="ldg-portrait">
                    <img src={src} alt="" draggable={false} />
                  </div>
                ))}
              </div>
              <div>
                <span className="ldg-enter ldg-enter-rtdt">
                  <span className="ldg-enter-pip" />
                  Enter
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Divider ──────────────────────────────────────────── */}
        <div className="ldg-divider">
          <div className="ldg-gem" />
        </div>

        {/* ── TRV Panel ────────────────────────────────────────── */}
        <div
          className="ldg-panel ldg-trv"
          style={{ flex: trvFlex }}
          onMouseEnter={() => setHovered("trv")}
          onMouseLeave={() => setHovered(null)}
          onClick={() => handleSelect("trv")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && handleSelect("trv")}
          aria-label="Open Crew Leader Creator — Thunder Road Vendetta"
        >
          <div className="ldg-trv-board" />
          <div className="ldg-trv-stripes" />
          <div className="ldg-trv-radial" />
          <div className="ldg-trv-ambient" />
          <div className="ldg-scanlines" />

          {/* Ghost wheel */}
          <div className="ldg-wheel">
            {SPOKES.map((deg) => (
              <div
                key={deg}
                className="ldg-spoke"
                style={{ transform: `rotate(${deg}deg)` }}
              />
            ))}
          </div>

          <div className="ldg-trv-body">
            {/* Identity */}
            <div>
              <p className="ldg-trv-sup">Board Game Companion</p>
              <h2 className="ldg-trv-title">
                Thunder
                <br />
                Road
                <br />
                Vendetta
              </h2>
              <div className="ldg-sep ldg-sep-trv" />
              <p className="ldg-trv-sub">Crew Leader Creator</p>
            </div>

            <div style={{ flex: 1, minHeight: 0 }} />

            {/* Ghost type + CTA */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.9rem",
              }}
            >
              <div className="ldg-ghost">
                CREW
                <br />
                LEADER
              </div>
              <div>
                <span className="ldg-enter ldg-enter-trv">
                  <span className="ldg-enter-pip" />
                  Enter
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="ldg-footer">Board Game Companion Tools</p>
    </>
  );
}
