/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        'primary' :"#5f6FFF" 
      },
      gridTemplateColumns:{
        'auto':'repeat(auto-fill, minmax(200px, 1fr))'
      },
      boxShadow: {
        'custom-blue': '0 4px 6px rgba(59, 130, 246, 0.5)', 
        'custom-red': '0 4px 6px rgba(220, 38, 38, 0.5)',   
      },
    },
  },
  plugins: [],
}