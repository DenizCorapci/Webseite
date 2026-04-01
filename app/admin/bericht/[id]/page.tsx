'use client'
export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import MedienGalerie from '@/components/Lightbox'

type Bericht = {
  id: string
  hund_id: string
  titel: string
  datum: string
  phase: string
  zusammenfassung: string
  anamnese: string
  verhaltensanalyse: string
  therapieplan: string
  naechste_schritte: string
  medien: { url: string; typ: 'foto' | 'video'; beschriftung: string }[]
}

const phasen = [
  'Phase 1: Grundlagen',
  'Phase 2: Alltag neu gestalten',
  'Phase 3: Gezieltes Training',
  'Phase 4: Praxis und Weiterführung',
]

export default function AdminBerichtDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const router = useRouter()
  const [bericht, setBericht] = useState<Bericht | null>(null)
  const [loading, setLoading] = useState(true)
  const [bearbeiten, setBearbeiten] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [form, setForm] = useState({
    titel: '',
    phase: '',
    zusammenfassung: '',
    anamnese: '',
    verhaltensanalyse: '',
    therapieplan: '',
    naechste_schritte: '',
  })

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('verhaltensberichte')
        .select('*, bericht_medien(*)')
        .eq('id', id)
        .single()
      if (data) {
        setBericht({ ...data, medien: data.bericht_medien ?? [] })
        setForm({
          titel: data.titel ?? '',
          phase: data.phase ?? '',
          zusammenfassung: data.zusammenfassung ?? '',
          anamnese: data.anamnese ?? '',
          verhaltensanalyse: data.verhaltensanalyse ?? '',
          therapieplan: data.therapieplan ?? '',
          naechste_schritte: data.naechste_schritte ?? '',
        })
      }
      setLoading(false)
    }
    load()
  }, [id])

  async function handleSave() {
    setSaving(true)
    await supabase.from('verhaltensberichte').update(form).eq('id', id)
    setBericht((prev) => prev ? { ...prev, ...form } : prev)
    setBearbeiten(false)
    setSaving(false)
  }

  async function handleDelete() {
    if (!confirm('Bericht wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.')) return
    setDeleting(true)
    await supabase.from('verhaltensberichte').delete().eq('id', id)
    router.push(`/admin/hunde/${bericht?.hund_id}`)
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center pt-16"><p className="text-muted">Lade...</p></div>
  if (!bericht) return <div className="min-h-screen flex items-center justify-center pt-16"><p className="text-muted">Bericht nicht gefunden.</p></div>

  const abschnitte = [
    { label: 'Anamnese', key: 'anamnese' },
    { label: 'Verhaltensanalyse', key: 'verhaltensanalyse' },
    { label: 'Therapieplan', key: 'therapieplan' },
    { label: 'Nächste Schritte', key: 'naechste_schritte' },
  ]

  return (
    <div className="min-h-screen pt-32 pb-24 max-w-3xl mx-auto px-6">
      <Link href={`/admin/hunde/${bericht.hund_id}`} className="text-xs text-muted hover:text-rust transition-colors mb-8 inline-block">
        ← Zurück zum Hundeprofil
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div className="flex-1">
          {bearbeiten ? (
            <div className="space-y-3">
              <input
                value={form.titel}
                onChange={(e) => setForm({ ...form, titel: e.target.value })}
                className="w-full bg-surface border border-border text-cream font-display text-3xl tracking-wider px-4 py-2 focus:border-rust focus:outline-none"
              />
              <select
                value={form.phase}
                onChange={(e) => setForm({ ...form, phase: e.target.value })}
                className="w-full bg-surface border border-border text-cream px-4 py-2 text-sm focus:border-rust focus:outline-none"
              >
                {phasen.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-xs border border-rust/30 text-rust px-2 py-0.5">{bericht.phase}</span>
                <span className="text-xs text-muted">{new Date(bericht.datum).toLocaleDateString('de-CH')}</span>
              </div>
              <h1 className="font-display text-5xl tracking-wider text-cream">{bericht.titel.toUpperCase()}</h1>
            </>
          )}
        </div>

        {/* Aktionen */}
        <div className="flex gap-2 flex-shrink-0">
          {bearbeiten ? (
            <>
              <button onClick={() => setBearbeiten(false)} className="btn-outline text-xs py-2 px-4">
                Abbrechen
              </button>
              <button onClick={handleSave} disabled={saving} className="btn-primary text-xs py-2 px-4">
                {saving ? 'Speichern...' : 'Speichern →'}
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setBearbeiten(true)} className="btn-outline text-xs py-2 px-4">
                ✏ Bearbeiten
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="text-xs border border-red-800/50 text-red-400 hover:border-red-600 hover:text-red-300 px-4 py-2 transition-colors"
              >
                {deleting ? 'Löschen...' : '🗑 Löschen'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Zusammenfassung */}
      <div className="bg-card border border-border p-6 mb-8">
        <p className="section-label mb-3">Zusammenfassung</p>
        {bearbeiten ? (
          <textarea
            rows={3}
            value={form.zusammenfassung}
            onChange={(e) => setForm({ ...form, zusammenfassung: e.target.value })}
            className="w-full bg-surface border border-border text-cream px-4 py-3 text-sm focus:border-rust focus:outline-none resize-none"
          />
        ) : (
          <p className="text-cream/70 text-sm leading-relaxed whitespace-pre-line">{bericht.zusammenfassung}</p>
        )}
      </div>

      {/* Abschnitte */}
      <div className="space-y-6">
        {abschnitte.map(({ label, key }) => (
          <div key={key} className="bg-card border border-border p-6">
            <p className="section-label mb-3">{label}</p>
            {bearbeiten ? (
              <textarea
                rows={6}
                value={form[key as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="w-full bg-surface border border-border text-cream px-4 py-3 text-sm focus:border-rust focus:outline-none resize-none"
              />
            ) : (
              <p className="text-cream/70 text-sm leading-relaxed whitespace-pre-line">
                {bericht[key as keyof Bericht] as string || <span className="text-muted italic">Kein Inhalt</span>}
              </p>
            )}
          </div>
        ))}

        {/* Fotos & Videos */}
        {bericht.medien.length > 0 && (
          <div>
            <h3 className="font-display text-2xl tracking-wider text-cream mb-4">FOTOS & VIDEOS</h3>
            <MedienGalerie medien={bericht.medien} />
          </div>
        )}

        {/* Speichern-Button unten */}
        {bearbeiten && (
          <div className="flex gap-3 pt-4">
            <button onClick={() => setBearbeiten(false)} className="btn-outline flex-1 justify-center">
              Abbrechen
            </button>
            <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 justify-center">
              {saving ? 'Speichern...' : 'Speichern →'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
