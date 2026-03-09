import { useState, useRef, useCallback, useEffect } from "react";
import jsPDF from "jspdf";
import { svg2pdf } from "svg2pdf.js";
import coverBg from "../assets/rtdt_cover2.jpg";

const sanitizeFilename = (name) => {
  if (!name || name === "HERO NAME") return "hero";
  const sanitized = name
    .trim()
    .replace(/[<>:"/\\|?*]/g, "")
    .replace(/\s+/g, "-")
    .toLowerCase();
  return sanitized || "hero";
};

const rasterizeSvgImage = (imgEl) =>
  new Promise((resolve, reject) => {
    const href =
      imgEl.getAttribute("href") ||
      imgEl.getAttributeNS("http://www.w3.org/1999/xlink", "href");
    if (!href || href.startsWith("data:")) {
      resolve(null);
      return;
    }
    const w = parseFloat(imgEl.getAttribute("width")) || 1213;
    const h = parseFloat(imgEl.getAttribute("height")) || 808;
    const scale = 3;
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
  await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
};

const downloadBlob = (blob, filename) => {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
};

export function useExport({ hero, showAlert, showStatus }) {
  const [downloading, setDownloading] = useState(false);
  const [snapshotFlash, setSnapshotFlash] = useState(false);
  const [holding, setHolding] = useState(false);
  const holdTimerRef = useRef(null);
  const holdEligibleRef = useRef(false);
  const holdBusyRef = useRef(false);

  const handleDownloadPdf = async () => {
    setDownloading(true);
    try {
      const svgEl = document.querySelector("#hero-board-container svg");

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

      const imagesAfter = svgEl.querySelectorAll("image");
      imagesAfter.forEach((imgEl, i) => {
        if (origHrefs[i]) imgEl.setAttribute("href", origHrefs[i]);
      });

      // Page 2 — back side
      doc.addPage([1213, 808], "landscape");

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
        drawW = 1213;
        drawH = 1213 / imgRatio;
      } else {
        drawH = 808;
        drawW = 808 * imgRatio;
      }
      const drawX = (1213 - drawW) / 2;
      const drawY = (808 - drawH) / 2;

      doc.setFillColor(0, 0, 0);
      doc.rect(0, 0, 1213, 808, "F");
      doc.addImage(coverDataUrl, "JPEG", drawX, drawY, drawW, drawH);

      doc.setGState(new doc.GState({ opacity: 0.5 }));
      doc.setFillColor(0, 0, 0);
      doc.rect(0, 0, 1213, 808, "F");
      doc.setGState(new doc.GState({ opacity: 1 }));

      doc.setFont("helvetica", "bold");
      doc.setFontSize(28);
      doc.setTextColor(252, 211, 77);
      doc.text("Return to Dark Tower Hero Board Creator", 1213 / 2, 120, {
        align: "center",
      });

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

        let boxH = 60;
        if (hero.author_name) boxH += 30;
        if (hero.revision_no) boxH += 26;
        if (hero.contact) boxH += 26;
        if (hero.description) {
          const descLines = doc.splitTextToSize(hero.description, boxW - 60);
          boxH += 20 + descLines.length * 18;
        }

        doc.setGState(new doc.GState({ opacity: 0.5 }));
        doc.setFillColor(161, 98, 7);
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
      showAlert({
        title: "PDF Export Failed",
        message: "PDF export failed. Please try again.",
      });
    } finally {
      setDownloading(false);
    }
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
      showStatus(
        copied
          ? "Copied & downloaded"
          : "Downloaded as PNG (clipboard unavailable)",
      );
    } catch (err) {
      console.error("Snapshot failed:", err);
      showStatus("Snapshot failed", "error");
    }
  };

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
    action.finally(() => {
      holdBusyRef.current = false;
    });
  }, [cancelHold]);

  useEffect(() => {
    window.addEventListener("blur", cancelHold);
    return () => window.removeEventListener("blur", cancelHold);
  }, [cancelHold]);

  return {
    downloading,
    snapshotFlash,
    holding,
    handleDownloadPdf,
    onSnapshotPointerDown,
    onSnapshotPointerUp,
    cancelHold,
  };
}
