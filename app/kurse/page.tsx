import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kurse',
  description: 'Hundeschule, Einzeltraining, Social Walks und Mantrailing mit Trainer Marcus in Adlikon bei Winterthur.',
}

const courses = [
  {
    slug: 'hundeschule',
    title: 'Hundeschule',
    subtitle: 'Gruppentraining',
    desc: 'Grundgehorsam, Leinenführigkeit und Sozialverhalten. In der Gruppe lernen Hunde besonders effektiv — durch gemeinsame Herausforderungen und strukturiertes Training.',
    details: ['Gruppen bis 6 Hunde', 'Für alle Rassen', 'Welpen & Junghunde', 'Aufbaukurs möglich'],
    icon: '🐕',
  },
  {
    slug: 'einzeltraining',
    title: 'Einzeltraining',
    subtitle: '1:1 mit Marcus',
    desc: 'Du brauchst individuelle Unterstützung? Im Einzeltraining geht Marcus direkt auf eure Situation ein — ohne Kompromisse, ohne Umwege.',
    details: ['Maßgeschneiderter Plan', 'Flexibler Termin', 'Fokus auf dein Problem', 'Für alle Trainingslevel'],
    icon: '🎯',
  },
  {
    slug: 'social-walks',
    title: 'Social Walks',
    subtitle: 'Gemeinsam unterwegs',
    desc: 'Entspanntes Laufen in der Gruppe durch die Natur rund um Adlikon. Hunde sozialisieren, Halter tauschen sich aus — Marcus ist immer dabei.',
    details: ['Regelmässige Termine', 'Naturstrecken', 'Für sozialisierte Hunde', 'Gemeinschaft inklusive'],
    icon: '🌿',
  },
  {
    slug: 'mantrailing',
    title: 'Mantrailing',
    subtitle: 'Nasenarbeit',
    desc: 'Dein Hund sucht eine bestimmte Person anhand ihres individuellen Geruchs. Mantrailing ist Nasenarbeit auf höchstem Niveau — fordernd, befriedigend, faszinierend.',
    details: ['Anfänger bis Fortgeschritten', 'Gelände-Training', 'Mind & Body', 'Echte Herausforderung'],
    icon: '👃',
  },
]

export default function KursePage() {
  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-16 max-w-7xl mx-auto px-6">
        <p className="section-label mb-3">Was wir anbieten</p>
        <div className="divider mb-6" />
        <h1 className="font-display text-7xl sm:text-8xl tracking-wider text-cream">
          UNSERE<br /><span className="text-rust">KURSE</span>
        </h1>
        <p className="mt-6 text-cream/60 text-lg max-w-xl leading-relaxed">
          Vier Angebote — ein Ziel: eine echte Verbindung zwischen dir und deinem Hund.
          Trainer Marcus begleitet euch mit Konsequenz und Herzblut.
        </p>
      </section>

      {/* Course list */}
      <section className="max-w-7xl mx-auto px-6 pb-24 space-y-4">
        {courses.map((c, i) => (
          <Link
            key={c.slug}
            href={`/kurse/${c.slug}`}
            className="group block bg-card border border-border hover:border-rust/50 transition-all duration-300 p-8"
          >
            <div className="flex flex-col lg:flex-row lg:items-center gap-8">
              {/* Number + icon */}
              <div className="flex items-center gap-4 lg:w-24 flex-shrink-0">
                <span className="font-display text-6xl text-rust/20 leading-none">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-4xl">{c.icon}</span>
              </div>

              {/* Content */}
              <div className="flex-1">
                <p className="section-label mb-1">{c.subtitle}</p>
                <h2 className="font-display text-4xl tracking-wider text-cream group-hover:text-rust transition-colors mb-3">
                  {c.title.toUpperCase()}
                </h2>
                <p className="text-cream/60 text-sm leading-relaxed max-w-2xl">{c.desc}</p>
              </div>

              {/* Details */}
              <div className="lg:w-64 flex-shrink-0">
                <ul className="space-y-1.5">
                  {c.details.map((d) => (
                    <li key={d} className="flex items-center gap-2 text-xs text-cream/50">
                      <span className="w-1 h-1 bg-rust rounded-full" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Arrow */}
              <div className="text-rust text-xl group-hover:translate-x-2 transition-transform lg:ml-4">
                →
              </div>
            </div>
          </Link>
        ))}
      </section>

      {/* CTA */}
      <section className="bg-surface border-y border-border">
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <h2 className="font-display text-5xl tracking-wider text-cream mb-4">
            NOCH FRAGEN?
          </h2>
          <p className="text-muted mb-8">
            Marcus hilft dir gerne dabei, den richtigen Kurs für deinen Hund zu finden.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/buchen" className="btn-primary">Jetzt anfragen</Link>
            <Link href="/kontakt" className="btn-outline">Kontakt</Link>
          </div>
        </div>
      </section>
    </>
  )
}
