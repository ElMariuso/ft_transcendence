/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}", ],
  theme: {
    extend: {
      maxWidth: {
        '1800': '1800px',
      },
      fontFamily: {
        'site-title': ['Open Sans', 'sans-serif'],
      },
      backgroundImage: {
        'custom-gradient': "linear-gradient(to bottom, hsl(37, 12%, 16%), hsl(37, 10%, 8%) 116px)",
      },
      backgroundColor: {
        'base-bg': '#161512',
      }
    }
  },
  variants: {},
  plugins: [],
}

