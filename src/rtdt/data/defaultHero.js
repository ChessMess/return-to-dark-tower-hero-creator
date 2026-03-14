export const MAX_VIRTUES = 6;

export function createEmptyVirtue(name = 'VIRTUE') {
  return {
    name,
    type: 'standard',        // 'advantage' | 'standard' | 'champion'
    description: 'Virtue ability description here.',
    kingdom: '',
  };
}

export const defaultHero = {
  schemaVersion: 2,
  name: 'HERO NAME',
  warriors: 7,
  spirit: 1,
  portraitDataUrl: null,
  flavorText: 'Italicised flavour text, vague and mysterious.',
  bannerAction: 'Gain 1 potion',
  virtues: [
    {
      name: 'VIRTUE 1',
      type: 'advantage',
      description: '+1 HUMANOID Advantage',
      kingdom: '',
    },
    {
      name: 'VIRTUE 2',
      type: 'standard',
      description: 'Virtue ability description here.',
      kingdom: '',
    },
  ],
  author_name: '',
  revision_no: '',
  description: '',
  contact: '',
  theme: 'orphaned_scion',
  customTheme: null,
};
