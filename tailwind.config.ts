import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sea: {
          50:  '#F0FBFA',
          100: '#D6F5F1',
          200: '#A8E8DF',
          400: '#4FC4B7',
          600: '#2A9D8F',
        },
        coral: {
          100: '#FFE8E0',
          400: '#FF7F6B',
          600: '#E8593F',
        },
        sand: {
          100: '#FFF8ED',
          300: '#F4D9A0',
        },
        lavender: {
          100: '#F0EEFF',
          400: '#9B8FE8',
        },
        text: {
          base:  '#2D3E50',
          muted: '#7A9AAF',
          light: '#B8CDD9',
        }
      },
      boxShadow: {
        soft: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
      },
      keyframes: {
        'bubble-rise': {
          '0%': { transform: 'translateY(100%) scale(0.8)', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { transform: 'translateY(-100%) scale(1.2)', opacity: '0' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'fadeInUp': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      },
      animation: {
        'bubble-rise': 'bubble-rise 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'fadeInUp': 'fadeInUp 0.6s ease-out forwards',
      }
    },
  },
  plugins: [],
} satisfies Config
