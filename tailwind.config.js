/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily:{
        bebas: ["Bebas Neue", "sans-serif"],
      },
      colors:{
        whiteColor: '#FFFFFF', // for white text 
        grayColor: '#cbd5e1',  // background
        blueColor: '#60a5fa',  // success
        redColor: '#f87171',   // failure and discount
        textAndBorder:'#374151' // default textColor
      }
    },
  },
  plugins: [],
};
