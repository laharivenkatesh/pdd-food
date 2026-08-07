declare const process: any;
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
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

export default defineConfig(({ mode }) => ({
  define: {
    global: "window",
    __DEV__: JSON.stringify(mode === "development"),
    "process.env.NODE_ENV": JSON.stringify(mode),
  },
  plugins: [jsxInJsPlugin(), react()],
  optimizeDeps: {
    include: ["@expo/vector-icons"],
    esbuildOptions: {
      loader: {
        ".js": "jsx",
      },
    },
  },
  resolve: {
    extensions: [
      ".web.tsx",
      ".web.ts",
      ".web.jsx",
      ".web.js",
      ".tsx",
      ".ts",
      ".jsx",
      ".js",
      ".json",
      ".mjs",
    ],
    alias: {
      "@": path.resolve(process.cwd(), "./src"),
      "react-native/Libraries/Utilities/codegenNativeComponent": path.resolve(process.cwd(), "./src/stubs/codegenNativeComponent.js"),
      "react-native/Libraries/Utilities/codegenNativeCommands": path.resolve(process.cwd(), "./src/stubs/codegenNativeCommands.js"),
      "react-native": "react-native-web",
      "@react-native/assets-registry/registry": "react-native-web/dist/modules/AssetRegistry",
      "@react-native/assets-registry": "react-native-web/dist/modules/AssetRegistry",
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
  build: {
    outDir: "dist",
  },
}));
