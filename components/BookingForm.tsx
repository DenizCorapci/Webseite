'use client'

import { useState } from 'react'

const courses = ['Hundeschule', 'Einzeltraining', 'Social Walks', 'Mantrailing']

export default function BookingForm() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    // Simulate sending (replace with actual API call / Resend / Formspree)
    await new Promise((r) => setTimeout(r, 1000))
    setLoading(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="bg-card border border-rust/40 p-10 text-center">
        <div className="text-5xl mb-4">🐕</div>
        <h2 className="font-display text-4xl tracking-wider text-cream mb-3">ANFRAGE GESENDET!</h2>
        <p className="text-cream/60">
          Marcus meldet sich innerhalb von 48 Stunden bei dir.
          Wir freuen uns auf euch!
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal */}
      <div>
        <p className="section-label mb-4">Deine Angaben</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-muted mb-1.5 uppercase tracking-wide">Vorname *</label>
            <input
              type="text"
              required
              className="w-full bg-card border border-border text-cream px-4 py-3 text-sm focus:outline-none focus:border-rust transition-colors"
              placeholder="Anna"
            />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1.5 uppercase tracking-wide">Nachname *</label>
            <input
              type="text"
              required
              className="w-full bg-card border border-border text-cream px-4 py-3 text-sm focus:outline-none focus:border-rust transition-colors"
              placeholder="Müller"
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
          <div>
            <label className="block text-xs text-muted mb-1.5 uppercase tracking-wide">Telefon / WhatsApp</label>
            <input
              type="tel"
              className="w-full bg-card border border-border text-cream px-4 py-3 text-sm focus:outline-none focus:border-rust transition-colors"
              placeholder="+41 79 123 45 67"
            />
          </div>
        </div>
      </div>

      {/* Dog info */}
      <div>
        <p className="section-label mb-4">Dein Hund</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-muted mb-1.5 uppercase tracking-wide">Name des Hundes *</label>
            <input
              type="text"
              required
              className="w-full bg-card border border-border text-cream px-4 py-3 text-sm focus:outline-none focus:border-rust transition-colors"
              placeholder="Bruno"
            />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1.5 uppercase tracking-wide">Rasse</label>
            <input
              type="text"
              className="w-full bg-card border border-border text-cream px-4 py-3 text-sm focus:outline-none focus:border-rust transition-colors"
              placeholder="Labrador"
            />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1.5 uppercase tracking-wide">Alter</label>
            <input
              type="text"
              className="w-full bg-card border border-border text-cream px-4 py-3 text-sm focus:outline-none focus:border-rust transition-colors"
              placeholder="2 Jahre"
            />
          </div>
        </div>
      </div>

      {/* Course + date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-muted mb-1.5 uppercase tracking-wide">Gewünschter Kurs *</label>
          <select
            required
            className="w-full bg-card border border-border text-cream px-4 py-3 text-sm focus:outline-none focus:border-rust transition-colors appearance-none"
          >
            <option value="">Kurs wählen…</option>
            {courses.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-muted mb-1.5 uppercase tracking-wide">Wunschtermin</label>
          <input
            type="text"
            className="w-full bg-card border border-border text-cream px-4 py-3 text-sm focus:outline-none focus:border-rust transition-colors"
            placeholder="z.B. Samstag Vormittag"
          />
        </div>
      </div>

      {/* Message */}
      <div>
        <label className="block text-xs text-muted mb-1.5 uppercase tracking-wide">Nachricht / Fragen</label>
        <textarea
          rows={4}
          className="w-full bg-card border border-border text-cream px-4 py-3 text-sm focus:outline-none focus:border-rust transition-colors resize-none"
          placeholder="Was sollen wir über euch wissen?"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? 'Wird gesendet…' : 'Anfrage absenden →'}
      </button>

      <p className="text-muted text-xs text-center">
        Deine Daten werden ausschließlich für die Kursanfrage verwendet.
      </p>
    </form>
  )
}
