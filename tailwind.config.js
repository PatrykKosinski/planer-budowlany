/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        sand: {
          50:  '#f7f5f2',
          100: '#f0ece6',
          200: '#e8e0d5',
          300: '#c8b89a',
          400: '#9b8b6e',
          500: '#7a6d56',
        },
        stone: {
          700: '#6b6258',
          800: '#4a4038',
          900: '#2c2c2c',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'serif'],
        sans:  ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
