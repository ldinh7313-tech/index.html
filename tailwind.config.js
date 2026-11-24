/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: { ink: "#282821", paper: "#f7f6f2", moss: "#68735a", clay: "#b8785a" },
      fontFamily: { display: ["Georgia", "serif"] },
    },
  },
  plugins: [],
};
