import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// Στο production build το base δείχνει στο GitHub Pages path του repo·
// τοπικά (dev server / geogame alias) μένει στη ρίζα.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/gyros-tou-kosmou/' : '/',
  plugins: [react()],
}))
