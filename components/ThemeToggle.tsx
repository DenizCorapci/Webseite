'use client'

import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [light, setLight] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('theme')
    if (stored === 'light') {
      document.documentElement.classList.add('light')
      setLight(true)
    }
  }, [])

  function toggle() {
    const next = !light
    setLight(next)
    if (next) {
      document.documentElement.classList.add('light')
      localStorage.setItem('theme', 'light')
    } else {
      document.documentElement.classList.remove('light')
      localStorage.setItem('theme', 'dark')
    }
  }

  return (
    <button
      onClick={toggle}
      title={light ? 'Dunkelmodus' : 'Hellmodus'}
      style={{
        background: 'none',
        border: '1px solid var(--color-border)',
        color: 'var(--color-muted)',
        cursor: 'pointer',
        padding: '6px 10px',
        fontSize: '1rem',
        lineHeight: 1,
        transition: 'border-color 0.2s, color 0.2s',
        flexShrink: 0,
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = '#C4551C'
        ;(e.currentTarget as HTMLButtonElement).style.color = '#C4551C'
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-border)'
        ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--color-muted)'
      }}
    >
      {light ? '🌙' : '☀️'}
    </button>
  )
}
