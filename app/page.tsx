import Image from 'next/image'
import Link from 'next/link'


const courses = [
  {
    slug: 'hundeschule',
    title: 'Hundeschule',
    subtitle: 'Gruppentraining',
    desc: 'Grundgehorsam, Leinenführigkeit und soziales Verhalten — in der Gruppe.',
    icon: '🐕',
    color: 'from-rust/20 to-transparent',
  },
  {
    slug: 'einzeltraining',
    title: 'Einzeltraining',
    subtitle: '1:1 mit Marcus',
    desc: 'Maßgeschneidertes Training direkt auf eure Situation zugeschnitten.',
    icon: '🎯',
    color: 'from-amber-900/20 to-transparent',
  },
  {
    slug: 'social-walks',
    title: 'Social Walks',
    subtitle: 'Gemeinsam unterwegs',
    desc: 'Entspanntes Laufen in der Gruppe durch die Natur rund um Zurzach.',
    icon: '🌿',
    color: 'from-emerald-900/20 to-transparent',
  },
  {
    slug: 'mantrailing',
    title: 'Mantrailing',
    subtitle: 'Nasenarbeit',
    desc: 'Personensuche mit der Nase — fordernd, befriedigend, faszinierend.',
    icon: '👃',
    color: 'from-blue-900/20 to-transparent',
  },
]

const testimonials = [
  {
    quote: 'Unser Labrador Bruno war völlig unerzogen — nach 4 Wochen bei Marcus ist er kaum wiederzuerkennen.',
    name: 'Sandra K.',
    location: 'Winterthur',
    course: 'Hundeschule',
    initials: 'SK',
  },
  {
    quote: 'Mantrailing ist unser neues Hobby! Marcus erklärt alles geduldig, Schritt für Schritt. Mia liebt es.',
    name: 'Thomas R.',
    location: 'Andelfingen',
    course: 'Mantrailing',
    initials: 'TR',
  },
  {
    quote: 'Nach 3 Einzeltrainings sehen wir bereits riesige Fortschritte. Unser Berner Senne war vorher in Gruppen unmöglich.',
    name: 'Claudia M.',
    location: 'Winterthur',
    course: 'Einzeltraining',
    initials: 'CM',
  },
  {
    quote: 'Die Social Walks sind weit mehr als spazieren gehen. Jede Woche ein Highlight!',
    name: 'Mirjam W.',
    location: 'Zurzach',
    course: 'Social Walks',
    initials: 'MW',
  },
  {
    quote: 'Endlich eine Hundeschule die hält was sie verspricht. Kein Hokuspokus — nur echte Resultate.',
    name: 'Patrick D.',
    location: 'Elgg',
    course: 'Hundeschule',
    initials: 'PD',
  },
]

const tickerItems = [
  'BAD DOG', '🐾', 'HUNDESCHULE', '🐕', 'EINZELTRAINING', '🎯',
  'SOCIAL WALKS', '🌿', 'MANTRAILING', '👃', 'ADLIKON', '⚡',
]

export default function HomePage() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        {/* Animated background orbs */}
        <div className="absolute top-1/4 right-0 w-[700px] h-[700px] bg-rust/8 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-900/10 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute top-0 left-1/3 w-[300px] h-[300px] bg-rust/5 rounded-full blur-2xl pointer-events-none" />

        {/* Diagonal stripe accent */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -right-20 top-0 w-px h-full bg-gradient-to-b from-transparent via-rust/20 to-transparent rotate-12 origin-top" style={{ left: '65%' }} />
        </div>

        <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-16">
          {/* Text */}
          <div className="order-2 lg:order-1">
            <p className="section-label mb-6 animate-fade-up">
              Mobile Hundeschule · Kanton Zürich
            </p>
            <h1 className="font-display leading-none tracking-wider text-cream animate-fade-up-delay-1"
              style={{ fontSize: 'clamp(5rem, 12vw, 9rem)' }}>
              BAD<br />
              <span className="text-gradient">DOG</span>
            </h1>
            <p className="mt-3 inline-block bg-rust/20 border border-rust/40 text-rust text-xs font-semibold tracking-widest uppercase px-3 py-1">
              ⚠ Testseite — nicht öffentlich
            </p>
            <p className="mt-6 text-cream/60 text-lg leading-relaxed max-w-md animate-fade-up-delay-2">
              Mobile Hundeschule für schwierige Hunde und verzweifelte Hundebesitzer —
              Verhaltenstraining & Verhaltenstherapie im Kanton Zürich.
            </p>
            <div className="mt-8 flex flex-wrap gap-4 animate-fade-up-delay-3">
              <Link href="/buchen" className="btn-primary">
                Jetzt buchen →
              </Link>
              <Link href="/kurse" className="btn-outline">
                Kurse entdecken
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-12 flex gap-10 animate-fade-up-delay-4">
              {[
                { num: 'ATN', label: 'Zertifiziert' },
                { num: '1:1', label: 'Individuell' },
                { num: 'ZH', label: 'Kanton Zürich' },
              ].map((s, i) => (
                <div key={i}>
                  <p className="font-display text-4xl text-gradient">{s.num}</p>
                  <p className="text-muted text-xs mt-1 tracking-wide uppercase">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Pino */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end animate-fade-up-delay-2">
            <div className="relative">
              {/* Spinning rings */}
              <div className="absolute -inset-4 border border-rust/20 rounded-full animate-spin" style={{ animationDuration: '20s' }} />
              <div className="absolute -inset-8 border border-rust/10 rounded-full animate-spin" style={{ animationDuration: '30s', animationDirection: 'reverse' }} />
              {/* Glow */}
              <div className="absolute inset-0 rounded-full bg-rust/10 blur-2xl scale-110 glow-rust" />

              <div className="relative w-72 h-72 sm:w-96 sm:h-96 rounded-full overflow-hidden border-2 border-rust/50">
                <Image
                  src="/pino2.png"
                  alt="Pino — Maskottchen der Bad Dog Hundeschule"
                  fill
                  className="object-cover object-top"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent" />
              </div>

            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted animate-fade-up-delay-5">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-muted to-transparent" />
        </div>
      </section>

      {/* ── TICKER STRIP ─────────────────────────────────── */}
      <div className="bg-rust py-3 overflow-hidden border-y border-rust-light/30">
        <div className="animate-marquee">
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span key={i} className="font-display text-xl tracking-widest text-cream mx-6 whitespace-nowrap">
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── KURSE ────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="mb-12">
          <p className="section-label mb-3">Was wir anbieten</p>
          <div className="divider mb-6" />
          <h2 className="font-display tracking-wider text-cream"
            style={{ fontSize: 'clamp(3.5rem, 7vw, 5.5rem)' }}>
            UNSERE <span className="text-gradient">KURSE</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {courses.map((c) => (
            <Link
              key={c.slug}
              href={`/kurse/${c.slug}`}
              className="group relative bg-card border border-border p-6 hover:border-rust/60 transition-all duration-300 hover:-translate-y-2 overflow-hidden"
            >
              {/* Gradient bg on hover */}
              <div className={`absolute inset-0 bg-gradient-to-b ${c.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

              <div className="relative z-10">
                <div className="text-3xl mb-4">{c.icon}</div>
                <p className="section-label mb-1">{c.subtitle}</p>
                <h3 className="font-display text-3xl tracking-wider text-cream mb-3 group-hover:text-gradient transition-colors">
                  {c.title.toUpperCase()}
                </h3>
                <p className="text-muted text-sm leading-relaxed mb-6">{c.desc}</p>
                <span className="text-rust text-sm font-semibold inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                  Mehr erfahren →
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Link href="/buchen" className="btn-primary">Kurs buchen</Link>
        </div>
      </section>


      {/* ── ÜBER MARCUS ──────────────────────────────────── */}
      <section className="bg-surface border-y border-border relative overflow-hidden">
        {/* Decorative */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-rust/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="section-label mb-3">Dein Trainer</p>
            <div className="divider mb-6" />
            <h2 className="font-display tracking-wider text-cream mb-8"
              style={{ fontSize: 'clamp(3.5rem, 7vw, 5.5rem)' }}>
              MARCUS
            </h2>
            <div className="space-y-4 text-cream/70 leading-relaxed">
              <p className="text-cream/90 font-medium text-sm">
                Hundeverhaltenstrainer, Hundeverhaltensberater & Hundeverhaltenstherapeut
              </p>
              <p className="text-cream/50 text-sm">
                Absolvent der Akademie für angewandte Tierpsychologie (ATN) ·
                Akkreditiert Veterinäramt Zürich
              </p>
              <p>
                Experte für Hunde mit Verhaltensschwierigkeiten. Mit Einfühlungsvermögen,
                Ruhe und Struktur — und dem fachlichen Wissen für schwierige Fälle.
                Fokus auf Ursachen statt Symptombehandlung.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {['Aggressionsverhalten', 'Angststörungen', 'Trennungsstress', 'Hyperaktivität', 'Ressourcenverteidigung'].map((s) => (
                <span key={s} className="text-xs border border-border text-cream/50 px-3 py-1">{s}</span>
              ))}
            </div>
            <div className="mt-8 flex gap-4">
              <Link href="/ueber-uns" className="btn-outline text-xs py-2.5 px-5">Mehr über Marcus</Link>
              <Link href="/kontakt" className="btn-primary text-xs py-2.5 px-5">Kontakt</Link>
            </div>
          </div>

          {/* Card */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative max-w-sm w-full">
              <div className="bg-card border border-border p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-rust/40 glow-rust">
                    <Image src="/pino2.png" alt="Pino" width={64} height={64} className="object-cover object-top scale-125" />
                  </div>
                  <div>
                    <p className="font-display text-2xl tracking-wider text-cream">MARCUS</p>
                    <p className="text-muted text-xs tracking-wide">Hundetrainer · Bad Dog</p>
                  </div>
                </div>
                <div className="space-y-3 border-t border-border pt-6">
                  {['Aggressionsverhalten & Reaktivität', 'Angststörungen & Traumata', 'Trennungsstress', 'Hyperaktivität & Stress', 'Ressourcenverteidigung'].map((s) => (
                    <div key={s} className="flex items-center gap-3 text-sm text-cream/70">
                      <span className="w-1.5 h-1.5 bg-rust rounded-full flex-shrink-0" />
                      {s}
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-xs text-muted">Einsatzgebiet</p>
                  <p className="text-sm text-cream mt-1">Mobile · Gesamter Kanton Zürich</p>
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-rust" />
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="mb-12">
          <p className="section-label mb-3">Was Kunden sagen</p>
          <div className="divider mb-6" />
          <h2 className="font-display tracking-wider text-cream"
            style={{ fontSize: 'clamp(3.5rem, 7vw, 5.5rem)' }}>
            STIMMEN
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.slice(0, 3).map((t, i) => (
            <div key={i} className="bg-card border border-border p-6 relative group hover:border-rust/40 transition-colors">
              <div className="font-display text-8xl text-rust/15 absolute top-2 right-4 leading-none select-none group-hover:text-rust/25 transition-colors">"</div>
              <p className="text-cream/80 text-sm leading-relaxed mb-6 relative z-10">"{t.quote}"</p>
              <div className="border-t border-border pt-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-rust flex items-center justify-center flex-shrink-0">
                  <span className="font-display text-sm text-cream">{t.initials}</span>
                </div>
                <div>
                  <p className="font-semibold text-cream text-sm">{t.name}</p>
                  <p className="text-muted text-xs">{t.location} · {t.course}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {testimonials.slice(3).map((t, i) => (
            <div key={i} className="bg-card border border-border p-6 relative group hover:border-rust/40 transition-colors">
              <div className="font-display text-8xl text-rust/15 absolute top-2 right-4 leading-none select-none group-hover:text-rust/25 transition-colors">"</div>
              <p className="text-cream/80 text-sm leading-relaxed mb-6 relative z-10">"{t.quote}"</p>
              <div className="border-t border-border pt-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-rust flex items-center justify-center flex-shrink-0">
                  <span className="font-display text-sm text-cream">{t.initials}</span>
                </div>
                <div>
                  <p className="font-semibold text-cream text-sm">{t.name}</p>
                  <p className="text-muted text-xs">{t.location} · {t.course}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── LERNVIDEOS TEASER ────────────────────────────── */}
      <section className="bg-surface border-y border-border">
        <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="section-label mb-2">Videobibliothek</p>
            <h2 className="font-display tracking-wider text-cream"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
              LERNVIDEOS
            </h2>
            <p className="text-muted mt-3 max-w-md">
              Kein Fachjargon, keine Theorie um der Theorie willen. Marcus zeigt, wie Training im echten Alltag funktioniert — mit echten Hunden, echten Problemen, echten Lösungen.
            </p>
          </div>
          <Link href="/lernvideos" className="btn-outline flex-shrink-0">
            Videos ansehen →
          </Link>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-surface border-t border-border">
        <div className="max-w-7xl mx-auto px-6 py-28 text-center">
          <p className="section-label mb-4">Bereit?</p>
          <h2 className="font-display tracking-wider text-cream leading-none mb-4"
            style={{ fontSize: 'clamp(4rem, 10vw, 8rem)' }}>
            LASS UNS<br /><span className="text-gradient">STARTEN.</span>
          </h2>
          <p className="text-cream/60 max-w-lg mx-auto mb-10 text-lg">
            Füll das Buchungsformular aus — Marcus meldet sich bei dir
            und wir finden den passenden Kurs für dich und deinen Hund.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/buchen" className="btn-primary">Jetzt anfragen</Link>
            <a href="https://wa.me/41775261032" className="btn-outline">WhatsApp</a>
          </div>
          <p className="mt-8 font-display text-xl tracking-wider text-rust">+41 77 526 10 32</p>
          <p className="mt-2 text-muted text-sm">
            BAD DOG ZH · Marcus Weissel · Mobile Hundeschule Kanton Zürich
          </p>
        </div>
      </section>
    </>
  )
}
