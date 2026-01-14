/**
 * Audio Generation Script
 *
 * Generates MP3 files for Hebrew vocabulary and phrases using Google Cloud TTS.
 *
 * Prerequisites:
 * 1. Create a Google Cloud project
 * 2. Enable "Cloud Text-to-Speech API"
 * 3. Create a service account and download JSON key
 * 4. Set environment variable: GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json
 *
 * Usage:
 *   npm run generate-audio
 */

import { TextToSpeechClient } from '@google-cloud/text-to-speech'
import { writeFile, mkdir, readFile } from 'fs/promises'
import { existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

// ESM __dirname equivalent
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Types
interface VocabItem {
  id: string
  hebrew: string
}

interface Phrase {
  id: string
  hebrew: string
}

interface AudioItem {
  id: string
  hebrew: string
  type: 'vocab' | 'phrase'
}

// Load JSON data
async function loadJsonData<T>(filename: string): Promise<T> {
  const filepath = join(__dirname, '../src/data', filename)
  const content = await readFile(filepath, 'utf-8')
  return JSON.parse(content) as T
}

// Combine vocabulary and phrases into a single list
async function getAudioItems(): Promise<AudioItem[]> {
  const vocabulary = await loadJsonData<VocabItem[]>('vocabulary.json')
  const phrases = await loadJsonData<Phrase[]>('phrases.json')

  const items: AudioItem[] = []

  for (const vocab of vocabulary) {
    items.push({
      id: vocab.id,
      hebrew: vocab.hebrew,
      type: 'vocab',
    })
  }

  for (const phrase of phrases) {
    items.push({
      id: phrase.id,
      hebrew: phrase.hebrew,
      type: 'phrase',
    })
  }

  return items
}

async function generateAudio() {
  // Check for credentials
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    console.error('Error: GOOGLE_APPLICATION_CREDENTIALS environment variable not set')
    console.error('')
    console.error('To use this script:')
    console.error('1. Create a Google Cloud project at https://console.cloud.google.com')
    console.error('2. Enable the "Cloud Text-to-Speech API"')
    console.error('3. Create a service account and download the JSON key')
    console.error('4. Set the environment variable:')
    console.error('   export GOOGLE_APPLICATION_CREDENTIALS=/path/to/your-key.json')
    console.error('')
    console.error('Then run: npm run generate-audio')
    process.exit(1)
  }

  const client = new TextToSpeechClient()
  const outputDir = join(__dirname, '../public/audio')

  // Ensure output directory exists
  if (!existsSync(outputDir)) {
    await mkdir(outputDir, { recursive: true })
  }

  const items = await getAudioItems()
  console.log(`\nGenerating audio for ${items.length} items...\n`)

  let successCount = 0
  let errorCount = 0

  for (const item of items) {
    const filename = `${item.type}-${item.id}.mp3`
    const filepath = join(outputDir, filename)

    try {
      // Request audio from Google Cloud TTS
      const [response] = await client.synthesizeSpeech({
        input: { text: item.hebrew },
        voice: {
          languageCode: 'he-IL',
          // Use Wavenet for higher quality (costs more but sounds better)
          // Alternatives: 'he-IL-Standard-A', 'he-IL-Standard-B', etc.
          name: 'he-IL-Wavenet-A',
        },
        audioConfig: {
          audioEncoding: 'MP3',
          // Slightly slower speaking rate for learners
          speakingRate: 0.9,
          pitch: 0,
        },
      })

      if (response.audioContent) {
        await writeFile(filepath, response.audioContent, 'binary')
        successCount++
        console.log(`[${successCount}/${items.length}] Generated: ${filename}`)
      } else {
        throw new Error('No audio content in response')
      }
    } catch (error) {
      errorCount++
      console.error(`Error generating ${filename}:`, error instanceof Error ? error.message : error)
    }

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  console.log('\n--- Summary ---')
  console.log(`Successfully generated: ${successCount}`)
  console.log(`Errors: ${errorCount}`)
  console.log(`Output directory: ${outputDir}`)
}

// Run the script
generateAudio().catch(console.error)
