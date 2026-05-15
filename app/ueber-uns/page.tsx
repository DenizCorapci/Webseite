import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Über uns',
  description: 'Marcus Weissel — Hundeverhaltenstrainer, Hundeverhaltensberater & Hundeverhaltenstherapeut. Spezialist für schwierige Hunde im Kanton Zürich.',
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
      <section className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <div>
          <p className="section-label mb-3">Trainer</p>
          <div className="divider mb-6" />
          <h2 className="font-display text-6xl tracking-wider text-cream mb-2">MARCUS</h2>
          <p className="font-display text-2xl tracking-wider text-rust mb-8">WEISSEL</p>
          <div className="space-y-3 text-cream/70 leading-relaxed mb-8">
            <p className="text-cream/90 font-medium">
              Hundeverhaltenstrainer, Hundeverhaltensberater & Hundeverhaltenstherapeut
            </p>
            <p className="text-cream/60 text-sm">
              Absolvent der Akademie für angewandte Tierpsychologie (ATN)
            </p>
          </div>
          <div className="space-y-4 text-cream/70 leading-relaxed">
            <p>
              Marcus Weissel ist Experte für Hunde mit Verhaltensschwierigkeiten.
              Mit Einfühlungsvermögen, Ruhe und Struktur begleitet er Hund und Mensch —
              und bringt das fachliche Wissen für schwierige Fälle mit.
            </p>
            <p>
              Der Fokus liegt auf Vertrauen, Klarheit und gewaltfreiem Training.
              Nicht Symptombehandlung, sondern Ursachenforschung — wissenschaftlich
              fundiert auf Basis von Ethologie, Verhaltensbiologie und Verhaltensmedizin.
            </p>
          </div>
        </div>

        {/* Zertifizierungen & Erfahrungen */}
        <div className="space-y-8">
          <div className="bg-card border border-border p-8">
            <h3 className="font-display text-xl tracking-wider text-cream mb-4">ZERTIFIZIERUNGEN</h3>
            <ul className="space-y-2 text-cream/70 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-rust mt-1">—</span>
                Akademie für angewandte Tierpsychologie Schweiz (ATN)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rust mt-1">—</span>
                Akkreditierung Veterinäramt Zürich
              </li>
            </ul>
          </div>

          <div className="bg-card border border-border p-8">
            <h3 className="font-display text-xl tracking-wider text-cream mb-4">AUSBILDUNGSSCHWERPUNKTE</h3>
            <ul className="space-y-2 text-cream/70 text-sm">
              {['Hundewissenschaften', 'Tierpsychosomatik', 'Verhaltensökonomie', 'Verhaltenstraining', 'Verhaltenstherapie'].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-rust mt-1">—</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-card border border-border p-8">
            <h3 className="font-display text-xl tracking-wider text-cream mb-4">ZUSÄTZLICHE ERFAHRUNGEN</h3>
            <ul className="space-y-2 text-cream/70 text-sm">
              {['Diensthunde Polizei und Militär', 'Neuropsychologie', 'Aggressionsverhalten', 'Verhaltensphysiologie'].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-rust mt-1">—</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Spezialisierungen */}
      <section className="bg-surface border-y border-border">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="mb-12">
            <p className="section-label mb-3">Schwerpunkte</p>
            <div className="divider mb-6" />
            <h2 className="font-display text-6xl tracking-wider text-cream">SPEZIALISIERUNGEN</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: 'Aggressionsverhalten', sub: '& Reaktivität' },
              { title: 'Angststörungen', sub: '& Traumata' },
              { title: 'Trennungsstress', sub: '& Alleine bleiben' },
              { title: 'Hyperaktivität', sub: '& Stressregulation' },
              { title: 'Ressourcenverteidigung', sub: '' },
              { title: 'Welpen', sub: '& Junghunde' },
            ].map((item) => (
              <div key={item.title} className="bg-card border border-border p-8">
                <div className="w-2 h-2 bg-rust mb-6" />
                <h3 className="font-display text-xl tracking-wider text-cream">{item.title}</h3>
                {item.sub && <p className="text-cream/50 text-sm mt-1">{item.sub}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ablauf */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="mb-12">
          <p className="section-label mb-3">Vorgehen</p>
          <div className="divider mb-6" />
          <h2 className="font-display text-6xl tracking-wider text-cream">ABLAUF</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              number: '01',
              title: 'Analyse',
              text: 'Professionelle Verhaltensdiagnostik zur Ursachenforschung. Individuelle Betreuung für Mensch-Hund-Teams.',
            },
            {
              number: '02',
              title: 'Strategie',
              text: 'Individueller Therapie- und Trainingsplan basierend auf den Ergebnissen der Verhaltensanalyse.',
            },
            {
              number: '03',
              title: 'Transformation',
              text: '5 bis 15 Sitzungen über mehrere Wochen oder Monate. Ziel: nachhaltige Verhaltensänderung und entspannter Alltag.',
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

      {/* Regionen */}
      <section className="bg-surface border-y border-border">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="mb-12">
            <p className="section-label mb-3">Einsatzgebiet</p>
            <div className="divider mb-6" />
            <h2 className="font-display text-6xl tracking-wider text-cream mb-4">REGIONEN</h2>
            <p className="text-cream/60">Mobile Hundeschule — gesamter Kanton Zürich sowie Wollerau und Freienbach.</p>
          </div>

          <div className="flex flex-wrap gap-3">
            {['Zürich', 'Winterthur', 'Uster', 'Dübendorf', 'Dietikon', 'Wetzikon', 'Wädenswil', 'Horgen', 'Bülach', 'Adliswil', 'Regensdorf', 'Volketswil', 'Thalwil', 'Schlieren', 'Opfikon', 'Kloten', 'Wollerau', 'Freienbach'].map((region) => (
              <span key={region} className="border border-border text-cream/60 text-sm px-4 py-2 font-display tracking-wider">
                {region.toUpperCase()}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Preise */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="mb-12">
          <p className="section-label mb-3">Investition</p>
          <div className="divider mb-6" />
          <h2 className="font-display text-6xl tracking-wider text-cream">PREISE</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div className="bg-card border border-border p-8">
            <h3 className="font-display text-lg tracking-wider text-cream mb-2">VERHALTENS- & CHARAKTERANALYSE</h3>
            <p className="font-display text-4xl text-rust mb-3">135 CHF</p>
            <ul className="space-y-1 text-cream/60 text-sm">
              <li>ca. 90 Minuten</li>
              <li>vor Ort oder online</li>
            </ul>
          </div>

          <div className="bg-card border border-border p-8">
            <h3 className="font-display text-lg tracking-wider text-cream mb-2">EINZELSTUNDE VERHALTENSTRAINING</h3>
            <p className="font-display text-4xl text-rust mb-3">99 CHF</p>
          </div>

          <div className="bg-card border border-border p-8">
            <h3 className="font-display text-lg tracking-wider text-cream mb-2">THERAPIE- & TRAININGSPLAN</h3>
            <p className="font-display text-4xl text-rust mb-3">49 CHF</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-card border border-border p-8">
            <h3 className="font-display text-lg tracking-wider text-cream mb-2">ANFAHRT</h3>
            <p className="font-display text-4xl text-rust mb-3">19 CHF</p>
          </div>

          <div className="bg-card border border-border p-8">
            <h3 className="font-display text-lg tracking-wider text-cream mb-3">ZAHLUNG & ZUSATZSERVICE</h3>
            <ul className="space-y-2 text-cream/70 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-rust mt-1">—</span>
                Zahlung per Überweisung oder Twint
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rust mt-1">—</span>
                WhatsApp-Support für kurze Fragen während der Zusammenarbeit
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-surface border-y border-border">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="mb-12">
            <p className="section-label mb-3">Häufige Fragen</p>
            <div className="divider mb-6" />
            <h2 className="font-display text-6xl tracking-wider text-cream">FAQ</h2>
          </div>

          <div className="space-y-4 max-w-4xl">
            {[
              {
                q: 'Wer hilft bei Problemhunden?',
                a: 'Spezialisierter Hundepsychologe und Verhaltenstherapeut mit Ausbildung an der Akademie für angewandte Tierpsychologie (ATN) und Akkreditierung des Veterinäramts Zürich.',
              },
              {
                q: 'Was ist der Unterschied zu einer normalen Hundeschule?',
                a: 'Der Fokus liegt auf Ursachen statt Symptombehandlung. Statt oberflächliche Verhaltenskorrektur wird das eigentliche Problem analysiert und behandelt.',
              },
              {
                q: 'Bei welchen Problemen wird geholfen?',
                a: 'Aggression, Angst, Stress, Hyperaktivität, Trennungsangst und Ressourcenverteidigung — sowie alle weiteren Verhaltensschwierigkeiten.',
              },
              {
                q: 'Auch für schwierige Fälle geeignet?',
                a: 'Ja — auch nach erfolglosen Trainingsversuchen bei anderen Trainern. Schwierige Fälle sind die Spezialität.',
              },
              {
                q: 'Wie lange dauert die Verhaltensmodifikation?',
                a: '5 bis 15 Sitzungen über mehrere Wochen oder Monate — je nach Ausgangslage und Verhaltensproblem.',
              },
            ].map((item) => (
              <div key={item.q} className="bg-card border border-border p-8">
                <h3 className="font-display text-lg tracking-wider text-cream mb-3">{item.q}</h3>
                <p className="text-cream/60 text-sm leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-surface border-t border-border">
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <h2 className="font-display text-5xl tracking-wider text-cream mb-4">
            JETZT ANFRAGEN
          </h2>
          <p className="text-muted mb-2 max-w-md mx-auto">
            Marcus Weissel — direkt erreichbar per Telefon oder WhatsApp.
          </p>
          <p className="text-rust font-display tracking-wider mb-8">+41 77 526 10 32</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/buchen" className="btn-primary">Kurs anfragen</Link>
            <Link href="/kontakt" className="btn-outline">Kontakt</Link>
          </div>
        </div>
      </section>
    </>
  )
}