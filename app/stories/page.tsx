import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Vorher & Nachher',
  description: 'Echte Geschichten von Hunden und ihren Menschen — wie Training bei Bad Dog Hundeschule ihr Leben verändert hat.',
}

type Story = {
  id: number
  hundeName: string
  rasse: string
  besitzer: string
  ort: string
  kurs: string
  dauer: string
  vorher: string
  nachher: string
  zitat: string
  fotoVorher: string
  fotoNachher: string
  farbe: string
}

const stories: Story[] = [
  {
    id: 1,
    hundeName: 'Bruno',
    rasse: 'Deutscher Schäferhund, 2 Jahre',
    besitzer: 'Familie Steiner',
    ort: 'Zurzach',
    kurs: 'Einzeltraining + Hundeschule',
    dauer: '3 Monate',
    vorher:
      'Bruno zog so stark an der Leine, dass Spaziergänge zur Tortur wurden. Er bellte jeden Hund an, sprang Fremde an und war zuhause kaum zu beruhigen. Wir hatten schon fast aufgegeben.',
    nachher:
      'Heute läuft Bruno entspannt an lockerer Leine. Er begrüsst andere Hunde ruhig, sitzt auf Kommando und ist zu einem echten Familienhund geworden. Spaziergänge sind wieder Freude statt Stress.',
    zitat:
      'Marcus hat uns von Anfang an ernst genommen. Nach zwei Wochen sahen wir erste Resultate — nach drei Monaten hatten wir einen anderen Hund.',
    fotoVorher: 'https://images.pexels.com/photos/2853422/pexels-photo-2853422.jpeg?auto=compress&cs=tinysrgb&w=600',
    fotoNachher: 'https://images.pexels.com/photos/1390361/pexels-photo-1390361.jpeg?auto=compress&cs=tinysrgb&w=600',
    farbe: 'from-rust/10',
  },
  {
    id: 2,
    hundeName: 'Luna',
    rasse: 'Labrador Mix, 1.5 Jahre',
    besitzer: 'Sarah K.',
    ort: 'Baden',
    kurs: 'Hundeschule Grundkurs',
    dauer: '6 Wochen',
    vorher:
      'Luna war überdreht, konnte sich null konzentrieren und ignorierte jeden Rückruf. Im Park lief sie einfach davon — ich hatte ständig Angst, sie zu verlieren.',
    nachher:
      'Der Rückruf klappt heute zuverlässig, auch mit Ablenkung. Luna hat gelernt, sich zu fokussieren. Der Grundkurs war der Wendepunkt — endlich haben wir eine gemeinsame Sprache.',
    zitat:
      'Ich hätte nicht gedacht, dass sechs Wochen so viel ausmachen können. Luna ist immer noch verspielt und lebhaft — aber jetzt auch verlässlich.',
    fotoVorher: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=600',
    fotoNachher: 'https://images.pexels.com/photos/825949/pexels-photo-825949.jpeg?auto=compress&cs=tinysrgb&w=600',
    farbe: 'from-emerald-900/10',
  },
  {
    id: 3,
    hundeName: 'Rex',
    rasse: 'Rottweiler, 3 Jahre',
    besitzer: 'Marco & Julia B.',
    ort: 'Döttingen',
    kurs: 'Einzeltraining',
    dauer: '8 Wochen',
    vorher:
      'Rex hatte starke Angstreaktion gegenüber anderen Hunden — nicht aus Aggression, sondern aus Unsicherheit. Er zitterte, bellte hysterisch und war in der Stadt nicht führbar.',
    nachher:
      'Mit viel Geduld und gezieltem Desensibilisierungstraining kann Rex heute an anderen Hunden vorbeigehen, ohne zu reagieren. Er ist ruhiger, selbstsicherer und entspannter als je zuvor.',
    zitat:
      'Marcus hat sofort erkannt, dass Rex Angst hatte — nicht Böswilligkeit. Diese Unterscheidung hat alles verändert. Endlich jemand der unseren Hund wirklich versteht.',
    fotoVorher: 'https://images.pexels.com/photos/4587991/pexels-photo-4587991.jpeg?auto=compress&cs=tinysrgb&w=600',
    fotoNachher: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=600',
    farbe: 'from-blue-900/10',
  },
  {
    id: 4,
    hundeName: 'Mia',
    rasse: 'Border Collie, 4 Jahre',
    besitzer: 'Thomas W.',
    ort: 'Klingnau',
    kurs: 'Mantrailing',
    dauer: '4 Monate',
    vorher:
      'Mia war intelligent aber unterfordert — zerstörte zuhause Möbel, jaulte stundenlang und war rastlos. Wir wussten, sie brauchte mehr als normale Spaziergänge.',
    nachher:
      'Mantrailing hat Mia eine Aufgabe gegeben. Die Erschöpfung nach einem Trail ist tiefer als nach zwei Stunden Laufen. Sie ist ausgeglichen, zufrieden — und meine Couch ist gerettet.',
    zitat:
      'Wer einen Border Collie hat, braucht Nasenarbeit. Marcus hat mir das mit dem ersten Training gezeigt. Mia lebt jetzt für ihre Trails.',
    fotoVorher: 'https://images.pexels.com/photos/3023579/pexels-photo-3023579.jpeg?auto=compress&cs=tinysrgb&w=600',
    fotoNachher: 'https://images.pexels.com/photos/551628/pexels-photo-551628.jpeg?auto=compress&cs=tinysrgb&w=600',
    farbe: 'from-amber-900/10',
  },
]

export default function StoriesPage() {
  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-16 max-w-7xl mx-auto px-6">
        <p className="section-label mb-3">Echte Veränderungen</p>
        <div className="divider mb-6" />
        <h1 className="font-display text-7xl sm:text-8xl tracking-wider text-cream">
          VORHER<br /><span className="text-rust">NACHHER</span>
        </h1>
        <p className="mt-6 text-cream/60 text-lg max-w-xl leading-relaxed">
          Keine Hochglanz-Werbung — echte Hunde, echte Probleme, echte Resultate.
          Diese Geschichten zeigen, was konsequentes Training bewirkt.
        </p>
      </section>

      {/* Stories */}
      <section className="max-w-7xl mx-auto px-6 pb-24 space-y-24">
        {stories.map((s, i) => (
          <article key={s.id} className="relative">
            {/* Nummer */}
            <div className="absolute -top-4 -left-2 font-display text-8xl text-cream/5 leading-none select-none pointer-events-none">
              {String(i + 1).padStart(2, '0')}
            </div>

            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-0 border border-border">

              {/* Fotos */}
              <div className="grid grid-cols-2">
                {/* Vorher */}
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={s.fotoVorher}
                    alt={`${s.hundeName} vorher`}
                    className="w-full h-full object-cover grayscale"
                  />
                  <div className="absolute inset-0 bg-ink/40" />
                  <div className="absolute bottom-0 left-0 right-0 bg-ink/80 py-2 text-center">
                    <span className="font-display text-xs tracking-widest text-cream/50">VORHER</span>
                  </div>
                </div>
                {/* Nachher */}
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={s.fotoNachher}
                    alt={`${s.hundeName} nachher`}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${s.farbe} to-transparent`} />
                  <div className="absolute bottom-0 left-0 right-0 bg-rust/80 py-2 text-center">
                    <span className="font-display text-xs tracking-widest text-cream">NACHHER</span>
                  </div>
                </div>
              </div>

              {/* Text */}
              <div className="bg-card p-8 lg:p-10 flex flex-col justify-between">
                <div>
                  {/* Meta */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="text-xs border border-rust/30 text-rust px-2 py-0.5">{s.kurs}</span>
                    <span className="text-xs border border-border text-muted px-2 py-0.5">{s.dauer}</span>
                    <span className="text-xs border border-border text-muted px-2 py-0.5">📍 {s.ort}</span>
                  </div>

                  {/* Hund & Besitzer */}
                  <h2 className="font-display text-5xl tracking-wider text-cream mb-1">
                    {s.hundeName.toUpperCase()}
                  </h2>
                  <p className="text-muted text-sm mb-6">{s.rasse} · {s.besitzer}</p>

                  {/* Vorher/Nachher Text */}
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-semibold tracking-widest text-cream/30 uppercase mb-1">Das Problem</p>
                      <p className="text-cream/60 text-sm leading-relaxed">{s.vorher}</p>
                    </div>
                    <div className="w-8 h-px bg-rust" />
                    <div>
                      <p className="text-xs font-semibold tracking-widest text-rust uppercase mb-1">Die Veränderung</p>
                      <p className="text-cream/80 text-sm leading-relaxed">{s.nachher}</p>
                    </div>
                  </div>
                </div>

                {/* Zitat */}
                <blockquote className="mt-8 pt-6 border-t border-border">
                  <p className="text-cream/70 text-sm italic leading-relaxed">
                    &ldquo;{s.zitat}&rdquo;
                  </p>
                  <footer className="mt-2 text-xs text-muted">— {s.besitzer}</footer>
                </blockquote>
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* CTA */}
      <section className="bg-surface border-y border-border">
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <h2 className="font-display text-5xl tracking-wider text-cream mb-4">
            DEINE GESCHICHTE<br />
            <span className="text-rust">WARTET</span>
          </h2>
          <p className="text-muted mb-8 max-w-md mx-auto">
            Jeder Hund hat das Potenzial zur Veränderung. Mach den ersten Schritt.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/buchen" className="btn-primary">Jetzt Kurs buchen</Link>
            <Link href="/termine" className="btn-outline">Termine ansehen</Link>
          </div>
        </div>
      </section>
    </>
  )
}
