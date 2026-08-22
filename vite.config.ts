import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0',
    // Dev server only. Dropped the wildcard 'all' (it defeats Vite's host check).
    // localhost/127.0.0.1 are always allowed; '.manus.computer' keeps the Cowork
    // cloud dev host working. Add another host here if a new dev environment needs it.
    allowedHosts: ['.manus.computer'],
  },
})
