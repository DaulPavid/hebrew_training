import pluralsData from './plurals.json'

export interface PluralExercise {
  id: string
  singular: string
  singularTranslit: string
  plural: string
  pluralTranslit: string
  english: string
  gender: 'masculine' | 'feminine'
  pattern: string
}

export const PLURALS: PluralExercise[] = pluralsData as PluralExercise[]

export function getRandomPlurals(count: number): PluralExercise[] {
  const shuffled = [...PLURALS].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

export function getPluralsByGender(gender: 'masculine' | 'feminine'): PluralExercise[] {
  return PLURALS.filter(p => p.gender === gender)
}

export function getPluralsByPattern(pattern: string): PluralExercise[] {
  return PLURALS.filter(p => p.pattern === pattern)
}

export function getPluralById(id: string): PluralExercise | undefined {
  return PLURALS.find(p => p.id === id)
}
