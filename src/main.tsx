import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { LanguageProvider } from './lib/language'
import { ToastProvider } from './lib/toast'
import { installErrorReporting } from './lib/errorReport'
import { preloadRoute } from './routeLoaders'
import '@fontsource-variable/lexend' // self-hosted Lexend (legibility-tuned for early/dyslexic readers)
import './index.css'

// S8-012: privacy-safe error counts (error class + route pattern only), cookie-free.
installErrorReporting()

const root = ReactDOM.createRoot(document.getElementById('root')!)
const render = () =>
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <LanguageProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </LanguageProvider>
      </BrowserRouter>
    </React.StrictMode>,
  )

// PD-04: the prerendered HTML stays on screen until the current route's chunk is in, so the
// first commit is the full page rather than the Suspense fallback (which pulled the footer
// into the viewport and back out: CLS 0.58 on /books). The chunk is modulepreloaded by the
// prerender, so this is normally a cache hit; a stalled load falls through after 3 s.
const settled = new Promise((resolve) => setTimeout(resolve, 3000))
Promise.race([preloadRoute(window.location.pathname), settled]).then(render, render)
