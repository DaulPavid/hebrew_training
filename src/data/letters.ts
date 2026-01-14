import lettersData from './letters.json'

// Hebrew alphabet
export const HEBREW_LETTERS: string[] = lettersData.hebrewLetters

// Final forms (sofit)
export const FINAL_LETTERS: Record<string, string> = lettersData.finalLetters

// Geresh normalization (Windows vs Mac)
export const WINDOWS_GERESH = lettersData.windowsGeresh
export const MAC_GERESH = lettersData.macGeresh

/**
 * Normalize geresh (Hebrew apostrophe) differences between platforms
 * Windows types: ' (single quote)
 * Mac types: ׳ (Hebrew punctuation geresh)
 */
export function normalizeGeresh(input: string): string {
  return input.replace(new RegExp(MAC_GERESH, 'g'), WINDOWS_GERESH)
}
