import numbersData from './numbers.json'

export interface NumberExercise {
  id: string
  value: number
  hebrew: string
  transliteration: string
  gender: 'masculine' | 'feminine'
}

export const NUMBERS: NumberExercise[] = numbersData as NumberExercise[]

export function getRandomNumbers(count: number): NumberExercise[] {
  const shuffled = [...NUMBERS].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

export function getNumbersByGender(gender: 'masculine' | 'feminine'): NumberExercise[] {
  return NUMBERS.filter(n => n.gender === gender)
}

export function getNumberById(id: string): NumberExercise | undefined {
  return NUMBERS.find(n => n.id === id)
}

export function getGenderLabel(gender: 'masculine' | 'feminine'): string {
  return gender === 'masculine' ? 'זכר' : 'נקבה'
}

export function getGenderContext(gender: 'masculine' | 'feminine'): string {
  return gender === 'masculine' ? 'boys/things (m)' : 'girls/things (f)'
}
