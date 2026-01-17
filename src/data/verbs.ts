import verbsData from './verbs.json'

export interface VerbExercise {
  id: string
  infinitive: string
  infinitiveTranslit: string
  root: string
  english: string
  tense: 'past' | 'present' | 'future'
  person: string
  conjugated: string
  conjugatedTranslit: string
}

export const VERBS: VerbExercise[] = verbsData as VerbExercise[]

export function getRandomVerbs(count: number): VerbExercise[] {
  const shuffled = [...VERBS].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

export function getVerbsByTense(tense: 'past' | 'present' | 'future'): VerbExercise[] {
  return VERBS.filter(v => v.tense === tense)
}

export function getVerbsByInfinitive(infinitive: string): VerbExercise[] {
  return VERBS.filter(v => v.infinitive === infinitive)
}

export function getVerbById(id: string): VerbExercise | undefined {
  return VERBS.find(v => v.id === id)
}

export function getTenseLabel(tense: 'past' | 'present' | 'future'): string {
  switch (tense) {
    case 'past': return 'עבר'
    case 'present': return 'הווה'
    case 'future': return 'עתיד'
  }
}
