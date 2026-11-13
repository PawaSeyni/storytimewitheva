import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import fs from 'node:fs'

// `vite preview` (the Playwright webServer) serves dist/ the way Netlify does, because
// src/main.tsx HYDRATES each page's prerendered snapshot: an extensionless URL without its
// trailing slash is 301-redirected to it (as production does), and an unknown URL gets
// dist/404.html with status 404. Vite's default SPA fallback would instead hand every such
// URL the HOME snapshot, which can never hydrate as another route.
function netlifyLikePreview(): Plugin {
  return {
    name: 'netlify-like-preview',
    configurePreviewServer(server) {
      const dist = path.resolve(server.config.root, server.config.build.outDir)
      server.middlewares.use((req, res, next) => {
        const [pathname, query = ''] = (req.url ?? '/').split('?')
        if (path.extname(pathname)) return next()
        const dir = path.join(dist, decodeURIComponent(pathname))
        if (!dir.startsWith(dist)) return next()
        if (fs.existsSync(path.join(dir, 'index.html'))) {
          if (pathname.endsWith('/')) return next()
          res.statusCode = 301
          res.setHeader('Location', `${pathname}/${query ? `?${query}` : ''}`)
          return res.end()
        }
        res.statusCode = 404
        res.setHeader('Content-Type', 'text/html')
        res.end(fs.readFileSync(path.join(dist, '404.html')))
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), netlifyLikePreview()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
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
