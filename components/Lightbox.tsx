'use client'

import { useState, useEffect } from 'react'

type Medium = {
  url: string
  typ: 'foto' | 'video'
  beschriftung: string
}

export default function MedienGalerie({ medien }: { medien: Medium[] }) {
  const [aktiv, setAktiv] = useState<number | null>(null)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setAktiv(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <style>{`
        .medien-item { position: relative; cursor: pointer; overflow: hidden; border: 1px solid #2A2A2A; background: #1A1A1A; }
        .medien-item img { width: 100%; aspect-ratio: 1; object-fit: cover; display: block; transition: transform 0.4s ease; }
        .medien-item:hover img { transform: scale(1.1); }
        .medien-overlay { position: absolute; inset: 0; background: rgba(10,10,10,0); transition: background 0.3s ease; display: flex; align-items: center; justify-content: center; }
        .medien-item:hover .medien-overlay { background: rgba(10,10,10,0.5); }
        .medien-icon { font-size: 2rem; opacity: 0; transition: opacity 0.3s ease; }
        .medien-item:hover .medien-icon { opacity: 1; }
      `}</style>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        {medien.map((m, i) => (
          <div key={i} className="medien-item" onClick={() => setAktiv(i)}>
            {m.typ === 'foto' ? (
              <img src={m.url} alt={m.beschriftung || ''} />
            ) : (
              <div style={{ position: 'relative', aspectRatio: '16/9', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '3rem' }}>▶</span>
              </div>
            )}
            <div className="medien-overlay">
              <span className="medien-icon">🔍</span>
            </div>
            {m.beschriftung && (
              <p style={{ fontSize: '0.75rem', color: '#888', padding: '0.5rem 0.75rem' }}>{m.beschriftung}</p>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {aktiv !== null && (
        <div
          onClick={() => setAktiv(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(10,10,10,0.97)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1rem',
          }}
        >
          {/* Schliessen */}
          <button
            onClick={() => setAktiv(null)}
            style={{
              position: 'absolute', top: '1rem', right: '1.5rem',
              background: 'none', border: 'none', color: '#F2EDE4',
              fontSize: '2.5rem', cursor: 'pointer', lineHeight: 1, zIndex: 10,
            }}
          >✕</button>

          {/* Navigation */}
          {aktiv > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); setAktiv(aktiv - 1) }}
              style={{
                position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: '1px solid #2A2A2A', color: '#F2EDE4',
                fontSize: '1.5rem', cursor: 'pointer', padding: '0.5rem 1rem', zIndex: 10,
              }}
            >‹</button>
          )}
          {aktiv < medien.length - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); setAktiv(aktiv + 1) }}
              style={{
                position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: '1px solid #2A2A2A', color: '#F2EDE4',
                fontSize: '1.5rem', cursor: 'pointer', padding: '0.5rem 1rem', zIndex: 10,
              }}
            >›</button>
          )}

          {/* Inhalt */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '56rem', width: '100%', maxHeight: '90vh' }}
          >
            {medien[aktiv].typ === 'foto' ? (
              <img
                src={medien[aktiv].url}
                alt={medien[aktiv].beschriftung || ''}
                style={{ width: '100%', maxHeight: '85vh', objectFit: 'contain', display: 'block' }}
              />
            ) : (
              <video
                src={medien[aktiv].url}
                controls autoPlay
                style={{ width: '100%', maxHeight: '85vh', display: 'block' }}
              />
            )}
            {medien[aktiv].beschriftung && (
              <p style={{ textAlign: 'center', color: '#888', fontSize: '0.875rem', marginTop: '0.75rem' }}>
                {medien[aktiv].beschriftung}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  )
}
