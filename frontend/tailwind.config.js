/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Be Vietnam Pro"', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#4B9EFF',
          hover: '#3A82DF',
        },
        secondary: {
          DEFAULT: '#818CF8',
        },
        accent: {
          DEFAULT: '#F472B6',
        }
      }
    },
  },
  plugins: [],
}
