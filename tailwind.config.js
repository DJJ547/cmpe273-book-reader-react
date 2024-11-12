/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mycolor: "rgba(206, 186, 164, 0.2)",
        mycolor2: "rgba(250, 248, 228, 0.7)"
      },
    },
  },
  plugins: [],
}

