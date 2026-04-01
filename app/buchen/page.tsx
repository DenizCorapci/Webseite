import type { Metadata } from 'next'
import BookingForm from '@/components/BookingForm'

export const metadata: Metadata = {
  title: 'Kurs buchen',
  description: 'Sende eine Buchungsanfrage für einen Kurs bei Bad Dog Hundeschule in Adlikon bei Winterthur.',
}

export default function BuchenPage() {
  return (
    <>
      <section className="pt-32 pb-16 bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-6">
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

      <section className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Form */}
        <div className="lg:col-span-2">
          <BookingForm />
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div className="bg-card border border-border p-6">
            <p className="section-label mb-4">So läuft es ab</p>
            <ol className="space-y-4">
              {[
                'Formular ausfüllen und absenden.',
                'Marcus meldet sich innerhalb von 48 Stunden.',
                'Gemeinsam den passenden Termin finden.',
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
              <p>8452 Adlikon</p>
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
