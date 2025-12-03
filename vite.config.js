import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// For GitHub Pages, use '/sudoku/' as base (replace 'sudoku' with your repo name)
// For local development, use '/'
export default defineConfig({
  plugins: [react()],
  base: '/sudoku/',
})

