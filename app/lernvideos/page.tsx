export const dynamic = 'force-dynamic'
import Link from 'next/link'
import type { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'

export const metadata: Metadata = {
  title: 'Lernvideos',
  description: 'Lernvideos von Bad Dog Hundeschule — Trainingstipps und Übungsanleitungen von Marcus.',
}

type Video = {
  id: string
  titel: string
  beschreibung: string
  video_url: string
  kategorie: string
  reihenfolge: number
}

function VideoEmbed({ url }: { url: string }) {
  // YouTube
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  if (ytMatch) {
    return (
      <div className="aspect-video w-full">
        <iframe
          src={`https://www.youtube.com/embed/${ytMatch[1]}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
    )
  }
  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
  if (vimeoMatch) {
    return (
      <div className="aspect-video w-full">
        <iframe
          src={`https://player.vimeo.com/video/${vimeoMatch[1]}`}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
    )
  }
  // Direktes Video (mp4 etc.)
  return (
    <video controls className="w-full aspect-video bg-black">
      <source src={url} />
    </video>
  )
}

const planned = [
  { icon: '🐾', title: 'Grundkommandos', desc: 'Sitz, Platz, Bleib — die Basis richtig aufbauen.' },
  { icon: '🦮', title: 'Leinenführigkeit', desc: 'Entspannt laufen ohne Zug und Stress.' },
  { icon: '👃', title: 'Mantrailing Basics', desc: 'Erste Schritte in der Nasenarbeit.' },
  { icon: '🌿', title: 'Sozialverhalten', desc: 'Begegnungen mit Hunden und Menschen meistern.' },
  { icon: '🎯', title: 'Impulskontrolle', desc: 'Der Hund lernt, innezuhalten.' },
  { icon: '🏡', title: 'Zuhause-Training', desc: 'Übungen für drin und draussen.' },
]

export default async function LernvideosPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data, error } = await supabase
    .from('lernvideos')
    .select('*')
    .order('reihenfolge', { ascending: true })

  const videos: Video[] = data ?? []
  console.log('Lernvideos:', videos.length, error?.message)

  // Nach Kategorie gruppieren
  const kategorienMap = new Map<string, Video[]>()
  for (const v of videos) {
    if (!kategorienMap.has(v.kategorie)) kategorienMap.set(v.kategorie, [])
    kategorienMap.get(v.kategorie)!.push(v)
  }

  return (
    <>
      {/* DEBUG — wird später entfernt */}
      <div style={{ background: '#1a1a1a', color: '#888', fontSize: '12px', padding: '8px 24px', fontFamily: 'monospace' }}>
        Videos in DB: {videos.length} {error ? `| Fehler: ${error.message}` : ''}
      </div>
      <section className="pt-32 pb-16 bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-6">
          <p className="section-label mb-3">{videos.length > 0 ? 'Trainingstipps' : 'Demnächst'}</p>
          <div className="divider mb-6" />
          <h1 className="font-display text-7xl sm:text-8xl tracking-wider text-cream">
            LERN<br /><span className="text-rust">VIDEOS</span>
          </h1>
          <p className="mt-6 text-cream/60 text-lg max-w-xl">
            {videos.length > 0
              ? 'Trainingstipps, Übungsanleitungen und ehrliche Einblicke aus dem Trainingsalltag von Marcus.'
              : 'Marcus bereitet eine Videobibliothek vor — Trainingstipps, Übungsanleitungen und ehrliche Einblicke aus dem Trainingsalltag.'}
          </p>
        </div>
      </section>

      {videos.length === 0 ? (
        /* Coming Soon */
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="bg-card border border-rust/30 p-12 text-center mb-16 relative overflow-hidden">
            <div className="font-display text-[15vw] text-rust/5 absolute inset-0 flex items-center justify-center leading-none pointer-events-none select-none">SOON</div>
            <div className="relative z-10">
              <div className="text-5xl mb-4">🎬</div>
              <h2 className="font-display text-5xl tracking-wider text-cream mb-4">COMING SOON</h2>
              <p className="text-cream/60 max-w-lg mx-auto mb-8">
                Die Videobibliothek ist in Vorbereitung. Wenn du informiert werden möchtest sobald die ersten Videos verfügbar sind, meld dich beim Kontaktformular.
              </p>
              <Link href="/kontakt" className="btn-primary">Informiert werden</Link>
            </div>
          </div>
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
      ) : (
        /* Videos anzeigen */
        <section className="max-w-7xl mx-auto px-6 py-16 space-y-16">
          {Array.from(kategorienMap.entries()).map(([kategorie, vids]) => (
            <div key={kategorie}>
              <p className="section-label mb-2">{kategorie}</p>
              <div className="divider mb-8" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {vids.map((v) => (
                  <div key={v.id} className="bg-card border border-border overflow-hidden">
                    <VideoEmbed url={v.video_url} />
                    <div className="p-5">
                      <h3 className="font-display text-2xl tracking-wider text-cream mb-2">{v.titel.toUpperCase()}</h3>
                      <p className="text-muted text-sm leading-relaxed">{v.beschreibung}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}
    </>
  )
}
