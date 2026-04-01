import CourseDetailPage from '@/components/CourseDetailPage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hundeschule',
  description: 'Gruppentraining für Hunde aller Rassen in Adlikon bei Winterthur. Grundgehorsam, Leinenführigkeit und Sozialverhalten mit Trainer Marcus.',
}

export default function HundeschulePage() {
  return (
    <CourseDetailPage
      icon="🐕"
      title="Hundeschule"
      subtitle="Gruppentraining"
      accentLine="Gemeinsam lernen — individuell vorankommen."
      description="In der Hundeschule trainieren Hund und Halter gemeinsam in der Gruppe. Maximal 6 Teilnehmer sorgen dafür, dass Marcus auf jedes Team individuell eingehen kann."
      longDescription={[
        'Die Hundeschule ist der ideale Einstieg für Hunde, die das grundlegende Handwerkszeug erlernen sollen. Sitz, Platz, Bleib, Leinenführigkeit — aber auch der souveräne Umgang mit Ablenkungen steht im Fokus.',
        'Marcus arbeitet konsequent und hundefreundlich. Keine Bestrafung, keine leeren Drohungen. Klare Kommunikation, die der Hund versteht.',
        'Die Gruppen bleiben bewusst klein, damit jedes Mensch-Hund-Team die Aufmerksamkeit bekommt, die es verdient. Nach dem Grundkurs ist ein Aufbaukurs möglich.',
      ]}
      forWhom={[
        'Welpen und Junghunde ab 4 Monaten',
        'Hunde mit Grundkenntnissen (Aufbaukurs)',
        'Halter, die strukturiertes Training suchen',
        'Alle Rassen und Größen',
      ]}
      details={[
        { label: 'Format', value: 'Gruppe (max. 6)' },
        { label: 'Dauer', value: 'ca. 60 Min.' },
        { label: 'Ort', value: 'Adlikon, 8452' },
        { label: 'Buchung', value: 'Auf Anfrage' },
      ]}
    />
  )
}
