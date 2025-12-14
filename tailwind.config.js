/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        twitch: {
          purple: '#9146FF',
          'purple-dark': '#772CE8',
          'purple-light': '#BF94FF',
        },
        dark: {
          bg: '#0E0E10',
          card: '#18181B',
          hover: '#1F1F23',
          border: '#2F2F35',
        },
      },
    },
  },
  plugins: [],
}
