import { useState, useEffect, useRef } from "react";
import jsPDF from "jspdf";
import { svgToCanvas } from "./utils/svgToPdfCanvas";
import CrewLeaderBoard from "./components/CrewLeaderBoard";
import CrewLeaderForm from "./components/CrewLeaderForm";
import RecentLeaderRow from "./components/RecentLeaderRow";
import GalleryModal from "./components/GalleryModal";
import AdminPanel from "./components/AdminPanel";
import { validateLeaderData } from "./utils/leaderIO";
import { useLeaderState } from "./hooks/useLeaderState";
import { useFileIO } from "./hooks/useFileIO";
import { useGallery } from "./hooks/useGallery";
import { useConfirm } from "../rtdt/hooks/useConfirm";
import ConfirmDialog from "../rtdt/components/ConfirmDialog";
import { formatTimeAgo } from "../rtdt/utils/timeUtils";
import AppRouteSwitch from "../shared/components/AppRouteSwitch";
import { useSnapshot } from "../shared/hooks/useSnapshot";

const sanitizeFilename = (name) => {
  if (!name || name === "CREW LEADER") return "crew-leader";
  return (
    name
      .trim()
      .replace(/[<>:"/\\|?*]/g, "")
      .replace(/\s+/g, "-")
      .toLowerCase() || "crew-leader"
  );
};

export default function TrvApp() {
  const leaderState = useLeaderState();
  const { leader, updateLeader, updateSlot, isModifiedFromDefault } =
    leaderState;
  const {
    confirmState,
    confirm,
    showAlert,
    showPrompt,
    handleConfirm,
    handleCancel,
  } = useConfirm();

  const [sidebarOpen, setSidebarOpen] = useState(
    () => localStorage.getItem("trv-sidebarOpen") !== "false",
  );
  const [statusMsg, setStatusMsg] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [zoom, setZoom] = useState(1);
  const boardAreaRef = useRef(null);
  const [boardSize, setBoardSize] = useState({ width: 0, height: 0 });

  const BOARD_W = 1027.3709;
  const BOARD_H = 789.92139;
  const ASPECT = BOARD_W / BOARD_H;

  const showStatus = (text, type = "success") => {
    setStatusMsg({ text, type });
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const fileIO = useFileIO({ leaderState, confirm, showPrompt, showStatus });
  const {
    clearFileHandle,
    recents,
    handleSaveJson,
    handleLoadJson,
    handleLoadRecent,
    handleRemoveRecent,
    handleOpenRecentInNewWindow,
    handleClearRecents,
  } = fileIO;

  const {
    submitting,
    shareWarning,
    setShareWarning,
    handleShareToGallery,
    handleLoadFromGallery,
  } = useGallery({ leaderState, clearFileHandle, confirm, showAlert, showStatus });

  const {
    snapshotFlash,
    holding,
    onSnapshotPointerDown,
    onSnapshotPointerUp,
    cancelHold,
  } = useSnapshot({
    subjectName: leader.crewLeaderName,
    svgSelector: "#trv-board-container svg",
    boardW: BOARD_W,
    boardH: BOARD_H,
    filenameFallback: "crew-leader",
    showStatus,
  });

  useEffect(() => {
    localStorage.setItem("trv-sidebarOpen", sidebarOpen);
  }, [sidebarOpen]);

  useEffect(() => {
    const el = boardAreaRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      let w = width;
      let h = w / ASPECT;
      if (h > height) {
        h = height;
        w = h * ASPECT;
      }
      setBoardSize({ width: w, height: h });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [ASPECT]);

  // Detect handoff from "Open in new tab"
  useEffect(() => {
    try {
      const raw = localStorage.getItem("trv-leader-handoff");
      if (!raw) return;
      const handoff = JSON.parse(raw);
      localStorage.removeItem("trv-leader-handoff");
      if (Date.now() - handoff.timestamp > 10_000) return;
      if (handoff.leader) {
        const result = validateLeaderData(handoff.leader);
        if (!result.valid) return;
        clearFileHandle();
        leaderState.replaceLeader(result.leader);
        showStatus(`Opened ${handoff.fileName || "crew leader"} in new tab`);
      }
    } catch {
      localStorage.removeItem("trv-leader-handoff");
    }
  }, []);

  const resetLeader = async () => {
    if (isModifiedFromDefault()) {
      const ok = await confirm({
        title: "Reset Crew Leader",
        message: "You have unsaved changes that will be lost. Reset anyway?",
        confirmLabel: "Reset",
        destructive: true,
      });
      if (!ok) return;
    }
    clearFileHandle();
    leaderState.resetLeader();
    showStatus("Reset to defaults");
  };

  const handleDownloadPdf = async () => {
    setDownloading(true);
    try {
      const svgEl = document.querySelector("#trv-board-container svg");
      if (!svgEl) throw new Error("Board SVG not found");

      const pdfCanvas = await svgToCanvas(svgEl, BOARD_W, BOARD_H, 3);

      const doc = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [BOARD_W, BOARD_H],
      });
      doc.addImage(
        pdfCanvas.toDataURL("image/png"),
        "PNG",
        0,
        0,
        BOARD_W,
        BOARD_H,
      );

      doc.save(`${sanitizeFilename(leader.crewLeaderName)}-crew-leader.pdf`);
      showStatus("PDF downloaded");
    } catch (err) {
      console.error("PDF export failed:", err);
      showStatus("PDF export failed", "error");
    } finally {
      setDownloading(false);
    }
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
              Crew Leader Creator
            </h1>
            <p className="text-xs text-gray-500">
              Thunder Road Vendetta
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
          <div className="flex items-end gap-2">
            <button
              type="button"
              onClick={resetLeader}
              className="text-[10px] px-2 py-0.5 border border-gray-600 rounded text-gray-500 hover:text-red-400 hover:border-red-400 transition-colors"
            >
              Reset
            </button>
            <AppRouteSwitch />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          <CrewLeaderForm
            leader={leader}
            updateLeader={updateLeader}
            updateSlot={updateSlot}
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
              Save
            </button>
            <button
              type="button"
              onClick={handleLoadJson}
              className="rounded bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs py-1.5 uppercase tracking-wider transition-colors"
            >
              Load
            </button>
          </div>
          {recents.length > 0 && (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                  Recent Leaders
                </h3>
                <button
                  type="button"
                  onClick={handleClearRecents}
                  className="w-4 h-4 flex items-center justify-center rounded text-gray-500 hover:text-red-400 hover:bg-gray-600 transition-colors text-xs leading-none"
                  aria-label="Clear all recent leaders"
                  title="Clear all"
                >
                  ×
                </button>
              </div>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {recents.map((entry) => (
                  <RecentLeaderRow
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
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setGalleryOpen(true)}
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
              {submitting ? "Sharing…" : "Share"}
            </button>
          </div>
          {shareWarning && (
            <div className="bg-yellow-900/30 border border-yellow-700/50 rounded p-2 space-y-1">
              <p className="text-[10px] font-bold text-yellow-400 uppercase tracking-wider">
                Before sharing:
              </p>
              {shareWarning.map((issue, i) => (
                <p key={i} className="text-[10px] text-yellow-300">
                  • {issue}
                </p>
              ))}
              <button
                type="button"
                onClick={() => setShareWarning(null)}
                className="text-[10px] text-gray-400 hover:text-gray-200 underline"
              >
                Dismiss
              </button>
            </div>
          )}
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={downloading}
            className="w-full rounded bg-amber-700 hover:bg-amber-600 disabled:bg-gray-700 disabled:text-gray-500 text-white font-bold py-2.5 text-sm uppercase tracking-widest transition-colors"
          >
            {downloading ? "Generating PDF…" : "Download PDF"}
          </button>
        </div>
      </aside>

      {/* Preview panel */}
      <main className="flex-1 flex flex-col bg-gray-950 overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-2 shrink-0">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen((o) => !o)}
              aria-label="Toggle sidebar"
              className="w-7 h-7 flex items-center justify-center rounded bg-gray-800 border border-gray-700 text-gray-400 hover:text-amber-400 hover:border-amber-500 transition-colors text-sm"
            >
              {sidebarOpen ? "\u00AB" : "\u00BB"}
            </button>
            {!sidebarOpen && <AppRouteSwitch />}
            {(leader.author_name || leader.revision_no) && (
              <span className="text-xs text-gray-400">
                {leader.author_name && (
                  <>
                    Designed by:{" "}
                    <span className="text-amber-200 font-semibold">
                      {leader.author_name}
                    </span>
                  </>
                )}
                {leader.author_name && leader.revision_no && (
                  <span className="mx-1.5 text-gray-600">·</span>
                )}
                {leader.revision_no && (
                  <span className="font-mono text-gray-300">
                    {leader.revision_no}
                  </span>
                )}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
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

            {/* Camera snapshot button */}
            <button
              type="button"
              onPointerDown={onSnapshotPointerDown}
              onPointerUp={onSnapshotPointerUp}
              onPointerLeave={cancelHold}
              onPointerCancel={cancelHold}
              disabled={downloading}
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

        {/* Board area */}
        <div
          ref={boardAreaRef}
          className="flex-1 overflow-auto grid justify-items-center items-start px-8 pt-2 pb-8"
        >
          <div
            id="trv-board-container"
            className="shadow-2xl"
            style={{
              width: boardSize.width * zoom,
              height: boardSize.height * zoom,
            }}
          >
            <CrewLeaderBoard leader={leader} />
          </div>
        </div>
      </main>

      {galleryOpen && (
        <GalleryModal
          onClose={() => setGalleryOpen(false)}
          onLoadLeader={handleLoadFromGallery}
          confirm={confirm}
        />
      )}

      {showAdmin && (
        <AdminPanel onClose={() => setShowAdmin(false)} confirm={confirm} />
      )}

      {confirmState && (
        <ConfirmDialog
          confirmState={confirmState}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}
