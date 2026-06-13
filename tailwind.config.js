/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf4ff',
          100: '#fae8ff',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
        },
        accent: {
          orange: '#f97316',
          pink: '#ec4899',
          yellow: '#eab308',
        }
      },
      fontFamily: {
        sans: ['Lexend Variable', 'Segoe UI', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Georgia', 'serif'],
      }
    },
  },
  plugins: [],
}
