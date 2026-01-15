<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useExerciseStore } from '@/stores/exerciseStore'
import { useProgressStore } from '@/stores/progressStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { useTypingEngine } from '@/composables/useTypingEngine'
import { useWPM } from '@/composables/useWPM'
import TextBlock from '@/components/typing/TextBlock.vue'
import TypingInput from '@/components/typing/TypingInput.vue'
import QwertyReference from '@/components/keyboard/QwertyReference.vue'
import CompletionCard from '@/components/exercises/CompletionCard.vue'
import HeroSection from '@/components/exercises/HeroSection.vue'
import { ExerciseType } from '@/data/letterSets'

const exerciseStore = useExerciseStore()
const progressStore = useProgressStore()
const settingsStore = useSettingsStore()

// Compute target text from current exercise
const targetText = computed(() => {
  if (!exerciseStore.currentExercise) return ''
  return exerciseStore.currentExercise.text.join('')
})

// Get lines for multi-line display
const lines = computed(() => exerciseStore.currentExercise?.text ?? [])

// Set up typing engine
const {
  typedText,
  letterStates,
  isComplete,
  correctCount,
  accuracy,
  currentIndex,
  handleInput,
  reset,
} = useTypingEngine(targetText)

// Set up WPM tracking
const { wpm, elapsedTimeSeconds } = useWPM(
  typedText,
  targetText,
  computed(() => correctCount.value)
)

// Show completion card
const showCompletion = ref(false)

// Current letter for keyboard highlight
const currentLetter = computed(() => {
  if (!targetText.value || currentIndex.value >= targetText.value.length) {
    return undefined
  }
  return targetText.value[currentIndex.value]
})

// Exercise title
const exerciseTitle = computed(() => {
  if (!exerciseStore.currentExercise) return ''
  const { type, newLetters, label, index } = exerciseStore.currentExercise

  if (type === ExerciseType.TEXT) {
    return `${index + 1}. ${label}`
  }

  const typeLabel = type === ExerciseType.PRACTICE ? 'תרגול' : 'שיעור'
  if (newLetters) {
    return `${index + 1}. ${typeLabel}: ${newLetters[0]} ${newLetters[1]}`
  }
  return `${index + 1}. ${typeLabel}`
})

// Watch for exercise completion
watch(isComplete, (complete) => {
  if (complete && exerciseStore.currentExercise) {
    showCompletion.value = true
    progressStore.saveWPM(exerciseStore.currentExercise.id, wpm.value)
  }
})

// Reset when exercise changes
watch(
  () => exerciseStore.currentExercise?.id,
  () => {
    reset()
    showCompletion.value = false
  }
)

// Try again handler
function tryAgain() {
  exerciseStore.regenerateCurrentExercise()
  reset()
  showCompletion.value = false
}

// Next exercise handler
function nextExercise() {
  if (!exerciseStore.currentExercise) return
  const currentIndex = exerciseStore.currentExercise.index
  exerciseStore.selectExerciseByIndex(currentIndex + 1)
}
</script>

<template>
  <div class="exercise-view">
    <!-- No exercise selected: show hero -->
    <HeroSection v-if="!exerciseStore.currentExercise" />

    <!-- Exercise active -->
    <template v-else>
      <TypingInput
        v-model="typedText"
        :disabled="showCompletion"
        @update:model-value="handleInput"
      />

      <h2 class="exercise-view__title">{{ exerciseTitle }}</h2>

      <TextBlock
        :key="exerciseStore.currentExercise?.id"
        :letter-states="letterStates"
        :lines="lines"
      />

      <div
        class="exercise-view__wpm"
        :class="{ 'exercise-view__wpm--visible': elapsedTimeSeconds > 1 && !isComplete }"
      >
        {{ Math.round(wpm) }} WPM
      </div>

      <!-- Completion state -->
      <template v-if="showCompletion">
        <CompletionCard :wpm="wpm" :accuracy="accuracy" />

        <div class="exercise-view__actions">
          <button class="exercise-view__btn exercise-view__btn--secondary" @click="tryAgain">
            נסה שוב
          </button>
          <button class="exercise-view__btn exercise-view__btn--primary" @click="nextExercise">
            הבא
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M19 12H5M5 12L12 19M5 12L12 5"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
      </template>

      <!-- Keyboard display -->
      <QwertyReference
        v-if="settingsStore.showKeyboard && !showCompletion"
        :current-letter="currentLetter"
        class="exercise-view__keyboard"
      />
    </template>

    <!-- Fixed keyboard toggle button -->
    <button
      v-if="exerciseStore.currentExercise"
      class="exercise-view__keyboard-toggle"
      @click="settingsStore.toggleKeyboard"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="2" y="4" width="20" height="14" rx="2" />
        <line x1="6" y1="8" x2="6" y2="8" />
        <line x1="10" y1="8" x2="10" y2="8" />
        <line x1="14" y1="8" x2="14" y2="8" />
        <line x1="18" y1="8" x2="18" y2="8" />
        <line x1="6" y1="12" x2="6" y2="12" />
        <line x1="18" y1="12" x2="18" y2="12" />
        <line x1="8" y1="16" x2="16" y2="16" />
      </svg>
    </button>
  </div>
</template>

<style scoped lang="scss">
.exercise-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  width: 100%;
  max-width: 800px;
  direction: rtl;

  &__title {
    font-family: 'Noto Sans Hebrew', sans-serif;
    font-size: 1.5em;
    color: #333;
    margin: 0;
    text-align: center;
  }

  &__wpm {
    font-family: monospace;
    font-size: 1.5em;
    font-weight: bold;
    color: #2b2fff;
    opacity: 0;
    transition: opacity 0.3s;

    &--visible {
      opacity: 1;
    }
  }

  &__keyboard-toggle {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 48px;
    height: 48px;
    padding: 12px;
    background: white;
    border: 1px solid #ddd;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 100;

    svg {
      width: 100%;
      height: 100%;
      color: #666;
    }

    &:hover {
      background: #f5f5f5;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);

      svg {
        color: #2e8f94;
      }
    }
  }

  &__keyboard {
    width: 100%;
    max-width: 700px;
    margin-top: 16px;
  }

  &__actions {
    display: flex;
    gap: 16px;
    margin-top: 16px;
  }

  &__btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    font-size: 1em;
    font-family: 'Noto Sans Hebrew', sans-serif;
    font-weight: bold;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;

    &:hover {
      transform: translateY(-2px);
    }

    &:active {
      transform: translateY(0);
    }

    &--primary {
      color: white;
      background: linear-gradient(135deg, #2e8f94 0%, #1a5f63 100%);
      box-shadow: 0 4px 12px rgba(46, 143, 148, 0.3);

      &:hover {
        box-shadow: 0 6px 16px rgba(46, 143, 148, 0.4);
      }

      svg {
        transform: scaleX(-1);
      }
    }

    &--secondary {
      color: #333;
      background: #e9ecef;

      &:hover {
        background: #dee2e6;
      }
    }
  }
}
</style>
