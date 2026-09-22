import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/national-weather-big-data/' : '/',
  plugins: [react()],
  server: {
    proxy: {
      '/api/weather-news': {
        target: 'https://news.google.com',
        changeOrigin: true,
        rewrite: () => '/rss/search?q=India+weather+IMD&hl=en-IN&gl=IN&ceid=IN:en',
      },
    },
  },
}))
