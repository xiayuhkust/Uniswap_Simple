import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    cors: true
  },
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        test: './test.html'
      }
    }
  }
})
