import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { readFileSync } from 'node:fs';

const { version } = JSON.parse(readFileSync('./package.json', 'utf8'));

export default defineConfig({
  base: '/return-to-dark-tower-hero-creator/',
  define: {
    __APP_VERSION__: JSON.stringify(version),
  },
  plugins: [
    tailwindcss(),
    react(),
  ],
});
