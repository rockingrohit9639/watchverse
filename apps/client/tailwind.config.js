/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx,js}'],
  theme: {
    extend: {
      colors: {
        background: '#0C0C0C',
        primary: '#ff002e',
        'text-primary': '#ACACAF',
      },
    },
  },
  plugins: [],
}
