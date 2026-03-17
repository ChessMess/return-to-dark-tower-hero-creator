import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { readFileSync } from "node:fs";

const { version } = JSON.parse(readFileSync("./package.json", "utf8"));

/** Redirect old base path and bare root to the new one (dev + preview). */
function redirectLegacyPaths() {
  const oldBase = "/return-to-dark-tower-hero-creator/";
  const newBase = "/board-game-creator/";
  function middleware(req, res, next) {
    if (req.url === "/" || req.url === "") {
      res.writeHead(302, { Location: newBase });
      return res.end();
    }
    if (req.url?.startsWith(oldBase)) {
      res.writeHead(302, { Location: req.url.replace(oldBase, newBase) });
      return res.end();
    }
    next();
  }
  return {
    name: "redirect-legacy-paths",
    configureServer(server) {
      server.middlewares.use(middleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware);
    },
  };
}

export default defineConfig({
  base: "/board-game-creator/",
  define: {
    __APP_VERSION__: JSON.stringify(version),
  },
  plugins: [redirectLegacyPaths(), tailwindcss(), react()],
});
