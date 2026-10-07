/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: '#090A0D',
          deep: '#060709',
          surface: '#0E1015',
          elevated: '#14161E',
          card: '#111319',
          highlight: '#191C26',
        },
        champagne: {
          50: '#FAF8F4',
          100: '#F4EFE6',
          200: '#E7DCB6',
          300: '#DEC996',
          400: '#D4B87A',
          DEFAULT: '#C9A96E',
          500: '#C9A96E',
          600: '#B08E51',
          700: '#8E703A',
        },
        coral: {
          DEFAULT: '#F87171',
          muted: '#E05A5A',
          subtle: 'rgba(248, 113, 113, 0.12)',
        },
        mint: {
          DEFAULT: '#34D399',
          muted: '#10B981',
          subtle: 'rgba(52, 211, 153, 0.12)',
        },
      },
      fontFamily: {
        sans: ['Inter', '"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderColor: {
        subtle: 'rgba(255, 255, 255, 0.06)',
        'subtle-light': 'rgba(255, 255, 255, 0.1)',
        'subtle-accent': 'rgba(201, 169, 110, 0.25)',
      },
      boxShadow: {
        'luxury': '0 20px 40px -15px rgba(0, 0, 0, 0.7), 0 0 1px 1px rgba(255, 255, 255, 0.05)',
        'panel': '0 10px 30px -10px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.06)',
        'glow-champagne': '0 0 25px -5px rgba(201, 169, 110, 0.2)',
      }
    },
  },
  plugins: [],
}
