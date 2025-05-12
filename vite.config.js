/* eslint-env node */
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'public',
    minify: 'esbuild',
    minifyOptions: {
      target: 'es2015',
      drop: ['console', 'debugger'],
    },
    rollupOptions: {
      output: {
        entryFileNames: 'js/[name].[hash:8].min.js',
        chunkFileNames: 'js/[name].[hash:8].min.js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith('.css')) {
            return 'css/[name].[hash:8].min.css';
          }
          return 'assets/[name].[hash:8][extname]';
        },
      },
    },
    sourcemap: false,
    cssCodeSplit: false,
  },
  base: process.env.NODE_ENV === 'production' ? '/vue-calculator/' : './',
});
