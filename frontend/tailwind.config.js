/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          cream: '#FFFDF7',
          primary: '#D6B98C',
          beige: '#F3E9DC',
          brown: '#5B4636',
          'brown-soft': '#7A6153',
          'brown-dark': '#35251A',
          50: '#FFFDF7',
          100: '#F3E9DC',
          500: '#D6B98C',
          600: '#b8936a',
          900: '#5B4636',
        },
        winway: {
          'deep-sea': '#FFFDF7',       // Cream background
          'deep-sea-dark': '#F3E9DC',  // Beige background
          'deep-sea-light': '#FFFDF7', // Cream background
          orange: '#D6B98C',           // Gold primary
        }
      },
      animation: {
        marquee: "marquee 34s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%":   { transform: "translateX(0)" },
          "100%": { transform: "translateX(-33.333%)" },
        },
      },
    },
  },
  plugins: [],
}