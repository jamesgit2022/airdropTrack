/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'neon-green': '#00E272',
        'dark-surface': '#1A1B1E',
        'dark-bg': '#000000',
      },
    },
  },
  plugins: [],
};
