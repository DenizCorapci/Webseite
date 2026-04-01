'use client'

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
