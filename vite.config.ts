import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/CommuteOS/', // IMPORTANT: Must match your GitHub Repo name for Pages deployment
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
