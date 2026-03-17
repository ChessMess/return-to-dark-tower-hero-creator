// Render an SVG element to a canvas via the browser's SVG renderer.
// This captures the exact browser rendering — including custom fonts —
// bypassing jsPDF/svg2pdf font issues with complex Fontself Maker glyphs.

import compactaTrvUrl from "../assets/fonts/CompactaTRV.otf";
import compactaBtUrl from "../assets/fonts/CompactaBT-BoldItalic.otf";
import acuminUrl from "../assets/fonts/AcuminVariableConcept.otf";

async function fetchAsBase64DataUrl(url, mime) {
  const res = await fetch(url);
  const buf = await res.arrayBuffer();
  const bytes = new Uint8Array(buf);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return `data:${mime};base64,${btoa(binary)}`;
}

// Build @font-face CSS with embedded base64 fonts for standalone SVG rendering
async function buildEmbeddedFontCSS() {
  const [compactaTrv, compactaBt, acumin] = await Promise.all([
    fetchAsBase64DataUrl(compactaTrvUrl, "font/otf"),
    fetchAsBase64DataUrl(compactaBtUrl, "font/otf"),
    fetchAsBase64DataUrl(acuminUrl, "font/otf"),
  ]);

  return `
    @font-face {
      font-family: 'Compacta TRV';
      src: url('${compactaTrv}') format('opentype');
      font-weight: 400;
      font-style: normal;
    }
    @font-face {
      font-family: 'Compacta BT';
      src: url('${compactaBt}') format('opentype');
      font-weight: 700;
      font-style: italic;
    }
    @font-face {
      font-family: 'Acumin Variable Concept';
      src: url('${acumin}') format('opentype');
      font-weight: 100 900;
      font-style: normal;
    }
  `;
}

/**
 * Render an SVG element to a canvas at the given scale.
 * Embeds fonts directly in the SVG so the browser renders them correctly
 * even when loading as a standalone image.
 */
export async function svgToCanvas(svgEl, width, height, scale = 3) {
  // Clone the SVG so we don't mutate the live DOM
  const clone = svgEl.cloneNode(true);

  // Embed fonts as base64 @font-face rules inside the SVG
  const fontCSS = await buildEmbeddedFontCSS();
  const styleEl = document.createElementNS("http://www.w3.org/2000/svg", "style");
  styleEl.textContent = fontCSS;
  clone.insertBefore(styleEl, clone.firstChild);

  // Inline any <image> hrefs that aren't already data: URLs.
  // SVG images must be rasterized to PNG first — nested SVG-as-image
  // contexts don't render properly when the outer SVG is loaded as an Image.
  const images = clone.querySelectorAll("image");
  await Promise.all(
    Array.from(images).map(async (imgEl) => {
      const href =
        imgEl.getAttribute("href") ||
        imgEl.getAttributeNS("http://www.w3.org/1999/xlink", "href");
      if (!href || href.startsWith("data:")) return;

      // Load the image via the browser, then rasterize to a PNG data URL
      const img = await new Promise((resolve, reject) => {
        const i = new Image();
        i.onload = () => resolve(i);
        i.onerror = () => reject(new Error(`Failed to load image: ${href}`));
        i.src = href;
      });
      const imgW = parseFloat(imgEl.getAttribute("width")) || img.naturalWidth;
      const imgH = parseFloat(imgEl.getAttribute("height")) || img.naturalHeight;
      const c = document.createElement("canvas");
      c.width = imgW * 3;
      c.height = imgH * 3;
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      const pngDataUrl = c.toDataURL("image/png");

      if (imgEl.hasAttribute("href")) imgEl.setAttribute("href", pngDataUrl);
      if (imgEl.hasAttributeNS("http://www.w3.org/1999/xlink", "href")) {
        imgEl.setAttributeNS("http://www.w3.org/1999/xlink", "href", pngDataUrl);
      }
    })
  );

  // Ensure the SVG has explicit dimensions for the Image loader
  clone.setAttribute("width", width);
  clone.setAttribute("height", height);

  // Serialize to a blob URL
  const svgString = new XMLSerializer().serializeToString(clone);
  const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  try {
    // Load as an Image (browser renders the SVG with embedded fonts)
    const img = await new Promise((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = () => reject(new Error("Failed to render SVG to image"));
      i.src = url;
    });

    // Draw to a high-res canvas
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas;
  } finally {
    URL.revokeObjectURL(url);
  }
}
