'use client'
export const dynamic = 'force-dynamic'

import { useUser } from '@clerk/nextjs'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function HundBearbeitenPage() {
  const { user } = useUser()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [hundId, setHundId] = useState<string | null>(null)
  const [foto, setFoto] = useState<File | null>(null)
  const [fotoPreview, setFotoPreview] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: '',
    rasse: '',
    hund_alter: '',
    geschlecht: 'Rüde',
    kastration: 'intakt',
    besonderheiten: '',
  })

  useEffect(() => {
    if (!user) return
    async function load() {
      const { data } = await supabase
        .from('hunde')
        .select('*')
        .eq('clerk_user_id', user!.id)
        .single()
      if (data) {
        setHundId(data.id)
        setFotoPreview(data.foto_url)
        setForm({
          name: data.name ?? '',
          rasse: data.rasse ?? '',
          hund_alter: data.hund_alter ?? '',
          geschlecht: data.geschlecht ?? 'Rüde',
          kastration: data.kastration ?? 'intakt',
          besonderheiten: data.besonderheiten ?? '',
        })
      }
    }
    load()
  }, [user])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user || !hundId) return
    setLoading(true)

    let foto_url = fotoPreview
    if (foto) {
      const ext = foto.name.split('.').pop()
      const pfad = `hunde/${user.id}/profil.${ext}`
      await supabase.storage.from('medien').upload(pfad, foto, { upsert: true })
      const { data: { publicUrl } } = supabase.storage.from('medien').getPublicUrl(pfad)
      foto_url = publicUrl
    }

    await supabase.from('hunde').update({ ...form, foto_url }).eq('id', hundId)
    router.push('/portal')
  }

  return (
    <div className="min-h-screen pt-32 pb-24 max-w-2xl mx-auto px-6">
      <p className="section-label mb-2">Kundenportal</p>
      <div className="divider mb-6" />
      <h1 className="font-display text-5xl tracking-wider text-cream mb-10">
        PROFIL<br /><span className="text-rust">BEARBEITEN</span>
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {[
          { label: 'Name des Hundes', key: 'name', placeholder: 'z.B. Bruno' },
          { label: 'Rasse', key: 'rasse', placeholder: 'z.B. Deutscher Schäferhund' },
          { label: 'Alter', key: 'hund_alter', placeholder: 'z.B. 2 Jahre' },
        ].map(({ label, key, placeholder }) => (
          <div key={key}>
            <label className="block text-xs font-semibold tracking-widest uppercase text-cream/60 mb-2">{label}</label>
            <input
              type="text"
              required
              placeholder={placeholder}
              value={form[key as keyof typeof form]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              className="w-full bg-surface border border-border text-cream px-4 py-3 text-sm focus:border-rust focus:outline-none"
            />
          </div>
        ))}

        <div>
          <label className="block text-xs font-semibold tracking-widest uppercase text-cream/60 mb-2">Geschlecht</label>
          <select
            value={form.geschlecht}
            onChange={(e) => setForm({ ...form, geschlecht: e.target.value })}
            className="w-full bg-surface border border-border text-cream px-4 py-3 text-sm focus:border-rust focus:outline-none"
          >
            <option>Rüde</option>
            <option>Hündin</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold tracking-widest uppercase text-cream/60 mb-2">Kastration</label>
          <select
            value={form.kastration}
            onChange={(e) => setForm({ ...form, kastration: e.target.value })}
            className="w-full bg-surface border border-border text-cream px-4 py-3 text-sm focus:border-rust focus:outline-none"
          >
            <option>intakt</option>
            <option>kastriert</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold tracking-widest uppercase text-cream/60 mb-2">Besonderheiten / Anmerkungen</label>
          <textarea
            rows={4}
            placeholder="z.B. reagiert auf andere Hunde..."
            value={form.besonderheiten}
            onChange={(e) => setForm({ ...form, besonderheiten: e.target.value })}
            className="w-full bg-surface border border-border text-cream px-4 py-3 text-sm focus:border-rust focus:outline-none resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold tracking-widest uppercase text-cream/60 mb-2">Foto des Hundes</label>
          {fotoPreview && (
            <div className="w-32 h-32 mb-3 overflow-hidden border border-border">
              <img src={fotoPreview} alt="Vorschau" className="w-full h-full object-cover" />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null
              setFoto(file)
              if (file) setFotoPreview(URL.createObjectURL(file))
            }}
            className="w-full bg-surface border border-border text-cream/60 px-4 py-3 text-sm focus:border-rust focus:outline-none file:mr-4 file:bg-rust file:text-cream file:border-0 file:px-3 file:py-1 file:text-xs file:uppercase file:tracking-widest cursor-pointer"
          />
        </div>

        <div className="flex gap-3">
          <button type="button" onClick={() => router.push('/portal')} className="btn-outline flex-1 justify-center">
            Abbrechen
          </button>
          <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">
            {loading ? 'Wird gespeichert...' : 'Speichern →'}
          </button>
        </div>
      </form>
    </div>
  )
}
