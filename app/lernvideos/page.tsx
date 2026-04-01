import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Lernvideos',
  description: 'Lernvideos von Bad Dog Hundeschule — coming soon. Trainingstipps und Übungsanleitungen von Marcus.',
}

const planned = [
  { icon: '🐾', title: 'Grundkommandos', desc: 'Sitz, Platz, Bleib — die Basis richtig aufbauen.' },
  { icon: '🦮', title: 'Leinenführigkeit', desc: 'Entspannt laufen ohne Zug und Stress.' },
  { icon: '👃', title: 'Mantrailing Basics', desc: 'Erste Schritte in der Nasenarbeit.' },
  { icon: '🌿', title: 'Sozialverhalten', desc: 'Begegnungen mit Hunden und Menschen meistern.' },
  { icon: '🎯', title: 'Impulskontrolle', desc: 'Der Hund lernt, innezuhalten.' },
  { icon: '🏡', title: 'Zuhause-Training', desc: 'Übungen für drin und draussen.' },
]

export default function LernvideosPage() {
  return (
    <>
      <section className="pt-32 pb-16 bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-6">
          <p className="section-label mb-3">Demnächst</p>
          <div className="divider mb-6" />
          <h1 className="font-display text-7xl sm:text-8xl tracking-wider text-cream">
            LERN<br /><span className="text-rust">VIDEOS</span>
          </h1>
          <p className="mt-6 text-cream/60 text-lg max-w-xl">
            Marcus bereitet eine Videobibliothek vor — Trainingstipps, Übungsanleitungen
            und ehrliche Einblicke aus dem Trainingsalltag.
          </p>
        </div>
      </section>

      {/* Coming Soon Banner */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="bg-card border border-rust/30 p-12 text-center mb-16 relative overflow-hidden">
          <div className="font-display text-[15vw] text-rust/5 absolute inset-0 flex items-center justify-center leading-none pointer-events-none select-none">
            SOON
          </div>
          <div className="relative z-10">
            <div className="text-5xl mb-4">🎬</div>
            <h2 className="font-display text-5xl tracking-wider text-cream mb-4">COMING SOON</h2>
            <p className="text-cream/60 max-w-lg mx-auto mb-8">
              Die Videobibliothek ist in Vorbereitung. Wenn du informiert werden möchtest
              sobald die ersten Videos verfügbar sind, meld dich beim Kontaktformular.
            </p>
            <Link href="/kontakt" className="btn-primary">
              Informiert werden
            </Link>
          </div>
        </div>

        {/* Planned topics */}
        <div>
          <p className="section-label mb-4">Geplante Themen</p>
          <div className="divider mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {planned.map((item) => (
              <div key={item.title} className="bg-card border border-border p-6 opacity-60">
                <span className="text-3xl mb-3 block">{item.icon}</span>
                <h3 className="font-display text-2xl tracking-wider text-cream mb-2">{item.title.toUpperCase()}</h3>
                <p className="text-muted text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
