import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: '/return-to-dark-tower-hero-creator/',
  plugins: [
    tailwindcss(),
    react(),
  ],
});
