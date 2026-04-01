export const dynamic = 'force-dynamic'
import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

export const metadata: Metadata = {
  title: 'Vorher & Nachher',
  description: 'Echte Geschichten von Hunden und ihren Menschen — wie Training bei Bad Dog Hundeschule ihr Leben verändert hat.',
}

type Story = {
  id: string
  hunde_name: string
  rasse: string
  besitzer: string
  ort: string
  kurs: string
  dauer: string
  vorher: string
  nachher: string
  zitat: string
  foto_vorher: string
  foto_nachher: string
  reihenfolge: number
}

const farben = [
  'from-rust/10',
  'from-emerald-900/10',
  'from-blue-900/10',
  'from-amber-900/10',
]

export default async function StoriesPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data } = await supabase
    .from('stories')
    .select('*')
    .order('reihenfolge', { ascending: true })

  const stories: Story[] = data ?? []

  return (
    <>
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

      <section className="max-w-7xl mx-auto px-6 pb-24 space-y-24">
        {stories.length === 0 ? (
          <div className="bg-card border border-border p-12 text-center">
            <p className="text-muted">Noch keine Stories vorhanden.</p>
          </div>
        ) : (
          stories.map((s, i) => (
            <article key={s.id} className="relative">
              <div className="absolute -top-4 -left-2 font-display text-8xl text-cream/5 leading-none select-none pointer-events-none">
                {String(i + 1).padStart(2, '0')}
              </div>
              <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-0 border border-border">
                <div className="grid grid-cols-2">
                  <div className="relative aspect-square overflow-hidden">
                    <img src={s.foto_vorher} alt={`${s.hunde_name} vorher`} className="w-full h-full object-cover grayscale" />
                    <div className="absolute inset-0 bg-ink/40" />
                    <div className="absolute bottom-0 left-0 right-0 bg-ink/80 py-2 text-center">
                      <span className="font-display text-xs tracking-widest text-cream/50">VORHER</span>
                    </div>
                  </div>
                  <div className="relative aspect-square overflow-hidden">
                    <img src={s.foto_nachher} alt={`${s.hunde_name} nachher`} className="w-full h-full object-cover" />
                    <div className={`absolute inset-0 bg-gradient-to-br ${farben[i % farben.length]} to-transparent`} />
                    <div className="absolute bottom-0 left-0 right-0 bg-rust/80 py-2 text-center">
                      <span className="font-display text-xs tracking-widest text-cream">NACHHER</span>
                    </div>
                  </div>
                </div>
                <div className="bg-card p-8 lg:p-10 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className="text-xs border border-rust/30 text-rust px-2 py-0.5">{s.kurs}</span>
                      <span className="text-xs border border-border text-muted px-2 py-0.5">{s.dauer}</span>
                      <span className="text-xs border border-border text-muted px-2 py-0.5">📍 {s.ort}</span>
                    </div>
                    <h2 className="font-display text-5xl tracking-wider text-cream mb-1">{s.hunde_name.toUpperCase()}</h2>
                    <p className="text-muted text-sm mb-6">{s.rasse} · {s.besitzer}</p>
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
                  <blockquote className="mt-8 pt-6 border-t border-border">
                    <p className="text-cream/70 text-sm italic leading-relaxed">&ldquo;{s.zitat}&rdquo;</p>
                    <footer className="mt-2 text-xs text-muted">— {s.besitzer}</footer>
                  </blockquote>
                </div>
              </div>
            </article>
          ))
        )}
      </section>

      <section className="bg-surface border-y border-border">
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <h2 className="font-display text-5xl tracking-wider text-cream mb-4">
            DEINE GESCHICHTE<br /><span className="text-rust">WARTET</span>
          </h2>
          <p className="text-muted mb-8 max-w-md mx-auto">Jeder Hund hat das Potenzial zur Veränderung. Mach den ersten Schritt.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/buchen" className="btn-primary">Jetzt Kurs buchen</Link>
            <Link href="/termine" className="btn-outline">Termine ansehen</Link>
          </div>
        </div>
      </section>
    </>
  )
}
