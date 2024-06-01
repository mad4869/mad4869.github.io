/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
    "./node_modules/tw-elements/js/**/*.js"
  ],
  prefix: "",
  theme: {},
  plugins: [
    require("tailwindcss-animate"),
    require('@tailwindcss/typography'),
    require("tw-elements/plugin.cjs")
  ],
}