import { useState, useEffect, useRef, useCallback } from "react";
import jsPDF from "jspdf";
import { svg2pdf } from "svg2pdf.js";
import HeroBoard from "./components/HeroBoard";
import HeroForm from "./components/HeroForm";
import {
  defaultHero,
  MAX_VIRTUES,
  createEmptyVirtue,
} from "./data/defaultHero";
import {
  loadHero,
  saveHero,
  getStorageBytes,
  validateHeroData,
  heroToJson,
  loadRecents,
  addToRecents,
  removeFromRecents,
  clearAllRecents,
  loadHeroFromHandle,
} from "./utils/heroIO";
import coverBg from "./assets/rtdt_cover2.jpg";

export default function V2App() {
  const [hero, setHero] = useState(loadHero);
  const [portraitQuality, setPortraitQuality] = useState(1.0);
  const [storageWarning, setStorageWarning] = useState(null);
  const [storageBytes, setStorageBytes] = useState(() => getStorageBytes());
  const [downloading, setDownloading] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(
    () => localStorage.getItem("v2-sidebarOpen") !== "false",
  );
  const [showPasteModal, setShowPasteModal] = useState(false);
  const [recents, setRecents] = useState([]);
  const fileHandleRef = useRef(null);
  const savedHeroRef = useRef(JSON.stringify(loadHero()));
  const [zoom, setZoom] = useState(1);
  const [isFlipped, setIsFlipped] = useState(false);
  const [snapshotFlash, setSnapshotFlash] = useState(false);
  const [cardSize, setCardSize] = useState({ width: 0, height: 0 });
  const cardAreaRef = useRef(null);

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

  useEffect(() => {
    loadRecents().then(setRecents);
  }, []);

  const markSaved = (h) => {
    savedHeroRef.current = JSON.stringify(h);
  };

  const hasUnsavedChanges = () => {
    return JSON.stringify(hero) !== savedHeroRef.current;
  };

  const showStatus = (text, type = "success") => {
    setStatusMsg({ text, type });
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const saveAndCheck = (next) => {
    saveHero(next);
    const bytes = getStorageBytes();
    setStorageBytes(bytes);
    if (bytes > 4_500_000) setStorageWarning("danger");
    else if (bytes > 3_000_000) setStorageWarning("warn");
    else setStorageWarning(null);
  };

  const updateHero = (field, value) =>
    setHero((prev) => {
      const next = { ...prev, [field]: value };
      saveAndCheck(next);
      return next;
    });

  const updateVirtue = (index, field, value) =>
    setHero((prev) => {
      const virtues = [...prev.virtues];
      virtues[index] = { ...virtues[index], [field]: value };
      const next = { ...prev, virtues };
      saveAndCheck(next);
      return next;
    });

  const addVirtue = () =>
    setHero((prev) => {
      if (prev.virtues.length >= MAX_VIRTUES) return prev;
      const next = {
        ...prev,
        virtues: [
          ...prev.virtues,
          createEmptyVirtue(`VIRTUE ${prev.virtues.length + 1}`),
        ],
      };
      saveAndCheck(next);
      return next;
    });

  const removeVirtue = (index) =>
    setHero((prev) => {
      const virtues = prev.virtues.filter((_, i) => i !== index);
      const next = { ...prev, virtues };
      saveAndCheck(next);
      return next;
    });

  const reorderVirtues = (from, to) =>
    setHero((prev) => {
      const virtues = [...prev.virtues];
      const [moved] = virtues.splice(from, 1);
      virtues.splice(to, 0, moved);
      const next = { ...prev, virtues };
      saveAndCheck(next);
      return next;
    });

  const hasChanges = () => JSON.stringify(hero) !== JSON.stringify(defaultHero);

  const resetHero = () => {
    if (
      hasChanges() &&
      !window.confirm(
        "You have unsaved changes that will be lost. Reset anyway?",
      )
    )
      return;
    localStorage.removeItem("rtdt-hero-v2");
    setHero({
      ...defaultHero,
      virtues: defaultHero.virtues.map((v) => ({ ...v })),
    });
  };

  // Rasterize an SVG <image> element to a high-res PNG data URL
  const rasterizeSvgImage = (imgEl) =>
    new Promise((resolve, reject) => {
      const href =
        imgEl.getAttribute("href") ||
        imgEl.getAttributeNS("http://www.w3.org/1999/xlink", "href");
      if (!href || href.startsWith("data:")) {
        resolve(null); // already a data URL or no href — skip
        return;
      }
      const w = parseFloat(imgEl.getAttribute("width")) || 1213;
      const h = parseFloat(imgEl.getAttribute("height")) || 808;
      const scale = 3; // 3x for high-res PDF output
      const canvas = document.createElement("canvas");
      canvas.width = w * scale;
      canvas.height = h * scale;
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/png"));
      };
      img.onerror = () => reject(new Error(`Failed to rasterize: ${href}`));
      img.src = href;
    });

  const loadImageAsDataUrl = (src) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        canvas.getContext("2d").drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/jpeg", 0.92));
      };
      img.onerror = reject;
      img.src = src;
    });

  const handleDownloadPdf = async () => {
    setDownloading(true);
    try {
      const svgEl = document.querySelector("#hero-board-container svg");

      // Rasterize external SVG <image> elements so svg2pdf can handle them
      const images = svgEl.querySelectorAll("image");
      const origHrefs = [];
      for (const imgEl of images) {
        const href = imgEl.getAttribute("href") || "";
        origHrefs.push(href);
        if (href && !href.startsWith("data:")) {
          try {
            const dataUrl = await rasterizeSvgImage(imgEl);
            if (dataUrl) imgEl.setAttribute("href", dataUrl);
          } catch (e) {
            console.warn("Could not rasterize image for PDF:", e);
          }
        }
      }

      const doc = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [1213, 808],
      });
      await svg2pdf(svgEl, doc, { x: 0, y: 0, width: 1213, height: 808 });

      // Restore original hrefs so the live preview stays SVG-based
      const imagesAfter = svgEl.querySelectorAll("image");
      imagesAfter.forEach((imgEl, i) => {
        if (origHrefs[i]) imgEl.setAttribute("href", origHrefs[i]);
      });

      // Page 2 — back side
      doc.addPage([1213, 808], "landscape");

      // Background cover image — centered, maintaining aspect ratio
      const coverDataUrl = await loadImageAsDataUrl(coverBg);
      const coverImg = await new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.src = coverDataUrl;
      });
      const imgRatio = coverImg.naturalWidth / coverImg.naturalHeight;
      const pageRatio = 1213 / 808;
      let drawW, drawH;
      if (imgRatio > pageRatio) {
        // Image is wider — fit to width, center vertically
        drawW = 1213;
        drawH = 1213 / imgRatio;
      } else {
        // Image is taller — fit to height, center horizontally
        drawH = 808;
        drawW = 808 * imgRatio;
      }
      const drawX = (1213 - drawW) / 2;
      const drawY = (808 - drawH) / 2;

      // Fill page with black first so letterbox areas aren't white
      doc.setFillColor(0, 0, 0);
      doc.rect(0, 0, 1213, 808, "F");
      doc.addImage(coverDataUrl, "JPEG", drawX, drawY, drawW, drawH);

      // Dark overlay
      doc.setGState(new doc.GState({ opacity: 0.5 }));
      doc.setFillColor(0, 0, 0);
      doc.rect(0, 0, 1213, 808, "F");
      doc.setGState(new doc.GState({ opacity: 1 }));

      // Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(28);
      doc.setTextColor(252, 211, 77);
      doc.text("Return to Dark Tower Hero Board Creator", 1213 / 2, 120, {
        align: "center",
      });

      // Author info
      const hasInfo =
        hero.author_name ||
        hero.revision_no ||
        hero.contact ||
        hero.description;
      if (hasInfo) {
        const boxX = 1213 * 0.035;
        const boxW = 1213 * 0.93;
        const boxY = 160;
        let textY = boxY + 40;

        // Measure box height based on filled fields
        let boxH = 60; // padding top + bottom
        if (hero.author_name) boxH += 30;
        if (hero.revision_no) boxH += 26;
        if (hero.contact) boxH += 26;
        if (hero.description) {
          const descLines = doc.splitTextToSize(hero.description, boxW - 60);
          boxH += 20 + descLines.length * 18;
        }

        // Gold-tinted box background
        doc.setGState(new doc.GState({ opacity: 0.5 }));
        doc.setFillColor(161, 98, 7); // yellow-700
        doc.roundedRect(boxX, boxY, boxW, boxH, 24, 24, "F");
        doc.setGState(new doc.GState({ opacity: 1 }));

        const labelX = boxX + 30;

        const centerX = 1213 / 2;

        if (hero.author_name) {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(16);
          doc.setTextColor(243, 244, 246);
          const label = "Designed by: ";
          const labelW = doc.getTextWidth(label);
          doc.setTextColor(253, 230, 138);
          const nameW = doc.getTextWidth(hero.author_name);
          const totalW = labelW + nameW;
          const startX = centerX - totalW / 2;
          doc.setTextColor(243, 244, 246);
          doc.text(label, startX, textY);
          doc.setTextColor(253, 230, 138);
          doc.text(hero.author_name, startX + labelW, textY);
          textY += 30;
        }
        if (hero.revision_no) {
          doc.setFont("helvetica", "normal");
          doc.setFontSize(14);
          doc.setTextColor(209, 213, 219);
          const label = "Hero Version: ";
          const labelW = doc.getTextWidth(label);
          doc.setFont("courier", "normal");
          const valW = doc.getTextWidth(hero.revision_no);
          const totalW = labelW + valW;
          const startX = centerX - totalW / 2;
          doc.setFont("helvetica", "normal");
          doc.text(label, startX, textY);
          doc.setFont("courier", "normal");
          doc.text(hero.revision_no, startX + labelW, textY);
          textY += 26;
        }
        if (hero.contact) {
          doc.setFont("helvetica", "normal");
          doc.setFontSize(14);
          doc.setTextColor(209, 213, 219);
          doc.text("Contact: ", labelX, textY);
          const labelW = doc.getTextWidth("Contact: ");
          doc.setFont("courier", "normal");
          doc.text(hero.contact, labelX + labelW, textY);
          textY += 26;
        }
        if (hero.description) {
          doc.setFont("helvetica", "normal");
          doc.setFontSize(14);
          doc.setTextColor(229, 231, 235);
          textY += 10;
          const descLines = doc.splitTextToSize(hero.description, boxW - 60);
          doc.text(descLines, labelX, textY);
        }
      }

      const filename =
        hero.name && hero.name !== "HERO NAME"
          ? `${hero.name.toLowerCase().replace(/\s+/g, "-")}-hero-board.pdf`
          : "hero-board.pdf";
      doc.save(filename);
    } catch (err) {
      console.error("PDF export failed:", err);
      alert("PDF export failed. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const writeToFileHandle = async (handle, json) => {
    const writable = await handle.createWritable();
    await writable.write(json);
    await writable.close();
  };

  const handleSaveJson = async () => {
    const json = heroToJson(hero);

    // If we already have a file handle, write directly to it
    if (fileHandleRef.current) {
      try {
        await writeToFileHandle(fileHandleRef.current, json);
        markSaved(hero);
        showStatus(`Saved to ${fileHandleRef.current.name}`);
        setRecents(await addToRecents(fileHandleRef.current, hero));
        return;
      } catch {
        // Permission revoked or handle stale — fall through to picker/download
        fileHandleRef.current = null;
      }
    }

    // Try File System Access API (Chrome/Edge)
    if (window.showSaveFilePicker) {
      const defaultName =
        hero.name && hero.name !== "HERO NAME"
          ? hero.name.toLowerCase().replace(/\s+/g, "-")
          : "hero";
      try {
        const handle = await window.showSaveFilePicker({
          suggestedName: `${defaultName}.json`,
          types: [
            {
              description: "JSON file",
              accept: { "application/json": [".json"] },
            },
          ],
        });
        await writeToFileHandle(handle, json);
        fileHandleRef.current = handle;
        markSaved(hero);
        showStatus(`Saved to ${handle.name}`);
        setRecents(await addToRecents(handle, hero));
        return;
      } catch (err) {
        if (err.name === "AbortError") return; // user cancelled picker
        // Fall through to legacy download
      }
    }

    // Fallback: legacy download (no recents — no file handle available)
    const defaultName =
      hero.name && hero.name !== "HERO NAME"
        ? hero.name.toLowerCase().replace(/\s+/g, "-")
        : "hero";
    const filename = prompt("File name:", defaultName);
    if (!filename) return;
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename.endsWith(".json") ? filename : `${filename}.json`;
    a.click();
    URL.revokeObjectURL(url);
    markSaved(hero);
    showStatus("Hero saved to file");
  };

  const handleLoadJson = async () => {
    // Try File System Access API (Chrome/Edge)
    if (window.showOpenFilePicker) {
      try {
        const [handle] = await window.showOpenFilePicker({
          types: [
            {
              description: "JSON file",
              accept: { "application/json": [".json"] },
            },
          ],
        });
        const file = await handle.getFile();
        const text = await file.text();
        const data = JSON.parse(text);
        const result = validateHeroData(data);
        if (result.valid) {
          fileHandleRef.current = handle;
          setHero(result.hero);
          saveAndCheck(result.hero);
          markSaved(result.hero);
          showStatus(`Loaded from ${handle.name}`);
          setRecents(await addToRecents(handle, result.hero));
        } else {
          showStatus(result.error, "error");
        }
        return;
      } catch (err) {
        if (err.name === "AbortError") return;
        if (err instanceof SyntaxError) {
          showStatus("Invalid JSON file", "error");
          return;
        }
        // Fall through to legacy file input
      }
    }

    // Fallback: legacy file input
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
            saveAndCheck(result.hero);
            markSaved(result.hero);
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

  const sanitizeFilename = (name) => {
    if (!name || name === "HERO NAME") return "hero";
    const sanitized = name
      .trim()
      .replace(/[<>:"/\\|?*]/g, "")
      .replace(/\s+/g, "-")
      .toLowerCase();
    return sanitized || "hero";
  };

  const renderBoardPngBlob = () =>
    new Promise(async (resolve, reject) => {
      try {
        const svgEl = document.querySelector("#hero-board-container svg");
        if (!svgEl) return reject(new Error("No SVG element found"));

        const clone = svgEl.cloneNode(true);
        const images = clone.querySelectorAll("image");
        for (const imgEl of images) {
          const href = imgEl.getAttribute("href") || "";
          if (href && !href.startsWith("data:")) {
            try {
              const dataUrl = await rasterizeSvgImage(imgEl);
              if (dataUrl) imgEl.setAttribute("href", dataUrl);
            } catch (e) {
              console.warn("Could not rasterize image for snapshot:", e);
            }
          }
        }

        const svgString = new XMLSerializer().serializeToString(clone);
        const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(blob);

        const canvas = document.createElement("canvas");
        canvas.width = 1213;
        canvas.height = 808;
        const ctx = canvas.getContext("2d");

        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0, 1213, 808);
          URL.revokeObjectURL(url);
          canvas.toBlob((pngBlob) => resolve(pngBlob), "image/png");
        };
        img.onerror = () => {
          URL.revokeObjectURL(url);
          reject(new Error("Could not render board"));
        };
        img.src = url;
      } catch (err) {
        reject(err);
      }
    });

  const copyBlobToClipboard = async (blob) => {
    await navigator.clipboard.write([
      new ClipboardItem({ "image/png": blob }),
    ]);
  };

  const downloadBlob = (blob, filename) => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  // Click: clipboard copy (fallback to download)
  const handleSnapshot = async () => {
    try {
      const pngBlob = await renderBoardPngBlob();
      const filename = `${sanitizeFilename(hero.name)}.png`;
      try {
        await copyBlobToClipboard(pngBlob);
        setSnapshotFlash(true);
        setTimeout(() => setSnapshotFlash(false), 600);
        showStatus("Image copied to clipboard");
      } catch {
        downloadBlob(pngBlob, filename);
        showStatus("Downloaded as PNG (clipboard unavailable)");
      }
    } catch (err) {
      console.error("Snapshot failed:", err);
      showStatus("Snapshot failed", "error");
    }
  };

  // Long press: clipboard copy + download
  const handleSnapshotCombo = async () => {
    try {
      const pngBlob = await renderBoardPngBlob();
      const filename = `${sanitizeFilename(hero.name)}.png`;
      let copied = false;
      try {
        await copyBlobToClipboard(pngBlob);
        copied = true;
      } catch {
        // clipboard unavailable — download will still happen
      }
      downloadBlob(pngBlob, filename);
      setSnapshotFlash(true);
      setTimeout(() => setSnapshotFlash(false), 600);
      showStatus(copied ? "Copied & downloaded" : "Downloaded as PNG (clipboard unavailable)");
    } catch (err) {
      console.error("Snapshot failed:", err);
      showStatus("Snapshot failed", "error");
    }
  };

  // Long-press refs
  const holdTimerRef = useRef(null);
  const holdEligibleRef = useRef(false);
  const holdBusyRef = useRef(false);
  const [holding, setHolding] = useState(false);

  const cancelHold = useCallback(() => {
    clearTimeout(holdTimerRef.current);
    holdTimerRef.current = null;
    holdEligibleRef.current = false;
    setHolding(false);
  }, []);

  const onSnapshotPointerDown = useCallback((e) => {
    if (holdBusyRef.current) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    holdEligibleRef.current = false;
    holdTimerRef.current = setTimeout(() => {
      holdEligibleRef.current = true;
      setHolding(true);
    }, 3000);
  }, []);

  const onSnapshotPointerUp = useCallback(() => {
    if (holdBusyRef.current) return;
    const wasEligible = holdEligibleRef.current;
    cancelHold();
    holdBusyRef.current = true;
    const action = wasEligible ? handleSnapshotCombo() : handleSnapshot();
    action.finally(() => { holdBusyRef.current = false; });
  }, [cancelHold]);

  // Cancel hold on window blur
  useEffect(() => {
    window.addEventListener("blur", cancelHold);
    return () => window.removeEventListener("blur", cancelHold);
  }, [cancelHold]);

  const handlePasteSubmit = (text) => {
    try {
      const data = JSON.parse(text);
      const result = validateHeroData(data);
      if (result.valid) {
        setHero(result.hero);
        saveAndCheck(result.hero);
        markSaved(result.hero);
        setShowPasteModal(false);
        showStatus("Hero pasted successfully");
      } else {
        showStatus(result.error, "error");
      }
    } catch {
      showStatus("Invalid JSON — check the pasted text", "error");
    }
  };

  const handleLoadRecent = async (entry) => {
    if (
      hasUnsavedChanges() &&
      !window.confirm(`Load "${entry.heroName || entry.fileName}"?\nCurrent unsaved changes will be lost.`)
    )
      return;
    try {
      const data = await loadHeroFromHandle(entry.handle);
      const result = validateHeroData(data);
      if (result.valid) {
        fileHandleRef.current = entry.handle;
        setHero(result.hero);
        saveAndCheck(result.hero);
        markSaved(result.hero);
        showStatus(`Loaded from ${entry.fileName}`);
      } else {
        showStatus(result.error, "error");
      }
    } catch {
      showStatus("File could not be found", "error");
      setRecents(await removeFromRecents(entry.id));
    }
  };

  const handleRemoveRecent = async (e, id) => {
    e.stopPropagation();
    setRecents(await removeFromRecents(id));
  };

  const handleClearRecents = async () => {
    setRecents(await clearAllRecents());
  };

  function formatTimeAgo(ts) {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  }

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
            <p className="text-xs text-gray-500">Return to Dark Tower</p>
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
            updateHero={updateHero}
            updateVirtue={updateVirtue}
            addVirtue={addVirtue}
            removeVirtue={removeVirtue}
            reorderVirtues={reorderVirtues}
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
                  <div
                    key={entry.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleLoadRecent(entry)}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleLoadRecent(entry); } }}
                    className="w-full text-left rounded bg-gray-700/50 hover:bg-gray-700 px-2 py-1 transition-colors group relative cursor-pointer"
                  >
                    <button
                      type="button"
                      onClick={(e) => handleRemoveRecent(e, entry.id)}
                      className="absolute top-0.5 right-1 w-4 h-4 flex items-center justify-center rounded text-gray-500 hover:text-red-400 hover:bg-gray-600 transition-colors text-xs"
                      aria-label={`Remove ${entry.fileName} from recents`}
                      title="Remove"
                    >
                      ×
                    </button>
                    <div className="flex items-center justify-between pr-4">
                      <span className="text-xs text-amber-300 font-bold truncate">
                        {entry.heroName || entry.fileName}
                      </span>
                      <span className="text-[10px] text-gray-500 shrink-0 ml-2">
                        {formatTimeAgo(entry.savedAt)}
                      </span>
                    </div>
                    <div className="text-[10px] text-gray-400 truncate">
                      {entry.author_name && `by ${entry.author_name}`}
                      {entry.author_name && entry.revision_no && " · "}
                      {entry.revision_no && `v${entry.revision_no}`}
                      {(entry.author_name || entry.revision_no) && " · "}
                      {entry.virtueCount} virtues
                    </div>
                  </div>
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
                    v{hero.revision_no}
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
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                <path fillRule="evenodd" d="M1 8a2 2 0 0 1 2-2h.93a2 2 0 0 0 1.664-.89l.812-1.22A2 2 0 0 1 8.07 3h3.86a2 2 0 0 1 1.664.89l.812 1.22A2 2 0 0 0 16.07 6H17a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8Zm13.5 3a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM10 14a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" />
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
                <HeroBoard hero={hero} />
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
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 w-96 space-y-3">
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
                onClick={() =>
                  handlePasteSubmit(
                    document.getElementById("paste-textarea-v2").value,
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
