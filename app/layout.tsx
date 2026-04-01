import type { Metadata } from 'next'
import { Bebas_Neue, DM_Sans } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { ClerkProvider } from '@clerk/nextjs'
import WhatsAppButton from '@/components/WhatsAppButton'

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Bad Dog — Hundeschule Winterthur',
    template: '%s | Bad Dog Hundeschule',
  },
  description:
    'Bad Dog ist deine Hundeschule in 5330 Zurzach. Hundeschule, Einzeltraining, Social Walks und Mantrailing mit Trainer Marcus.',
  keywords: [
    'Hundeschule Winterthur',
    'Hundeschule Zurzach',
    'Mantrailing Winterthur',
    'Einzeltraining Hund Winterthur',
    'Social Walks Hund',
    'Bad Dog Hundeschule',
  ],
  openGraph: {
    title: 'Bad Dog — Hundeschule Winterthur',
    description: 'Hundeschule · Einzeltraining · Social Walks · Mantrailing in 5330 Zurzach.',
    locale: 'de_CH',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="de" className={`${bebasNeue.variable} ${dmSans.variable}`}>
        <body>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <WhatsAppButton />
        </body>
      </html>
    </ClerkProvider>
  )
}
