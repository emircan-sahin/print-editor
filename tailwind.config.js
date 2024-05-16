/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        // kareli defter gibi olsun (soldan sağa yukardan aşağı)
        'lined-paper': 'linear-gradient(to bottom, transparent 29px, #fff 30px)',
        'lined-paper-2': 'linear-gradient(to right, transparent 29px, #fff 30px)',
      },
      backgroundSize: {
        'lined-paper': '100% 30px',
        'lined-paper-2': '30px 100%',
      },
    },
  },
  plugins: [],
}