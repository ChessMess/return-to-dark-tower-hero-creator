import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { readFileSync } from 'node:fs';

const { version } = JSON.parse(readFileSync('./package.json', 'utf8'));

/** Redirect old base path to the new one (dev + preview). */
function redirectLegacyPaths() {
  const oldBase = '/return-to-dark-tower-hero-creator/';
  const newBase = '/board-game-creator/';
  return {
    name: 'redirect-legacy-paths',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url?.startsWith(oldBase)) {
          res.writeHead(302, { Location: req.url.replace(oldBase, newBase) });
          return res.end();
        }
        next();
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url?.startsWith(oldBase)) {
          res.writeHead(302, { Location: req.url.replace(oldBase, newBase) });
          return res.end();
        }
        next();
      });
    },
  };
}

export default defineConfig({
  base: '/board-game-creator/',
  define: {
    __APP_VERSION__: JSON.stringify(version),
  },
  plugins: [
    redirectLegacyPaths(),
    tailwindcss(),
    react(),
  ],
});
