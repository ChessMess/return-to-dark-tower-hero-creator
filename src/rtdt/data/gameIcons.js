// Game icon path data for inline icon substitution in board text.
// Icons are rendered at ~10px height to match 9px Karma text.
// Multi-layer icons use a `layers` array; single-path icons use `path`/`fill`.

// Spirit flame/teardrop (from hero_board_bg.svg icon_spirit_master)
// Layers: dark border outline → teal fill → white center highlight
export const SPIRIT_ICON = {
  layers: [
    // Dark border (1.1× scaled teardrop for outline effect)
    {
      path: 'M -0.25,-0.05 C -0.25,1.44 1.15,3.17 2.53,4.46 3.93,3.17 5.33,1.44 5.33,-0.05 5.33,-0.23 5.31,-0.43 5.26,-0.62 4.65,-3.47 0.41,-3.47 -0.19,-0.62 -0.23,-0.43 -0.25,-0.23 -0.25,-0.05 Z',
      fill: '#231f20',
    },
    // Teal fill
    {
      path: 'M 0,0 C 0,1.353 1.275,2.924 2.533,4.096 3.799,2.924 5.074,1.353 5.074,0 5.074,-0.167 5.057,-0.343 5.01,-0.52 4.456,-3.107 0.605,-3.107 0.06,-0.52 0.018,-0.343 0,-0.167 0,0 Z',
      fill: '#4b8ea4',
    },
    // White center dot
    {
      path: 'M 3.04,0.5 A 0.5,0.5 0 1 1 2.04,0.5 A 0.5,0.5 0 1 1 3.04,0.5 Z',
      fill: '#ffffff',
      opacity: 0.5,
    },
  ],
  fill: '#4b8ea4',
  width: 5.58,
  height: 7.93,
  originX: 0.25,
  originY: 3.47,
};

// Warriors token (from hero_board_bg.svg icon_warriors_token_master)
// Layers: red circle → white compass/gear overlay → white center dot
export const WARRIORS_ICON = {
  layers: [
    // Red circle background
    {
      path: 'M 4.748,0 A 4.748,4.748 0 1 1 -4.748,0 A 4.748,4.748 0 1 1 4.748,0 Z',
      fill: '#9a393e',
    },
    // Simplified 8-tooth compass/gear star overlay
    {
      path: 'M 4.5,0 L 2.96,1.22 L 3.18,3.18 L 1.22,2.96 L 0,4.5 L -1.22,2.96 L -3.18,3.18 L -2.96,1.22 L -4.5,0 L -2.96,-1.22 L -3.18,-3.18 L -1.22,-2.96 L 0,-4.5 L 1.22,-2.96 L 3.18,-3.18 L 2.96,-1.22 Z',
      fill: '#ffffff',
      opacity: 0.3,
    },
    // White center dot
    {
      path: 'M 1.3,0 A 1.3,1.3 0 1 1 -1.3,0 A 1.3,1.3 0 1 1 1.3,0 Z',
      fill: '#ffffff',
    },
  ],
  fill: '#9a393e',
  width: 9.496,
  height: 9.496,
  originX: 4.748,
  originY: 4.748,
};

// Skull (simple custom path — no skull icon exists in the SVG template)
export const SKULL_ICON = {
  path: 'M 0,-4.5 C -2.5,-4.5 -4.5,-2.8 -4.5,-0.5 C -4.5,1.2 -3.2,2.6 -1.5,3.2 L -1.5,4.5 L -0.5,4.5 L -0.5,3.5 L 0.5,3.5 L 0.5,4.5 L 1.5,4.5 L 1.5,3.2 C 3.2,2.6 4.5,1.2 4.5,-0.5 C 4.5,-2.8 2.5,-4.5 0,-4.5 Z M -1.8,-1.5 A 1,1 0 1 1 -1.8,0.5 A 1,1 0 1 1 -1.8,-1.5 Z M 1.8,-1.5 A 1,1 0 1 1 1.8,0.5 A 1,1 0 1 1 1.8,-1.5 Z M -0.8,1 L 0.8,1 L 0.8,2 L -0.8,2 Z',
  fill: '#231f20',
  width: 9,
  height: 9,
  originX: 4.5, // centered at origin, left edge at -4.5
  originY: 4.5,
};

// Map single-char tokens to icon definitions
export const ICON_MAP = {
  '*': SPIRIT_ICON,
  '#': WARRIORS_ICON,
  '^': SKULL_ICON,
};

// Characters that trigger icon substitution
export const ICON_CHARS = new Set(Object.keys(ICON_MAP));
