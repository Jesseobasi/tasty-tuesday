/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx}', './app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        base: '#0f0f0f',
        offwhite: '#f7f5f2',
        accent: '#ff4f79',
        accentHover: '#ff3b6b',
        muted: '#9ca3af',
        surface: '#0b0d14',
        surfaceAlt: '#111827'
      },
      boxShadow: {
        cozy: '0 10px 30px -12px rgba(0,0,0,0.25)',
      },
      fontFamily: {
        display: ['"DM Sans"', 'Inter', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      animation: {
        fadeIn: 'fadeIn 0.6s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
