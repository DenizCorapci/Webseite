import Link from 'next/link'

interface Props {
  title: string
  subtitle: string
  description: string
  longDescription: string[]
  forWhom: string[]
  details: { label: string; value: string }[]
  icon: string
  accentLine: string
}

export default function CourseDetailPage({
  title,
  subtitle,
  description,
  longDescription,
  forWhom,
  details,
  icon,
  accentLine,
}: Props) {
  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-16 bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-6">
          <Link href="/kurse" className="text-muted text-sm hover:text-cream transition-colors inline-flex items-center gap-2 mb-8">
            ← Alle Kurse
          </Link>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-5xl">{icon}</span>
                <p className="section-label">{subtitle}</p>
              </div>
              <h1 className="font-display text-7xl sm:text-8xl tracking-wider text-cream">
                {title.toUpperCase()}
              </h1>
              <p className="mt-6 text-rust font-semibold text-lg">{accentLine}</p>
            </div>
            <p className="text-cream/60 text-lg leading-relaxed">{description}</p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main text */}
        <div className="lg:col-span-2 space-y-5">
          <p className="section-label mb-4">Details</p>
          <div className="divider mb-6" />
          {longDescription.map((p, i) => (
            <p key={i} className="text-cream/70 leading-relaxed">{p}</p>
          ))}

          <div className="pt-6">
            <p className="section-label mb-4">Für wen geeignet?</p>
            <ul className="space-y-2">
              {forWhom.map((item) => (
                <li key={item} className="flex items-center gap-3 text-cream/70">
                  <span className="w-1.5 h-1.5 bg-rust rounded-full flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Info card */}
          <div className="bg-card border border-border p-6">
            <p className="section-label mb-4">Kursinfos</p>
            <div className="space-y-3">
              {details.map((d) => (
                <div key={d.label} className="flex justify-between items-center border-b border-border pb-2">
                  <span className="text-muted text-xs uppercase tracking-wide">{d.label}</span>
                  <span className="text-cream text-sm font-medium">{d.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-rust p-6">
            <p className="font-display text-2xl tracking-wider text-cream mb-2">
              JETZT BUCHEN
            </p>
            <p className="text-cream/80 text-sm mb-4">
              Platz sichern und mit dem Training starten.
            </p>
            <Link
              href="/buchen"
              className="block text-center bg-cream text-ink font-semibold text-sm tracking-widest uppercase py-3 hover:bg-cream/90 transition-colors"
            >
              Anfrage senden
            </Link>
          </div>

          <Link href="/kontakt" className="btn-outline w-full justify-center text-xs py-3">
            Fragen? Meld dich
          </Link>
        </div>
      </section>
    </>
  )
}
