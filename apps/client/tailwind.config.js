/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx,js}'],
  theme: {
    extend: {
      colors: {
        background: '#0C0C0C',
        primary: '#ff002e',
        'text-primary': '#FFF',
        'text-secondary': '#aaa',
        base: '#212020',
      },
    },
  },
  plugins: [],
}
