'use client'

import { useState } from 'react'

type Medium = {
  url: string
  typ: 'foto' | 'video'
  beschriftung: string
}

export default function MedienGalerie({ medien }: { medien: Medium[] }) {
  const [aktiv, setAktiv] = useState<Medium | null>(null)
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        {medien.map((m, i) => (
          <div
            key={i}
            className="relative cursor-pointer border border-border bg-card"
            style={{ overflow: 'hidden' }}
            onClick={() => setAktiv(m)}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            {m.typ === 'foto' ? (
              <img
                src={m.url}
                alt={m.beschriftung}
                style={{
                  width: '100%',
                  aspectRatio: '1',
                  objectFit: 'cover',
                  display: 'block',
                  transform: hovered === i ? 'scale(1.08)' : 'scale(1)',
                  transition: 'transform 0.35s ease',
                }}
              />
            ) : (
              <video
                src={m.url}
                style={{ width: '100%', aspectRatio: '16/9', display: 'block' }}
              />
            )}

            {/* Hover Overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: hovered === i ? 'rgba(10,10,10,0.45)' : 'rgba(10,10,10,0)',
                transition: 'background 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span
                style={{
                  fontSize: '2rem',
                  opacity: hovered === i ? 1 : 0,
                  transition: 'opacity 0.3s ease',
                  userSelect: 'none',
                }}
              >
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
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(10,10,10,0.96)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
          onClick={() => setAktiv(null)}
        >
          <button
            style={{
              position: 'absolute',
              top: '1.25rem',
              right: '1.5rem',
              color: '#F2EDE4',
              fontSize: '2rem',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              lineHeight: 1,
            }}
            onClick={() => setAktiv(null)}
          >
            ✕
          </button>
          <div
            style={{ maxWidth: '56rem', width: '100%', maxHeight: '90vh' }}
            onClick={(e) => e.stopPropagation()}
          >
            {aktiv.typ === 'foto' ? (
              <img
                src={aktiv.url}
                alt={aktiv.beschriftung}
                style={{ width: '100%', maxHeight: '85vh', objectFit: 'contain', display: 'block' }}
              />
            ) : (
              <video
                src={aktiv.url}
                controls
                autoPlay
                style={{ width: '100%', maxHeight: '85vh', display: 'block' }}
              />
            )}
            {aktiv.beschriftung && (
              <p style={{ textAlign: 'center', color: '#888', fontSize: '0.875rem', marginTop: '0.75rem' }}>
                {aktiv.beschriftung}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  )
}
