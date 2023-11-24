/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}", ],
  theme: {
    extend: {
      margin: {
        '30px': '30px',
      },
      padding: {
        '15px': '15px',
      },
      width: {
        '450px': '450px',
      },
      backgroundImage: {
        'custom-gradient': "linear-gradient(to bottom, hsl(37, 12%, 16%), hsl(37, 10%, 8%) 116px)",
        'button-gradient': 'linear-gradient(to bottom, hsl(37, 7%, 22%), hsl(37, 5%, 19%) 100%)',
      },
      backgroundColor: {
        'base-bg': '#161512',
        'matchmaking-bg': 'rgb(32, 35, 37)',
      },
      colors: {
        'base-text': '#999',
        'button': '#999',
        'matchmaking': '#bababa',
      },
	  maxWidth: {
        'tab': '5rem',
      },
	  minWidth: {
        'tab': '5rem',
      },
	  spacing: {
        'chat': '44rem',
      }
    }
  },
  variants: {},
  plugins: [],
}

