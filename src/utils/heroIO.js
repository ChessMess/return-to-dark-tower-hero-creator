import { defaultHero } from '../data/defaultHero';

/**
 * Validate and sanitize imported hero data.
 * Merges with defaultHero so missing fields get defaults.
 * Returns { valid: true, hero } or { valid: false, error: string }.
 */
export function validateHeroData(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return { valid: false, error: 'Invalid data: expected a JSON object.' };
  }

  const hero = {
    name: typeof data.name === 'string' ? data.name : defaultHero.name,
    warriors: typeof data.warriors === 'number' ? Math.max(1, Math.min(99, data.warriors)) : defaultHero.warriors,
    spirit: typeof data.spirit === 'number' ? Math.max(0, Math.min(9, data.spirit)) : defaultHero.spirit,
    portraitDataUrl: typeof data.portraitDataUrl === 'string' ? data.portraitDataUrl : null,
    flavorLine1: typeof data.flavorLine1 === 'string' ? data.flavorLine1 : defaultHero.flavorLine1,
    flavorLine2: typeof data.flavorLine2 === 'string' ? data.flavorLine2 : defaultHero.flavorLine2,
    championTerrain: typeof data.championTerrain === 'string' ? data.championTerrain : defaultHero.championTerrain,
    virtues: [],
  };

  const srcVirtues = Array.isArray(data.virtues) ? data.virtues : [];
  for (let i = 0; i < 5; i++) {
    const src = srcVirtues[i] || {};
    const def = defaultHero.virtues[i];
    if (i === 0) {
      hero.virtues.push({
        name: typeof src.name === 'string' ? src.name : def.name,
        advantageType: typeof src.advantageType === 'string' ? src.advantageType : def.advantageType,
      });
    } else {
      hero.virtues.push({
        name: typeof src.name === 'string' ? src.name : def.name,
        line1: typeof src.line1 === 'string' ? src.line1 : def.line1,
        line2: typeof src.line2 === 'string' ? src.line2 : def.line2,
      });
    }
  }

  return { valid: true, hero };
}

/**
 * Serialize hero to indented JSON string.
 */
export function heroToJson(hero) {
  return JSON.stringify(hero, null, 2);
}

/**
 * Resize and compress an image file using Canvas API.
 * Outputs JPEG at the given quality, capped to maxWidth × maxHeight.
 * Returns a Promise<string> resolving to a base64 data URL.
 */
export function optimizeImage(file, { maxWidth = 540, maxHeight = 740, quality = 0.8 } = {}) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      let { width, height } = img;

      // Only downscale, never upscale
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      resolve(canvas.toDataURL('image/jpeg', quality));
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image for optimization.'));
    };

    img.src = url;
  });
}
