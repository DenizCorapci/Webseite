'use client'
export const dynamic = 'force-dynamic'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import BookingForm from '@/components/BookingForm'
import Link from 'next/link'

function BuchenInner() {
  const params = useSearchParams()
  const terminId = params.get('termin_id')
  const kurs = params.get('kurs')
  const datum = params.get('datum')
  const uhrzeit = params.get('uhrzeit')
  const ort = params.get('ort')
  const typ = params.get('typ')

  const hatTermin = !!(terminId && kurs && datum)

  function formatDatum(d: string) {
    return new Date(d).toLocaleDateString('de-CH', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })
  }

  return (
    <>
      <section className="pt-32 pb-16 bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-6">
          <Link href="/termine" className="text-xs text-muted hover:text-rust transition-colors mb-6 inline-block">← Zurück zu den Terminen</Link>
          <p className="section-label mb-3">Bereit?</p>
          <div className="divider mb-6" />
          <h1 className="font-display text-7xl sm:text-8xl tracking-wider text-cream">
            KURS<br /><span className="text-rust">BUCHEN</span>
          </h1>
          <p className="mt-6 text-cream/60 text-lg max-w-xl">
            Füll das Formular aus — Marcus meldet sich innerhalb von 48 Stunden
            bei dir und bestätigt den Platz.
          </p>
        </div>
      </section>

      {hatTermin && (
        <div className="bg-rust/10 border-b border-rust/30">
          <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex-1">
              <p className="text-xs font-semibold tracking-widest uppercase text-rust mb-1">Ausgewählter Termin</p>
              <p className="text-cream font-medium text-lg">{kurs}</p>
              <p className="text-muted text-sm">{formatDatum(datum!)} · {uhrzeit} Uhr{ort ? ` · ${ort}` : ''}</p>
            </div>
            {typ && (
              <span className="text-xs border border-rust/40 text-rust px-3 py-1 self-start sm:self-auto">{typ}</span>
            )}
          </div>
        </div>
      )}

      <section className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2">
          <BookingForm
            terminId={terminId}
            kurs={kurs}
            datum={datum}
          />
        </div>

        <div className="space-y-6">
          <div className="bg-card border border-border p-6">
            <p className="section-label mb-4">So läuft es ab</p>
            <ol className="space-y-4">
              {[
                'Formular ausfüllen und absenden.',
                'Marcus meldet sich innerhalb von 48 Stunden.',
                'Platzbestätigung erhalten.',
                'Bezahlung vor Ort beim ersten Training.',
              ].map((step, i) => (
                <li key={i} className="flex gap-3 text-sm text-cream/70">
                  <span className="font-display text-2xl text-rust leading-none flex-shrink-0">{i + 1}</span>
                  <span className="pt-1">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="bg-card border border-border p-6">
            <p className="section-label mb-4">Standort</p>
            <address className="not-italic text-sm text-cream/70 space-y-1">
              <p className="font-semibold text-cream">Bad Dog Hundeschule</p>
              <p>Andelfingerstrasse 2b</p>
              <p>5330 Zurzach</p>
            </address>
          </div>

          <div className="bg-rust p-6">
            <p className="font-display text-xl tracking-wider text-cream mb-2">FRAGEN?</p>
            <p className="text-cream/80 text-sm">
              Unsicher welcher Kurs der richtige ist? Marcus hilft dir gerne bei der Wahl.
            </p>
            <a href="/kontakt" className="block mt-4 text-center bg-cream text-ink font-semibold text-xs tracking-widest uppercase py-3 hover:bg-cream/90 transition-colors">
              Kontakt
            </a>
          </div>
        </div>
      </section>
    </>
  )
}

export default function BuchenPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center pt-16"><p className="text-muted">Lade...</p></div>}>
      <BuchenInner />
    </Suspense>
  )
}
