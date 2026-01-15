/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/static/**/*.{html,js}",
    "./src/static/pages/**/*.html",
    "./src/static/js/**/*.js"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  // Important: Prevent conflicts with Bootstrap
  corePlugins: {
    preflight: false, // Disable Tailwind's base reset to avoid Bootstrap conflicts
  }
}
