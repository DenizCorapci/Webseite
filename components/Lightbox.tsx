'use client'

import { useState } from 'react'

type Medium = {
  url: string
  typ: 'foto' | 'video'
  beschriftung: string
}

export default function MedienGalerie({ medien }: { medien: Medium[] }) {
  const [aktiv, setAktiv] = useState<Medium | null>(null)

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        {medien.map((m, i) => (
          <div
            key={i}
            className="bg-card border border-border overflow-hidden group relative cursor-pointer"
            onClick={() => setAktiv(m)}
          >
            {m.typ === 'foto' ? (
              <img
                src={m.url}
                alt={m.beschriftung}
                className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <video src={m.url} className="w-full aspect-video" />
            )}
            {/* Hover-Overlay */}
            <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/40 transition-all duration-300 flex items-center justify-center">
              <span className="text-cream text-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                🔍
              </span>
            </div>
            {m.beschriftung && (
              <p className="text-xs text-muted px-3 py-2">{m.beschriftung}</p>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {aktiv && (
        <div
          className="fixed inset-0 z-50 bg-ink/95 flex items-center justify-center p-4"
          onClick={() => setAktiv(null)}
        >
          <button
            className="absolute top-5 right-6 text-cream/60 hover:text-cream text-3xl font-light transition-colors"
            onClick={() => setAktiv(null)}
          >
            ✕
          </button>
          <div
            className="max-w-4xl max-h-[90vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {aktiv.typ === 'foto' ? (
              <img
                src={aktiv.url}
                alt={aktiv.beschriftung}
                className="w-full max-h-[85vh] object-contain"
              />
            ) : (
              <video src={aktiv.url} controls autoPlay className="w-full max-h-[85vh]" />
            )}
            {aktiv.beschriftung && (
              <p className="text-center text-cream/60 text-sm mt-3">{aktiv.beschriftung}</p>
            )}
          </div>
        </div>
      )}
    </>
  )
}
