import { defaultHero, MAX_VIRTUES, createEmptyVirtue } from '../data/defaultHero';

const STORAGE_KEY = 'rtdt-hero-v2';
const V1_STORAGE_KEY = 'rtdt-hero';

/**
 * Validate and sanitize imported V2 hero data.
 * Merges with defaultHero so missing fields get defaults.
 */
export function validateHeroData(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return { valid: false, error: 'Invalid data: expected a JSON object.' };
  }

  const hero = {
    name: typeof data.name === 'string' ? data.name.slice(0, 20) : defaultHero.name,
    warriors: typeof data.warriors === 'number' ? Math.max(1, Math.min(99, data.warriors)) : defaultHero.warriors,
    spirit: typeof data.spirit === 'number' ? Math.max(0, Math.min(9, data.spirit)) : defaultHero.spirit,
    portraitDataUrl: (
      typeof data.portraitDataUrl === 'string' &&
      (data.portraitDataUrl.startsWith('data:image/jpeg;base64,') ||
       data.portraitDataUrl.startsWith('data:image/png;base64,') ||
       data.portraitDataUrl.startsWith('data:image/gif;base64,'))
    ) ? data.portraitDataUrl : null,
    flavorLine1: typeof data.flavorLine1 === 'string' ? data.flavorLine1.slice(0, 35) : defaultHero.flavorLine1,
    flavorLine2: typeof data.flavorLine2 === 'string' ? data.flavorLine2.slice(0, 35) : defaultHero.flavorLine2,
    bannerAction: typeof data.bannerAction === 'string' ? data.bannerAction.slice(0, 40) : defaultHero.bannerAction,
    championKingdom: typeof data.championKingdom === 'string' ? data.championKingdom.slice(0, 20) : '',
    championTerrain: typeof data.championTerrain === 'string' ? data.championTerrain.slice(0, 15) : defaultHero.championTerrain,
    author_name: typeof data.author_name === 'string' ? data.author_name.slice(0, 50) : '',
    revision_no: typeof data.revision_no === 'string' ? data.revision_no.slice(0, 8) : '1.0',
    description: typeof data.description === 'string' ? data.description.slice(0, 1000) : '',
    contact: typeof data.contact === 'string' ? data.contact.slice(0, 250) : '',
    virtues: [],
  };

  const srcVirtues = Array.isArray(data.virtues) ? data.virtues.slice(0, MAX_VIRTUES) : [];
  for (const src of srcVirtues) {
    if (!src || typeof src !== 'object') continue;
    const empty = createEmptyVirtue();
    hero.virtues.push({
      name: typeof src.name === 'string' ? src.name.slice(0, 12) : empty.name,
      type: ['advantage', 'standard', 'champion'].includes(src.type) ? src.type : 'standard',
      advantageType: typeof src.advantageType === 'string' ? src.advantageType.slice(0, 15) : '',
      description: typeof src.description === 'string' ? src.description.slice(0, 80) : '',
      kingdom: typeof src.kingdom === 'string' ? src.kingdom.slice(0, 20) : '',
    });
  }

  return { valid: true, hero };
}

/**
 * Migrate V1 hero data to V2 format.
 */
export function migrateV1ToV2(v1Hero) {
  if (!v1Hero || typeof v1Hero !== 'object') return null;

  const virtues = [];
  const srcVirtues = Array.isArray(v1Hero.virtues) ? v1Hero.virtues : [];

  for (let i = 0; i < srcVirtues.length && i < MAX_VIRTUES; i++) {
    const src = srcVirtues[i] || {};
    if (i === 0) {
      virtues.push({
        name: src.name || 'VIRTUE 1',
        type: 'advantage',
        advantageType: src.advantageType || 'TYPE',
        description: '',
        kingdom: '',
      });
    } else {
      let desc = '';
      if (typeof src.description === 'string') {
        desc = src.description;
      } else if (typeof src.line1 === 'string' || typeof src.line2 === 'string') {
        desc = [(src.line1 || ''), (src.line2 || '')].filter(Boolean).join(' ');
      }
      virtues.push({
        name: src.name || `VIRTUE ${i + 1}`,
        type: 'standard',
        advantageType: '',
        description: desc,
        kingdom: '',
      });
    }
  }

  return {
    ...defaultHero,
    name: v1Hero.name || defaultHero.name,
    warriors: v1Hero.warriors || defaultHero.warriors,
    spirit: v1Hero.spirit ?? defaultHero.spirit,
    portraitDataUrl: v1Hero.portraitDataUrl || null,
    flavorLine1: v1Hero.flavorLine1 || defaultHero.flavorLine1,
    flavorLine2: v1Hero.flavorLine2 || defaultHero.flavorLine2,
    championKingdom: v1Hero.championKingdom || '',
    championTerrain: v1Hero.championTerrain || defaultHero.championTerrain,
    author_name: v1Hero.author_name || '',
    revision_no: v1Hero.revision_no || '',
    description: v1Hero.description || '',
    contact: v1Hero.contact || '',
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
  } catch { /* fall through */ }

  try {
    const v1Raw = localStorage.getItem(V1_STORAGE_KEY);
    if (v1Raw) {
      const migrated = migrateV1ToV2(JSON.parse(v1Raw));
      if (migrated) {
        const result = validateHeroData(migrated);
        if (result.valid) return result.hero;
      }
    }
  } catch { /* fall through */ }

  return { ...defaultHero, virtues: defaultHero.virtues.map(v => ({ ...v })) };
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
export function optimizeImage(file, { maxWidth = 540, maxHeight = 740, quality = 0.8 } = {}) {
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
