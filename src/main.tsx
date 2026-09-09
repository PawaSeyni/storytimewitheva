import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { LanguageProvider } from './lib/language'
import { ToastProvider } from './lib/toast'
import { installErrorReporting } from './lib/errorReport'
import '@fontsource-variable/lexend' // self-hosted Lexend (legibility-tuned for early/dyslexic readers)
import './index.css'

// S8-012: privacy-safe error counts (error class + route pattern only), cookie-free.
installErrorReporting()

ReactDOM.createRoot(document.getElementById('root')!).render(
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
