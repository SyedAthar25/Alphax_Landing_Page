/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/preline/dist/*.js",
  ],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 2s linear infinite',
        'spin-slow-reverse': 'spin-reverse 3s linear infinite',
        fadeIn: "fadeIn 0.3s ease-in-out",
      },
      keyframes: {
        'spin-reverse': {
          to: { transform: 'rotate(-360deg)' },
            },
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      },
    },
  },
  plugins: [require("preline/plugin")],
  extend: {
    animation: {
      fadeIn: "fadeIn 0.3s ease-in-out",
    },
    keyframes: {
      fadeIn: {
        "0%": { opacity: 0, transform: "scale(0.95)" },
        "100%": { opacity: 1, transform: "scale(1)" },
      },
    },
  },
};
