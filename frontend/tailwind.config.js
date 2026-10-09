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
          950: '#06090E',
          900: '#0B0F19',
          850: '#0F1626',
          800: '#141D30',
          700: '#1E2C48',
        },
        'shield-blue': '#2997FF',
        'shield-indigo': '#5E5CE6',
        'alert-amber': '#FF9F0A',
        'alert-red': '#FF453A',
        'shield-green': '#30D158',
        'apple-gray': {
          100: '#F5F5F7',
          300: '#D2D2D7',
          400: '#A1A1A6',
          500: '#86868B',
          600: '#6E6E73',
          700: '#48484A',
          800: '#2C2C2E',
          900: '#1C1C1E'
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"SF Pro Text"', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['"SF Mono"', 'ui-monospace', 'Menlo', 'Monaco', 'Consolas', 'monospace']
      },
      boxShadow: {
        'apple-glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)',
        'apple-card': '0 20px 40px -15px rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.06)',
        'apple-glow': '0 0 40px -10px rgba(41, 151, 255, 0.25)',
      }
    },
  },
  plugins: [],
}

