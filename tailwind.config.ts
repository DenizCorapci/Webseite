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
        ink:    'rgb(var(--color-ink) / <alpha-value>)',
        surface:'rgb(var(--color-surface) / <alpha-value>)',
        card:   'rgb(var(--color-card) / <alpha-value>)',
        rust:   '#C4551C',
        'rust-light': '#E06530',
        cream:  'rgb(var(--color-cream) / <alpha-value>)',
        muted:  'rgb(var(--color-muted) / <alpha-value>)',
        border: 'rgb(var(--color-border) / <alpha-value>)',
      },
      fontFamily: {
        display: ['var(--font-bebas)', 'sans-serif'],
        body:    ['var(--font-dm-sans)', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.25em',
      },
    },
  },
  plugins: [],
}
export default config
