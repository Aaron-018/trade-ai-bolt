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
          target: 'http://100.42.177.69:8081',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, '')
        },
        '/xxx': {
          // target: 'https://a411-113-249-40-61.ngrok-free.app',
          target: 'http://localhost:8081',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/xxx/, '')
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
