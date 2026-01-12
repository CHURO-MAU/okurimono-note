import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'warm-cream': '#FFF8F0',
        'sakura': '#FFB7C5',
        'wakakusa': '#C3D825',
        'sora': '#A7D8DE',
        'warm-gray': '#5A5A5A',
        'soft-white': '#FFFEF9',
        'peach': '#FFD4C8',
        'lavender': '#E6D5F5',
      },
      fontFamily: {
        sans: ['Noto Sans JP', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'soft': '1rem',
        'softer': '1.5rem',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.06)',
        'soft-lg': '0 4px 16px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
}
export default config
