import { useState, useEffect, useRef, useMemo } from "react";
import HeroBoard from "./components/HeroBoard";
import HeroForm from "./components/HeroForm";
import RecentHeroRow from "./components/RecentHeroRow";
import { defaultHero } from "./data/defaultHero";
import { validateHeroData } from "./utils/heroIO";
import { resolveTheme } from "./data/themes";
import { buildThemedSvgUrls, revokeThemedSvgUrls } from "./utils/svgTheme";
import GalleryModal from "./components/GalleryModal";
import AdminPanel from "./components/AdminPanel";
import ConfirmDialog from "./components/ConfirmDialog";
import { useConfirm } from "./hooks/useConfirm";
import { useHeroState } from "./hooks/useHeroState";
import { useFileIO } from "./hooks/useFileIO";
import { useExport } from "./hooks/useExport";
import { useGallery } from "./hooks/useGallery";
import coverBg from "./assets/rtdt_cover2.jpg";
import { formatTimeAgo } from "./utils/timeUtils";

export default function V2App() {
  // --- Core state ---
  const heroState = useHeroState();
  const { hero, setHero, replaceHero, portraitQuality, setPortraitQuality, storageWarning, storageBytes,
          isModifiedFromDefault } = heroState;
  const { confirmState, confirm, showAlert, showPrompt, handleConfirm, handleCancel } = useConfirm();

  // --- UI state ---
  const [statusMsg, setStatusMsg] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(
    () => localStorage.getItem("v2-sidebarOpen") !== "false",
  );
  const [showPasteModal, setShowPasteModal] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardSize, setCardSize] = useState({ width: 0, height: 0 });
  const cardAreaRef = useRef(null);

  const showStatus = (text, type = "success") => {
    setStatusMsg({ text, type });
    setTimeout(() => setStatusMsg(null), 3000);
  };

  // --- Feature hooks ---
  const fileIO = useFileIO({ heroState, confirm, showPrompt, showStatus });
  const { clearFileHandle, recents, handleSaveJson, handleLoadJson, handleCopyToClipboard,
          handlePasteSubmit, handleLoadRecent, handleRemoveRecent, handleOpenRecentInNewWindow,
          handleClearRecents } = fileIO;

  const { downloading, snapshotFlash, holding, handleDownloadPdf,
          onSnapshotPointerDown, onSnapshotPointerUp, cancelHold } =
    useExport({ hero, showAlert, showStatus });

  const { submitting, shareWarning, setShareWarning, handleShareToGallery, handleLoadFromGallery } =
    useGallery({ heroState, clearFileHandle, confirm, showAlert, showStatus });

  // --- Theme ---
  const resolvedTheme = useMemo(
    () => resolveTheme(hero.theme, hero.customTheme),
    [hero.theme, hero.customTheme],
  );

  const themedUrls = useMemo(
    () => buildThemedSvgUrls(resolvedTheme),
    [resolvedTheme],
  );

  const themeColors = useMemo(() => ({
    textPrimary: resolvedTheme.textPrimary,
    textSecondary: resolvedTheme.textSecondary,
    virtueTitleFill: resolvedTheme.virtueTitleFill,
    emptyPlaceholderFill: resolvedTheme.emptyPlaceholderFill,
    flavorOpacity: resolvedTheme.flavorOpacity,
  }), [resolvedTheme]);

  const prevUrlsRef = useRef(null);
  useEffect(() => {
    if (prevUrlsRef.current && prevUrlsRef.current !== themedUrls) {
      revokeThemedSvgUrls(prevUrlsRef.current);
    }
    prevUrlsRef.current = themedUrls;
    return () => revokeThemedSvgUrls(themedUrls);
  }, [themedUrls]);

  // --- Effects ---
  useEffect(() => {
    const el = cardAreaRef.current;
    if (!el) return;
    const ASPECT = 1213 / 808;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      let w = width;
      let h = w / ASPECT;
      if (h > height) {
        h = height;
        w = h * ASPECT;
      }
      setCardSize({ width: w, height: h });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    localStorage.setItem("v2-sidebarOpen", sidebarOpen);
  }, [sidebarOpen]);

  // Detect handoff from "Open in new tab"
  useEffect(() => {
    try {
      const raw = localStorage.getItem("rtdt-hero-handoff");
      if (!raw) return;
      const handoff = JSON.parse(raw);
      localStorage.removeItem("rtdt-hero-handoff");
      if (Date.now() - handoff.timestamp > 10_000) return;
      if (handoff.hero) {
        const result = validateHeroData(handoff.hero);
        if (!result.valid) return;
        clearFileHandle();
        replaceHero(result.hero);
        showStatus(`Opened ${handoff.fileName || "hero"} in new tab`);
      }
    } catch {
      localStorage.removeItem("rtdt-hero-handoff");
    }
  }, []);

  // --- Local handlers ---
  const resetHero = async () => {
    if (isModifiedFromDefault()) {
      const ok = await confirm({
        title: "Reset Hero",
        message: "You have unsaved changes that will be lost. Reset anyway?",
        confirmLabel: "Reset",
        destructive: true,
      });
      if (!ok) return;
    }
    localStorage.removeItem("rtdt-hero-v2");
    clearFileHandle();
    setHero({
      ...defaultHero,
      virtues: defaultHero.virtues.map((v) => ({ ...v })),
    });
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
      {/* Editor panel */}
      <aside
        className={`flex flex-col bg-gray-800 border-r border-gray-700 overflow-hidden transition-all duration-300 ${sidebarOpen ? "w-80" : "w-0 border-r-0"}`}
      >
        <div className="px-4 py-3 border-b border-gray-700 bg-gray-900 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-sm font-bold text-amber-400 tracking-wider uppercase">
              Hero Board Creator
            </h1>
            <p className="text-xs text-gray-500">
              Return to Dark Tower
              <span className="ml-1 text-gray-600 font-mono">v{typeof __APP_VERSION__ !== "undefined" ? __APP_VERSION__ : "?.?.?"}</span>
              <button
                type="button"
                onClick={() => setShowAdmin(true)}
                className="ml-1.5 text-gray-600 hover:text-amber-400 transition-colors"
                title="Admin"
              >
                &bull;
              </button>
            </p>
          </div>
          <button
            type="button"
            onClick={resetHero}
            className="text-[10px] px-2 py-0.5 border border-gray-600 rounded text-gray-500 hover:text-red-400 hover:border-red-400 transition-colors"
          >
            Reset
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          <HeroForm
            hero={hero}
            updateHero={heroState.updateHero}
            updateVirtue={heroState.updateVirtue}
            addVirtue={heroState.addVirtue}
            removeVirtue={heroState.removeVirtue}
            reorderVirtues={heroState.reorderVirtues}
            portraitQuality={portraitQuality}
            setPortraitQuality={setPortraitQuality}
            storageWarning={storageWarning}
            storageBytes={storageBytes}
          />
        </div>

        <div className="px-4 py-3 border-t border-gray-700 bg-gray-900 shrink-0 space-y-2">
          {statusMsg && (
            <div
              className={`text-xs text-center py-1 rounded ${
                statusMsg.type === "error"
                  ? "text-red-400 bg-red-900/30"
                  : "text-green-400 bg-green-900/30"
              }`}
            >
              {statusMsg.text}
            </div>
          )}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleSaveJson}
              className="rounded bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs py-1.5 uppercase tracking-wider transition-colors"
            >
              Save Hero
            </button>
            <button
              type="button"
              onClick={handleLoadJson}
              className="rounded bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs py-1.5 uppercase tracking-wider transition-colors"
            >
              Load Hero
            </button>
            <button
              type="button"
              onClick={handleCopyToClipboard}
              className="rounded bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs py-1.5 uppercase tracking-wider transition-colors"
            >
              Copy
            </button>
            <button
              type="button"
              onClick={() => setShowPasteModal(true)}
              className="rounded bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs py-1.5 uppercase tracking-wider transition-colors"
            >
              Paste
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setShowGallery(true)}
              className="rounded bg-indigo-800 hover:bg-indigo-700 text-indigo-200 text-xs py-1.5 uppercase tracking-wider transition-colors"
            >
              Gallery
            </button>
            <button
              type="button"
              onClick={handleShareToGallery}
              disabled={submitting}
              className="rounded bg-indigo-800 hover:bg-indigo-700 disabled:bg-gray-700 disabled:text-gray-500 text-indigo-200 text-xs py-1.5 uppercase tracking-wider transition-colors"
            >
              {submitting ? "Sharing..." : "Share"}
            </button>
          </div>
          {recents.length > 0 && (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                  Recent Heroes
                </h3>
                <button
                  type="button"
                  onClick={handleClearRecents}
                  className="w-4 h-4 flex items-center justify-center rounded text-gray-500 hover:text-red-400 hover:bg-gray-600 transition-colors text-xs leading-none"
                  aria-label="Clear all recent heroes"
                  title="Clear all"
                >
                  ×
                </button>
              </div>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {recents.map((entry) => (
                  <RecentHeroRow
                    key={entry.id}
                    entry={entry}
                    onLoad={handleLoadRecent}
                    onRemove={handleRemoveRecent}
                    onOpenNewWindow={handleOpenRecentInNewWindow}
                    formatTimeAgo={formatTimeAgo}
                  />
                ))}
              </div>
            </div>
          )}
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={downloading}
            className="w-full rounded bg-amber-700 hover:bg-amber-600 disabled:bg-gray-700 disabled:text-gray-500 text-white font-bold py-2.5 text-sm uppercase tracking-widest transition-colors"
          >
            {downloading ? "Generating PDF..." : "Download PDF"}
          </button>
        </div>
      </aside>

      {/* Preview panel */}
      <main className="flex-1 flex flex-col bg-gray-950 overflow-hidden">
        {/* Toolbar row */}
        <div className="flex items-center justify-between px-4 py-2 shrink-0">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen((o) => !o)}
              aria-label="Toggle sidebar"
              aria-expanded={sidebarOpen}
              className="w-7 h-7 flex items-center justify-center rounded bg-gray-800 border border-gray-700 text-gray-400 hover:text-amber-400 hover:border-amber-500 transition-colors text-sm"
            >
              {sidebarOpen ? "\u00AB" : "\u00BB"}
            </button>
            {(hero.author_name || hero.revision_no) && (
              <span className="text-xs text-gray-400 tracking-wider">
                {hero.author_name && (
                  <>
                    Hero designed by:{" "}
                    <span className="text-amber-200 font-semibold">
                      {hero.author_name}
                    </span>
                  </>
                )}
                {hero.author_name && hero.revision_no && (
                  <span className="mx-1.5 text-gray-600">·</span>
                )}
                {hero.revision_no && (
                  <span className="font-mono text-gray-300">
                    {hero.revision_no}
                  </span>
                )}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsFlipped((f) => !f)}
              className="min-w-[128px] flex items-center justify-center rounded-lg bg-gray-800/80 border border-gray-700 text-gray-300 hover:text-amber-400 hover:border-amber-500 font-bold text-xs uppercase tracking-widest px-3 py-1 transition-colors"
            >
              {isFlipped ? "Show Front" : "Show Back"}
            </button>

            {/* Zoom controls */}
            <div className="flex items-center gap-1 bg-gray-800/80 border border-gray-700 rounded-lg px-1 py-0">
              <button
                type="button"
                onClick={() =>
                  setZoom((z) => Math.max(0.25, +(z - 0.25).toFixed(2)))
                }
                className="px-2 py-1 flex items-center justify-center rounded text-gray-300 hover:bg-gray-700 text-xs font-bold transition-colors"
              >
                −
              </button>
              <button
                type="button"
                onClick={() => setZoom(1)}
                className="px-1.5 py-1 flex items-center justify-center rounded text-gray-400 hover:bg-gray-700 text-xs tabular-nums transition-colors"
              >
                {Math.round(zoom * 100)}%
              </button>
              <button
                type="button"
                onClick={() =>
                  setZoom((z) => Math.min(3, +(z + 0.25).toFixed(2)))
                }
                className="px-2 py-1 flex items-center justify-center rounded text-gray-300 hover:bg-gray-700 text-xs font-bold transition-colors"
              >
                +
              </button>
            </div>

            <button
              type="button"
              onPointerDown={onSnapshotPointerDown}
              onPointerUp={onSnapshotPointerUp}
              onPointerLeave={cancelHold}
              onPointerCancel={cancelHold}
              disabled={isFlipped}
              className={`w-7 h-7 flex items-center justify-center rounded-lg border transition-all duration-300 disabled:opacity-40 disabled:pointer-events-none select-none touch-none ${holding ? "bg-amber-600 border-amber-400 text-white scale-110" : snapshotFlash ? "bg-amber-500 border-amber-400 text-white scale-110" : "bg-gray-800/80 border-gray-700 text-gray-300 hover:text-amber-400 hover:border-amber-500"}`}
              title="Click to copy image · Hold 3s to copy & download"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-3.5 h-3.5"
              >
                <path
                  fillRule="evenodd"
                  d="M1 8a2 2 0 0 1 2-2h.93a2 2 0 0 0 1.664-.89l.812-1.22A2 2 0 0 1 8.07 3h3.86a2 2 0 0 1 1.664.89l.812 1.22A2 2 0 0 0 16.07 6H17a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8Zm13.5 3a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM10 14a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Card area */}
        <div
          ref={cardAreaRef}
          className="flex-1 overflow-auto grid justify-items-center items-start px-8 pt-2 pb-8"
        >
          <div
            className="relative [perspective:2000px] shadow-2xl"
            style={{
              width: cardSize.width * zoom,
              height: cardSize.height * zoom,
            }}
          >
            <div
              className="absolute inset-0 w-full h-full transition-transform duration-700 [transform-style:preserve-3d]"
              style={{ transform: `rotateY(${isFlipped ? 180 : 0}deg)` }}
            >
              {/* Front face */}
              <div
                id="hero-board-container"
                className="absolute inset-0 w-full h-full [backface-visibility:hidden]"
                style={{ zIndex: 2 }}
              >
                <HeroBoard hero={hero} themedUrls={themedUrls} themeColors={themeColors} />
              </div>
              {/* Back face */}
              <div
                className="absolute inset-0 w-full h-full flex flex-col items-center justify-center [backface-visibility:hidden] rotate-y-180 rounded-lg overflow-hidden border-2 border-gray-600"
                style={{ zIndex: 1 }}
              >
                <img
                  src={coverBg}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 w-full h-full bg-black/50" />
                <div className="relative z-10 flex flex-col items-center justify-center text-center w-full h-full">
                  <h2
                    className="text-5xl text-amber-300 drop-shadow mb-4 mt-16"
                    style={{ fontFamily: "AzkolsKerning7, sans-serif" }}
                  >
                    Return to Dark Tower Hero Board Creator
                  </h2>
                  {hero.author_name ||
                  hero.revision_no ||
                  hero.contact ||
                  hero.description ? (
                    <div className="bg-yellow-700/50 rounded-3xl px-8 py-6 shadow-lg w-[93%] mx-auto">
                      {hero.author_name && (
                        <p className="text-lg text-gray-100 font-semibold mb-2">
                          Designed by:{" "}
                          <span className="text-amber-200">
                            {hero.author_name}
                          </span>
                        </p>
                      )}
                      {hero.revision_no && (
                        <p className="text-md text-gray-300 mb-2">
                          Hero Version:{" "}
                          <span className="font-mono">{hero.revision_no}</span>
                        </p>
                      )}
                      {hero.contact && (
                        <p className="text-md text-gray-300 mb-2">
                          Contact:{" "}
                          <span className="font-mono">{hero.contact}</span>
                        </p>
                      )}
                      {hero.description && (
                        <p className="text-md text-gray-200 mt-4 whitespace-pre-line text-left">
                          {hero.description}
                        </p>
                      )}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Paste modal */}
      {showPasteModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 w-96 space-y-3">
            <h2 className="text-sm font-bold text-amber-400 uppercase tracking-wider">
              Paste Hero JSON
            </h2>
            <textarea
              id="paste-textarea-v2"
              rows={10}
              placeholder="Paste hero JSON here..."
              autoFocus
              className="w-full rounded bg-gray-700 border border-gray-600 px-3 py-2 text-xs text-gray-100 font-mono focus:outline-none focus:border-amber-500 resize-none"
            />
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowPasteModal(false)}
                className="rounded bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs px-4 py-1.5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  const ok = await handlePasteSubmit(
                    document.getElementById("paste-textarea-v2").value,
                  );
                  if (ok) setShowPasteModal(false);
                }}
                className="rounded bg-amber-700 hover:bg-amber-600 text-white text-xs px-4 py-1.5 font-bold transition-colors"
              >
                Load
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share warning dialog */}
      {shareWarning && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-amber-700/60 rounded-lg p-6 w-80 space-y-4 shadow-xl">
            <div className="flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <h2 className="text-sm font-bold text-amber-400 uppercase tracking-wider">
                Hero isn&apos;t ready to share
              </h2>
            </div>
            <p className="text-xs text-gray-400">Please fix the following before sharing to the gallery:</p>
            <ul className="space-y-1.5">
              {shareWarning.map((issue, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-gray-200">
                  <span className="text-amber-500 mt-0.5">•</span>
                  {issue}
                </li>
              ))}
            </ul>
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => setShareWarning(null)}
                className="rounded bg-amber-700 hover:bg-amber-600 text-white text-xs px-5 py-1.5 font-bold uppercase tracking-wider transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Gallery modal */}
      {showGallery && (
        <GalleryModal
          onClose={() => setShowGallery(false)}
          onLoadHero={handleLoadFromGallery}
          confirm={confirm}
        />
      )}

      {/* Admin panel */}
      {showAdmin && <AdminPanel onClose={() => setShowAdmin(false)} confirm={confirm} />}

      {/* Confirm dialog */}
      <ConfirmDialog
        confirmState={confirmState}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
}
