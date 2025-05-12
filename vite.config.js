// CommonJS 語法，兼容性更好
const { defineConfig } = require('vite');
const vue = require('@vitejs/plugin-vue');
const path = require('path');

module.exports = defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    outDir: 'public',
    minify: 'esbuild',
    minifyOptions: {
      target: 'es2015',
      drop: ['console', 'debugger']
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
        }
      }
    },
    sourcemap: false,
    cssCodeSplit: false
  },
  base: './'
});
