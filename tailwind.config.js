/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Manrope', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        brand: {
          DEFAULT: '#0d9488',
          light: '#0d9488',
          dark: '#2dd4bf',
        },
      },
      keyframes: {
        'pulse-critical': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(239,68,68,0.45)' },
          '50%': { boxShadow: '0 0 0 5px rgba(239,68,68,0)' },
        },
        'amb-pulse': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.25)' },
        },
        'ekg-sweep': {
          '0%': { strokeDashoffset: '0' },
          '100%': { strokeDashoffset: '-418' },
        },
      },
      animation: {
        'pulse-critical': 'pulse-critical 2.2s ease-in-out infinite',
        'amb-pulse': 'amb-pulse 1s infinite',
        'ekg-sweep': 'ekg-sweep 3.4s linear infinite',
      },
    },
  },
  plugins: [],
};
