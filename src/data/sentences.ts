import sentencesData from './sentences.json'

export interface SentenceExercise {
  id: string
  /** The full Hebrew sentence with ___ for the blank */
  hebrewWithBlank: string
  /** The missing Hebrew word */
  answer: string
  /** Transliteration of the answer */
  answerTransliteration: string
  /** English translation of the full sentence */
  englishTranslation: string
  /** Hint for what word to fill in */
  hint: string
}

/**
 * Sentence completion exercises
 * Data loaded from sentences.json
 */
export const SENTENCES: SentenceExercise[] = sentencesData

/**
 * Get a sentence by ID
 */
export function getSentenceById(id: string): SentenceExercise | undefined {
  return SENTENCES.find(s => s.id === id)
}

/**
 * Get random sentences for a session
 */
export function getRandomSentences(count: number): SentenceExercise[] {
  const shuffled = [...SENTENCES].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}
