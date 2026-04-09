'use client'
export const dynamic = 'force-dynamic'

import { useState, useRef, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type Kunde = {
  clerk_user_id: string
  vorname: string
  nachname: string
  email: string
  telefon: string
  hund_id: string | null
  hund_name: string
  hund_rasse: string
}

type BerichtForm = {
  titel: string
  phase: string
  zusammenfassung: string
  naechste_schritte: string
}

const phasen = [
  'Phase 1: Grundlagen',
  'Phase 2: Alltag neu gestalten',
  'Phase 3: Gezieltes Training',
  'Phase 4: Praxis und Weiterführung',
]

const leerForm: BerichtForm = {
  titel: '', phase: 'Phase 1: Grundlagen', zusammenfassung: '', naechste_schritte: '',
}

export default function SprachberichtPage() {
  const router = useRouter()

  // Schritt 1: Kunde suchen
  const [schritt, setSchritt] = useState<1 | 2 | 3>(1)
  const [suche, setSuche] = useState({ vorname: '', nachname: '', telefon: '' })
  const [sucheLoading, setSucheLoading] = useState(false)
  const [gefundenerKunde, setGefundenerKunde] = useState<Kunde | null>(null)
  const [suchFehler, setSuchFehler] = useState('')

  // Schritt 2: Aufnahme
  const [aufnahme, setAufnahme] = useState(false)
  const [transkription, setTranskription] = useState('')
  const [strukturieren, setStrukturieren] = useState(false)
  const erkennerRef = useRef<{ stop(): void } | null>(null)

  // Schritt 3: Bericht
  const [form, setForm] = useState<BerichtForm>(leerForm)
  const [saving, setSaving] = useState(false)

  async function handleKundeSuchen() {
    if (!suche.vorname || !suche.nachname) return
    setSucheLoading(true)
    setSuchFehler('')
    setGefundenerKunde(null)

    let query = supabase
      .from('kunden_profile')
      .select('clerk_user_id, vorname, nachname, email, telefon')
      .ilike('vorname', suche.vorname.trim())
      .ilike('nachname', suche.nachname.trim())

    if (suche.telefon.trim()) {
      query = query.ilike('telefon', `%${suche.telefon.trim()}%`)
    }

    const { data: profile } = await query.limit(1).single()

    if (!profile) {
      setSuchFehler('Kein Kunde gefunden. Bitte Angaben prüfen.')
      setSucheLoading(false)
      return
    }

    const { data: hund } = await supabase
      .from('hunde')
      .select('id, name, rasse')
      .eq('clerk_user_id', profile.clerk_user_id)
      .single()

    setGefundenerKunde({
      clerk_user_id: profile.clerk_user_id,
      vorname: profile.vorname,
      nachname: profile.nachname,
      email: profile.email,
      telefon: profile.telefon,
      hund_id: hund?.id ?? null,
      hund_name: hund?.name ?? '—',
      hund_rasse: hund?.rasse ?? '—',
    })
    setSucheLoading(false)
  }

  function startAufnahme() {
    type SRType = new () => {
      lang: string; continuous: boolean; interimResults: boolean;
      onresult: ((e: { results: { length: number; [i: number]: [{ transcript: string }] } }) => void) | null;
      start(): void; stop(): void;
    }
    const w = window as unknown as { SpeechRecognition?: SRType; webkitSpeechRecognition?: SRType }
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition
    if (!SR) {
      alert('Spracherkennung wird von diesem Browser nicht unterstützt. Bitte Chrome oder Edge verwenden.')
      return
    }

    const erkenner = new SR()
    erkenner.lang = 'de-CH'
    erkenner.continuous = true
    erkenner.interimResults = true

    erkenner.onresult = (event) => {
      let gesamtText = ''
      for (let i = 0; i < event.results.length; i++) {
        gesamtText += event.results[i][0].transcript + ' '
      }
      setTranskription(gesamtText.trim())
    }

    erkenner.start()
    erkennerRef.current = erkenner
    setAufnahme(true)
  }

  function stopAufnahme() {
    erkennerRef.current?.stop()
    setAufnahme(false)
  }

  useEffect(() => {
    return () => { erkennerRef.current?.stop() }
  }, [])

  async function handleStrukturieren() {
    if (!transkription.trim()) return
    setStrukturieren(true)
    const res = await fetch('/api/bericht-strukturieren', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transkription, hundName: gefundenerKunde?.hund_name }),
    })
    const data = await res.json()
    if (data.error) {
      alert('KI-Strukturierung fehlgeschlagen: ' + data.error)
    } else {
      setForm({ ...leerForm, ...data })
      setSchritt(3)
    }
    setStrukturieren(false)
  }

  async function handleSpeichern() {
    if (!gefundenerKunde?.hund_id || !form.titel) return
    setSaving(true)
    await supabase.from('verhaltensberichte').insert({
      hund_id: gefundenerKunde.hund_id,
      datum: new Date().toISOString().split('T')[0],
      titel: form.titel,
      phase: form.phase,
      zusammenfassung: form.zusammenfassung,
      naechste_schritte: form.naechste_schritte,
    })
    setSaving(false)
    router.push('/admin')
  }

  return (
    <div className="min-h-screen pt-32 pb-24 max-w-3xl mx-auto px-6">
      <Link href="/admin" className="text-xs text-muted hover:text-rust transition-colors mb-8 inline-block">← Zurück zum Dashboard</Link>

      <h1 className="font-display text-5xl tracking-wider text-cream mb-2">SPRACHBERICHT</h1>
      <p className="text-muted text-sm mb-10">Trainingsbericht per Mikrofon erfassen und direkt im Kundenportal speichern.</p>

      {/* Fortschrittsanzeige */}
      <div className="flex items-center gap-2 mb-10">
        {[1, 2, 3].map(s => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors
              ${schritt === s ? 'border-rust bg-rust text-cream' : schritt > s ? 'border-rust bg-rust/20 text-rust' : 'border-border text-muted'}`}>
              {schritt > s ? '✓' : s}
            </div>
            <span className={`text-xs ${schritt === s ? 'text-cream' : 'text-muted'}`}>
              {s === 1 ? 'Kunde' : s === 2 ? 'Aufnahme' : 'Bericht'}
            </span>
            {s < 3 && <div className={`w-8 h-0.5 ${schritt > s ? 'bg-rust' : 'bg-border'}`} />}
          </div>
        ))}
      </div>

      {/* ── Schritt 1: Kunde suchen ── */}
      {schritt === 1 && (
        <div className="bg-card border border-border p-6">
          <h2 className="font-display text-2xl tracking-wider text-cream mb-6">KUNDE VERIFIZIEREN</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            {[
              { label: 'Vorname', key: 'vorname', placeholder: 'Anna' },
              { label: 'Nachname', key: 'nachname', placeholder: 'Müller' },
              { label: 'Telefon (optional)', key: 'telefon', placeholder: '+41 79...' },
            ].map(({ label, key, placeholder }) => (
              <div key={key}>
                <label className="block text-xs font-semibold tracking-widest uppercase text-cream/60 mb-1">{label}</label>
                <input
                  value={suche[key as keyof typeof suche]}
                  onChange={e => setSuche({ ...suche, [key]: e.target.value })}
                  onKeyDown={e => e.key === 'Enter' && handleKundeSuchen()}
                  placeholder={placeholder}
                  className="w-full bg-surface border border-border text-cream px-3 py-2 text-sm focus:border-rust focus:outline-none"
                />
              </div>
            ))}
          </div>

          {suchFehler && <p className="text-red-400 text-xs mb-4">{suchFehler}</p>}

          <button onClick={handleKundeSuchen} disabled={sucheLoading || !suche.vorname || !suche.nachname}
            className="btn-primary text-xs py-2 px-6">
            {sucheLoading ? 'Suche...' : 'Kunde suchen →'}
          </button>

          {/* Treffer */}
          {gefundenerKunde && (
            <div className="mt-6 bg-surface border border-emerald-700/40 p-5">
              <p className="text-xs font-semibold tracking-widest uppercase text-emerald-400 mb-3">✓ Kunde gefunden</p>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-cream font-medium">{gefundenerKunde.vorname} {gefundenerKunde.nachname}</p>
                  <p className="text-muted text-xs">{gefundenerKunde.email} · {gefundenerKunde.telefon}</p>
                  <p className="text-muted text-xs mt-1">
                    Hund: <span className="text-cream">{gefundenerKunde.hund_name}</span>
                    {gefundenerKunde.hund_rasse !== '—' && ` (${gefundenerKunde.hund_rasse})`}
                  </p>
                  {!gefundenerKunde.hund_id && (
                    <p className="text-amber-400 text-xs mt-1">⚠ Kein Hundeprofil — Bericht kann nicht gespeichert werden.</p>
                  )}
                </div>
                <button
                  onClick={() => setSchritt(2)}
                  disabled={!gefundenerKunde.hund_id}
                  className="btn-primary text-xs py-2 px-5 flex-shrink-0"
                >
                  Weiter →
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Schritt 2: Aufnahme ── */}
      {schritt === 2 && gefundenerKunde && (
        <div className="bg-card border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl tracking-wider text-cream">AUFNAHME</h2>
            <div className="text-right">
              <p className="text-cream text-sm font-medium">{gefundenerKunde.vorname} {gefundenerKunde.nachname}</p>
              <p className="text-muted text-xs">🐕 {gefundenerKunde.hund_name}</p>
            </div>
          </div>

          {/* Mikrofon-Button */}
          <div className="flex flex-col items-center py-8">
            <button
              onClick={aufnahme ? stopAufnahme : startAufnahme}
              className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl transition-all border-4 ${
                aufnahme
                  ? 'bg-red-600 border-red-400 animate-pulse shadow-lg shadow-red-900/50'
                  : 'bg-surface border-border hover:border-rust'
              }`}
            >
              🎙
            </button>
            <p className="text-sm mt-4 text-muted">
              {aufnahme ? 'Aufnahme läuft — klicken zum Stoppen' : 'Klicken zum Starten'}
            </p>
            <p className="text-xs text-muted/60 mt-1">Funktioniert in Chrome und Edge</p>
          </div>

          {/* Transkription */}
          <div className="mb-4">
            <label className="block text-xs font-semibold tracking-widest uppercase text-cream/60 mb-2">
              Transkription {aufnahme && <span className="text-red-400 animate-pulse">● live</span>}
            </label>
            <textarea
              value={transkription}
              onChange={e => setTranskription(e.target.value)}
              rows={8}
              placeholder="Sprach-Text erscheint hier automatisch... Du kannst ihn auch manuell eingeben oder bearbeiten."
              className="w-full bg-surface border border-border text-cream px-4 py-3 text-sm focus:border-rust focus:outline-none resize-none"
            />
            <p className="text-xs text-muted mt-1">{transkription.split(' ').filter(Boolean).length} Wörter</p>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setSchritt(1)} className="btn-outline text-xs py-2 px-4">← Zurück</button>
            <button
              onClick={handleStrukturieren}
              disabled={strukturieren || !transkription.trim()}
              className="btn-primary text-xs py-2 px-6 flex-1 justify-center"
            >
              {strukturieren ? '⏳ KI strukturiert...' : '✨ Mit KI strukturieren →'}
            </button>
          </div>
          <p className="text-xs text-muted/60 mt-3 text-center">
            Die KI verteilt den Text automatisch auf Anamnese, Analyse, Therapieplan und Nächste Schritte.
          </p>
        </div>
      )}

      {/* ── Schritt 3: Bericht Review ── */}
      {schritt === 3 && gefundenerKunde && (
        <div className="bg-card border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl tracking-wider text-cream">BERICHT PRÜFEN</h2>
            <div className="text-right">
              <p className="text-cream text-sm font-medium">{gefundenerKunde.vorname} {gefundenerKunde.nachname}</p>
              <p className="text-muted text-xs">🐕 {gefundenerKunde.hund_name}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase text-cream/60 mb-1">Titel *</label>
              <input value={form.titel} onChange={e => setForm({ ...form, titel: e.target.value })}
                className="w-full bg-surface border border-border text-cream px-4 py-2 text-sm focus:border-rust focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase text-cream/60 mb-1">Phase</label>
              <select value={form.phase} onChange={e => setForm({ ...form, phase: e.target.value })}
                className="w-full bg-surface border border-border text-cream px-4 py-2 text-sm focus:border-rust focus:outline-none">
                {phasen.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            {[
              { label: 'Zusammenfassung', key: 'zusammenfassung', rows: 5 },
              { label: 'Nächste Trainingsschritte', key: 'naechste_schritte', rows: 5 },
            ].map(({ label, key, rows }) => (
              <div key={key}>
                <label className="block text-xs font-semibold tracking-widest uppercase text-cream/60 mb-1">{label}</label>
                <textarea
                  value={form[key as keyof BerichtForm]}
                  onChange={e => setForm({ ...form, [key]: e.target.value })}
                  rows={rows}
                  className="w-full bg-surface border border-border text-cream px-4 py-2 text-sm focus:border-rust focus:outline-none resize-none"
                />
              </div>
            ))}
          </div>

          <div className="flex gap-3 mt-6">
            <button onClick={() => setSchritt(2)} className="btn-outline text-xs py-2 px-4">← Zurück</button>
            <button
              onClick={handleSpeichern}
              disabled={saving || !form.titel}
              className="btn-primary text-xs py-2 px-6 flex-1 justify-center"
            >
              {saving ? 'Wird gespeichert...' : '💾 Im Kundenportal speichern →'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
