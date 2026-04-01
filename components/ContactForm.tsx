'use client'

import { useState } from 'react'

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1000))
    setLoading(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="bg-card border border-rust/40 p-10 text-center">
        <div className="text-5xl mb-4">✉️</div>
        <h2 className="font-display text-4xl tracking-wider text-cream mb-3">NACHRICHT GESENDET!</h2>
        <p className="text-cream/60">
          Marcus antwortet innerhalb von 48 Stunden. Wir freuen uns auf deine Nachricht!
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-muted mb-1.5 uppercase tracking-wide">Name *</label>
          <input
            type="text"
            required
            className="w-full bg-card border border-border text-cream px-4 py-3 text-sm focus:outline-none focus:border-rust transition-colors"
            placeholder="Anna Müller"
          />
        </div>
        <div>
          <label className="block text-xs text-muted mb-1.5 uppercase tracking-wide">E-Mail *</label>
          <input
            type="email"
            required
            className="w-full bg-card border border-border text-cream px-4 py-3 text-sm focus:outline-none focus:border-rust transition-colors"
            placeholder="anna@beispiel.ch"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs text-muted mb-1.5 uppercase tracking-wide">Hund (optional)</label>
        <input
          type="text"
          className="w-full bg-card border border-border text-cream px-4 py-3 text-sm focus:outline-none focus:border-rust transition-colors"
          placeholder="Rasse, Alter…"
        />
      </div>

      <div>
        <label className="block text-xs text-muted mb-1.5 uppercase tracking-wide">Nachricht *</label>
        <textarea
          rows={6}
          required
          className="w-full bg-card border border-border text-cream px-4 py-3 text-sm focus:outline-none focus:border-rust transition-colors resize-none"
          placeholder="Was kann Marcus für euch tun?"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? 'Wird gesendet…' : 'Nachricht senden →'}
      </button>

      <p className="text-muted text-xs text-center">
        Deine Daten werden ausschließlich für die Beantwortung deiner Anfrage verwendet.
      </p>
    </form>
  )
}
