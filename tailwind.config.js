/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0a0e1a',
          800: '#131a2e',
          700: '#1a2340',
          600: '#243056',
        },
        accent: {
          green: '#00e676',
          amber: '#ffc107',
          cyan: '#00bcd4',
        },
        text: {
          primary: '#e8eaf6',
          secondary: '#7986cb',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
