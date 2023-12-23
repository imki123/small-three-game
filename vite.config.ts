/* eslint-disable no-undef */
import { resolve } from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/small-three-game/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        game2: resolve(__dirname, 'game2/index.html'),
      },
    },
  },
})
