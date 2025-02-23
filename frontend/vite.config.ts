import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    cors: true,
    hmr: {
      overlay: false
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        test: './test.html'
      }
    }
  },
  resolve: {
    alias: {
      '@': '/src',
      events: 'events'
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis'
      }
    }
  },
  define: {
    'process.env': {},
    global: 'globalThis',
    'window.global': 'globalThis'
  }
})
