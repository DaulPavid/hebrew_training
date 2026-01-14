import phrasesData from './phrases.json'

export interface Phrase {
  id: string
  hebrew: string
  transliteration: string
  english: string
  category: 'greeting' | 'question' | 'response' | 'common' | 'travel'
}

/**
 * Common Hebrew conversational phrases for typing practice
 * Data loaded from phrases.json
 */
export const PHRASES: Phrase[] = phrasesData as Phrase[]

/**
 * Get phrases by category
 */
export function getPhrasesByCategory(category: Phrase['category']): Phrase[] {
  return PHRASES.filter(p => p.category === category)
}

/**
 * Get random phrases for a session
 */
export function getRandomPhrases(count: number): Phrase[] {
  const shuffled = [...PHRASES].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}
