/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#EF5DA8", 
        primaryLight: "rgba(239, 93, 168, 0.9)",
        secondary: 'rgba(174, 175, 247, 0.6)',
        gray: {
          400: "#9CA3AF", 
        },
        green: {
          400: '#DDF6D2',
          500: '#16a34a',
          600: '#15803d',
          700: '#166534',
        },
        buttonPink: {
          500: '#EF5DA8',
        },
        buttonOrange: {
          500: '#F09E54',
        },
        buttonBlue: {
          500: '#AEAFF7'
        },
        buttonGreen: {
          500: '#A0E3E2'
        },
        pink: {
          100: '#FCDDEC',
          500: '#EF5DA8'
        },
        orange: {
          100: '#FFB1A7'
        }
      },
      keyframes: {
        typewriter: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
      },
      animation: {
        'spin-slow': 'spin 2s linear',
        typewriter: 'typewriter 1.2s steps(20, end) forwards',
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"], // Example font family
        serif: ["Merriweather", "serif"], // Example font family
        alegreya: ['Alegreya'],
        alegreyaBold: ['Alegreya-Bold'],
        alegrayaSCB: ['AlegreyaSCB'],
        alegreyaSC: ['AlegreyaSC'],
        poppins: ['Poppins', 'sans-serif'],
        poppinsBold: ['Poppins', 'sans-serif']
      },
      spacing: {
        '128': '32rem', // Example custom spacing
        '144': '36rem', // Example custom spacing
      },
      borderRadius: {
        '4xl': '2rem', // Example custom border radius
      },
      dropShadow: {
        'custom': '0 0 4px rgba(0, 0, 0, 0.25)', // Example custom shadow
      },
      screens: {
        '3xl': '1600px', // Example custom screen size
      },
      fontSize: {
        'xxs': '0.625rem', // Example custom font size
        'xxl': '1.5rem', // Example custom font size
      },  
    },
  },
  plugins: [],
}