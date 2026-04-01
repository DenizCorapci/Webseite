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
        ink:    'var(--color-ink)',
        surface:'var(--color-surface)',
        card:   'var(--color-card)',
        rust:   '#C4551C',
        'rust-light': '#E06530',
        cream:  'var(--color-cream)',
        muted:  'var(--color-muted)',
        border: 'var(--color-border)',
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
