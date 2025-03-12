/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'rgb(var(--slate-100))',
          darker: 'rgb(var(--slate-200))',
          lighter: 'rgb(var(--slate-50))',
        },
        'btn-primary': {
          DEFAULT: 'rgb(var(--blue-500))',
          dark: 'rgb(var(--blue-600))',
        },
        'btn-secondary': {
          DEFAULT: 'rgb(var(--emerald-500))',
          dark: 'rgb(var(--emerald-600))',
        },
        accent: {
          DEFAULT: 'rgb(var(--blue-600))',
          light: 'rgb(var(--blue-500))',
          dark: 'rgb(var(--blue-700))',
        },
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-in-out',
      },
    },
  },
  plugins: [],
}
