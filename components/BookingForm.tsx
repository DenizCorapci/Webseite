'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import DatePicker from '@/components/DatePicker'

const courseOptions = ['Ersttermin (2 Std.)', 'Hundeschule', 'Einzeltraining', 'Social Walks', 'Mantrailing']

type Props = {
  terminId?: string | null
  kurs?: string | null
  datum?: string | null
}

type Slot = { uhrzeit: string; verfuegbar: boolean; verfuegbar2h: boolean }

const WOCHENTAG = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']
const MONAT = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']

function formatDatum(iso: string) {
  const d = new Date(iso)
  return `${WOCHENTAG[d.getDay()]}, ${d.getDate()}. ${MONAT[d.getMonth()]} ${d.getFullYear()}`
}

export default function BookingForm({ terminId, kurs, datum }: Props) {
  const [schritt, setSchritt] = useState<1 | 2>(1)  // 1=Datum+Slot, 2=Kontaktdaten
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fehler, setFehler] = useState('')

  // Schritt 1: Datum & Slot
  const [gewaehltesDatum, setGewaehltesDatum] = useState('')
  const [slots, setSlots] = useState<Slot[]>([])
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [keinTag, setKeinTag] = useState(false)
  const [gewaehlterSlot, setGewaehlterSlot] = useState('')

  // Schritt 2: Kontaktdaten
  const [form, setForm] = useState({
    vorname: '', nachname: '', email: '', telefon: '',
    hund_name: '', hund_rasse: '', hund_alter: '',
    kurs_wunsch: kurs ?? '',
    nachricht: '',
  })

  const istErsttermin = form.kurs_wunsch.startsWith('Ersttermin')

  // Wenn Termin aus URL bereits bekannt → Datum vorausfüllen
  useEffect(() => {
    if (datum) setGewaehltesDatum(datum)
  }, [datum])

  useEffect(() => {
    if (!gewaehltesDatum) { setSlots([]); return }
    setSlotsLoading(true)
    setKeinTag(false)
    setGewaehlterSlot('')
    fetch(`/api/verfuegbare-slots?datum=${gewaehltesDatum}`)
      .then(r => r.json())
      .then(data => {
        const s: Slot[] = data.slots ?? []
        setSlots(s)
        const verfuegbar = s.filter(sl => istErsttermin ? sl.verfuegbar2h : sl.verfuegbar)
        if (verfuegbar.length === 0) setKeinTag(true)
        setSlotsLoading(false)
      })
  }, [gewaehltesDatum])

  // Heute als min-Datum (keine Vergangenheit)
  const heute = new Date().toISOString().split('T')[0]

  function set(key: string, value: string) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setFehler('')

    const nachrichtText = form.nachricht
      || (kurs ? `Kurs: ${kurs}${datum ? ` am ${new Date(datum).toLocaleDateString('de-CH')}` : ''}` : '')
      || (form.kurs_wunsch ? `Gewünschter Kurs: ${form.kurs_wunsch}` : '')

    const kursTyp = istErsttermin ? 'Ersttermin' : form.kurs_wunsch

    const { error } = await supabase.from('buchungsanfragen').insert({
      termin_id: terminId ?? null,
      vorname: form.vorname,
      nachname: form.nachname,
      email: form.email,
      telefon: form.telefon,
      hund_name: form.hund_name,
      hund_rasse: form.hund_rasse,
      hund_alter: form.hund_alter,
      nachricht: nachrichtText,
      wunsch_datum: gewaehltesDatum || null,
      wunsch_uhrzeit: gewaehlterSlot || null,
      kurs_typ: kursTyp,
    })

    setLoading(false)
    if (error) {
      setFehler('Fehler beim Senden. Bitte versuche es nochmals oder kontaktiere uns direkt.')
      return
    }
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="bg-card border border-rust/40 p-10 text-center">
        <div className="text-5xl mb-4">🐕</div>
        <h2 className="font-display text-4xl tracking-wider text-cream mb-3">ANFRAGE GESENDET!</h2>
        <p className="text-cream/60 mb-4">
          Dein Wunschtermin: <span className="text-cream font-medium">
            {formatDatum(gewaehltesDatum)} um {gewaehlterSlot} Uhr
            {istErsttermin && ` – ${String(parseInt(gewaehlterSlot) + 2).padStart(2, '0')}:00 Uhr`}
          </span>
        </p>
        <p className="text-cream/60 text-sm">
          Marcus bestätigt deinen Termin innerhalb von 48 Stunden. Wir freuen uns auf euch!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* ── Schritt 1: Datum & Slot ── */}
      <div className={`bg-card border p-6 ${schritt === 1 ? 'border-rust/40' : 'border-border opacity-60'}`}>
        <div className="flex items-center gap-3 mb-5">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 ${schritt >= 1 ? 'border-rust bg-rust text-cream' : 'border-border text-muted'}`}>1</div>
          <p className="font-semibold text-cream tracking-wide">DATUM & UHRZEIT WÄHLEN</p>
        </div>

        <div className="mb-4">
          <label className="block text-xs text-muted mb-2 uppercase tracking-wide">Wunschdatum</label>
          <DatePicker
            value={gewaehltesDatum}
            onChange={setGewaehltesDatum}
            minDate={heute}
          />
        </div>

        {/* Slot-Raster */}
        {gewaehltesDatum && (
          <div>
            {slotsLoading ? (
              <p className="text-muted text-sm">Verfügbarkeit wird geprüft...</p>
            ) : keinTag ? (
              <div className="bg-red-900/20 border border-red-800/50 p-4 text-center">
                <p className="text-red-400 font-medium text-sm">Kein Termin verfügbar</p>
                <p className="text-muted text-xs mt-1">An diesem Tag sind alle Slots belegt. Bitte wähle einen anderen Tag.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-muted uppercase tracking-wide">Verfügbare Slots am {formatDatum(gewaehltesDatum)}</p>
                  {istErsttermin && (
                    <span className="text-xs border border-amber-700/50 text-amber-400 px-2 py-0.5">⏱ 2 Stunden</span>
                  )}
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {slots.map(sl => {
                    const verfuegbar = istErsttermin ? sl.verfuegbar2h : sl.verfuegbar
                    const endUhrzeit = istErsttermin
                      ? `${String(parseInt(sl.uhrzeit) + 2).padStart(2, '0')}:00`
                      : ''
                    // Beim Ersttermin: letzte Stunde (17:00) hat keinen 2h-Block → überspringen
                    if (istErsttermin && sl.uhrzeit === '17:00') return null
                    return (
                      <button
                        key={sl.uhrzeit}
                        type="button"
                        disabled={!verfuegbar || schritt !== 1}
                        onClick={() => setGewaehlterSlot(sl.uhrzeit)}
                        className={`py-2.5 text-sm font-medium border transition-all ${
                          !verfuegbar
                            ? 'border-border/30 text-muted/40 cursor-not-allowed line-through'
                            : gewaehlterSlot === sl.uhrzeit
                            ? 'border-rust bg-rust text-cream'
                            : 'border-border text-cream hover:border-rust hover:text-rust'
                        }`}
                      >
                        {sl.uhrzeit}{istErsttermin ? `–${endUhrzeit}` : ''}
                      </button>
                    )
                  })}
                </div>
                {gewaehlterSlot && (
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-sm text-cream">
                      ✓ <span className="font-medium">{formatDatum(gewaehltesDatum)}, {gewaehlterSlot} Uhr</span> gewählt
                    </p>
                    <button
                      type="button"
                      onClick={() => setSchritt(2)}
                      className="btn-primary text-xs py-2 px-5"
                    >
                      Weiter →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* ── Schritt 2: Kontaktdaten ── */}
      <div className={`bg-card border p-6 ${schritt === 2 ? 'border-rust/40' : 'border-border opacity-60 pointer-events-none'}`}>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 ${schritt === 2 ? 'border-rust bg-rust text-cream' : 'border-border text-muted'}`}>2</div>
            <p className="font-semibold text-cream tracking-wide">DEINE ANGABEN</p>
          </div>
          {schritt === 2 && (
            <button type="button" onClick={() => setSchritt(1)} className="text-xs text-muted hover:text-rust transition-colors">
              ← Datum ändern
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-muted mb-1.5 uppercase tracking-wide">Vorname *</label>
              <input type="text" required value={form.vorname} onChange={e => set('vorname', e.target.value)}
                className="w-full bg-surface border border-border text-cream px-4 py-3 text-sm focus:outline-none focus:border-rust transition-colors"
                placeholder="Anna" />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1.5 uppercase tracking-wide">Nachname *</label>
              <input type="text" required value={form.nachname} onChange={e => set('nachname', e.target.value)}
                className="w-full bg-surface border border-border text-cream px-4 py-3 text-sm focus:outline-none focus:border-rust transition-colors"
                placeholder="Müller" />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1.5 uppercase tracking-wide">E-Mail *</label>
              <input type="email" required value={form.email} onChange={e => set('email', e.target.value)}
                className="w-full bg-surface border border-border text-cream px-4 py-3 text-sm focus:outline-none focus:border-rust transition-colors"
                placeholder="anna@beispiel.ch" />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1.5 uppercase tracking-wide">Telefon / WhatsApp</label>
              <input type="tel" value={form.telefon} onChange={e => set('telefon', e.target.value)}
                className="w-full bg-surface border border-border text-cream px-4 py-3 text-sm focus:outline-none focus:border-rust transition-colors"
                placeholder="+41 79 123 45 67" />
            </div>
          </div>

          {/* Dog */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-muted mb-1.5 uppercase tracking-wide">Name des Hundes *</label>
              <input type="text" required value={form.hund_name} onChange={e => set('hund_name', e.target.value)}
                className="w-full bg-surface border border-border text-cream px-4 py-3 text-sm focus:outline-none focus:border-rust transition-colors"
                placeholder="Bruno" />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1.5 uppercase tracking-wide">Rasse</label>
              <input type="text" value={form.hund_rasse} onChange={e => set('hund_rasse', e.target.value)}
                className="w-full bg-surface border border-border text-cream px-4 py-3 text-sm focus:outline-none focus:border-rust transition-colors"
                placeholder="Labrador" />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1.5 uppercase tracking-wide">Alter</label>
              <input type="text" value={form.hund_alter} onChange={e => set('hund_alter', e.target.value)}
                className="w-full bg-surface border border-border text-cream px-4 py-3 text-sm focus:outline-none focus:border-rust transition-colors"
                placeholder="2 Jahre" />
            </div>
          </div>

          {/* Kurs — nur wenn kein Termin vorgewählt */}
          {!terminId && (
            <div>
              <label className="block text-xs text-muted mb-1.5 uppercase tracking-wide">Gewünschter Kurs *</label>
              <select required value={form.kurs_wunsch} onChange={e => set('kurs_wunsch', e.target.value)}
                className="w-full bg-surface border border-border text-cream px-4 py-3 text-sm focus:outline-none focus:border-rust transition-colors appearance-none">
                <option value="">Kurs wählen…</option>
                {courseOptions.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          )}

          {/* Nachricht */}
          <div>
            <label className="block text-xs text-muted mb-1.5 uppercase tracking-wide">Nachricht / Fragen</label>
            <textarea rows={3} value={form.nachricht} onChange={e => set('nachricht', e.target.value)}
              className="w-full bg-surface border border-border text-cream px-4 py-3 text-sm focus:outline-none focus:border-rust transition-colors resize-none"
              placeholder="Was sollen wir über euch wissen?" />
          </div>

          {fehler && (
            <div className="bg-red-900/20 border border-red-800/50 text-red-400 px-4 py-3 text-sm">{fehler}</div>
          )}

          {/* Zusammenfassung */}
          {gewaehltesDatum && gewaehlterSlot && (
            <div className="bg-surface border border-rust/30 px-4 py-3 text-sm">
              <p className="text-muted text-xs uppercase tracking-wide mb-1">Wunschtermin</p>
              <p className="text-cream font-medium">
                {formatDatum(gewaehltesDatum)}, {gewaehlterSlot}{istErsttermin ? `–${String(parseInt(gewaehlterSlot) + 2).padStart(2, '0')}:00` : ''} Uhr
              </p>
              <p className="text-muted text-xs mt-0.5">Marcus bestätigt innerhalb von 48 Stunden.</p>
            </div>
          )}

          <button type="submit" disabled={loading}
            className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed">
            {loading ? 'Wird gesendet…' : 'Anfrage absenden →'}
          </button>

          <p className="text-muted text-xs text-center">
            Deine Daten werden ausschliesslich für die Kursanfrage verwendet.
          </p>
        </form>
      </div>
    </div>
  )
}
