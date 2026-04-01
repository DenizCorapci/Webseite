'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

const links = [
  { href: '/kurse',      label: 'Kurse' },
  { href: '/termine',    label: 'Termine' },
  { href: '/lernvideos', label: 'Lernvideos' },
  { href: '/ueber-uns',  label: 'Über uns' },
  { href: '/kontakt',    label: 'Kontakt' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-ink/90 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-full overflow-hidden border border-rust/40 group-hover:border-rust transition-colors">
            <Image
              src="/pino2.png"
              alt="Pino – Bad Dog Maskottchen"
              width={36}
              height={36}
              className="object-cover object-top scale-125"
            />
          </div>
          <span className="font-display text-2xl tracking-widest text-cream">
            BAD <span className="text-rust">DOG</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="font-body text-sm font-medium text-cream/70 hover:text-cream tracking-wide transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <Link href="/buchen" className="btn-primary text-xs py-2.5 px-5">
            Jetzt buchen
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setOpen(!open)}
          aria-label="Menü"
        >
          <span className={`block w-6 h-0.5 bg-cream transition-all duration-200 ${open ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-cream transition-all duration-200 ${open ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-cream transition-all duration-200 ${open ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-surface border-t border-border px-6 py-6 flex flex-col gap-5">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="font-body text-base font-medium text-cream/80 hover:text-cream"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <Link href="/buchen" className="btn-primary justify-center mt-2" onClick={() => setOpen(false)}>
            Jetzt buchen
          </Link>
        </div>
      )}
    </header>
  )
}
