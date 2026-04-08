'use client'
export const dynamic = 'force-dynamic'

import { useUser } from '@clerk/nextjs'
import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatPage() {
  const { user } = useUser()
  const [hundId, setHundId] = useState<string | null>(null)
  const [hundName, setHundName] = useState<string>('')
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingHund, setLoadingHund] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)
  const initialized = useRef(false)
  const [emailSending, setEmailSending] = useState<number | null>(null)
  const [emailSent, setEmailSent] = useState<number | null>(null)

  async function sendEmail(inhalt: string, index: number) {
    setEmailSending(index)
    try {
      await fetch('/api/email-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ antwort: inhalt }),
      })
      setEmailSent(index)
      setTimeout(() => setEmailSent(null), 3000)
    } finally {
      setEmailSending(null)
    }
  }

  useEffect(() => {
    if (!user || initialized.current) return
    initialized.current = true
    supabase
      .from('hunde')
      .select('id, name')
      .eq('clerk_user_id', user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setHundId(data.id)
          setHundName(data.name)
          setMessages([{
            role: 'assistant',
            content: `Hallo! Ich bin dein persönlicher Hundetraining-Assistent von Bad Dog Hundeschule. Ich kenne das Profil und den Verhaltensbericht von ${data.name} und helfe dir gerne bei Fragen zum Training. Was möchtest du wissen?`,
          }])
        } else {
          setMessages([{
            role: 'assistant',
            content: 'Hallo! Erstelle zuerst ein Hundeprofil im Portal, damit ich dir personalisierte Tipps geben kann.',
          }])
        }
        setLoadingHund(false)
      })
  }, [user])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMsg: Message = { role: 'user', content: input.trim() }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    // Placeholder für streaming
    setMessages(prev => [...prev, { role: 'assistant', content: '' }])

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          hundId,
        }),
      })

      if (!res.ok) {
        const errText = await res.text()
        setMessages(prev => [
          ...prev.slice(0, -1),
          { role: 'assistant', content: `Fehler: ${errText}` },
        ])
        setLoading(false)
        return
      }

      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      let full = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        full += decoder.decode(value, { stream: true })
        setMessages(prev => [
          ...prev.slice(0, -1),
          { role: 'assistant', content: full },
        ])
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unbekannter Fehler'
      setMessages(prev => [
        ...prev.slice(0, -1),
        { role: 'assistant', content: `Fehler: ${msg}` },
      ])
    }

    setLoading(false)
  }

  if (loadingHund) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <p className="text-muted">Lade...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-0 flex flex-col max-w-7xl mx-auto px-6" style={{ height: '100vh' }}>
      {/* Header */}
      <div className="pt-8 pb-4 flex-shrink-0">
        <Link href="/portal" className="text-xs text-muted hover:text-rust transition-colors mb-4 inline-block">
          ← Zurück zum Portal
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-rust/20 border border-rust/40 flex items-center justify-center">
            <span className="text-xl">🐾</span>
          </div>
          <div>
            <h1 className="font-display text-2xl tracking-wider text-cream">KI-BERATER</h1>
            {hundName && <p className="text-xs text-muted">Personalisiert für {hundName}</p>}
          </div>
        </div>
        <div className="divider mt-4" />
      </div>

      {/* Nachrichten */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4" style={{ minHeight: 0 }}>
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.role === 'assistant' && (
              <div className="w-7 h-7 bg-rust/20 border border-rust/40 flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
                <span className="text-sm">🐾</span>
              </div>
            )}
            <div className="max-w-[80%]">
              <div
                className={`px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
                  m.role === 'user'
                    ? 'bg-rust/20 border border-rust/40 text-cream'
                    : 'bg-card border border-border text-cream/80'
                }`}
              >
                {m.content || (loading && i === messages.length - 1 ? (
                  <span className="text-muted animate-pulse">…</span>
                ) : '')}
              </div>
              {m.role === 'assistant' && m.content && !loading && (
                <button
                  onClick={() => sendEmail(m.content, i)}
                  disabled={emailSending === i}
                  className="mt-1 text-xs text-muted hover:text-cream transition-colors"
                >
                  {emailSent === i ? '✓ Gesendet' : emailSending === i ? '...' : '📧 Per Email senden'}
                </button>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Eingabe */}
      <div className="flex-shrink-0 pb-6 pt-3 border-t border-border">
        <form onSubmit={handleSend} className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Stell eine Frage zu deinem Hund..."
            disabled={loading}
            className="flex-1 bg-surface border border-border text-cream px-4 py-3 text-sm focus:border-rust focus:outline-none placeholder:text-muted/50 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="btn-primary px-6 disabled:opacity-40"
          >
            {loading ? '...' : '→'}
          </button>
        </form>
        <p className="text-xs text-muted/50 mt-2 text-center">
          KI-Antworten ersetzen keine professionelle Beratung durch Marcus.
        </p>
      </div>
    </div>
  )
}
