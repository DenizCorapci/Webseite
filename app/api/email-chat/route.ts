import { NextRequest } from 'next/server'
import { Resend } from 'resend'
import { auth, currentUser } from '@clerk/nextjs/server'
import { marked } from 'marked'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) {
    return new Response(JSON.stringify({ error: 'Nicht eingeloggt' }), { status: 401 })
  }

  const user = await currentUser()
  const email = user?.emailAddresses?.[0]?.emailAddress
  if (!email) {
    return new Response(JSON.stringify({ error: 'Keine Email-Adresse gefunden' }), { status: 400 })
  }

  const { antwort } = await req.json()
  if (!antwort) {
    return new Response(JSON.stringify({ error: 'Keine Antwort übergeben' }), { status: 400 })
  }

  const antwortHtml = await marked(antwort)

  const { error } = await resend.emails.send({
    from: 'Bad Dog Hundeschule <onboarding@resend.dev>',
    to: process.env.RESEND_TEST_EMAIL || email,
    subject: 'Deine Antwort vom KI-Berater – Bad Dog Hundeschule',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <div style="background: #111; padding: 24px; text-align: center;">
          <h1 style="color: #F2EDE4; font-size: 1.2rem; letter-spacing: 0.1em; margin: 0;">🐾 BAD DOG HUNDESCHULE</h1>
          <p style="color: #888; font-size: 0.8rem; margin: 4px 0 0;">KI-Berater Antwort</p>
        </div>
        <div style="padding: 32px 24px; background: #fafafa; border: 1px solid #eee; line-height: 1.7; font-size: 0.95rem;">
          <style>
            h1,h2,h3 { color: #111; margin: 16px 0 8px; }
            ul,ol { padding-left: 20px; margin: 8px 0; }
            li { margin: 4px 0; }
            strong { color: #111; }
            p { margin: 8px 0; }
          </style>
          ${antwortHtml}
        </div>
        <div style="padding: 16px 24px; background: #f0f0f0; text-align: center;">
          <p style="color: #888; font-size: 0.75rem; margin: 0;">
            Bad Dog Hundeschule · 5330 Zurzach · Diese Antwort wurde vom KI-Berater generiert und ersetzt keine professionelle Beratung durch Marcus.
          </p>
        </div>
      </div>
    `,
  })

  if (error) {
    console.error('[Email] Resend Fehler:', JSON.stringify(error))
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }

  return new Response(JSON.stringify({ ok: true, email }), { status: 200 })
}
