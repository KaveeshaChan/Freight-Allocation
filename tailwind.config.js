/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,js,jsx,ts,tsx}', // Adjust this path based on your project structure
  ],
  theme: {
    extend: {
      colors: {
        darkGreen: '#344E41',
        mediumGreen: '#3A5A40',
        oliveGreen: '#588157',
        lightOliveGreen: '#A3B18A',
        lightBeige: '#DAD7CD',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'], // Use Poppins as the default sans font
      },
    },
  },
  plugins: [],
};
