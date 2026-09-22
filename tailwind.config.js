/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        imd: {
          navy: '#0b2545',
          dark: '#13315c',
          primary: '#134074',
          accent: '#0077b6',
          light: '#eef4f8',
          gold: '#c59b27',
          surface: '#f8fafc',
          border: '#cbd5e1',
          warningRed: '#dc2626',
          warningOrange: '#ea580c',
          warningYellow: '#ca8a04',
          warningGreen: '#16a34a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'Roboto', 'system-ui', 'sans-serif'],
        serif: ['Merriweather', 'Georgia', 'serif'],
        mono: ['Fira Code', 'monospace'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
