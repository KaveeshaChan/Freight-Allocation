const { Opacity } = require('@mui/icons-material');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,js,jsx,ts,tsx}', 
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
      animation: {
        spin: "spin 1s linear infinite",
        "spin-reverse": "spin 1.5s linear infinite reverse",
        progress: "progress 2s ease-in-out infinite",
        "fade-in": "fade-in 0.5s ease-out",
      },
      keyframes: {
        progress: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        fadeIn: {
          "0": {Opacity: 0},
          "100": {Opacity: 1}
        }
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'], // Use Poppins as the default sans font
      },transitionProperty: {
        'transform': 'transform',
      },
      translate: {
        'full': '100%',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
