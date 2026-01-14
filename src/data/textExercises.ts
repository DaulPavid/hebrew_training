import textExercisesData from './textExercises.json'

// Text exercise definition
export interface TextExerciseData {
  text: string[]
  label: string
}

/**
 * All text exercises
 * Data loaded from textExercises.json
 */
export const TEXT_EXERCISES: TextExerciseData[] = textExercisesData

// Named exports for individual exercises (for backward compatibility)
export const touchTypingExercise = TEXT_EXERCISES[0]!
export const hebrewOriginsExercise = TEXT_EXERCISES[1]!
export const keyboardExercise = TEXT_EXERCISES[2]!
export const privateCarExercise = TEXT_EXERCISES[3]!
export const bicycleExercise = TEXT_EXERCISES[4]!
export const computerScienceExercise = TEXT_EXERCISES[5]!
export const codingExercise = TEXT_EXERCISES[6]!
