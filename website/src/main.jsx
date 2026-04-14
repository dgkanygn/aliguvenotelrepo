import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

import { SiteProvider } from './context/SiteContext'

createRoot(document.getElementById('root')).render(
  <SiteProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </SiteProvider>
)
