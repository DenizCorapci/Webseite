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
        ink:    '#0A0A0A',
        surface:'#141414',
        card:   '#1A1A1A',
        rust:   '#C4551C',
        'rust-light': '#E06530',
        cream:  '#F2EDE4',
        muted:  '#888888',
        border: '#2A2A2A',
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
