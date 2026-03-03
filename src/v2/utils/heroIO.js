import {
  defaultHero,
  MAX_VIRTUES,
  createEmptyVirtue,
} from "../data/defaultHero";

const STORAGE_KEY = "rtdt-hero-v2";
const V1_STORAGE_KEY = "rtdt-hero";

/**
 * Detect whether imported data looks like V1 format.
 */
function looksLikeV1(data) {
  if (data.schemaVersion === 1) return true;
  if (data.schemaVersion >= 2) return false;
  // No schemaVersion — sniff fields
  return (
    typeof data.flavorLine1 === "string" ||
    typeof data.flavorLine2 === "string" ||
    typeof data.championTerrain === "string" ||
    (Array.isArray(data.virtues) &&
      data.virtues[0] &&
      "advantageType" in data.virtues[0])
  );
}

/**
 * Validate and sanitize imported V2 hero data.
 * Merges with defaultHero so missing fields get defaults.
 * Auto-migrates V1 data when detected.
 */
export function validateHeroData(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return { valid: false, error: "Invalid data: expected a JSON object." };
  }

  // Auto-migrate V1 imports
  if (looksLikeV1(data)) {
    const migrated = migrateV1ToV2(data);
    if (migrated) data = migrated;
  }

  const hero = {
    schemaVersion: 2,
    name:
      typeof data.name === "string" ? data.name.slice(0, 20) : defaultHero.name,
    warriors:
      typeof data.warriors === "number"
        ? Math.max(1, Math.min(99, data.warriors))
        : defaultHero.warriors,
    spirit:
      typeof data.spirit === "number"
        ? Math.max(0, Math.min(9, data.spirit))
        : defaultHero.spirit,
    portraitDataUrl:
      typeof data.portraitDataUrl === "string" &&
      (data.portraitDataUrl.startsWith("data:image/jpeg;base64,") ||
        data.portraitDataUrl.startsWith("data:image/png;base64,") ||
        data.portraitDataUrl.startsWith("data:image/gif;base64,") ||
        data.portraitDataUrl.startsWith("data:image/webp;base64,"))
        ? data.portraitDataUrl
        : null,
    flavorText:
      typeof data.flavorText === "string"
        ? data.flavorText.slice(0, 120)
        : `${data.flavorLine1 || ""} ${data.flavorLine2 || ""}`
            .trim()
            .slice(0, 120) || defaultHero.flavorText,
    bannerAction:
      typeof data.bannerAction === "string"
        ? data.bannerAction.slice(0, 40)
        : defaultHero.bannerAction,
    author_name:
      typeof data.author_name === "string" ? data.author_name.slice(0, 50) : "",
    revision_no:
      typeof data.revision_no === "string"
        ? data.revision_no.slice(0, 8)
        : "1.0",
    description:
      typeof data.description === "string"
        ? data.description.slice(0, 1000)
        : "",
    contact: typeof data.contact === "string" ? data.contact.slice(0, 250) : "",
    virtues: [],
  };

  const srcVirtues = Array.isArray(data.virtues)
    ? data.virtues.slice(0, MAX_VIRTUES)
    : [];
  for (const src of srcVirtues) {
    if (!src || typeof src !== "object") continue;
    const empty = createEmptyVirtue();
    // Migrate old advantageType field into description if description is empty
    let desc = typeof src.description === "string" ? src.description : "";
    if (!desc && typeof src.advantageType === "string" && src.advantageType) {
      desc = `+1 ${src.advantageType} Advantage`;
    }
    hero.virtues.push({
      name: typeof src.name === "string" ? src.name.slice(0, 12) : empty.name,
      type: ["advantage", "standard", "champion"].includes(src.type)
        ? src.type
        : "standard",
      description: desc,
      kingdom: typeof src.kingdom === "string" ? src.kingdom.slice(0, 20) : "",
    });
  }

  return { valid: true, hero };
}

/**
 * Migrate V1 hero data to V2 format.
 */
export function migrateV1ToV2(v1Hero) {
  if (!v1Hero || typeof v1Hero !== "object") return null;

  const virtues = [];
  const srcVirtues = Array.isArray(v1Hero.virtues) ? v1Hero.virtues : [];

  for (let i = 0; i < srcVirtues.length && i < MAX_VIRTUES; i++) {
    const src = srcVirtues[i] || {};
    if (i === 0) {
      const advType = src.advantageType || "TYPE";
      virtues.push({
        name: src.name || "VIRTUE 1",
        type: "advantage",
        description: `+1 ${advType} Advantage`,
        kingdom: "",
      });
    } else {
      let desc = "";
      if (typeof src.description === "string") {
        desc = src.description;
      } else if (
        typeof src.line1 === "string" ||
        typeof src.line2 === "string"
      ) {
        desc = [src.line1 || "", src.line2 || ""].filter(Boolean).join(" ");
      }
      virtues.push({
        name: src.name || `VIRTUE ${i + 1}`,
        type: "standard",
        description: desc,
        kingdom: "",
      });
    }
  }

  // Auto-create a champion virtue from V1's top-level champion fields
  const champKingdom = v1Hero.championKingdom || "";
  const champTerrain = v1Hero.championTerrain || "";
  if ((champKingdom || champTerrain) && virtues.length < MAX_VIRTUES) {
    virtues.push({
      name: "CHAMPION",
      type: "champion",
      description: champTerrain ? `+2 Wild Advantages in ${champTerrain}` : "",
      kingdom: champKingdom,
    });
  }

  return {
    ...defaultHero,
    name: v1Hero.name || defaultHero.name,
    warriors: v1Hero.warriors || defaultHero.warriors,
    spirit: v1Hero.spirit ?? defaultHero.spirit,
    portraitDataUrl: v1Hero.portraitDataUrl || null,
    flavorText:
      `${v1Hero.flavorLine1 || ""} ${v1Hero.flavorLine2 || ""}`
        .trim()
        .slice(0, 120) || defaultHero.flavorText,
    bannerAction: v1Hero.bannerAction || defaultHero.bannerAction,
    author_name: v1Hero.author_name || "",
    revision_no: v1Hero.revision_no || "",
    description: v1Hero.description || "",
    contact: v1Hero.contact || "",
    virtues,
  };
}

/**
 * Load hero from localStorage. Tries V2 key first, then migrates V1, then defaults.
 */
export function loadHero() {
  try {
    const v2Raw = localStorage.getItem(STORAGE_KEY);
    if (v2Raw) {
      const result = validateHeroData(JSON.parse(v2Raw));
      if (result.valid) return result.hero;
    }
  } catch {
    /* fall through */
  }

  try {
    const v1Raw = localStorage.getItem(V1_STORAGE_KEY);
    if (v1Raw) {
      const migrated = migrateV1ToV2(JSON.parse(v1Raw));
      if (migrated) {
        const result = validateHeroData(migrated);
        if (result.valid) return result.hero;
      }
    }
  } catch {
    /* fall through */
  }

  return {
    ...defaultHero,
    virtues: defaultHero.virtues.map((v) => ({ ...v })),
  };
}

/**
 * Save hero to localStorage.
 */
export function saveHero(hero) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(hero));
}

/**
 * Serialize hero to indented JSON string.
 */
export function heroToJson(hero) {
  return JSON.stringify(hero, null, 2);
}

/**
 * Resize and compress an image file using Canvas API.
 */
export function optimizeImage(
  file,
  { maxWidth = 540, maxHeight = 740, quality = 0.8 } = {},
) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      let { width, height } = img;

      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      resolve(canvas.toDataURL("image/jpeg", quality));
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image for optimization."));
    };

    img.src = url;
  });
}
