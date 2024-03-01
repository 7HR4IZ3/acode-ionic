import { resolve } from "path";
import { defineConfig, transformWithEsbuild } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  root: resolve(__dirname, "src"),
  build: {
    outDir: resolve(__dirname, "dist"),
    minify: false,
    emptyOutDir: true
  },
  plugins: [
    {
      name: "treat-js-files-as-jsx",
      async transform(code, id) {
        if (!id.match(/src\/.*\.js$/)) return null;

        // Use the exposed transform from vite, instead of directly
        // transforming with esbuild
        return transformWithEsbuild(code, id, {
          loader: "jsx",
          jsx: "automatic"
        });
      }
    },
    react({
      babel: {
        plugins: [
          "html-tag-js/jsx/jsx-to-tag.js",
          "html-tag-js/jsx/syntax-parser.js",
          "@babel/plugin-transform-runtime",
          "@babel/plugin-transform-block-scoping"
        ],
        compact: false,
        sourceMaps: "inline"
      }
    })
  ],

  optimizeDeps: {
    force: true,
    esbuildOptions: {
      loader: {
        ".js": "jsx"
      }
    }
  },

  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "#root": resolve(__dirname)
    }
  },

  assetsInclude: ["**/*.hbs", "./src/assets/js/emmet-core.js"]
});
