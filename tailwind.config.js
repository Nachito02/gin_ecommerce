/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        madera: {
          claro: "#a77944",
          oscuro: "#5b3c23",
        },
        beige: "#e7dccd",
        piedra: "#d6d3cf",
        tapizado: "#f0ede9",
        carbon: "#1f1f1f",
        blanco: "#ffffff",
      },
    },
  },
  plugins: [],
}
