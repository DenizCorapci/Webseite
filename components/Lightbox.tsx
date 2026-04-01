'use client'

import { useState, useEffect, useCallback } from 'react'

type Medium = {
  url: string
  typ: 'foto' | 'video'
  beschriftung: string
}

export default function MedienGalerie({ medien }: { medien: Medium[] }) {
  const [aktiv, setAktiv] = useState<number | null>(null)

  const schliessen = useCallback(() => setAktiv(null), [])

  useEffect(() => {
    if (aktiv === null) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') schliessen() }
    window.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [aktiv, schliessen])

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
        {medien.map((m, i) => (
          <div
            key={i}
            role="button"
            tabIndex={0}
            onClick={() => setAktiv(i)}
            onKeyDown={(e) => e.key === 'Enter' && setAktiv(i)}
            style={{
              position: 'relative',
              cursor: 'zoom-in',
              overflow: 'hidden',
              border: '1px solid #2A2A2A',
              backgroundColor: '#1A1A1A',
            }}
          >
            {m.typ === 'foto' ? (
              <img
                src={m.url}
                alt={m.beschriftung || ''}
                style={{
                  width: '100%',
                  aspectRatio: '1 / 1',
                  objectFit: 'cover',
                  display: 'block',
                  transition: 'transform 0.4s ease',
                  willChange: 'transform',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.1)' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)' }}
              />
            ) : (
              <div style={{
                aspectRatio: '16 / 9',
                backgroundColor: '#0A0A0A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <span style={{ fontSize: '3rem', color: '#F2EDE4' }}>▶</span>
              </div>
            )}
            {m.beschriftung && (
              <p style={{ fontSize: '0.75rem', color: '#888888', padding: '6px 12px', margin: 0 }}>
                {m.beschriftung}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {aktiv !== null && (
        <div
          onClick={schliessen}
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            zIndex: 99999,
            backgroundColor: 'rgba(10, 10, 10, 0.97)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          {/* Schliessen */}
          <button
            onClick={schliessen}
            style={{
              position: 'absolute', top: '16px', right: '24px',
              background: 'transparent', border: 'none',
              color: '#F2EDE4', fontSize: '2rem', cursor: 'pointer',
              lineHeight: 1, zIndex: 1,
            }}
          >✕</button>

          {/* Prev */}
          {aktiv > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); setAktiv(aktiv - 1) }}
              style={{
                position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
                background: 'transparent', border: '1px solid #2A2A2A',
                color: '#F2EDE4', fontSize: '1.5rem', cursor: 'pointer',
                padding: '8px 16px', zIndex: 1,
              }}
            >‹</button>
          )}

          {/* Next */}
          {aktiv < medien.length - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); setAktiv(aktiv + 1) }}
              style={{
                position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)',
                background: 'transparent', border: '1px solid #2A2A2A',
                color: '#F2EDE4', fontSize: '1.5rem', cursor: 'pointer',
                padding: '8px 16px', zIndex: 1,
              }}
            >›</button>
          )}

          {/* Bild / Video */}
          <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: '900px', width: '100%' }}>
            {medien[aktiv].typ === 'foto' ? (
              <img
                src={medien[aktiv].url}
                alt={medien[aktiv].beschriftung || ''}
                style={{ width: '100%', maxHeight: '85vh', objectFit: 'contain', display: 'block' }}
              />
            ) : (
              <video
                src={medien[aktiv].url}
                controls
                autoPlay
                style={{ width: '100%', maxHeight: '85vh', display: 'block' }}
              />
            )}
            {medien[aktiv].beschriftung && (
              <p style={{ textAlign: 'center', color: '#888888', fontSize: '14px', marginTop: '12px' }}>
                {medien[aktiv].beschriftung}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  )
}
