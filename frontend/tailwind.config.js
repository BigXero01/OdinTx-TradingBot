/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#F7A130',
          dark: '#D4881F',
        },
        surface: {
          DEFAULT: '#0E0E0E',
          card: '#1A1A1A',
          border: '#2A2A2A',
        },
        bull: '#22C55E',
        bear: '#EF4444',
        neutral: '#A3A3A3',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
