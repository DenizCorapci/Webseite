'use client'

import { useState } from 'react'

type Props = {
  value: string        // ISO: 'YYYY-MM-DD'
  onChange: (iso: string) => void
  minDate?: string     // ISO
}

const WOCHENTAG_KURZ = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']
const MONATE = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
                'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']

export default function DatePicker({ value, onChange, minDate }: Props) {
  const heute = new Date()
  heute.setHours(0, 0, 0, 0)

  const min = minDate ? new Date(minDate) : heute

  const [anzeige, setAnzeige] = useState(() => {
    const start = value ? new Date(value) : new Date()
    return { monat: start.getMonth(), jahr: start.getFullYear() }
  })

  function vorMonat() {
    setAnzeige(prev => {
      if (prev.monat === 0) return { monat: 11, jahr: prev.jahr - 1 }
      return { monat: prev.monat - 1, jahr: prev.jahr }
    })
  }

  function naechsterMonat() {
    setAnzeige(prev => {
      if (prev.monat === 11) return { monat: 0, jahr: prev.jahr + 1 }
      return { monat: prev.monat + 1, jahr: prev.jahr }
    })
  }

  // Erster Tag des Monats (0=So, 1=Mo, ...)
  const ersterTag = new Date(anzeige.jahr, anzeige.monat, 1)
  // Mo=0, Di=1, ..., So=6
  const startOffset = (ersterTag.getDay() + 6) % 7
  const tageImMonat = new Date(anzeige.jahr, anzeige.monat + 1, 0).getDate()

  const gewaehltesDatum = value ? new Date(value) : null

  function handleTag(tag: number) {
    const d = new Date(anzeige.jahr, anzeige.monat, tag)
    d.setHours(0, 0, 0, 0)
    if (d < min) return
    const iso = `${anzeige.jahr}-${String(anzeige.monat + 1).padStart(2, '0')}-${String(tag).padStart(2, '0')}`
    onChange(iso)
  }

  function istHeute(tag: number) {
    return tag === heute.getDate() && anzeige.monat === heute.getMonth() && anzeige.jahr === heute.getFullYear()
  }

  function istGewaehlt(tag: number) {
    if (!gewaehltesDatum) return false
    return tag === gewaehltesDatum.getDate() &&
      anzeige.monat === gewaehltesDatum.getMonth() &&
      anzeige.jahr === gewaehltesDatum.getFullYear()
  }

  function istDeaktiviert(tag: number) {
    const d = new Date(anzeige.jahr, anzeige.monat, tag)
    d.setHours(0, 0, 0, 0)
    return d < min
  }

  // Kann man zum vorherigen Monat navigieren?
  const kannZurueck = anzeige.jahr > min.getFullYear() ||
    (anzeige.jahr === min.getFullYear() && anzeige.monat > min.getMonth())

  // Grid-Zellen (leere + Tage)
  const zellen: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: tageImMonat }, (_, i) => i + 1),
  ]
  // Auf volle Wochen auffüllen
  while (zellen.length % 7 !== 0) zellen.push(null)

  return (
    <div className="bg-surface border border-border p-4 select-none">
      {/* Header: Monat/Jahr + Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={vorMonat}
          disabled={!kannZurueck}
          className={`w-8 h-8 flex items-center justify-center border transition-colors ${kannZurueck ? 'border-border text-cream hover:border-rust hover:text-rust' : 'border-border/30 text-muted/30 cursor-not-allowed'}`}
        >
          ‹
        </button>
        <span className="font-display tracking-wider text-cream text-sm">
          {MONATE[anzeige.monat]} {anzeige.jahr}
        </span>
        <button
          type="button"
          onClick={naechsterMonat}
          className="w-8 h-8 flex items-center justify-center border border-border text-cream hover:border-rust hover:text-rust transition-colors"
        >
          ›
        </button>
      </div>

      {/* Wochentag-Header */}
      <div className="grid grid-cols-7 mb-1">
        {WOCHENTAG_KURZ.map(t => (
          <div key={t} className="text-center text-xs font-semibold text-muted py-1">{t}</div>
        ))}
      </div>

      {/* Tage-Raster */}
      <div className="grid grid-cols-7 gap-0.5">
        {zellen.map((tag, i) => {
          if (!tag) return <div key={`leer-${i}`} />

          const deaktiviert = istDeaktiviert(tag)
          const gewaehlt = istGewaehlt(tag)
          const heute_ = istHeute(tag)

          return (
            <button
              key={tag}
              type="button"
              onClick={() => handleTag(tag)}
              disabled={deaktiviert}
              className={`
                aspect-square flex items-center justify-center text-sm transition-all
                ${deaktiviert
                  ? 'text-muted/30 cursor-not-allowed'
                  : gewaehlt
                  ? 'bg-rust text-cream font-bold'
                  : heute_
                  ? 'border border-rust text-rust font-semibold hover:bg-rust hover:text-cream'
                  : 'text-cream hover:bg-rust/20 hover:text-rust'
                }
              `}
            >
              {tag}
            </button>
          )
        })}
      </div>

      {/* Gewähltes Datum anzeigen */}
      {value && (
        <p className="text-xs text-center text-muted mt-3 pt-3 border-t border-border">
          Gewählt: <span className="text-cream">
            {new Date(value).toLocaleDateString('de-CH', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
          </span>
        </p>
      )}
    </div>
  )
}
