import letterExercisesData from './letterExercises.json'

// Exercise types
export const ExerciseType = {
  REVIEW: 'review',
  PRACTICE: 'practice',
  TEXT: 'text',
} as const

export type ExerciseType = (typeof ExerciseType)[keyof typeof ExerciseType]

// A pair of new letters to learn together
export type LetterPair = [string, string]

// Descriptor for a letter exercise
export interface LetterExerciseDescriptor {
  newLetters: LetterPair
  type: typeof ExerciseType.PRACTICE | typeof ExerciseType.REVIEW
}

/**
 * Letter progression exercises
 * Data loaded from letterExercises.json
 */
export const LETTER_EXERCISE_DESCRIPTORS: LetterExerciseDescriptor[] =
  letterExercisesData.map(item => ({
    newLetters: item.newLetters as LetterPair,
    type: item.type as typeof ExerciseType.PRACTICE | typeof ExerciseType.REVIEW,
  }))

/**
 * Get all letters learned up to and including a given exercise index
 */
export function getLettersUpToExercise(exerciseIndex: number): string[] {
  return LETTER_EXERCISE_DESCRIPTORS.slice(0, exerciseIndex + 1)
    .flatMap((descriptor) => descriptor.newLetters)
}

/**
 * Get a unique exercise ID from its index and type
 */
export function getExerciseId(index: number, type: ExerciseType): string {
  return `${type}-${index}`
}

/**
 * Get display label for an exercise
 */
export function getExerciseLabel(descriptor: LetterExerciseDescriptor): string {
  const [letter1, letter2] = descriptor.newLetters
  const typeLabel = descriptor.type === ExerciseType.REVIEW ? 'Review' : 'Practice'
  return `${letter1} ${letter2} (${typeLabel})`
}
