import { ref } from 'vue'

export type SpeechSpeed = 'slow' | 'normal'

const speedRates: Record<SpeechSpeed, number> = {
  slow: 0.6,
  normal: 1.0,
}

/**
 * Composable for Text-to-Speech functionality
 * Uses pre-generated audio files from Google Cloud TTS
 * Falls back to Web Speech API if audio file not found
 */
export function useTextToSpeech() {
  const isSupported = ref(true) // Always supported with static files
  const isSpeaking = ref(false)
  const currentSpeed = ref<SpeechSpeed>('normal')
  const currentAudio = ref<HTMLAudioElement | null>(null)

  /**
   * Get the audio file path for a given item
   * @param itemId - The vocabulary or phrase ID (e.g., 'v001' or 'phrase-1')
   * @returns The path to the audio file
   */
  function getAudioPath(itemId: string): string {
    const type = itemId.startsWith('phrase') ? 'phrase' : 'vocab'
    return `/audio/${type}-${itemId}.mp3`
  }

  /**
   * Check if an audio file exists
   */
  async function audioFileExists(path: string): Promise<boolean> {
    try {
      const response = await fetch(path, { method: 'HEAD' })
      return response.ok
    } catch {
      return false
    }
  }

  /**
   * Play audio for a vocabulary or phrase item
   * @param itemId - The item ID (e.g., 'v001' or 'phrase-1')
   * @param hebrewText - The Hebrew text (used as fallback for Web Speech API)
   */
  async function speakItem(
    itemId: string,
    hebrewText: string,
    speed: SpeechSpeed = currentSpeed.value
  ): Promise<void> {
    // Stop any current audio
    stop()

    const audioPath = getAudioPath(itemId)
    const exists = await audioFileExists(audioPath)

    if (exists) {
      return playAudioFile(audioPath, speed)
    } else {
      // Fall back to Web Speech API
      console.warn(`Audio file not found: ${audioPath}, falling back to Web Speech API`)
      return speakWithWebSpeech(hebrewText, speed)
    }
  }

  /**
   * Play a static audio file
   */
  function playAudioFile(path: string, speed: SpeechSpeed): Promise<void> {
    return new Promise((resolve, reject) => {
      const audio = new Audio(path)
      currentAudio.value = audio

      // Set playback rate for speed control
      audio.playbackRate = speedRates[speed]

      audio.onplay = () => {
        isSpeaking.value = true
      }

      audio.onended = () => {
        isSpeaking.value = false
        currentAudio.value = null
        resolve()
      }

      audio.onerror = () => {
        isSpeaking.value = false
        currentAudio.value = null
        reject(new Error(`Failed to play audio: ${path}`))
      }

      audio.play().catch(reject)
    })
  }

  /**
   * Fallback: Speak using Web Speech API
   */
  function speakWithWebSpeech(text: string, speed: SpeechSpeed): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!('speechSynthesis' in window)) {
        reject(new Error('Speech synthesis not supported'))
        return
      }

      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'he-IL'
      utterance.rate = speedRates[speed]
      utterance.volume = 1.0

      utterance.onstart = () => {
        isSpeaking.value = true
      }

      utterance.onend = () => {
        isSpeaking.value = false
        resolve()
      }

      utterance.onerror = (event) => {
        isSpeaking.value = false
        if (event.error === 'interrupted') {
          resolve()
        } else {
          reject(new Error(`Speech error: ${event.error}`))
        }
      }

      window.speechSynthesis.speak(utterance)
    })
  }

  /**
   * Legacy speak function for backward compatibility
   * Use speakItem when you have the item ID for better audio quality
   */
  function speak(text: string, speed: SpeechSpeed = currentSpeed.value): Promise<void> {
    return speakWithWebSpeech(text, speed)
  }

  /**
   * Stop any ongoing audio playback
   */
  function stop() {
    if (currentAudio.value) {
      currentAudio.value.pause()
      currentAudio.value = null
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
    isSpeaking.value = false
  }

  /**
   * Set the default speech speed
   */
  function setSpeed(speed: SpeechSpeed) {
    currentSpeed.value = speed
  }

  return {
    isSupported,
    isSpeaking,
    currentSpeed,
    speak,
    speakItem,
    stop,
    setSpeed,
    getAudioPath,
  }
}
