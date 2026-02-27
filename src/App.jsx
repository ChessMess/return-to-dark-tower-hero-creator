import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import { svg2pdf } from "svg2pdf.js";
import HeroCard from "./components/HeroCard";
import HeroForm from "./components/HeroForm";
import { defaultHero } from "./data/defaultHero";
import { validateHeroData, heroToJson } from "./utils/heroIO";

const STORAGE_KEY = "rtdt-hero";

function loadHero() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return defaultHero;
    const data = JSON.parse(saved);
    const result = validateHeroData(data);
    return result.valid ? result.hero : defaultHero;
  } catch {
    return defaultHero;
  }
}

function persist(hero) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(hero));
  } catch {}
}

export default function App() {
  const [hero, setHero] = useState(loadHero);
  const [downloading, setDownloading] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(
    () => localStorage.getItem("sidebarOpen") !== "false",
  );

  useEffect(() => {
    localStorage.setItem("sidebarOpen", sidebarOpen);
  }, [sidebarOpen]);
  const [showPasteModal, setShowPasteModal] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [contactCopied, setContactCopied] = useState(false);

  const showStatus = (text, type = "success") => {
    setStatusMsg({ text, type });
    setTimeout(() => setStatusMsg(null), 3000);
  };

  // Card flip state
  const [isFlipped, setIsFlipped] = useState(false);

  const updateHero = (field, value) =>
    setHero((prev) => {
      const next = { ...prev, [field]: value };
      persist(next);
      return next;
    });

  const updateVirtue = (index, field, value) =>
    setHero((prev) => {
      const virtues = [...prev.virtues];
      virtues[index] = { ...virtues[index], [field]: value };
      const next = { ...prev, virtues };
      persist(next);
      return next;
    });

  const resetHero = () => {
    localStorage.removeItem(STORAGE_KEY);
    setHero(defaultHero);
  };

  const handleDownloadPdf = async () => {
    setDownloading(true);
    try {
      const svgEl = document.querySelector("#hero-card-container svg");
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [910, 606],
      });
      await svg2pdf(svgEl, doc, { x: 0, y: 0, width: 910, height: 606 });
      const filename =
        hero.name && hero.name !== "HERO NAME"
          ? `${hero.name.toLowerCase().replace(/\s+/g, "-")}-hero-card.pdf`
          : "hero-card.pdf";
      doc.save(filename);
    } catch (err) {
      console.error("PDF export failed:", err);
      alert("PDF export failed. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const handleSaveJson = () => {
    const defaultName =
      hero.name && hero.name !== "HERO NAME"
        ? hero.name.toLowerCase().replace(/\s+/g, "-")
        : "hero";
    const filename = prompt("File name:", defaultName);
    if (!filename) return;
    const json = heroToJson(hero);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename.endsWith(".json") ? filename : `${filename}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showStatus("Hero saved to file");
  };

  const handleLoadJson = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json,application/json";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const data = JSON.parse(evt.target.result);
          const result = validateHeroData(data);
          if (result.valid) {
            setHero(result.hero);
            persist(result.hero);
            showStatus("Hero loaded from file");
          } else {
            showStatus(result.error, "error");
          }
        } catch {
          showStatus("Invalid JSON file", "error");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(heroToJson(hero));
      showStatus("Hero copied to clipboard");
    } catch {
      showStatus("Copy failed — check browser permissions", "error");
    }
  };

  const handlePasteSubmit = (text) => {
    try {
      const data = JSON.parse(text);
      const result = validateHeroData(data);
      if (result.valid) {
        setHero(result.hero);
        persist(result.hero);
        setShowPasteModal(false);
        showStatus("Hero pasted successfully");
      } else {
        showStatus(result.error, "error");
      }
    } catch {
      showStatus("Invalid JSON — check the pasted text", "error");
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
      {/* Editor panel */}
      <aside
        className={`flex flex-col bg-gray-800 border-r border-gray-700 overflow-hidden transition-all duration-300 ${sidebarOpen ? "w-80" : "w-0 border-r-0"}`}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-700 bg-gray-900 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-sm font-bold text-amber-400 tracking-wider uppercase">
              Hero Creator
            </h1>
            <p className="text-xs text-gray-500">Return to Dark Tower</p>
          </div>
          <button
            type="button"
            onClick={resetHero}
            className="text-xs text-gray-500 hover:text-red-400 transition-colors"
          >
            Reset
          </button>
        </div>

        {/* Form scroll area */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <HeroForm
            hero={hero}
            updateHero={updateHero}
            updateVirtue={updateVirtue}
          />
        </div>

        {/* Action buttons */}
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
      <main className="flex-1 overflow-auto bg-gray-950 flex items-center justify-center p-8 relative">
        <button
          type="button"
          onClick={() => setSidebarOpen((o) => !o)}
          aria-label="Toggle sidebar"
          aria-expanded={sidebarOpen}
          className="absolute top-4 left-4 z-20 w-7 h-7 flex items-center justify-center rounded bg-gray-800 border border-gray-700 text-gray-400 hover:text-amber-400 hover:border-amber-500 transition-colors text-sm"
        >
          {sidebarOpen ? "\u00AB" : "\u00BB"}
        </button>

        {/* Flip button */}
        <button
          type="button"
          onClick={() => setIsFlipped((f) => !f)}
          className="absolute top-4 right-4 z-20 h-7 min-w-[128px] flex items-center justify-center rounded bg-amber-700 border border-amber-800 text-white font-bold text-xs uppercase tracking-widest shadow transition-colors"
        >
          {isFlipped ? "Show Front" : "Show Back"}
        </button>

        {/* Card flip container */}
        <div
          className="relative w-[910px] h-[606px] [perspective:2000px] shadow-2xl"
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: "center center",
          }}
        >
          <div
            className="absolute inset-0 w-full h-full transition-transform duration-700 [transform-style:preserve-3d]"
            style={{ transform: `rotateY(${isFlipped ? 180 : 0}deg)` }}
          >
            {/* Front face */}
            <div
              id="hero-card-container"
              className="absolute inset-0 w-full h-full [backface-visibility:hidden]"
              style={{ zIndex: 2 }}
            >
              <HeroCard hero={hero} />
            </div>
            {/* Back face */}
            <div
              className="absolute inset-0 w-[910px] h-[606px] flex flex-col items-center justify-center [backface-visibility:hidden] rotate-y-180"
              style={{
                backgroundImage:
                  "url('/return-to-dark-tower-hero-creator/hero_thanks_bg.jpeg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                zIndex: 1,
              }}
            >
              {/* Overlay for readability */}
              <div className="absolute inset-0 w-[910px] h-[606px] bg-black/60" />
              <div className="relative z-10 flex flex-col items-center justify-center text-center w-full h-full">
                <h2 className="text-3xl font-bold text-amber-300 drop-shadow mb-4 mt-16">
                  Return to Dark Tower Hero Creator
                </h2>
                {hero.author_name ||
                hero.revision_no ||
                hero.contact ||
                hero.description ? (
                  <div className="bg-gray-900/70 rounded-3xl px-8 py-6 shadow-lg w-[93%] mx-auto">
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
                        Version:{" "}
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

        {/* Zoom controls */}
        <div className="absolute bottom-4 right-4 flex items-center gap-1 bg-gray-800/80 border border-gray-700 rounded-lg px-1 py-0">
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
            onClick={() => setZoom((z) => Math.min(3, +(z + 0.25).toFixed(2)))}
            className="px-2 py-1 flex items-center justify-center rounded text-gray-300 hover:bg-gray-700 text-xs font-bold transition-colors"
          >
            +
          </button>
        </div>
      </main>

      {/* Paste modal */}
      {showPasteModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 w-96 space-y-3">
            <h2 className="text-sm font-bold text-amber-400 uppercase tracking-wider">
              Paste Hero JSON
            </h2>
            <textarea
              id="paste-textarea"
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
                onClick={() =>
                  handlePasteSubmit(
                    document.getElementById("paste-textarea").value,
                  )
                }
                className="rounded bg-amber-700 hover:bg-amber-600 text-white text-xs px-4 py-1.5 font-bold transition-colors"
              >
                Load
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
