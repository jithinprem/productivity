/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#88304E",
        secondary: "#151312",
        light: {
          100: '#D6D6D6',
          200: '#A8B5D8',
        }
      }
    },
  },
  plugins: [],
}