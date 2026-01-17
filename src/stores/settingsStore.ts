import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

const STORAGE_KEY = 'hebrew-practice-settings'

interface Settings {
  showKeyboard: boolean
  practiceMode: boolean // true = answers visible, false = test mode (answers hidden)
}

function loadSettings(): Settings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (e) {
    console.error('Failed to load settings:', e)
  }
  return { showKeyboard: true, practiceMode: true }
}

function saveSettings(settings: Settings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch (e) {
    console.error('Failed to save settings:', e)
  }
}

export const useSettingsStore = defineStore('settings', () => {
  const settings = loadSettings()
  const showKeyboard = ref(settings.showKeyboard)
  const practiceMode = ref(settings.practiceMode)

  // Persist on change
  watch([showKeyboard, practiceMode], () => {
    saveSettings({
      showKeyboard: showKeyboard.value,
      practiceMode: practiceMode.value,
    })
  })

  function toggleKeyboard() {
    showKeyboard.value = !showKeyboard.value
  }

  function togglePracticeMode() {
    practiceMode.value = !practiceMode.value
  }

  function setPracticeMode(value: boolean) {
    practiceMode.value = value
  }

  return {
    showKeyboard,
    practiceMode,
    toggleKeyboard,
    togglePracticeMode,
    setPracticeMode,
  }
})
