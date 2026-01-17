import rootsData from './roots.json'

export interface RootExercise {
  id: string
  root: string
  targetWord: string
  targetTranslit: string
  english: string
  hint: string
  relatedWords: string[]
}

export const ROOTS: RootExercise[] = rootsData as RootExercise[]

export function getRandomRoots(count: number): RootExercise[] {
  const shuffled = [...ROOTS].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

export function getRootsByRoot(root: string): RootExercise[] {
  return ROOTS.filter(r => r.root === root)
}

export function getRootById(id: string): RootExercise | undefined {
  return ROOTS.find(r => r.id === id)
}
