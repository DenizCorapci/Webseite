'use client'
export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

type Video = {
  id: string
  titel: string
  beschreibung: string
  video_url: string
  kategorie: string
  reihenfolge: number
}

const kategorien = [
  { key: 'Grundlagen',       icon: '🐾', title: 'Grundkommandos',    desc: 'Sitz, Platz, Bleib — die Basis richtig aufbauen.' },
  { key: 'Leinenführigkeit', icon: '🦮', title: 'Leinenführigkeit',   desc: 'Entspannt laufen ohne Zug und Stress.' },
  { key: 'Mantrailing',      icon: '👃', title: 'Mantrailing',        desc: 'Erste Schritte in der Nasenarbeit.' },
  { key: 'Sozialverhalten',  icon: '🌿', title: 'Sozialverhalten',    desc: 'Begegnungen mit Hunden und Menschen meistern.' },
  { key: 'Impulskontrolle',  icon: '🎯', title: 'Impulskontrolle',    desc: 'Der Hund lernt, innezuhalten.' },
  { key: 'Allgemein',        icon: '🏡', title: 'Allgemein',          desc: 'Weitere Tipps und Übungen.' },
]

function VideoEmbed({ url }: { url: string }) {
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
  return (
    <video controls className="w-full aspect-video bg-black">
      <source src={url} />
    </video>
  )
}

export default function LernvideosPage() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('lernvideos')
      .select('*')
      .order('reihenfolge', { ascending: true })
      .then(({ data }) => {
        setVideos(data ?? [])
        setLoading(false)
      })
  }, [])

  const videosByKategorie = new Map<string, Video[]>()
  for (const v of videos) {
    if (!videosByKategorie.has(v.kategorie)) videosByKategorie.set(v.kategorie, [])
    videosByKategorie.get(v.kategorie)!.push(v)
  }

  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-16 bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-6">
          <p className="section-label mb-3">Trainingstipps</p>
          <div className="divider mb-6" />
          <h1 className="font-display text-7xl sm:text-8xl tracking-wider text-cream">
            LERN<br /><span className="text-rust">VIDEOS</span>
          </h1>
          <p className="mt-6 text-cream/60 text-lg max-w-xl">
            Kein Fachjargon, keine Theorie um der Theorie willen. Marcus zeigt, wie Training im echten Alltag funktioniert — mit echten Hunden, echten Problemen, echten Lösungen.
          </p>
        </div>
      </section>

      {/* Kategorie-Karten */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <p className="section-label mb-4">Themen</p>
        <div className="divider mb-8" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {kategorien.map((kat) => {
            const hatVideos = !loading && (videosByKategorie.get(kat.key)?.length ?? 0) > 0
            return (
              <a
                key={kat.key}
                href={hatVideos ? `#${kat.key}` : undefined}
                className={`block bg-card border p-5 text-center transition-colors ${
                  hatVideos
                    ? 'border-rust/30 hover:border-rust cursor-pointer'
                    : 'border-border opacity-50 cursor-default'
                }`}
              >
                <span className="text-3xl block mb-3">{kat.icon}</span>
                <h3 className="font-display text-sm tracking-wider text-cream leading-tight">
                  {kat.title.toUpperCase()}
                </h3>
                {hatVideos && (
                  <p className="text-xs text-rust mt-1">
                    {videosByKategorie.get(kat.key)!.length} Video{videosByKategorie.get(kat.key)!.length !== 1 ? 's' : ''}
                  </p>
                )}
              </a>
            )
          })}
        </div>
      </section>

      {/* Videos */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <p className="text-muted">Lade...</p>
        </div>
      ) : videos.length === 0 ? (
        <section className="max-w-7xl mx-auto px-6 pb-24">
          <div className="bg-card border border-rust/30 p-12 text-center relative overflow-hidden">
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
        </section>
      ) : (
        <section className="max-w-7xl mx-auto px-6 pb-24 space-y-16">
          {kategorien
            .filter((kat) => (videosByKategorie.get(kat.key)?.length ?? 0) > 0)
            .map((kat) => (
              <div key={kat.key} id={kat.key}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{kat.icon}</span>
                  <p className="section-label">{kat.title}</p>
                </div>
                <div className="divider mb-8" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {videosByKategorie.get(kat.key)!.map((v) => (
                    <div key={v.id} className="bg-card border border-border overflow-hidden">
                      <VideoEmbed url={v.video_url} />
                      <div className="p-5">
                        <h3 className="font-display text-2xl tracking-wider text-cream mb-2">
                          {v.titel.toUpperCase()}
                        </h3>
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
