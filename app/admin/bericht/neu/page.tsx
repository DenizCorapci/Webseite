'use client'
export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function NeuerBerichtForm() {
  const router = useRouter()
  const params = useSearchParams()
  const hundId = params.get('hund_id') ?? ''
  const hundName = params.get('hund_name') ?? ''
  const [loading, setLoading] = useState(false)
  const [dateien, setDateien] = useState<File[]>([])

  const [form, setForm] = useState({
    titel: '',
    phase: 'Phase 1: Grundlagen',
    zusammenfassung: '',
    anamnese: '',
    verhaltensanalyse: '',
    therapieplan: '',
    naechste_schritte: '',
  })

  const phasen = [
    'Phase 1: Grundlagen',
    'Phase 2: Alltag neu gestalten',
    'Phase 3: Gezieltes Training',
    'Phase 4: Praxis und Weiterführung',
  ]

  function extractSection(text: string, von: string[], bis: string[]): string {
    const lines = text.split('\n')
    let capturing = false
    const result: string[] = []
    for (const line of lines) {
      const trimmed = line.trim()
      if (von.some(v => trimmed.toLowerCase().includes(v.toLowerCase()))) {
        capturing = true
        continue
      }
      if (capturing && bis.some(b => trimmed.toLowerCase().includes(b.toLowerCase()))) {
        break
      }
      if (capturing && trimmed) result.push(trimmed)
    }
    return result.join('\n').trim()
  }

  function parseTxt(text: string) {
    const titelMatch = text.match(/Verhaltensbericht[^\n]*für\s+([^\n]+)/i)
    const titel = titelMatch ? `Verhaltensbericht — ${titelMatch[1].trim()}` : 'Verhaltensbericht'

    const zusammenfassung = extractSection(text,
      ['6. zusammenfassung', 'zusammenfassung und ausblick'],
      ['7.', '---']
    ) || extractSection(text, ['1. einleitung'], ['2. anamnese', '---'])

    const anamnese = extractSection(text,
      ['2. anamnese', 'anamnese:'],
      ['3. analyse', '3. verhalten']
    )

    const verhaltensanalyse = extractSection(text,
      ['3. analyse', 'analyse der verhaltensproblematik'],
      ['4. management', '4. therapie']
    )

    const therapieplan = extractSection(text,
      ['4. management', '5. therapie', 'therapie- und trainingsplan'],
      ['6. zusammenfassung', '---']
    )

    const naechste_schritte = extractSection(text,
      ['5.4', 'phase 4', 'praxis und weiterführung'],
      ['6.', '---']
    )

    setForm(prev => ({
      ...prev,
      titel,
      zusammenfassung: zusammenfassung || prev.zusammenfassung,
      anamnese: anamnese || prev.anamnese,
      verhaltensanalyse: verhaltensanalyse || prev.verhaltensanalyse,
      therapieplan: therapieplan || prev.therapieplan,
      naechste_schritte: naechste_schritte || prev.naechste_schritte,
    }))
  }

  function handleTxtUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result as string
      parseTxt(text)
    }
    reader.readAsText(file, 'UTF-8')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const { data: bericht, error } = await supabase
      .from('verhaltensberichte')
      .insert({
        hund_id: hundId,
        datum: new Date().toISOString().split('T')[0],
        ...form,
      })
      .select()
      .single()

    if (error || !bericht) {
      setLoading(false)
      return
    }

    // Dateien hochladen
    for (const datei of dateien) {
      const ext = datei.name.split('.').pop()
      const pfad = `${hundId}/${bericht.id}/${Date.now()}.${ext}`
      const { data: upload } = await supabase.storage
        .from('medien')
        .upload(pfad, datei)

      if (upload) {
        const { data: { publicUrl } } = supabase.storage
          .from('medien')
          .getPublicUrl(pfad)

        const typ = datei.type.startsWith('video') ? 'video' : 'foto'
        await supabase.from('bericht_medien').insert({
          bericht_id: bericht.id,
          url: publicUrl,
          typ,
          beschriftung: datei.name,
        })
      }
    }

    router.push('/admin')
  }

  const felder = [
    { label: 'Anamnese', key: 'anamnese', placeholder: 'Stammdaten, Gesundheit, Alltag, bisheriges Training...' },
    { label: 'Verhaltensanalyse', key: 'verhaltensanalyse', placeholder: 'Hauptproblem, Stressfaktoren, Ursachen...' },
    { label: 'Therapieplan', key: 'therapieplan', placeholder: 'Massnahmen, Übungen, Schritte...' },
    { label: 'Nächste Schritte', key: 'naechste_schritte', placeholder: 'Was soll der Kunde bis zum nächsten Termin üben?' },
  ]

  return (
    <div className="min-h-screen pt-32 pb-24 max-w-3xl mx-auto px-6">
      <p className="section-label mb-2">Admin</p>
      <div className="divider mb-6" />
      <h1 className="font-display text-5xl tracking-wider text-cream mb-2">
        NEUER BERICHT
      </h1>
      <p className="text-muted mb-10">für <span className="text-rust">{hundName}</span></p>

      {/* TXT Import */}
      <div className="bg-surface border border-rust/30 p-5 mb-8">
        <p className="section-label mb-1">Verhaltensbericht importieren</p>
        <p className="text-muted text-xs mb-3">TXT-Datei hochladen — Felder werden automatisch ausgefüllt</p>
        <input
          type="file"
          accept=".txt"
          onChange={handleTxtUpload}
          className="w-full bg-card border border-border text-cream/60 px-4 py-3 text-sm file:mr-4 file:bg-rust file:text-cream file:border-0 file:px-3 file:py-1 file:text-xs file:uppercase file:tracking-widest cursor-pointer"
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs font-semibold tracking-widest uppercase text-cream/60 mb-2">Titel</label>
          <input
            type="text"
            required
            placeholder="z.B. Erstbeurteilung — Leinenreaktivität"
            value={form.titel}
            onChange={(e) => setForm({ ...form, titel: e.target.value })}
            className="w-full bg-surface border border-border text-cream px-4 py-3 text-sm focus:border-rust focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold tracking-widest uppercase text-cream/60 mb-2">Phase</label>
          <select
            value={form.phase}
            onChange={(e) => setForm({ ...form, phase: e.target.value })}
            className="w-full bg-surface border border-border text-cream px-4 py-3 text-sm focus:border-rust focus:outline-none"
          >
            {phasen.map((p) => <option key={p}>{p}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold tracking-widest uppercase text-cream/60 mb-2">Zusammenfassung</label>
          <textarea
            rows={3}
            required
            placeholder="Kurze Zusammenfassung der Einheit..."
            value={form.zusammenfassung}
            onChange={(e) => setForm({ ...form, zusammenfassung: e.target.value })}
            className="w-full bg-surface border border-border text-cream px-4 py-3 text-sm focus:border-rust focus:outline-none resize-none"
          />
        </div>

        {felder.map(({ label, key, placeholder }) => (
          <div key={key}>
            <label className="block text-xs font-semibold tracking-widest uppercase text-cream/60 mb-2">{label}</label>
            <textarea
              rows={5}
              placeholder={placeholder}
              value={form[key as keyof typeof form]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              className="w-full bg-surface border border-border text-cream px-4 py-3 text-sm focus:border-rust focus:outline-none resize-none"
            />
          </div>
        ))}

        {/* Fotos & Videos */}
        <div>
          <label className="block text-xs font-semibold tracking-widest uppercase text-cream/60 mb-2">
            Fotos & Videos hochladen
          </label>
          <input
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={(e) => setDateien(Array.from(e.target.files ?? []))}
            className="w-full bg-surface border border-border text-cream/60 px-4 py-3 text-sm focus:border-rust focus:outline-none file:mr-4 file:bg-rust file:text-cream file:border-0 file:px-3 file:py-1 file:text-xs file:uppercase file:tracking-widest cursor-pointer"
          />
          {dateien.length > 0 && (
            <p className="text-xs text-muted mt-2">{dateien.length} Datei(en) ausgewählt</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full justify-center"
        >
          {loading ? 'Wird gespeichert...' : 'Bericht speichern →'}
        </button>
      </form>
    </div>
  )
}

export default function NeuerBerichtPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center pt-16"><p className="text-muted">Lade...</p></div>}>
      <NeuerBerichtForm />
    </Suspense>
  )
}
