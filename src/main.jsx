import React from 'react'
import { createRoot } from 'react-dom/client'
import RoadmapPage from './components/RoadmapPage.jsx'

// Styles load in cascade order: font swap point -> tokens -> page styles.
import './styles/fonts.css'
import './styles/tokens.css'
import './styles/roadmap.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RoadmapPage />
  </React.StrictMode>,
)
