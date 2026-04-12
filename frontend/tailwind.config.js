/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'navy': {
          900: '#0F1B2D',
          800: '#1A2C42',
        },
        'shield-blue': '#2563EB',
        'alert-amber': '#F59E0B'
      }
    },
  },
  plugins: [],
}
