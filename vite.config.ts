import * as path from 'path';

import { defineConfig } from 'vite'
import inject from '@rollup/plugin-inject';
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), svgr(), inject({
      cn: ['classnames', 'default'],
    }),],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    assetsDir: 'goldpari-assets',
  },
})
