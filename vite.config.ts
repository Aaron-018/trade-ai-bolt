import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isBeta = mode === 'beta'
  const port = isBeta ? 3415 : 3416
  return {
    plugins: [react()],
    optimizeDeps: {
      exclude: ['lucide-react']
    },
    server: {
      host: true,
      open: false,
      port,
      proxy: {
        '/api': {
          target: '',
          changeOrigin: true
        }
      }
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    }
  }
})
