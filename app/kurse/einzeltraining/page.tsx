import CourseDetailPage from '@/components/CourseDetailPage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Einzeltraining',
  description: '1:1 Hundetraining mit Marcus in Adlikon bei Winterthur. Maßgeschneidertes Training für deine individuelle Situation.',
}

export default function EinzeltrainingPage() {
  return (
    <CourseDetailPage
      icon="🎯"
      title="Einzeltraining"
      subtitle="1:1 mit Marcus"
      accentLine="Dein Hund. Deine Situation. Dein Plan."
      description="Manche Hunde brauchen mehr als die Gruppe. Im Einzeltraining arbeitet Marcus direkt mit dir und deinem Hund — ohne Ablenkung, ohne Kompromisse."
      longDescription={[
        'Ob Leinenaggressivität, Trennungsangst, Jagdverhalten oder einfach ein solides Fundament — im Einzeltraining gehen wir gezielt auf eure spezifische Situation ein.',
        'Marcus analysiert zuerst: Was ist das eigentliche Problem? Was braucht der Hund? Was braucht der Halter? Daraus entsteht ein individueller Trainingsplan.',
        'Die Termine werden gemeinsam geplant und finden meistens im gewohnten Umfeld statt — dort, wo das Problem auch wirklich auftritt.',
      ]}
      forWhom={[
        'Hunde mit spezifischen Verhaltensauffälligkeiten',
        'Halter, die individuelle Betreuung suchen',
        'Hunde, die in Gruppen überfordert sind',
        'Für schnelle, gezielte Fortschritte',
      ]}
      details={[
        { label: 'Format', value: '1:1' },
        { label: 'Dauer', value: 'ca. 60–90 Min.' },
        { label: 'Ort', value: 'Flexibel / Adlikon' },
        { label: 'Buchung', value: 'Auf Anfrage' },
      ]}
    />
  )
}
