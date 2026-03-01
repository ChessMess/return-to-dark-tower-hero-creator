export const MAX_VIRTUES = 6;

export function createEmptyVirtue(name = 'VIRTUE') {
  return {
    name,
    type: 'standard',        // 'advantage' | 'standard' | 'champion'
    advantageType: 'TYPE',
    description: 'Virtue ability description here.',
    kingdom: '',
  };
}

export const defaultHero = {
  name: 'HERO NAME',
  warriors: 7,
  spirit: 1,
  portraitDataUrl: null,
  flavorLine1: 'Italicised flavour text',
  flavorLine2: 'vague and mysterious.',
  bannerAction: 'Gain 1 potion',
  virtues: [
    {
      name: 'VIRTUE 1',
      type: 'advantage',
      advantageType: 'HUMANOID',
      description: '',
      kingdom: '',
    },
    {
      name: 'VIRTUE 2',
      type: 'standard',
      advantageType: '',
      description: 'Virtue ability description here.',
      kingdom: '',
    },
  ],
  championKingdom: '',
  championTerrain: 'terrain',
  author_name: '',
  revision_no: '',
  description: '',
  contact: '',
};
