/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        farm: {
          dark:  '#1B4332',
          mid:   '#2D6A4F',
          leaf:  '#52B788',
          pale:  '#D8F3DC',
          amber: '#E9A13A',
          soil:  '#7D4F30',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
