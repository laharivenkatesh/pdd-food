declare const process: any;
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { transformSync } from 'esbuild';

function jsxInJsPlugin() {
  return {
    name: 'jsx-in-js-plugin',
    transform(code: string, id: string) {
      if (
        (id.includes('node_modules/@expo') ||
          id.includes('node_modules/react-native') ||
          id.includes('node_modules/@react-native')) &&
        (id.endsWith('.js') || id.endsWith('.mjs'))
      ) {
        const result = transformSync(code, { loader: 'tsx', jsx: 'automatic', target: 'es2020' });
        return {
          code: result.code,
          map: null,
        };
      }
      return null;
    },
  };
}

export default defineConfig({
  define: {
    global: 'window',
    __DEV__: false,
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  plugins: [jsxInJsPlugin(), react()],
  optimizeDeps: {
    include: ['@expo/vector-icons', 'react-native-web'],
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(typeof process !== 'undefined' && process.cwd ? process.cwd() : '.', './src'),
      'react-native': 'react-native-web',
      '@react-native/assets-registry/registry': 'react-native-web/dist/modules/assets-registry/registry',
      'react-native/Libraries/Image/AssetRegistry': 'react-native-web/dist/modules/assets-registry/registry',
    },
    extensions: ['.web.tsx', '.web.ts', '.tsx', '.ts', '.web.js', '.js'],
  },
  build: {
    outDir: 'dist',
  },
});
