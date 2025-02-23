import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const config = {
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
        main: './test.html'
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
}

export default defineConfig(config)
