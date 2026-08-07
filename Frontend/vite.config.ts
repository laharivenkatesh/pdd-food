import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { componentTagger } from "lovable-tagger";

import { transformSync } from "esbuild";

function jsxInJsPlugin() {
  return {
    name: "jsx-in-js-plugin",
    transform(code: string, id: string) {
      if (
        (id.includes("node_modules/@expo") ||
          id.includes("node_modules/react-native") ||
          id.includes("node_modules/@react-native")) &&
        id.endsWith(".js")
      ) {
        const result = transformSync(code, { loader: "tsx", jsx: "automatic" });
        return {
          code: result.code,
          map: null,
        };
      }
      return null;
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  define: {
    global: "window",
    __DEV__: JSON.stringify(mode === "development"),
    "process.env.NODE_ENV": JSON.stringify(mode),
  },
  server: {
    host: "::",
    port: 8080,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
    hmr: {
      overlay: false,
    },
  },
  esbuild: {
    loader: "tsx",
    include: /src\/.*\.tsx?$/,
  },
  plugins: [
    jsxInJsPlugin(),
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  optimizeDeps: {
    include: ["@expo/vector-icons"],
    esbuildOptions: {
      loader: {
        ".js": "jsx",
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "react-native/Libraries/Utilities/codegenNativeComponent": path.resolve(__dirname, "./src/stubs/codegenNativeComponent.js"),
      "react-native/Libraries/Utilities/codegenNativeCommands": path.resolve(__dirname, "./src/stubs/codegenNativeCommands.js"),
      "react-native": "react-native-web",
      "@react-native/assets-registry/registry": "react-native-web/dist/modules/AssetRegistry",
      "@react-native/assets-registry": "react-native-web/dist/modules/AssetRegistry",
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
}));
