import { useState, useRef, useCallback, useEffect } from "react";

// Increase for higher-res clipboard/download output (e.g. 3 = 3×, 1 = native)
const SNAPSHOT_SCALE = 2;

const sanitizeFilename = (name, fallback = "subject") => {
  if (!name) return fallback;
  const sanitized = name
    .trim()
    .replace(/[<>:"/\\|?*]/g, "")
    .replace(/\s+/g, "-")
    .toLowerCase();
  return sanitized || fallback;
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
    const w = parseFloat(imgEl.getAttribute("width")) || 100;
    const h = parseFloat(imgEl.getAttribute("height")) || 100;
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

const renderBoardPngBlob = async ({ svgSelector, boardW, boardH }) => {
  const svgEl = document.querySelector(svgSelector);
  if (!svgEl) throw new Error(`No SVG element found at "${svgSelector}"`);

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
  canvas.width = boardW * SNAPSHOT_SCALE;
  canvas.height = boardH * SNAPSHOT_SCALE;
  const ctx = canvas.getContext("2d");

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, boardW * SNAPSHOT_SCALE, boardH * SNAPSHOT_SCALE);
      URL.revokeObjectURL(url);
      canvas.toBlob(resolve, "image/png");
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not render board"));
    };
    img.src = url;
  });
};

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

const captureSnapshot = async (
  name,
  {
    svgSelector,
    boardW,
    boardH,
    download = false,
    filenameFallback = "subject",
  } = {},
) => {
  const pngBlob = await renderBoardPngBlob({ svgSelector, boardW, boardH });
  const filename = `${sanitizeFilename(name, filenameFallback)}.png`;
  let copied = false;
  try {
    await copyBlobToClipboard(pngBlob);
    copied = true;
  } catch {
    if (!download) downloadBlob(pngBlob, filename);
  }
  if (download) downloadBlob(pngBlob, filename);
  return { copied, filename };
};

export function useSnapshot({
  subjectName,
  svgSelector,
  boardW,
  boardH,
  filenameFallback = "subject",
  showStatus,
}) {
  const [snapshotFlash, setSnapshotFlash] = useState(false);
  const [holding, setHolding] = useState(false);
  const holdTimerRef = useRef(null);
  const holdEligibleRef = useRef(false);
  const holdBusyRef = useRef(false);
  const subjectNameRef = useRef(subjectName);
  const showStatusRef = useRef(showStatus);

  useEffect(() => {
    subjectNameRef.current = subjectName;
  }, [subjectName]);

  useEffect(() => {
    showStatusRef.current = showStatus;
  }, [showStatus]);

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
    captureSnapshot(subjectNameRef.current, {
      svgSelector,
      boardW,
      boardH,
      download: wasEligible,
      filenameFallback,
    })
      .then(({ copied }) => {
        setSnapshotFlash(true);
        setTimeout(() => setSnapshotFlash(false), 600);
        showStatusRef.current(
          wasEligible
            ? copied
              ? "Copied & downloaded"
              : "Downloaded as PNG (clipboard unavailable)"
            : copied
              ? "Image copied to clipboard"
              : "Downloaded as PNG (clipboard unavailable)",
        );
      })
      .catch((err) => {
        console.error("Snapshot failed:", err);
        showStatusRef.current("Snapshot failed", "error");
      })
      .finally(() => {
        holdBusyRef.current = false;
      });
  }, [cancelHold, svgSelector, boardW, boardH, filenameFallback]);

  useEffect(() => {
    window.addEventListener("blur", cancelHold);
    return () => window.removeEventListener("blur", cancelHold);
  }, [cancelHold]);

  return {
    snapshotFlash,
    holding,
    onSnapshotPointerDown,
    onSnapshotPointerUp,
    cancelHold,
  };
}
