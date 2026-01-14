import type { VocabItem } from '@/types'
import vocabularyData from './vocabulary.json'

/**
 * Essential Hebrew vocabulary - 50 foundational words
 * Data loaded from vocabulary.json
 */
export const VOCABULARY: VocabItem[] = vocabularyData

/**
 * Get vocabulary items by category
 */
export function getVocabByCategory(category: string): VocabItem[] {
  return VOCABULARY.filter((item) => item.category === category)
}

/**
 * Get all unique categories
 */
export function getCategories(): string[] {
  return [...new Set(VOCABULARY.map((item) => item.category))]
}

/**
 * Get a vocabulary item by ID
 */
export function getVocabById(id: string): VocabItem | undefined {
  return VOCABULARY.find((item) => item.id === id)
}

/**
 * Category display names
 */
export const CATEGORY_LABELS: Record<string, string> = {
  greetings: 'ברכות',
  pronouns: 'כינויים',
  verbs: 'פעלים',
  questions: 'מילות שאלה',
  numbers: 'מספרים',
  nouns: 'שמות עצם',
}
