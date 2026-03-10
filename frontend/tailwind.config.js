/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ocean: {
          950: '#060f1a',
          900: '#0a1628',
          800: '#0f2040',
          700: '#1a3a5c',
          600: '#1e4a72',
        },
        teal: {
          500: '#1a9e8f',
          400: '#22c4b3',
          300: '#5dd8cc',
        },
        coral: {
          500: '#e05c3a',
          400: '#f07a5a',
        },
        gold: {
          500: '#c9a84c',
          400: '#e0c060',
        },
        text: {
          100: '#e8f4f8',
          300: '#a8c8d8',
          500: '#7aa3b8',
        }
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
        body: ['Inter', 'sans-serif'],
      },
      borderColor: {
        DEFAULT: 'rgba(26,158,143,0.2)',
      }
    },
  },
  plugins: [],
}
