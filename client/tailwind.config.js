/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      container: {
        center: true,
        padding: {
          DEFAULT: "12px",
          xs: "12px",
          sm: "12px",
          md: "2rem",
          lg: "3rem",
          xl: "3rem",
          "2xl": "4rem",
        },
      },
    },
  },
  plugins: [],
}