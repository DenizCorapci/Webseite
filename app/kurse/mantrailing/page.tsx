import CourseDetailPage from '@/components/CourseDetailPage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mantrailing',
  description: 'Mantrailing — Nasenarbeit und Personensuche mit Hunden in Winterthur. Mit Trainer Marcus von Bad Dog.',
}

export default function MantrailingPage() {
  return (
    <CourseDetailPage
      icon="👃"
      title="Mantrailing"
      subtitle="Nasenarbeit"
      accentLine="Die Nase kennt den Weg."
      description="Dein Hund sucht eine bestimmte Person anhand ihres einzigartigen Körpergeruchs — über kurze oder lange Strecken, in jedem Gelände. Mantrailing ist Hochleistung für Nase und Geist."
      longDescription={[
        'Beim Mantrailing sucht der Hund eine vorher definierte Person anhand eines Geruchsmusters (z.B. von einem Kleidungsstück). Anders als beim Fährtensuchen folgt er nicht dem Weg — er sucht den Menschen.',
        'Diese Disziplin ist körperlich und mental fordernd — für Hund und Halter. Marcus führt euch Schritt für Schritt vom ersten kurzen Trail bis zu komplexen Szenarien.',
        'Mantrailing macht süchtig. Wer einmal gesehen hat, wie der eigene Hund eine Spur aufnimmt und zielstrebig verfolgt, möchte nie mehr aufhören.',
      ]}
      forWhom={[
        'Hunde aller Rassen (jede Nase kann es!)',
        'Anfänger — kein Vorwissen nötig',
        'Fortgeschrittene, die Distanz & Komplexität steigern wollen',
        'Hunde, die mentale Auslastung brauchen',
      ]}
      details={[
        { label: 'Format', value: 'Einzel / Klein-Gruppe' },
        { label: 'Dauer', value: 'ca. 90 Min.' },
        { label: 'Ort', value: 'Gelände Adlikon & Umgebung' },
        { label: 'Level', value: 'Anfänger bis Profi' },
      ]}
    />
  )
}
