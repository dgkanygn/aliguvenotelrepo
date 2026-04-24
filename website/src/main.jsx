import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import ReactGA from 'react-ga4'

import { SiteProvider } from './context/SiteContext'

// Google Analytics Initialization
const analyticsId = import.meta.env.VITE_GOOGLE_ANALYTICS_ID
ReactGA.initialize(analyticsId)

createRoot(document.getElementById('root')).render(
  <SiteProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </SiteProvider>
)
