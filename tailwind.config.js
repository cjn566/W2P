
export default {
  darkMode: 'class', // This enables dark mode based on the presence of the "dark" class in the HTML tag
  content: [
    "./assets/styles/tailwind-presets/aura/**/*.{js,vue,ts}",
    `./components/**/*.{vue,js,ts}`,
    `./layouts/**/*.vue`,
    `./pages/**/*.vue`,
    `./app.{js,ts,vue}`,
  ],
  plugins: [require('tailwindcss-primeui')],
}
