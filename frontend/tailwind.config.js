/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },
    colors: {
      primary: '#53B84A',
      secondary: '#1A7B16',
      tertiary: '#122604',
      vertBG: '#1c5b1a',
      black: '#000000',
      white: '#FFFFFF',
      red: {
        500: '#EF4444',  // pour le span du composant Cards
      },
      green: {
        500: '#22C55E',  // pour le span du composant Cards
      },
    },
    fontFamily: {
    },
    extend: {
      backgroundImage: {
        'custom-svg': "url('../../frontend/src/assets/Vector_9.svg')",
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
};
