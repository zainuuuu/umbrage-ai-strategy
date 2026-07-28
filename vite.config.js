import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Standalone dev server for the AI Roadmap page.
// Project root is the repo root so `roadmap-content.json` (the single source
// of truth) can be imported directly and stay where the rest of the repo expects it.
export default defineConfig({
  plugins: [react()],
  server: { port: 5173, open: false },
})
