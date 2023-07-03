import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';

import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/

// https://blog.csdn.net/qq_43519131/article/details/127408209

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'images': fileURLToPath(new URL('./public/images', import.meta.url)),
      'svgs': fileURLToPath(new URL('./public/svgs', import.meta.url)),
    }
  }
})
