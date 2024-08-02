
export default {
  darkMode: 'class', // This enables dark mode based on the presence of the "dark" class in the HTML tag
  content: [
    "./assets/styles/tailwind-presets/aura/**/*.{js,vue,ts}",
      `./components/**/*.{vue,js,ts}`,
      `./layouts/**/*.vue`,
      `./pages/**/*.vue`,
      `./composables/**/*.{js,ts}`,
      `./plugins/**/*.{js,ts}`,
      `./utils/**/*.{js,ts}`,
      `./App.{js,ts,vue}`,
      `./app.{js,ts,vue}`,
      `./Error.{js,ts,vue}`,
      `./error.{js,ts,vue}`,
      `./app.config.{js,ts}`
  ],
  plugins: [require('tailwindcss-primeui')],
}
