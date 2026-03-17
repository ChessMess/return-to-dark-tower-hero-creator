export const defaultCrewLeader = {
  schemaVersion: 2,
  crewLeaderName: 'CREW LEADER',
  crewLeaderTitle: '',
  portraitDataUrl: null,

  // Special ability (top of front board, unique per leader)
  specialAbilityName: '',
  specialAbilityDescription: '',

  // 4 positional effect slots — sorted by dice value (lowest → slot 0)
  slots: [
    { effectName: 'AIRSTRIKE', dice: 'ANY', description: '' },
    { effectName: 'NITRO', dice: '1-3', description: '' },
    { effectName: 'DRIFT', dice: '3-5', description: '' },
    { effectName: 'REPAIR', dice: '6', description: '' },
  ],

  // Command token count (0–9)
  commandTokens: 0,

  // Board theme
  accentColor: '#00ff00',
  nameColor: '#fff6d3',

  // Metadata (back of board)
  author_name: '',
  revision_no: '',
  contact_info: '',
  author_description: '',
};
