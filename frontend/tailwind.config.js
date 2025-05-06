/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'blueprint': {
          'gold': '#b39700',
          'yellow': '#ffd700',
          'bright': '#fff100',
          'light': '#eeeeee',
          'gray': '#aaaaaa',
        }
      }
    },
  },
  plugins: [],
}
