import type { Metadata } from 'next'
import ContactForm from '@/components/ContactForm'

export const metadata: Metadata = {
  title: 'Kontakt',
  description: 'Kontaktiere Bad Dog Hundeschule in Adlikon bei Winterthur. Fragen, Anfragen, Rückmeldungen — Marcus antwortet innerhalb von 48 Stunden.',
}

export default function KontaktPage() {
  return (
    <>
      <section className="pt-32 pb-16 bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-6">
          <p className="section-label mb-3">Schreib uns</p>
          <div className="divider mb-6" />
          <h1 className="font-display text-7xl sm:text-8xl tracking-wider text-cream">
            KONTAKT
          </h1>
          <p className="mt-6 text-cream/60 text-lg max-w-xl">
            Fragen zum Kursangebot, zur Anfahrt oder einfach Hallo sagen —
            Marcus antwortet innerhalb von 48 Stunden.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Form */}
        <div className="lg:col-span-2">
          <ContactForm />
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div className="bg-card border border-border p-6">
            <p className="section-label mb-4">Adresse</p>
            <address className="not-italic text-cream/70 text-sm space-y-1.5">
              <p className="font-semibold text-cream">Bad Dog Hundeschule</p>
              <p>Andelfingerstrasse 2b</p>
              <p>8452 Adlikon</p>
            </address>
          </div>

          <div className="bg-card border border-border p-6">
            <p className="section-label mb-4">Google Maps</p>
            <div className="w-full h-48 bg-surface border border-border flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl mb-2">📍</div>
                <p className="text-muted text-xs">Andelfingerstrasse 2b</p>
                <p className="text-muted text-xs">8452 Adlikon</p>
                <a
                  href="https://maps.google.com/?q=Andelfingerstrasse+2b,+8452+Adlikon"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 text-rust text-xs hover:text-rust-light transition-colors"
                >
                  In Google Maps öffnen →
                </a>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border p-6">
            <p className="section-label mb-4">Antwortzeit</p>
            <p className="text-cream/70 text-sm">
              Marcus antwortet auf alle Anfragen innerhalb von <strong className="text-cream">48 Stunden</strong>.
              Für dringende Fragen einfach das Buchungsformular nutzen.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
