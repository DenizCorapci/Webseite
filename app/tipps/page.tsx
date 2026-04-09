'use client'
export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Tipp = {
  id: string
  titel: string
  beschreibung: string
  video_url: string
}

function getVideoType(url: string): 'youtube' | 'vimeo' | 'local' {
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube'
  if (url.includes('vimeo.com')) return 'vimeo'
  return 'local'
}

function getYouTubeId(url: string) {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&?\s]+)/)
  return m ? m[1] : ''
}

function getVimeoId(url: string) {
  const m = url.match(/vimeo\.com\/(\d+)/)
  return m ? m[1] : ''
}

function getThumbnail(url: string): string | null {
  const type = getVideoType(url)
  if (type === 'youtube') return `https://img.youtube.com/vi/${getYouTubeId(url)}/hqdefault.jpg`
  return null
}

export default function TippsPage() {
  const [tipps, setTipps] = useState<Tipp[]>([])
  const [loading, setLoading] = useState(true)
  const [aktiv, setAktiv] = useState<Tipp | null>(null)

  useEffect(() => {
    supabase.from('tipps').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { setTipps(data ?? []); setLoading(false) })
  }, [])

  function renderPlayer(tipp: Tipp) {
    const type = getVideoType(tipp.video_url)
    if (type === 'youtube') {
      return (
        <iframe
          src={`https://www.youtube.com/embed/${getYouTubeId(tipp.video_url)}?autoplay=1`}
          className="w-full h-full"
          allow="autoplay; fullscreen"
          allowFullScreen
        />
      )
    }
    if (type === 'vimeo') {
      return (
        <iframe
          src={`https://player.vimeo.com/video/${getVimeoId(tipp.video_url)}?autoplay=1`}
          className="w-full h-full"
          allow="autoplay; fullscreen"
          allowFullScreen
        />
      )
    }
    return (
      <video
        src={tipp.video_url}
        controls
        autoPlay
        className="w-full h-full object-contain bg-black"
      />
    )
  }

  return (
    <>
      {/* Lightbox */}
      {aktiv && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex flex-col"
          onClick={() => setAktiv(null)}
        >
          <div className="flex items-center justify-between px-6 py-4 flex-shrink-0">
            <div onClick={e => e.stopPropagation()}>
              <p className="text-cream font-medium">{aktiv.titel}</p>
              {aktiv.beschreibung && <p className="text-muted text-xs mt-0.5">{aktiv.beschreibung}</p>}
            </div>
            <button
              onClick={() => setAktiv(null)}
              className="text-cream/60 hover:text-cream text-2xl leading-none px-2"
            >✕</button>
          </div>
          <div
            className="flex-1 px-4 pb-6"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-full h-full max-w-5xl mx-auto">
              {renderPlayer(aktiv)}
            </div>
          </div>
        </div>
      )}

      <section className="pt-32 pb-16 max-w-7xl mx-auto px-6">
        <p className="section-label mb-3">Wissen & Tipps</p>
        <div className="divider mb-6" />
        <h1 className="font-display text-7xl sm:text-8xl tracking-wider text-cream">
          TIPPS<br /><span className="text-rust">& TRICKS</span>
        </h1>
        <p className="mt-6 text-cream/60 text-lg max-w-xl leading-relaxed">
          Praktische Tipps und Erklärungen von Marcus — für den Alltag mit deinem Hund.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-24">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <p className="text-muted">Lade...</p>
          </div>
        ) : tipps.length === 0 ? (
          <div className="bg-card border border-border p-12 text-center">
            <p className="text-muted">Noch keine Tipps vorhanden. Marcus bereitet Inhalte vor.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {tipps.map(tipp => {
              const thumb = getThumbnail(tipp.video_url)
              const type = getVideoType(tipp.video_url)
              return (
                <button
                  key={tipp.id}
                  onClick={() => setAktiv(tipp)}
                  className="group bg-card border border-border hover:border-rust/50 transition-all text-left overflow-hidden"
                >
                  {/* Thumbnail / Vorschau */}
                  <div className="relative aspect-video bg-surface overflow-hidden">
                    {thumb ? (
                      <img src={thumb} alt={tipp.titel} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-4xl">🎬</span>
                      </div>
                    )}
                    {/* Play-Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 transition-colors">
                      <div className="w-14 h-14 rounded-full bg-rust/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6 text-cream ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                    {type !== 'youtube' && type !== 'vimeo' && (
                      <span className="absolute top-2 right-2 text-xs bg-black/60 text-cream px-2 py-0.5">VIDEO</span>
                    )}
                  </div>
                  {/* Info */}
                  <div className="p-4">
                    <p className="text-cream font-medium group-hover:text-rust transition-colors">{tipp.titel}</p>
                    {tipp.beschreibung && (
                      <p className="text-muted text-xs mt-1 line-clamp-2">{tipp.beschreibung}</p>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </section>
    </>
  )
}
