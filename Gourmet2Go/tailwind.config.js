/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        
        'sault-blue': {
          DEFAULT: '#006BA6',
          dark: '#004F7A',
          light: '#0A7FB8',
        },
        'sault-green': {
          DEFAULT: '#6B8E23',
          dark: '#556B1A',
          light: '#7FA030',
        },
        'sault-gray': {
          light: '#F5F5F5',
          DEFAULT: '#E8E8E8',
          dark: '#6B6B6B',
        },
      },
      fontFamily: {
        'display': ['"Outfit"', 'sans-serif'],
        'body': ['"Inter"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
