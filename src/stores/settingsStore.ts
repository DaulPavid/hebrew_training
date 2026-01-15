import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

const STORAGE_KEY = 'hebrew-practice-settings'

interface Settings {
  showKeyboard: boolean
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
  return { showKeyboard: true }
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

  // Persist on change
  watch(showKeyboard, (value) => {
    saveSettings({ showKeyboard: value })
  })

  function toggleKeyboard() {
    showKeyboard.value = !showKeyboard.value
  }

  return {
    showKeyboard,
    toggleKeyboard,
  }
})
