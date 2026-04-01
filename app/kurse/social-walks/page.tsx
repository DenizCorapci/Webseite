import CourseDetailPage from '@/components/CourseDetailPage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Social Walks',
  description: 'Gemeinsame Spaziergänge mit Hunden in 5330 Zurzach. Sozialisation in der Gruppe mit Trainer Marcus.',
}

export default function SocialWalksPage() {
  return (
    <CourseDetailPage
      icon="🌿"
      title="Social Walks"
      subtitle="Gemeinsam unterwegs"
      accentLine="Laufen, sozialisieren, ankommen."
      description="Die Social Walks sind mehr als Gassi gehen. In der Gruppe durch die Natur rund um Zurzach — Hunde lernen, entspannt nebeneinander zu laufen, Halter tauschen sich aus."
      longDescription={[
        'Beim Social Walk laufen mehrere Hund-Halter-Teams gemeinsam. Marcus begleitet die Gruppe, gibt Tipps und greift ein, wenn Hunde oder Halter Unterstützung brauchen.',
        'Das Ziel: Hunde, die entspannt in der Gruppe laufen können. Keine Hektik, kein Stress. Einfach laufen — aber bewusst und unter Aufsicht.',
        'Die Strecken führen durch die Natur rund um Zurzach. Felder, Wälder, offenes Gelände. Ideal für Hunde, die Raum brauchen.',
      ]}
      forWhom={[
        'Hunde, die an der Sozialisation arbeiten',
        'Halter, die Gleichgesinnte suchen',
        'Hunde in allen Trainingslevels',
        'Regelmässige Teilnahme empfohlen',
      ]}
      details={[
        { label: 'Format', value: 'Gruppe' },
        { label: 'Dauer', value: 'ca. 90 Min.' },
        { label: 'Ort', value: 'Zurzach & Umgebung' },
        { label: 'Rhythmus', value: 'Regelmässig' },
      ]}
    />
  )
}
