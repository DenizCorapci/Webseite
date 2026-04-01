import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Über uns',
  description: 'Bad Dog Hundeschule — Trainer Marcus und Maskottchen Pino in Adlikon bei Winterthur.',
}

export default function UeberUnsPage() {
  return (
    <>
      <section className="pt-32 pb-16 bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-6">
          <p className="section-label mb-3">Wer wir sind</p>
          <div className="divider mb-6" />
          <h1 className="font-display text-7xl sm:text-8xl tracking-wider text-cream">
            ÜBER<br /><span className="text-rust">UNS</span>
          </h1>
        </div>
      </section>

      {/* Marcus */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <p className="section-label mb-3">Trainer</p>
          <div className="divider mb-6" />
          <h2 className="font-display text-6xl tracking-wider text-cream mb-8">MARCUS</h2>
          <div className="space-y-4 text-cream/70 leading-relaxed">
            <p>
              Marcus ist Hundetrainer aus Überzeugung. Kein Hund ist hoffnungslos —
              aber nicht jede Methode passt zu jedem Hund. Diese Erkenntnis ist die
              Grundlage von Bad Dog.
            </p>
            <p>
              Seine Trainingsphilosophie ist einfach: Konsequenz ohne Härte.
              Klare Kommunikation. Den Hund dort abholen, wo er steht — nicht wo
              man ihn gerne hätte.
            </p>
            <p>
              Bei Bad Dog gibt es keine Versprechungen über Nacht. Dafür echte Fortschritte,
              die halten. Marcus begleitet dich und deinen Hund so lange, bis das Ziel erreicht ist.
            </p>
          </div>
        </div>

        {/* Placeholder for Marcus photo */}
        <div className="flex justify-center lg:justify-end">
          <div className="relative">
            <div className="w-72 h-80 bg-card border border-border flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">👤</div>
                <p className="text-muted text-sm">Foto von Marcus</p>
                <p className="text-muted text-xs mt-1">folgt demnächst</p>
              </div>
            </div>
            <div className="absolute -bottom-2 -left-2 w-12 h-12 bg-rust" />
            <div className="absolute -top-2 -right-2 w-6 h-6 border border-rust" />
          </div>
        </div>
      </section>

      {/* Pino */}
      <section className="bg-surface border-y border-border">
        <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Pino image */}
          <div className="flex justify-center order-2 lg:order-1">
            <div className="relative">
              <div className="w-72 h-72 rounded-full overflow-hidden border-2 border-rust/40">
                <Image
                  src="/pino2.png"
                  alt="Pino — Dobermann und Maskottchen der Bad Dog Hundeschule"
                  fill
                  className="object-cover object-top"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-rust px-4 py-2">
                <p className="font-display text-sm tracking-widest text-cream">PINO</p>
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="order-1 lg:order-2">
            <p className="section-label mb-3">Das Maskottchen</p>
            <div className="divider mb-6" />
            <h2 className="font-display text-6xl tracking-wider text-cream mb-8">PINO</h2>
            <div className="space-y-4 text-cream/70 leading-relaxed">
              <p>
                Pino ist ein Dobermann — elegant, intelligent, missverstanden.
                Wie viele Hunde, die als "schwierig" gelten, braucht er keine
                harte Hand, sondern eine klare.
              </p>
              <p>
                Pino ist das Gesicht von Bad Dog — weil er verkörpert, worum es hier geht:
                Ein Hund, dem man nicht ansieht was er kann, bis man ihn sieht.
              </p>
              <p>
                Der Name "Bad Dog"? Ironisch gemeint. Kein Hund ist von Natur aus böse.
                Manche brauchen nur jemanden, der sie versteht.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="mb-12">
          <p className="section-label mb-3">Unsere Haltung</p>
          <div className="divider mb-6" />
          <h2 className="font-display text-6xl tracking-wider text-cream">
            PHILOSOPHIE
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              number: '01',
              title: 'Kein Hokuspokus',
              text: 'Konsequentes Training basierend auf Verständnis — nicht auf Druck oder Tricks. Was funktioniert, ist was bleibt.',
            },
            {
              number: '02',
              title: 'Auf Augenhöhe',
              text: 'Weder Hund noch Halter werden bevormundet. Marcus erklärt, warum er was macht — und hört zu.',
            },
            {
              number: '03',
              title: 'Echte Fortschritte',
              text: 'Keine schnellen Versprechen. Dafür Ergebnisse, die auch noch in einem Jahr halten.',
            },
          ].map((p) => (
            <div key={p.number} className="bg-card border border-border p-8">
              <p className="font-display text-5xl text-rust/30 mb-4">{p.number}</p>
              <h3 className="font-display text-2xl tracking-wider text-cream mb-3">
                {p.title.toUpperCase()}
              </h3>
              <p className="text-cream/60 text-sm leading-relaxed">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-surface border-t border-border">
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <h2 className="font-display text-5xl tracking-wider text-cream mb-4">
            LERN UNS KENNEN
          </h2>
          <p className="text-muted mb-8 max-w-md mx-auto">
            Der beste Weg uns kennenzulernen? Einfach vorbeikommen.
            Oder schreib Marcus eine Nachricht.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/buchen" className="btn-primary">Kurs anfragen</Link>
            <Link href="/kontakt" className="btn-outline">Kontakt</Link>
          </div>
        </div>
      </section>
    </>
  )
}
