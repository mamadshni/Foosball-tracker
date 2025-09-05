import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // For GitHub Pages project sites (username.github.io/repo-name/), set base:
  // Replace with your repo name if different
  base: '/foosball-tracker/',
  plugins: [react()],
})
