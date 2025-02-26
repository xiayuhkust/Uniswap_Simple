/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./test.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        'primary': '#1a1a1a',
      },
    },
  },
  plugins: [],
}
