/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'custom-purple': '#6A0DAD',
        'custom-pink': '#FF6F91',
        primary: {
          light: '#6366f1', // indigo-600
          dark: '#818cf8'   // indigo-400

        },
        secondary: {
          light: '#9333ea', // purple-600
          dark: '#a855f7'   // purple-500
        },
        background: {
          light: '#ffffff',
          dark: '#121212'
        },
        card: {
          light: '#ffffff',
          dark: '#1e1e1e'
        },
        text: {
          light: '#1f2937', // gray-800
          dark: '#f3f4f6'   // gray-100
        }
      }
    },
  },
  plugins: [],
}
