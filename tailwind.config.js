/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Sora', 'sans-serif'],
        display: ['"Clash Display"', 'Sora', 'sans-serif'],
      },
      colors: {
        surface: {
          50:  '#f9f9f7',
          100: '#f0f0ec',
          200: '#e4e4dd',
          800: '#1c1c1a',
          850: '#171715',
          900: '#111110',
          950: '#0b0b0a',
        },
        brand: {
          DEFAULT: '#14b87e',
          light:   '#1fd494',
          dark:    '#0d8a5e',
          muted:   '#14b87e22',
        },
      },
      animation: {
        'fade-up':      'fadeUp 0.5s ease forwards',
        'fade-in':      'fadeIn 0.4s ease forwards',
        'slide-in':     'slideIn 0.3s ease forwards',
        'pulse-dot':    'pulseDot 1.4s ease-in-out infinite',
        'shimmer':      'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeUp:    { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        fadeIn:    { from: { opacity: '0' }, to: { opacity: '1' } },
        slideIn:   { from: { transform: 'translateX(-100%)' }, to: { transform: 'translateX(0)' } },
        pulseDot:  { '0%,80%,100%': { transform: 'scale(0)', opacity: '0.4' }, '40%': { transform: 'scale(1)', opacity: '1' } },
        shimmer:   { from: { backgroundPosition: '-200% 0' }, to: { backgroundPosition: '200% 0' } },
      },
    },
  },
  plugins: [],
}


