/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Refined pastel palette
        periwinkle: '#7B9EC7',
        'periwinkle-dark': '#5A7FA8',
        gold: '#E8C547',
        'gold-dark': '#C9A830',
        blush: '#E8A0B0',
        'blush-dark': '#C97E8E',
        sage: '#7BBF7A',
        'sage-dark': '#5A9E59',
        cream: '#F5F0E8',
        'cream-dark': '#E8E0D0',
        ink: '#1A1A1A',
        'ink-light': '#4A4A4A',
      },
      fontFamily: {
        display: ['"Clash Display"', 'system-ui', 'sans-serif'],
        sans: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
