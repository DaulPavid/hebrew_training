import minimalPairsData from './minimalPairs.json'

export interface MinimalPairExercise {
  id: string
  targetWord: string
  targetTranslit: string
  english: string
  confusedWith: string
  confusedTranslit: string
  confusedEnglish: string
  focusLetter: string
  confusedLetter: string
}

export const MINIMAL_PAIRS: MinimalPairExercise[] = minimalPairsData as MinimalPairExercise[]

export function getRandomMinimalPairs(count: number): MinimalPairExercise[] {
  const shuffled = [...MINIMAL_PAIRS].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

export function getMinimalPairsByLetters(focusLetter: string, confusedLetter: string): MinimalPairExercise[] {
  return MINIMAL_PAIRS.filter(
    mp => mp.focusLetter === focusLetter && mp.confusedLetter === confusedLetter
  )
}

export function getMinimalPairById(id: string): MinimalPairExercise | undefined {
  return MINIMAL_PAIRS.find(mp => mp.id === id)
}
