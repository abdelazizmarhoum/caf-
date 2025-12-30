/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        whatsapp: {
          DEFAULT: '#25D366',
          teal: '#128C7E',
        },
        // Food-Zone Colors
        yellow: "#ffb703",
        black: "#000000",
        gray: "#e5e5e5",

        pool: {
          dark: '#128C7E',
          light: '#34B7F1',
          sand: '#FFD166',
          coral: '#FF9A76',
        },
        food: {
          red: '#FF6B6B',
        },
        neutral: {
          dark: '#2D3436',
          light: '#F8F9FA',
        },
      },
      fontFamily: {
        sans: ['Montserrat', 'Open Sans', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'bounce-slow': 'bounce 3s infinite',
        'ripple': 'ripple 1s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      }
    },
  },
  plugins: [],
}
