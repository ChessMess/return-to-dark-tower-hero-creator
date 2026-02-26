export default function HeroCard({ hero }) {
  return (
    <div id="hero-card-container">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 910 606" width="910" height="606">
        <defs>
          {/* Color palette */}
          {/* Background tan: #c4a882, Dark accent: #3d3529, Gold border: #b8963e, Card bg: #d4c4a8 */}

          {/* Parchment texture pattern */}
          <filter id="parchment">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5" result="noise"/>
            <feDiffuseLighting in="noise" lightingColor="#d4c4a8" surfaceScale="2" result="lit">
              <feDistantLight azimuth="45" elevation="55"/>
            </feDiffuseLighting>
            <feComposite in="SourceGraphic" in2="lit" operator="arithmetic" k1="0.8" k2="0.3" k3="0.1" k4="0"/>
          </filter>

          {/* Drop shadow for cards */}
          <filter id="cardShadow">
            <feDropShadow dx="1" dy="1" stdDeviation="2" floodColor="#2a1f12" floodOpacity="0.3"/>
          </filter>

          {/* Gold gradient for borders */}
          <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e0c060"/>
            <stop offset="20%" stopColor="#d4a848"/>
            <stop offset="50%" stopColor="#b8963e"/>
            <stop offset="80%" stopColor="#a8842e"/>
            <stop offset="100%" stopColor="#8b6d24"/>
          </linearGradient>

          <linearGradient id="goldGradH" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#e0c060"/>
            <stop offset="20%" stopColor="#d4a848"/>
            <stop offset="50%" stopColor="#b8963e"/>
            <stop offset="80%" stopColor="#a8842e"/>
            <stop offset="100%" stopColor="#8b6d24"/>
          </linearGradient>

          {/* Gold gradient for ornamental virtue borders */}
          <linearGradient id="goldOrnament" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ddb850"/>
            <stop offset="25%" stopColor="#c9a040"/>
            <stop offset="50%" stopColor="#b8963e"/>
            <stop offset="75%" stopColor="#a88830"/>
            <stop offset="100%" stopColor="#9a7a28"/>
          </linearGradient>

          {/* Dark panel gradient */}
          <linearGradient id="darkPanel" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4a4035"/>
            <stop offset="100%" stopColor="#3a3025"/>
          </linearGradient>

          {/* Section header gradient */}
          <linearGradient id="sectionHeader" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#6b5d4a"/>
            <stop offset="50%" stopColor="#7d6e58"/>
            <stop offset="100%" stopColor="#6b5d4a"/>
          </linearGradient>

          {/* Virtue tab gradient */}
          <linearGradient id="virtueTab" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d4a848"/>
            <stop offset="50%" stopColor="#b8963e"/>
            <stop offset="100%" stopColor="#9a7e30"/>
          </linearGradient>

          {/* Background texture gradient */}
          <radialGradient id="bgGlow" cx="0.3" cy="0.5" r="0.6">
            <stop offset="0%" stopColor="#d8c8a4" stopOpacity="0.3"/>
            <stop offset="100%" stopColor="#b09870" stopOpacity="0"/>
          </radialGradient>

          {/* Bottom bar gradient */}
          <linearGradient id="bottomBar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5a4a35"/>
            <stop offset="100%" stopColor="#3d3025"/>
          </linearGradient>

          {/* Champion slot dark teal gradient */}
          <linearGradient id="championBg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3a4540"/>
            <stop offset="100%" stopColor="#2d3832"/>
          </linearGradient>

          {/* Clip path for hero portrait */}
          <clipPath id="portraitClip">
            <rect x="18" y="75" width="270" height="370" rx="4"/>
          </clipPath>

          {/* ============================== */}
          {/* GAME GLYPH SYMBOLS             */}
          {/* (Extracted from SVG files)     */}
          {/* ============================== */}

          {/* Banner glyph (flag with diamond) */}
          <symbol id="glyphBanner" viewBox="0 0 22.518 40.093">
            <path fill="currentColor" d="M21.3,36.718c-0.196,0-0.391-0.046-0.569-0.141l-9.472-5.009l-9.471,5.009c-0.376,0.202-0.832,0.187-1.198-0.034C0.224,36.323,0,35.928,0,35.5V20.068c0-0.673,0.546-1.218,1.218-1.218c0.673,0,1.218,0.545,1.218,1.218v13.41l8.254-4.364c0.357-0.187,0.782-0.187,1.139,0l8.254,4.364v-13.41c0-0.673,0.545-1.218,1.218-1.218c0.672,0,1.218,0.545,1.218,1.218V35.5c0,0.427-0.224,0.822-0.59,1.043C21.735,36.66,21.518,36.718,21.3,36.718"/>
            <path fill="currentColor" d="M21.3,16.942c-0.673,0-1.218-0.544-1.218-1.218V7.295H2.436v8.429c0,0.674-0.545,1.218-1.218,1.218C0.546,16.942,0,16.398,0,15.725V6.078C0,5.405,0.546,4.86,1.218,4.86H21.3c0.672,0,1.218,0.545,1.218,1.218v9.647C22.518,16.398,21.972,16.942,21.3,16.942"/>
            <path fill="currentColor" d="M16.698,17.784l-4.435-4.435c-0.556-0.555-1.454-0.555-2.01,0l-4.435,4.435c-0.555,0.555-0.555,1.454,0,2.009l4.435,4.435c0.556,0.555,1.454,0.555,2.01,0l4.435-4.435C17.253,19.238,17.253,18.339,16.698,17.784"/>
          </symbol>

          {/* Cleanse glyph (skull creature with branches) */}
          <symbol id="glyphCleanse" viewBox="0 0 29.583 41.008">
            <path fill="currentColor" d="M13.331,27.839c-0.104,0.313-0.347,0.485-0.66,0.485c-0.079,0-0.164-0.01-0.251-0.033c-0.516-0.134-1.229-0.733-1.137-1.22l0.021-0.114c0.116-0.65,0.465-2.628,1.806-2.628c0.128,0,0.236,0.097,0.25,0.224C13.371,24.65,13.621,26.972,13.331,27.839"/>
            <path fill="currentColor" d="M16.459,28.291c-0.087,0.023-0.171,0.033-0.251,0.033c-0.314,0-0.558-0.172-0.662-0.485c-0.289-0.867-0.039-3.189-0.028-3.286c0.015-0.127,0.121-0.224,0.25-0.224c1.341,0,1.69,1.978,1.806,2.628l0.021,0.114C17.688,27.558,16.973,28.157,16.459,28.291"/>
            <path fill="currentColor" d="M9.449,22.919c-0.329,0-0.649-0.059-0.956-0.176c-1.108-0.427-1.798-1.545-1.798-2.917c0-0.085,0.038-0.164,0.104-0.218c2.391-1.915,4.147-2.556,5.223-1.896c0.812,0.495,1.087,1.709,0.754,3.329c-0.01,0.05-0.031,0.095-0.065,0.132C11.687,22.308,10.523,22.919,9.449,22.919"/>
            <path fill="currentColor" d="M20.815,22.743c-0.306,0.117-0.627,0.176-0.957,0.176c-1.073,0-2.236-0.611-3.261-1.746c-0.033-0.039-0.057-0.084-0.066-0.132c-0.331-1.621-0.056-2.834,0.755-3.329c1.072-0.66,2.83-0.021,5.223,1.896c0.065,0.054,0.104,0.132,0.104,0.218C22.613,21.198,21.925,22.316,20.815,22.743"/>
            <path fill="currentColor" d="M9.024,32.828c-0.004-0.002-0.008-0.004-0.012-0.006c-0.096-2.796-0.38-3.93-2.949-5.064c-2.57-1.133-2.872-2.721-3.704-6.424c2.192-1.512,1.965-3.174,1.965-7.029c0-3.44,4.512-5.61,8.653-6.039c0.062-0.709,0.182-1.493,0.377-2.264C7.752,6.365,2.107,9.47,2.107,14.305l0.003,1c0.018,3.2-0.066,3.553-1.01,4.203c-0.744,0.514-1.104,1.429-0.904,2.312l0.055,0.247c0.832,3.71,1.382,6.161,4.917,7.72c1.429,0.631,1.546,0.682,1.629,3.111c0.023,0.713,0.391,1.372,0.983,1.768c0.372,0.248,0.796,0.465,1.244,0.663V32.828z"/>
            <path fill="currentColor" d="M27.805,19.508c-0.675-0.465-0.906-0.796-0.979-2.107c-0.676,0.636-1.32,1.353-1.793,2.199c0.289,0.652,0.747,1.205,1.513,1.734c-0.831,3.703-1.134,5.291-3.703,6.424c-2.569,1.134-2.854,2.268-2.949,5.064c-0.029,0.02-0.069,0.033-0.101,0.052v2.502c0.485-0.208,0.935-0.444,1.332-0.71c0.594-0.397,0.96-1.055,0.985-1.768c0.083-2.429,0.199-2.481,1.628-3.111c3.536-1.56,4.085-4.01,4.917-7.72l0.055-0.247C28.907,20.936,28.549,20.022,27.805,19.508"/>
            <path fill="currentColor" d="M13.511,37.05v-3.643c0-0.627-0.51-1.137-1.137-1.137c-0.628,0-1.137,0.51-1.137,1.137v3.337C11.974,36.901,12.732,37.001,13.511,37.05"/>
            <path fill="currentColor" d="M18.256,36.646v-3.553c0-0.628-0.509-1.137-1.137-1.137c-0.627,0-1.137,0.509-1.137,1.137v3.879c0,0.02,0.011,0.037,0.012,0.057C16.756,36.958,17.512,36.831,18.256,36.646"/>
            <path fill="currentColor" d="M11.883,5.763l1.16-1.431c0.296-0.366,0.885-0.141,0.867,0.329c-0.028,0.723-0.094,1.483-0.236,1.651C13.385,6.65,11.883,5.763,11.883,5.763"/>
            <path fill="currentColor" d="M13.307,5.601c0.498-0.193,1.139-0.406,1.738-0.597c0.566-0.179,1.024,0.479,0.661,0.948l-1.512,1.956l-1.134-1.261C12.754,6.307,12.88,5.766,13.307,5.601"/>
            <path fill="currentColor" d="M19.647,2.826c-1.255-0.791,1.273-1.663,1.863-0.583C21.752,2.686,20.029,3.067,19.647,2.826"/>
            <path fill="currentColor" d="M24.205,3.437c0.17-1.961,1.529-2.232,1.954-1.799C26.583,2.071,24.205,3.437,24.205,3.437"/>
            <path fill="currentColor" d="M22.673,2.37c-0.897-0.394,0.172-1.904,0.74-1.564C23.979,1.146,22.986,2.507,22.673,2.37"/>
            <path fill="currentColor" d="M25.02,19.595c-0.085-0.84,0.755-5.883,1.942-1.524C27.392,19.645,25.02,19.595,25.02,19.595"/>
            <path fill="currentColor" d="M20.651,8.301c0.34-1.784,1.24-2.548,1.597-2.208c0.357,0.339,1.182,1.024,0.345,1.616C21.756,8.301,20.651,8.301,20.651,8.301"/>
            <path fill="currentColor" d="M26.251,16.708c0.557-1.578,2.425-2.243,2.595-0.721c0.17,1.521-1.227,2.083-1.884,2.083C26.307,18.07,26.251,16.708,26.251,16.708"/>
            <path fill="currentColor" d="M24.323,8c0.618-0.781,1.478-0.845,1.374,0c-0.105,0.846-1.406,1.951-1.374,1.171C24.356,8.391,24.323,8,24.323,8"/>
            <path fill="currentColor" d="M25.761,15.128c-0.062-1.496,0.015-3.309,1.088-3.185c1.072,0.125,1.479,0.586,1.187,1.237C27.742,13.831,25.761,15.128,25.761,15.128"/>
            <path fill="currentColor" d="M25.761,10.797c-0.554-1.471,1.989-4.116,1.87-0.988C27.583,11.047,25.761,10.797,25.761,10.797"/>
            <path fill="currentColor" d="M26.913,2.92c1.269-1.138,2.114-0.313,1.919,0.397c-0.195,0.709-1.333,0.633-1.919,0.541C26.328,3.767,26.913,2.92,26.913,2.92"/>
            <path fill="currentColor" d="M28.056,0.573c1.138-0.827,1.788-0.832,1.594,0c-0.196,0.832,0.265,0.575-0.86,0.866c-1.124,0.291-1.774,0-1.774,0L28.056,0.573z"/>
            <path fill="currentColor" d="M27.839,7.765c-0.06-0.778-0.137-0.292,0.51-1.323c0.647-1.031,1.006-0.745,1.126,0.239c0.12,0.984,0.599,1.144,0,1.922c-0.599,0.778-1.178,0.208-1.356-0.255l-0.18-0.463L27.839,7.765z"/>
            <path fill="currentColor" d="M24.352,5.529c0.953-0.841,2.708-1.646,2.149-0.745c-0.559,0.901-0.206,1.5-1.021,1.44C24.666,6.164,24.352,5.529,24.352,5.529"/>
            <path fill="currentColor" d="M17.256,5.546c1.077-1.251,1.797-2.508,2.294-1.55c0.499,0.958,1.338,0.766,0.479,1.55c-0.857,0.784-0.277,1.29-1.315,1.227c-1.039-0.064-1.099,0.016-1.158-0.303C17.496,6.151,17.256,5.546,17.256,5.546"/>
            <path fill="currentColor" d="M22.154,4.559c0.459-0.599,1.575-0.678,1.177,0c-0.399,0.678-0.299,0.625-0.698,0.682C22.233,5.297,22.154,4.559,22.154,4.559"/>
          </symbol>

          {/* Battle glyph (sword with handle) */}
          <symbol id="glyphBattle" viewBox="0 0 29.918 41.008">
            <path fill="currentColor" d="M16.575,41.008c-1.852,0-3.358-1.507-3.358-3.359v-3.32c0-0.611,0.496-1.108,1.108-1.108s1.108,0.497,1.108,1.108v3.32c0,0.63,0.513,1.143,1.142,1.143c0.631,0,1.143-0.513,1.143-1.143v-9.652c0-0.958,0.373-1.858,1.05-2.535c1.043-1.043,2.538-1.341,3.904-0.776c1.364,0.564,2.212,1.833,2.212,3.311v3.694c0,0.63,0.512,1.142,1.142,1.142s1.142-0.512,1.142-1.142V13.62c0-0.612,0.497-1.108,1.108-1.108c0.613,0,1.109,0.496,1.109,1.108v18.071c0,1.852-1.507,3.359-3.359,3.359c-1.852,0-3.359-1.507-3.359-3.359v-3.694c0-0.848-0.646-1.18-0.843-1.262c-0.199-0.082-0.89-0.302-1.487,0.296c-0.259,0.258-0.401,0.602-0.401,0.966v9.652C19.935,39.501,18.429,41.008,16.575,41.008"/>
            <path fill="currentColor" d="M1.128,30.026c-0.283,0-0.564-0.107-0.782-0.322c-0.434-0.431-0.436-1.133-0.004-1.567l7.138-7.182c0.432-0.436,1.135-0.436,1.568-0.005c0.435,0.431,0.437,1.133,0.005,1.567L1.915,29.7C1.698,29.917,1.413,30.026,1.128,30.026"/>
            <path fill="currentColor" d="M11.407,14.729c-0.284,0-0.567-0.107-0.784-0.324c-0.433-0.433-0.433-1.135,0-1.568l4.955-4.956c0.433-0.434,1.135-0.434,1.568,0c0.433,0.433,0.433,1.135,0,1.568l-4.955,4.956C11.975,14.622,11.691,14.729,11.407,14.729"/>
            <rect x="14.424" y="3.658" transform="matrix(0.7071 0.7071 -0.7071 0.7071 11.2626 -8.203)" fill="currentColor" width="2.218" height="11.671"/>
            <path fill="currentColor" d="M22.664,3.472c-0.522,0-0.988-0.372-1.088-0.905c-0.114-0.601,0.281-1.18,0.883-1.294l6.162-1.164c0.598-0.123,1.181,0.282,1.295,0.884c0.114,0.601-0.282,1.181-0.883,1.295l-6.162,1.164C22.802,3.464,22.732,3.472,22.664,3.472"/>
            <path fill="currentColor" d="M27.663,8.468c-0.067,0-0.138-0.007-0.206-0.02c-0.603-0.114-0.997-0.694-0.885-1.296l1.164-6.161c0.114-0.6,0.697-0.996,1.296-0.883c0.603,0.114,0.997,0.694,0.885,1.296l-1.165,6.161C28.651,8.096,28.186,8.468,27.663,8.468"/>
            <polygon fill="currentColor" points="11.324,15.271 17.681,8.914 16.113,7.346 7.457,16.002"/>
            <polygon fill="currentColor" points="14.022,22.567 27.286,9.302 25.72,7.735 14.753,18.701"/>
            <path fill="currentColor" d="M13.287,27.866c-0.284,0-0.567-0.107-0.784-0.324L2.424,17.463c-0.433-0.433-0.433-1.135,0-1.568c0.434-0.434,1.135-0.434,1.568,0l10.079,10.079c0.433,0.433,0.433,1.135,0,1.568C13.854,27.759,13.571,27.866,13.287,27.866"/>
            <rect x="25.974" y="7.119" transform="matrix(0.7071 0.7071 -0.7071 0.7071 13.5458 -16.825)" fill="currentColor" width="2.218" height="1.64"/>
            <rect x="20.053" y="1.74" transform="matrix(0.7069 0.7073 -0.7073 0.7069 8.9364 -13.8354)" fill="currentColor" width="2.217" height="4.25"/>
            <path fill="currentColor" d="M7.404,20.922c-0.522,0-0.988-0.372-1.088-0.903c-0.114-0.602,0.281-1.182,0.883-1.296l3.46-0.654c0.598-0.117,1.181,0.282,1.296,0.883c0.113,0.602-0.282,1.182-0.884,1.296l-3.46,0.654C7.542,20.916,7.473,20.922,7.404,20.922"/>
            <path fill="currentColor" d="M10.155,24.031c-0.067,0-0.138-0.007-0.207-0.02c-0.602-0.114-0.997-0.694-0.884-1.295l0.711-3.763c0.113-0.601,0.695-1.002,1.296-0.884c0.602,0.114,0.997,0.694,0.884,1.295l-0.711,3.763C11.143,23.659,10.678,24.031,10.155,24.031"/>
            <rect x="7.086" y="19.598" transform="matrix(-0.7072 -0.707 0.707 -0.7072 0.5139 42.0322)" fill="currentColor" width="3.751" height="2.624"/>
          </symbol>

          {/* Quest glyph (scroll/document) */}
          <symbol id="glyphQuest" viewBox="0 0 29.916 41.008">
            <rect x="11.959" y="9.814" fill="currentColor" width="9.949" height="2.211"/>
            <rect x="11.959" y="16.912" fill="currentColor" width="9.949" height="2.211"/>
            <rect x="11.959" y="24.01" fill="currentColor" width="9.949" height="2.211"/>
            <path fill="currentColor" d="M7.406,34.242c-0.61,0-1.105-0.495-1.105-1.105V7.921c0-1.091-0.888-1.98-1.98-1.98c-1.092,0-1.979,0.889-1.979,1.98c0,0.365,0.1,0.723,0.29,1.031c0.319,0.522,0.155,1.203-0.366,1.522c-0.521,0.323-1.202,0.156-1.521-0.364C0.343,9.453,0.129,8.696,0.129,7.921c0-2.31,1.881-4.191,4.191-4.191c2.312,0,4.192,1.881,4.192,4.191v25.215C8.513,33.748,8.018,34.242,7.406,34.242"/>
            <path fill="currentColor" d="M10.493,37.329c-0.611,0-1.106-0.495-1.106-1.106c0-0.61,0.495-1.105,1.106-1.105c1.091,0,1.979-0.889,1.979-1.981c0-0.542-0.215-1.047-0.604-1.423c-0.439-0.426-0.451-1.126-0.026-1.565c0.425-0.44,1.124-0.451,1.564-0.027c0.825,0.799,1.279,1.868,1.279,3.015C14.686,35.449,12.804,37.329,10.493,37.329"/>
            <path fill="currentColor" d="M10.493,37.329c-2.312,0-4.193-1.88-4.193-4.192c0-0.61,0.495-1.106,1.107-1.106c0.61,0,1.106,0.496,1.106,1.106c0,1.092,0.889,1.981,1.979,1.981s1.979-0.889,1.979-1.981c0-0.61,0.495-1.106,1.105-1.106c0.612,0,1.107,0.496,1.107,1.106C14.686,35.449,12.804,37.329,10.493,37.329"/>
            <path fill="currentColor" d="M26.177,37.176h-7.132c-0.61,0-1.105-0.495-1.105-1.105c0-0.611,0.495-1.106,1.105-1.106h7.132c0.812,0,1.472-0.661,1.472-1.471s-0.66-1.471-1.472-1.471h-13.54c-0.61,0-1.105-0.495-1.105-1.106c0-0.61,0.495-1.104,1.105-1.104h13.54c2.031,0,3.685,1.651,3.685,3.682C29.861,35.525,28.208,37.176,26.177,37.176"/>
            <path fill="currentColor" d="M26.343,26.221c-0.611,0-1.106-0.495-1.106-1.106V7.921c0-1.091-0.888-1.979-1.979-1.979c-0.611,0-1.106-0.495-1.106-1.106c0-0.61,0.495-1.105,1.106-1.105c2.311,0,4.192,1.88,4.192,4.19v17.194C27.449,25.726,26.954,26.221,26.343,26.221"/>
            <path fill="currentColor" d="M23.257,5.942H12.989c-0.611,0-1.106-0.495-1.106-1.105c0-0.611,0.495-1.106,1.106-1.106h10.268c0.611,0,1.106,0.495,1.106,1.106C24.363,5.447,23.868,5.942,23.257,5.942"/>
          </symbol>

          {/* Reinforce glyph (target/crosshair) */}
          <symbol id="glyphReinforce" viewBox="0 0 27.001 41.008">
            <path fill="currentColor" d="M7.107,11.083c1.74-1.407,3.95-2.254,6.357-2.254c2.389,0,4.582,0.836,6.316,2.223l1.578-1.578c-2.143-1.785-4.895-2.862-7.895-2.862c-3.019,0-5.784,1.091-7.932,2.896L7.107,11.083z"/>
            <path fill="currentColor" d="M22.928,11.041l-1.574,1.576c1.399,1.738,2.242,3.943,2.242,6.343c0,2.396-0.839,4.595-2.232,6.331l1.576,1.577c1.793-2.144,2.875-4.901,2.875-7.908C25.814,15.948,24.728,13.188,22.928,11.041"/>
            <path fill="currentColor" d="M5.576,25.304c-1.4-1.738-2.243-3.943-2.243-6.343c0-2.383,0.832-4.572,2.214-6.304l-1.579-1.579c-1.779,2.141-2.853,4.889-2.853,7.883c0,3.012,1.087,5.773,2.885,7.919L5.576,25.304z"/>
            <path fill="currentColor" d="M19.795,26.858c-1.736,1.395-3.936,2.234-6.33,2.234c-2.389,0-4.583-0.836-6.317-2.224L5.57,28.447c2.142,1.786,4.894,2.864,7.895,2.864c3.006,0,5.763-1.083,7.907-2.875L19.795,26.858z"/>
            <path fill="currentColor" d="M14.742,17.336h-2.556c-0.204,0-0.369,0.165-0.369,0.369v2.555c0,0.204,0.165,0.37,0.369,0.37h2.556c0.203,0,0.368-0.166,0.368-0.37v-2.555C15.11,17.501,14.945,17.336,14.742,17.336"/>
            <path fill="currentColor" d="M8.768,17.872c0.201-0.873,0.632-1.678,1.28-2.328c0.652-0.651,1.45-1.062,2.288-1.263v-2.257c-1.412,0.227-2.77,0.866-3.855,1.952c-1.07,1.07-1.731,2.428-1.959,3.896H8.768z"/>
            <path fill="currentColor" d="M14.553,12.02v2.25c0.854,0.196,1.665,0.612,2.328,1.275c0.659,0.658,1.072,1.464,1.271,2.31h2.253c-0.226-1.42-0.864-2.786-1.956-3.878v-0.001C17.353,12.879,15.98,12.241,14.553,12.02"/>
            <path fill="currentColor" d="M12.353,23.646c-0.844-0.199-1.647-0.612-2.305-1.269c-0.639-0.639-1.063-1.43-1.269-2.287H6.525c0.233,1.452,0.895,2.795,1.955,3.855c1.09,1.091,2.454,1.73,3.872,1.955V23.646z"/>
            <path fill="currentColor" d="M18.15,20.072c-0.199,0.844-0.612,1.648-1.27,2.304c-0.658,0.659-1.465,1.073-2.311,1.271v2.254c1.42-0.225,2.787-0.864,3.879-1.956c1.091-1.091,1.73-2.455,1.955-3.873H18.15z"/>
            <path fill="currentColor" d="M26.875,25.058c-2.325,5.094-7.455,8.648-13.41,8.648s-11.086-3.556-13.411-8.65v4.254c3.104,4.014,7.955,6.614,13.411,6.614s10.305-2.599,13.41-6.613V25.058z"/>
            <path fill="currentColor" d="M0.054,12.866c2.325-5.094,7.456-8.65,13.411-8.65s11.085,3.555,13.41,8.649V8.611c-3.106-4.014-7.954-6.614-13.41-6.614S3.158,4.598,0.054,8.612V12.866z"/>
          </symbol>

          {/* Spirit resource icon */}
          <symbol id="iconSpirit" viewBox="0 0 14 14">
            <circle cx="7" cy="7" r="6" fill="#4a9e6e" stroke="#2d6b45" strokeWidth="0.8"/>
            <text x="7" y="10.5" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold" fontFamily="Arial, sans-serif">S</text>
          </symbol>

          {/* Warrior resource icon */}
          <symbol id="iconWarrior" viewBox="0 0 14 14">
            <circle cx="7" cy="7" r="6" fill="#c44040" stroke="#8b2020" strokeWidth="0.8"/>
            <text x="7" y="10.5" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold" fontFamily="Arial, sans-serif">W</text>
          </symbol>

          {/* Glyph/advantage icon (circle with cross) */}
          <symbol id="iconGlyph" viewBox="0 0 30 30">
            <circle cx="15" cy="15" r="12" fill="none" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M15,6 L15,11 M15,19 L15,24 M6,15 L11,15 M19,15 L24,15" stroke="currentColor" strokeWidth="1.2"/>
            <circle cx="15" cy="15" r="4" fill="none" stroke="currentColor" strokeWidth="1"/>
          </symbol>

          {/* Building icons */}
          <symbol id="iconCitadel" viewBox="0 0 22 22">
            <path d="M4,20 L4,8 L7,8 L7,4 L11,4 L11,8 L15,8 L15,4 L18,4 L18,8 L18,20 Z" fill="currentColor" opacity="0.85"/>
          </symbol>
          <symbol id="iconSanctuary" viewBox="0 0 22 22">
            <path d="M3,20 L3,10 L11,4 L19,10 L19,20 Z" fill="currentColor" opacity="0.85"/>
            <circle cx="11" cy="13" r="3" fill="#4a4035"/>
          </symbol>
          <symbol id="iconVillage" viewBox="0 0 22 22">
            <path d="M2,20 L2,12 L8,7 L14,12 L14,20 Z" fill="currentColor" opacity="0.85"/>
            <path d="M12,20 L12,14 L18,10 L18,20 Z" fill="currentColor" opacity="0.85"/>
          </symbol>
          <symbol id="iconBazaar" viewBox="0 0 22 22">
            <path d="M3,10 L11,4 L19,10 L19,20 L3,20 Z" fill="currentColor" opacity="0.85"/>
            <rect x="8" y="15" width="6" height="5" fill="#4a4035"/>
          </symbol>
        </defs>

        {/* ============================================================ */}
        {/* LAYOUT GRID                                                  */}
        {/* Canvas: 910 × 606                                            */}
        {/* Row 1 — main content:  y=14  → y=504  (h=490)               */}
        {/* Row 2 — treasures:     y=506 → y=606  (h=100)               */}
        {/*                                                              */}
        {/* Col A — left panel:    x=16  → x=290  (w=274)               */}
        {/* Gap A→B:               x=290 → x=300  (w=10)                */}
        {/* Col B — center panel:  x=300 → x=594  (w=294)               */}
        {/* Gap B→C:               x=594 → x=602  (w=8)                 */}
        {/* Col C — right panel:   x=602 → x=900  (w=298)               */}
        {/* ============================================================ */}

        {/* ============================== */}
        {/* BACKGROUND                     */}
        {/* ============================== */}
        <rect width="910" height="606" fill="#b09870"/>
        <rect width="910" height="606" fill="url(#bgGlow)"/>
        <rect width="910" height="606" fill="#c4a882" opacity="0.3"/>

        {/* ============================== */}
        {/* OUTER DECORATIVE BORDER        */}
        {/* ============================== */}
        <rect x="1" y="1" width="908" height="604" rx="6" fill="none" stroke="#8b7355" strokeWidth="2.5"/>
        <rect x="4" y="4" width="902" height="598" rx="5" fill="none" stroke="url(#goldGradH)" strokeWidth="1.5"/>
        <rect x="7" y="7" width="896" height="592" rx="4" fill="none" stroke="#6b5d4a" strokeWidth="0.5" opacity="0.4"/>

        {/* ============================== */}
        {/* LEFT PANEL - Hero Portrait     */}
        {/* ============================== */}
        <g id="leftPanel">
          {/* Hero Name */}
          <text x="22" y="38" fontFamily="Georgia, 'Times New Roman', serif" fontSize="28" fontWeight="bold" fill="#2a1f12" letterSpacing="1.5">{hero.name}</text>

          {/* Decorative double-line with open-arc divider under hero name */}
          {/* Arc: center (26,50) r=7, opens left at x≈19 — lines extend to right edge of Col A (x=290) */}
          <path d="M 19,48 A 7,7 0 1,1 19,52" fill="none" stroke="#5a4a35" strokeWidth="0.8" opacity="0.7"/>
          <line x1="19" y1="48" x2="290" y2="48" stroke="#5a4a35" strokeWidth="0.8" opacity="0.7"/>
          <line x1="19" y1="52" x2="290" y2="52" stroke="#5a4a35" strokeWidth="0.8" opacity="0.7"/>

          {/* Starting resources line */}
          <text x="22" y="68" fontFamily="Arial, sans-serif" fontSize="9" fill="#4a3d2e" fontVariant="small-caps" letterSpacing="0.5">{`START WITH: ${hero.warriors}`}</text>
          <use href="#iconWarrior" x="99" y="59" width="10" height="10"/>
          <text x="112" y="68" fontFamily="Arial, sans-serif" fontSize="9" fill="#4a3d2e">{`|  ${hero.spirit}`}</text>
          <use href="#iconSpirit" x="128" y="59" width="10" height="10"/>

          {/* Hero Portrait Area */}
          <rect x="16" y="74" width="274" height="375" rx="3" fill="#9a8a6e" stroke="#7a6a50" strokeWidth="1"/>
          <rect x="18" y="76" width="270" height="371" rx="2" fill="#b0a080"/>

          {/* Placeholder silhouette */}
          <g id="heroSilhouette" opacity={hero.portraitDataUrl ? 0 : 0.2}>
            <ellipse cx="153" cy="180" rx="40" ry="48" fill="#5a4a35"/>
            <path d="M85,248 Q85,225 112,212 Q133,202 153,202 Q173,202 194,212 Q221,225 221,248 L221,380 Q221,420 200,440 L106,440 Q85,420 85,380 Z" fill="#5a4a35"/>
          </g>

          {/* Hero portrait image */}
          {hero.portraitDataUrl && (
            <image
              href={hero.portraitDataUrl}
              x="18"
              y="75"
              width="270"
              height="370"
              preserveAspectRatio="xMidYMid slice"
              clipPath="url(#portraitClip)"
            />
          )}

          {/* Portrait frame border */}
          <rect x="16" y="74" width="274" height="375" rx="3" fill="none" stroke="#8b7355" strokeWidth="2"/>

          {/* Flavor text area */}
          <text x="153" y="466" textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontSize="11" fill="#5a4a35" fontStyle="italic" opacity="0.8">{hero.flavorLine1}</text>
          <text x="153" y="480" textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontSize="11" fill="#5a4a35" fontStyle="italic" opacity="0.8">{hero.flavorLine2}</text>
        </g>

        {/* ============================== */}
        {/* CENTER PANEL - Game Mechanics   */}
        {/* ============================== */}
        <g id="centerPanel">
          {/* Panel background */}
          <rect x="300" y="14" width="294" height="490" rx="3" fill="#3d3529" opacity="0.8"/>
          <rect x="302" y="16" width="290" height="486" rx="2" fill="none" stroke="#5a4a35" strokeWidth="0.5"/>

          {/* ============================== */}
          {/* SECTION BORDERS                */}
          {/* Three named sections, each     */}
          {/* outlined like an HTML div      */}
          {/* ============================== */}
          {/* Start of Turn border: y=18–95  */}
          <rect x="302" y="18" width="290" height="77" rx="2" fill="none" stroke="#7a6a52" strokeWidth="1.5"/>
          {/* Middle of Turn border: y=101–458 (encompasses Move, Heroic Action, Reinforce) */}
          <rect x="302" y="101" width="290" height="357" rx="2" fill="none" stroke="#7a6a52" strokeWidth="1.5"/>
          {/* End of Turn border: y=464–503  */}
          <rect x="302" y="464" width="290" height="39" rx="2" fill="none" stroke="#7a6a52" strokeWidth="1.5"/>

          {/* START OF TURN */}
          <g id="startOfTurn">
            <rect x="302" y="18" width="290" height="18" rx="2" fill="url(#sectionHeader)"/>
            <text x="316" y="31" fontFamily="Arial, sans-serif" fontSize="10" fontWeight="bold" fill="#d4c4a8" letterSpacing="2" fontVariant="small-caps">START OF TURN</text>

            {/* Banner action */}
            <rect x="310" y="46" width="274" height="46" rx="3" fill="#4a4035" stroke="#5a4a35" strokeWidth="0.5"/>
            <use href="#glyphBanner" x="316" y="50" width="22" height="36" color="#c4a882"/>
            <text x="346" y="64" fontFamily="Arial, sans-serif" fontSize="13" fontWeight="bold" fill="#e8d8c0">BANNER</text>
            <text x="346" y="80" fontFamily="Arial, sans-serif" fontSize="10" fill="#b0a088">Gain 1 potion</text>
          </g>

          {/* MIDDLE OF TURN */}
          <g id="middleOfTurn">
            <rect x="302" y="101" width="290" height="18" rx="2" fill="url(#sectionHeader)"/>
            <text x="316" y="114" fontFamily="Arial, sans-serif" fontSize="10" fontWeight="bold" fill="#d4c4a8" letterSpacing="1.5" fontVariant="small-caps">MIDDLE OF TURN</text>
            <text x="460" y="114" fontFamily="Arial, sans-serif" fontSize="8" fill="#a09080" fontVariant="small-caps">IN ANY ORDER</text>

            {/* Move action */}
            <rect x="310" y="124" width="274" height="44" rx="3" fill="#4a4035" stroke="#5a4a35" strokeWidth="0.5"/>
            {/* Move icon (boot silhouette) */}
            <g transform="translate(319,135)">
              <path d="M5.6,0.2 C5.4,0.3 5.2,0.4 5.1,0.6 C5.1,0.6 5.0,1.0 4.9,1.4 C4.5,3.6 3.8,6.0 3.1,8.1 C2.9,8.6 2.4,9.8 2.1,10.4 C1.8,11.1 1.5,11.6 1.1,12.3 C0.3,13.6 0.1,14.3 0.0,15.3 C0.0,15.7 0.0,15.9 0.1,17.0 C0.2,18.6 0.2,19.3 0.3,20.1 C0.3,20.9 0.3,21.0 0.5,21.3 C0.8,21.5 0.6,21.5 4.0,21.5 C5.9,21.5 7.1,21.5 7.2,21.5 C7.3,21.4 7.6,21.2 7.7,21.0 C7.7,21.0 7.8,20.6 7.9,20.1 L8.1,19.3 8.3,19.3 C8.5,19.3 9.8,19.5 10.3,19.7 C11.0,19.9 11.9,20.5 12.6,21.1 C12.8,21.2 13.0,21.4 13.1,21.4 L13.2,21.5 16.7,21.5 C19.3,21.5 20.3,21.5 20.4,21.5 C20.6,21.4 20.8,21.2 20.9,21.1 C21.0,20.9 21.8,18.6 21.9,18.4 C22.0,17.8 22.0,17.2 21.7,16.8 C21.5,16.4 21.0,16.0 20.5,15.8 C20.3,15.8 19.6,15.6 18.9,15.4 C17.2,14.9 16.3,14.7 15.5,14.3 C14.1,13.7 13.3,13.0 12.9,12.2 C12.8,11.8 12.7,11.4 12.7,10.9 C12.8,9.8 13.1,8.6 13.9,7.0 C14.5,5.9 15.2,4.8 16.6,2.6 C16.9,2.1 17.3,1.5 17.3,1.4 C17.5,1.2 17.5,0.9 17.4,0.7 C17.4,0.5 17.2,0.3 17.0,0.2 C16.7,0.1 16.3,0.1 16.1,0.4 C15.9,0.5 14.1,3.4 13.4,4.6 C12.6,5.9 11.9,7.4 11.5,8.4 C11.2,9.5 11.1,10.0 11.1,11.0 C11.1,11.6 11.1,11.8 11.2,12.1 C11.4,12.9 11.7,13.5 12.3,14.2 C13.3,15.3 15.0,16.1 17.7,16.8 C18.2,16.9 18.9,17.1 19.3,17.2 C19.7,17.3 20.0,17.4 20.1,17.4 C20.4,17.5 20.4,17.7 19.9,18.9 L19.6,19.9 16.7,19.9 L13.7,19.9 13.5,19.7 C12.6,18.9 11.5,18.3 10.4,18.0 C9.5,17.8 7.6,17.6 7.3,17.7 C7.1,17.8 6.9,17.9 6.8,18.1 C6.8,18.1 6.6,18.5 6.6,18.9 C6.5,19.2 6.4,19.6 6.3,19.7 L6.3,19.9 4.1,19.9 L1.9,19.9 1.9,19.6 C1.9,19.3 1.8,18.1 1.7,16.7 C1.6,15.5 1.7,15.1 1.9,14.3 C2.0,14.0 2.1,13.9 2.7,12.8 C4.0,10.7 5.1,7.6 5.9,4.5 C6.3,3.0 6.6,1.3 6.6,1.0 C6.6,0.4 6.1,0.0 5.6,0.2 Z" fill="#c4a882"/>
            </g>
            <text x="348" y="142" fontFamily="Arial, sans-serif" fontSize="13" fontWeight="bold" fill="#e8d8c0">MOVE 3</text>
            <text x="411" y="142" fontFamily="Arial, sans-serif" fontSize="8" fill="#a09080" fontVariant="small-caps">(SPLIT AS NEEDED)</text>
            <text x="348" y="158" fontFamily="Arial, sans-serif" fontSize="10" fill="#b0a088">Spend 1 </text>
            <use href="#iconSpirit" x="399" y="148" width="12" height="12"/>
            <text x="414" y="158" fontFamily="Arial, sans-serif" fontSize="10" fill="#b0a088"> to double your move</text>
          </g>

          {/* HEROIC ACTION */}
          <g id="heroicAction">
            <rect x="310" y="176" width="274" height="16" rx="2" fill="url(#sectionHeader)"/>
            <text x="316" y="188" fontFamily="Arial, sans-serif" fontSize="9" fontWeight="bold" fill="#d4c4a8" letterSpacing="1.5" fontVariant="small-caps">HEROIC ACTION</text>

            {/* CHOOSE ONE bracket (left side) */}
            <g transform="translate(314,200)">
              <path d="M4,0 Q0,0 0,6 L0,56 Q0,62 4,62" fill="none" stroke="#8a7a62" strokeWidth="1.2"/>
              <text x="2" y="36" fontFamily="Arial, sans-serif" fontSize="7" fill="#8a7a62" letterSpacing="1.5" transform="rotate(-90, 2, 36)" textAnchor="middle" fontVariant="small-caps">CHOOSE ONE</text>
            </g>

            {/* GAIN 2 AFTER bracket (right side) */}
            <g transform="translate(578,200)">
              <path d="M0,0 Q4,0 4,6 L4,56 Q4,62 0,62" fill="none" stroke="#8a7a62" strokeWidth="1.2"/>
              <text x="2" y="14" fontFamily="Arial, sans-serif" fontSize="7" fill="#8a7a62" letterSpacing="1" transform="rotate(90, 2, 14)" fontVariant="small-caps">GAIN 2</text>
              <use href="#iconSpirit" x="-4" y="28" width="11" height="11"/>
              <text x="2" y="52" fontFamily="Arial, sans-serif" fontSize="7" fill="#8a7a62" letterSpacing="1" transform="rotate(90, 2, 52)" fontVariant="small-caps">AFTER</text>
            </g>

            {/* Cleanse */}
            <rect x="330" y="198" width="244" height="36" rx="3" fill="#4a4035" stroke="#5a4a35" strokeWidth="0.5"/>
            <use href="#glyphCleanse" x="335" y="200" width="22" height="30" color="#c4a882"/>
            <text x="364" y="214" fontFamily="Arial, sans-serif" fontSize="12" fontWeight="bold" fill="#e8d8c0">CLEANSE</text>
            <text x="364" y="228" fontFamily="Arial, sans-serif" fontSize="9" fill="#b0a088">Remove all skulls from your space</text>

            {/* Battle */}
            <rect x="330" y="240" width="244" height="36" rx="3" fill="#4a4035" stroke="#5a4a35" strokeWidth="0.5"/>
            <use href="#glyphBattle" x="335" y="243" width="22" height="30" color="#c4a882"/>
            <text x="364" y="256" fontFamily="Arial, sans-serif" fontSize="12" fontWeight="bold" fill="#e8d8c0">BATTLE</text>
            <text x="364" y="270" fontFamily="Arial, sans-serif" fontSize="9" fill="#b0a088">Battle a foe on your space</text>

            {/* Quest */}
            <rect x="330" y="282" width="244" height="36" rx="3" fill="#4a4035" stroke="#5a4a35" strokeWidth="0.5"/>
            <use href="#glyphQuest" x="335" y="285" width="22" height="30" color="#c4a882"/>
            <text x="364" y="298" fontFamily="Arial, sans-serif" fontSize="12" fontWeight="bold" fill="#e8d8c0">QUEST</text>
            <text x="364" y="312" fontFamily="Arial, sans-serif" fontSize="9" fill="#b0a088">Complete a quest or explore a dungeon</text>
          </g>

          {/* REINFORCE */}
          <g id="reinforce">
            <rect x="310" y="326" width="274" height="18" rx="2" fill="url(#sectionHeader)"/>
            <use href="#glyphReinforce" x="312" y="327" width="16" height="16" color="#d4c4a8"/>
            <text x="332" y="339" fontFamily="Arial, sans-serif" fontSize="10" fontWeight="bold" fill="#d4c4a8" letterSpacing="1">REINFORCE</text>
            <text x="310" y="356" fontFamily="Arial, sans-serif" fontSize="8" fill="#8a7a62" fontVariant="small-caps">ON A SPACE WITH A BUILDING</text>

            {/* CHOOSE ONE bracket */}
            <g transform="translate(314,362)">
              <path d="M4,0 Q0,0 0,5 L0,90 Q0,95 4,95" fill="none" stroke="#8a7a62" strokeWidth="1.2"/>
              <text x="2" y="52" fontFamily="Arial, sans-serif" fontSize="7" fill="#8a7a62" letterSpacing="1.5" transform="rotate(-90, 2, 52)" textAnchor="middle" fontVariant="small-caps">CHOOSE ONE</text>
            </g>

            {/* Citadel */}
            <g transform="translate(328, 362)">
              <use href="#iconCitadel" x="0" y="2" width="16" height="16" color="#c4a882"/>
              <text x="22" y="13" fontFamily="Arial, sans-serif" fontSize="10" fontWeight="bold" fill="#e8d8c0">CITADEL</text>
              <text x="108" y="7" fontFamily="Arial, sans-serif" fontSize="8" fill="#b0a088"><tspan fontWeight="bold" fill="#c4a882">Free:</tspan> Gain 1 potion</text>
              <text x="108" y="18" fontFamily="Arial, sans-serif" fontSize="8" fill="#b0a088">5 </text>
              <use href="#iconSpirit" x="116" y="10" width="10" height="10"/>
              <text x="128" y="18" fontFamily="Arial, sans-serif" fontSize="8" fill="#b0a088">: Gain 1 virtue</text>
            </g>

            {/* Sanctuary */}
            <g transform="translate(328, 386)">
              <use href="#iconSanctuary" x="0" y="2" width="16" height="16" color="#c4a882"/>
              <text x="22" y="13" fontFamily="Arial, sans-serif" fontSize="10" fontWeight="bold" fill="#e8d8c0">SANCTUARY</text>
              <text x="108" y="7" fontFamily="Arial, sans-serif" fontSize="8" fill="#b0a088"><tspan fontWeight="bold" fill="#c4a882">Free:</tspan> Gain 1 </text>
              <use href="#iconSpirit" x="155" y="-1" width="10" height="10"/>
              <text x="108" y="18" fontFamily="Arial, sans-serif" fontSize="8" fill="#b0a088">5 </text>
              <use href="#iconSpirit" x="116" y="10" width="10" height="10"/>
              <text x="128" y="18" fontFamily="Arial, sans-serif" fontSize="8" fill="#b0a088">: Remove all corruptions</text>
            </g>

            {/* Village */}
            <g transform="translate(328, 410)">
              <use href="#iconVillage" x="0" y="2" width="16" height="16" color="#c4a882"/>
              <text x="22" y="13" fontFamily="Arial, sans-serif" fontSize="10" fontWeight="bold" fill="#e8d8c0">VILLAGE</text>
              <text x="108" y="7" fontFamily="Arial, sans-serif" fontSize="8" fill="#b0a088"><tspan fontWeight="bold" fill="#c4a882">Free:</tspan> Gain 6 </text>
              <use href="#iconWarrior" x="150" y="-1" width="10" height="10"/>
              <text x="108" y="18" fontFamily="Arial, sans-serif" fontSize="8" fill="#b0a088">1 </text>
              <use href="#iconSpirit" x="116" y="10" width="10" height="10"/>
              <text x="128" y="18" fontFamily="Arial, sans-serif" fontSize="8" fill="#b0a088">: Gain 12 </text>
              <use href="#iconWarrior" x="169" y="10" width="10" height="10"/>
            </g>

            {/* Bazaar */}
            <g transform="translate(328, 434)">
              <use href="#iconBazaar" x="0" y="2" width="16" height="16" color="#c4a882"/>
              <text x="22" y="13" fontFamily="Arial, sans-serif" fontSize="10" fontWeight="bold" fill="#e8d8c0">BAZAAR</text>
              <text x="108" y="7" fontFamily="Arial, sans-serif" fontSize="8" fill="#b0a088"><tspan fontWeight="bold" fill="#c4a882">Free:</tspan> Gain 1 gear</text>
              <text x="108" y="18" fontFamily="Arial, sans-serif" fontSize="8" fill="#b0a088">2 </text>
              <use href="#iconSpirit" x="116" y="10" width="10" height="10"/>
              <text x="128" y="18" fontFamily="Arial, sans-serif" fontSize="8" fill="#b0a088">: Gain 1 treasure</text>
            </g>
          </g>

          {/* END OF TURN */}
          <g id="endOfTurn">
            <rect x="302" y="464" width="290" height="18" rx="2" fill="url(#sectionHeader)"/>
            <text x="316" y="477" fontFamily="Arial, sans-serif" fontSize="10" fontWeight="bold" fill="#d4c4a8" letterSpacing="1.5" fontVariant="small-caps">END OF TURN</text>
            <text x="316" y="496" fontFamily="Arial, sans-serif" fontSize="10" fill="#b0a088">Drop 1 skull into the Tower</text>
          </g>
        </g>

        {/* ============================== */}
        {/* RIGHT PANEL - Virtues           */}
        {/* ============================== */}
        <g id="rightPanel">
          {/* VIRTUES Header bar */}
          <rect x="602" y="14" width="298" height="30" rx="3" fill="#3d3529"/>
          <rect x="602" y="14" width="298" height="30" rx="3" fill="none" stroke="url(#goldGradH)" strokeWidth="1"/>
          <text x="751" y="35" textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontSize="18" fontWeight="bold" fill="#d4c4a8" letterSpacing="4">VIRTUES</text>

          {/* ===== Row 1: Large left virtue + Small right virtue ===== */}

          {/* Virtue 1 (primary ability with glyph) */}
          <g id="virtue1Slot">
            {/* Ornamental outer border */}
            <rect x="602" y="52" width="144" height="82" rx="5" fill="#c8b898" stroke="url(#goldOrnament)" strokeWidth="2.5"/>
            {/* Inner fill */}
            <rect x="605" y="55" width="138" height="76" rx="4" fill="#d8c8a4"/>
            {/* Corner accents */}
            <line x1="602" y1="60" x2="608" y2="60" stroke="url(#goldOrnament)" strokeWidth="2"/>
            <line x1="602" y1="60" x2="602" y2="66" stroke="url(#goldOrnament)" strokeWidth="2"/>
            <line x1="746" y1="60" x2="740" y2="60" stroke="url(#goldOrnament)" strokeWidth="2"/>
            <line x1="746" y1="60" x2="746" y2="66" stroke="url(#goldOrnament)" strokeWidth="2"/>
            <line x1="602" y1="126" x2="608" y2="126" stroke="url(#goldOrnament)" strokeWidth="2"/>
            <line x1="602" y1="126" x2="602" y2="120" stroke="url(#goldOrnament)" strokeWidth="2"/>
            <line x1="746" y1="126" x2="740" y2="126" stroke="url(#goldOrnament)" strokeWidth="2"/>
            <line x1="746" y1="126" x2="746" y2="120" stroke="url(#goldOrnament)" strokeWidth="2"/>
            {/* Virtue name tab */}
            <rect x="634" y="45" width="80" height="17" rx="3" fill="#3d3529" stroke="url(#goldOrnament)" strokeWidth="1.5"/>
            <text x="674" y="57" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="#d4c4a8" letterSpacing="1.5">{hero.virtues[0].name.toUpperCase()}</text>
            {/* Glyph icon */}
            <use href="#iconGlyph" x="662" y="66" width="24" height="24" color="#6b5d4a"/>
            {/* Ability text */}
            <text x="674" y="106" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="10" fill="#4a3d2e" fontWeight="bold">{`+1 ${hero.virtues[0].advantageType} Advantage`}</text>
          </g>

          {/* Virtue 2 */}
          <g id="virtue2Slot">
            <rect x="756" y="52" width="144" height="82" rx="5" fill="#c8b898" stroke="url(#goldOrnament)" strokeWidth="2.5"/>
            <rect x="759" y="55" width="138" height="76" rx="4" fill="#d8c8a4"/>
            {/* Corner accents */}
            <line x1="756" y1="60" x2="762" y2="60" stroke="url(#goldOrnament)" strokeWidth="2"/>
            <line x1="756" y1="60" x2="756" y2="66" stroke="url(#goldOrnament)" strokeWidth="2"/>
            <line x1="900" y1="60" x2="894" y2="60" stroke="url(#goldOrnament)" strokeWidth="2"/>
            <line x1="900" y1="60" x2="900" y2="66" stroke="url(#goldOrnament)" strokeWidth="2"/>
            <line x1="756" y1="126" x2="762" y2="126" stroke="url(#goldOrnament)" strokeWidth="2"/>
            <line x1="756" y1="126" x2="756" y2="120" stroke="url(#goldOrnament)" strokeWidth="2"/>
            <line x1="900" y1="126" x2="894" y2="126" stroke="url(#goldOrnament)" strokeWidth="2"/>
            <line x1="900" y1="126" x2="900" y2="120" stroke="url(#goldOrnament)" strokeWidth="2"/>
            {/* Virtue name tab */}
            <rect x="788" y="45" width="80" height="17" rx="3" fill="#3d3529" stroke="url(#goldOrnament)" strokeWidth="1.5"/>
            <text x="828" y="57" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="#d4c4a8" letterSpacing="1">{hero.virtues[1].name.toUpperCase()}</text>
            {/* Ability text */}
            <text x="828" y="90" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="9" fill="#4a3d2e">{hero.virtues[1].line1}</text>
            <text x="828" y="103" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="9" fill="#4a3d2e">{hero.virtues[1].line2}</text>
          </g>

          {/* ===== Row 2: Two equal virtues ===== */}

          {/* Virtue 3 */}
          <g id="virtue3Slot">
            <rect x="602" y="144" width="144" height="82" rx="5" fill="#c8b898" stroke="url(#goldOrnament)" strokeWidth="2.5"/>
            <rect x="605" y="147" width="138" height="76" rx="4" fill="#d8c8a4"/>
            <line x1="602" y1="152" x2="608" y2="152" stroke="url(#goldOrnament)" strokeWidth="2"/>
            <line x1="602" y1="152" x2="602" y2="158" stroke="url(#goldOrnament)" strokeWidth="2"/>
            <line x1="746" y1="152" x2="740" y2="152" stroke="url(#goldOrnament)" strokeWidth="2"/>
            <line x1="746" y1="152" x2="746" y2="158" stroke="url(#goldOrnament)" strokeWidth="2"/>
            <line x1="602" y1="218" x2="608" y2="218" stroke="url(#goldOrnament)" strokeWidth="2"/>
            <line x1="602" y1="218" x2="602" y2="212" stroke="url(#goldOrnament)" strokeWidth="2"/>
            <line x1="746" y1="218" x2="740" y2="218" stroke="url(#goldOrnament)" strokeWidth="2"/>
            <line x1="746" y1="218" x2="746" y2="212" stroke="url(#goldOrnament)" strokeWidth="2"/>
            <rect x="634" y="137" width="80" height="17" rx="3" fill="#3d3529" stroke="url(#goldOrnament)" strokeWidth="1.5"/>
            <text x="674" y="149" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="#d4c4a8" letterSpacing="1">{hero.virtues[2].name.toUpperCase()}</text>
            <text x="674" y="182" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="9" fill="#4a3d2e">{hero.virtues[2].line1}</text>
            <text x="674" y="195" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="9" fill="#4a3d2e">{hero.virtues[2].line2}</text>
          </g>

          {/* Virtue 4 */}
          <g id="virtue4Slot">
            <rect x="756" y="144" width="144" height="82" rx="5" fill="#c8b898" stroke="url(#goldOrnament)" strokeWidth="2.5"/>
            <rect x="759" y="147" width="138" height="76" rx="4" fill="#d8c8a4"/>
            <line x1="756" y1="152" x2="762" y2="152" stroke="url(#goldOrnament)" strokeWidth="2"/>
            <line x1="756" y1="152" x2="756" y2="158" stroke="url(#goldOrnament)" strokeWidth="2"/>
            <line x1="900" y1="152" x2="894" y2="152" stroke="url(#goldOrnament)" strokeWidth="2"/>
            <line x1="900" y1="152" x2="900" y2="158" stroke="url(#goldOrnament)" strokeWidth="2"/>
            <line x1="756" y1="218" x2="762" y2="218" stroke="url(#goldOrnament)" strokeWidth="2"/>
            <line x1="756" y1="218" x2="756" y2="212" stroke="url(#goldOrnament)" strokeWidth="2"/>
            <line x1="900" y1="218" x2="894" y2="218" stroke="url(#goldOrnament)" strokeWidth="2"/>
            <line x1="900" y1="218" x2="900" y2="212" stroke="url(#goldOrnament)" strokeWidth="2"/>
            <rect x="788" y="137" width="80" height="17" rx="3" fill="#3d3529" stroke="url(#goldOrnament)" strokeWidth="1.5"/>
            <text x="828" y="149" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="#d4c4a8" letterSpacing="1">{hero.virtues[3].name.toUpperCase()}</text>
            <text x="828" y="182" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="9" fill="#4a3d2e">{hero.virtues[3].line1}</text>
            <text x="828" y="195" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="9" fill="#4a3d2e">{hero.virtues[3].line2}</text>
          </g>

          {/* ===== Row 3: Virtue 5 + Champion ===== */}

          {/* Virtue 5 */}
          <g id="virtue5Slot">
            <rect x="602" y="236" width="144" height="82" rx="5" fill="#c8b898" stroke="url(#goldOrnament)" strokeWidth="2.5"/>
            <rect x="605" y="239" width="138" height="76" rx="4" fill="#d8c8a4"/>
            <line x1="602" y1="244" x2="608" y2="244" stroke="url(#goldOrnament)" strokeWidth="2"/>
            <line x1="602" y1="244" x2="602" y2="250" stroke="url(#goldOrnament)" strokeWidth="2"/>
            <line x1="746" y1="244" x2="740" y2="244" stroke="url(#goldOrnament)" strokeWidth="2"/>
            <line x1="746" y1="244" x2="746" y2="250" stroke="url(#goldOrnament)" strokeWidth="2"/>
            <line x1="602" y1="310" x2="608" y2="310" stroke="url(#goldOrnament)" strokeWidth="2"/>
            <line x1="602" y1="310" x2="602" y2="304" stroke="url(#goldOrnament)" strokeWidth="2"/>
            <line x1="746" y1="310" x2="740" y2="310" stroke="url(#goldOrnament)" strokeWidth="2"/>
            <line x1="746" y1="310" x2="746" y2="304" stroke="url(#goldOrnament)" strokeWidth="2"/>
            <rect x="634" y="229" width="80" height="17" rx="3" fill="#3d3529" stroke="url(#goldOrnament)" strokeWidth="1.5"/>
            <text x="674" y="241" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="#d4c4a8" letterSpacing="1">{hero.virtues[4].name.toUpperCase()}</text>
            <text x="674" y="272" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="9" fill="#4a3d2e">{hero.virtues[4].line1}</text>
            <text x="674" y="285" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="9" fill="#4a3d2e">{hero.virtues[4].line2}</text>
          </g>

          {/* Champion slot (dark teal/green background) */}
          <g id="championSlot">
            <rect x="756" y="236" width="144" height="82" rx="5" fill="url(#championBg)" stroke="url(#goldOrnament)" strokeWidth="2.5"/>
            <rect x="759" y="239" width="138" height="76" rx="4" fill="#3a4a42" opacity="0.6"/>
            {/* Corner accents */}
            <line x1="756" y1="244" x2="762" y2="244" stroke="url(#goldOrnament)" strokeWidth="2"/>
            <line x1="756" y1="244" x2="756" y2="250" stroke="url(#goldOrnament)" strokeWidth="2"/>
            <line x1="900" y1="244" x2="894" y2="244" stroke="url(#goldOrnament)" strokeWidth="2"/>
            <line x1="900" y1="244" x2="900" y2="250" stroke="url(#goldOrnament)" strokeWidth="2"/>
            <line x1="756" y1="310" x2="762" y2="310" stroke="url(#goldOrnament)" strokeWidth="2"/>
            <line x1="756" y1="310" x2="756" y2="304" stroke="url(#goldOrnament)" strokeWidth="2"/>
            <line x1="900" y1="310" x2="894" y2="310" stroke="url(#goldOrnament)" strokeWidth="2"/>
            <line x1="900" y1="310" x2="900" y2="304" stroke="url(#goldOrnament)" strokeWidth="2"/>
            {/* Champion name tab (wider) */}
            <rect x="769" y="229" width="118" height="17" rx="3" fill="#3d3529" stroke="url(#goldOrnament)" strokeWidth="1.5"/>
            <text x="828" y="241" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="7" fontWeight="bold" fill="#d4c4a8" letterSpacing="0.5">CHAMPION OF THE</text>
            {/* Glyph icon */}
            <use href="#iconGlyph" x="817" y="250" width="22" height="22" color="#c4a882"/>
            <text x="828" y="286" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="9" fill="#c4a882">+2 Wild Advantages</text>
            <text x="828" y="299" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="9" fill="#c4a882">{`in ${hero.championTerrain}`}</text>
          </g>

          {/* ============================== */}
          {/* CORRUPTIONS                     */}
          {/* ============================== */}
          <g id="corruptions">
            {/* Corruptions header */}
            <rect x="602" y="328" width="298" height="24" rx="3" fill="none"/>
            <text x="751" y="347" textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontSize="16" fontWeight="bold" fill="#3d3529" letterSpacing="4">CORRUPTIONS</text>
            {/* Decorative line under header */}
            <line x1="650" y1="354" x2="852" y2="354" stroke="#8b7355" strokeWidth="0.8"/>

            {/* Corruption slot 1 */}
            <rect x="602" y="362" width="144" height="105" rx="5" fill="#c8b898" stroke="#a89878" strokeWidth="1.5" opacity="0.5"/>
            <rect x="605" y="365" width="138" height="99" rx="4" fill="#d4c4a8" opacity="0.3"/>

            {/* Corruption slot 2 */}
            <rect x="756" y="362" width="144" height="105" rx="5" fill="#c8b898" stroke="#a89878" strokeWidth="1.5" opacity="0.5"/>
            <rect x="759" y="365" width="138" height="99" rx="4" fill="#d4c4a8" opacity="0.3"/>
          </g>
        </g>

        {/* ============================== */}
        {/* BOTTOM BAR - Treasures          */}
        {/* ============================== */}
        <g id="bottomBar">
          {/* Dark bar background */}
          <rect x="0" y="506" width="910" height="100" fill="url(#bottomBar)"/>
          {/* Gold accent line at top of bar */}
          <rect x="0" y="506" width="910" height="2" fill="url(#goldGradH)"/>

          {/* Treasures header tab */}
          <rect x="370" y="510" width="170" height="24" rx="4" fill="#3d3529" stroke="url(#goldGradH)" strokeWidth="2"/>
          <text x="455" y="527" textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontSize="14" fontWeight="bold" fill="#d4c4a8" letterSpacing="3">TREASURES</text>

          {/* Treasure slots (4) */}
          <rect x="80" y="542" width="164" height="52" rx="4" fill="#5a4a35" stroke="#7a6a50" strokeWidth="1"/>
          <rect x="82" y="544" width="160" height="48" rx="3" fill="none" stroke="#4a3a28" strokeWidth="0.5"/>

          <rect x="264" y="542" width="164" height="52" rx="4" fill="#5a4a35" stroke="#7a6a50" strokeWidth="1"/>
          <rect x="266" y="544" width="160" height="48" rx="3" fill="none" stroke="#4a3a28" strokeWidth="0.5"/>

          <rect x="482" y="542" width="164" height="52" rx="4" fill="#5a4a35" stroke="#7a6a50" strokeWidth="1"/>
          <rect x="484" y="544" width="160" height="48" rx="3" fill="none" stroke="#4a3a28" strokeWidth="0.5"/>

          <rect x="666" y="542" width="164" height="52" rx="4" fill="#5a4a35" stroke="#7a6a50" strokeWidth="1"/>
          <rect x="668" y="544" width="160" height="48" rx="3" fill="none" stroke="#4a3a28" strokeWidth="0.5"/>
        </g>

      </svg>
    </div>
  );
}
