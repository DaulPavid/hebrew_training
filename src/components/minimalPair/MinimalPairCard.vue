<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { MinimalPairExercise } from '@/data/minimalPairs'
import { useTypingEngine } from '@/composables/useTypingEngine'
import { useSettingsStore } from '@/stores/settingsStore'
import Letter from '@/components/typing/Letter.vue'
import TypingInput from '@/components/typing/TypingInput.vue'

const props = defineProps<{
  item: MinimalPairExercise
}>()

const settingsStore = useSettingsStore()

const emit = defineEmits<{
  complete: [correct: boolean, accuracy: number]
}>()

// Target text is the target word
const targetText = computed(() => props.item.targetWord)

// Set up typing engine
const {
  typedText,
  letterStates,
  isComplete,
  accuracy,
  handleInput,
  reset,
} = useTypingEngine(targetText)

// Track result state
const showResult = ref(false)
const wasCorrect = ref(false)

// Watch for completion
watch(isComplete, (complete) => {
  if (complete) {
    wasCorrect.value = accuracy.value >= 80
    showResult.value = true

    setTimeout(() => {
      emit('complete', wasCorrect.value, accuracy.value)
    }, 1500)
  }
})

// Reset when item changes
watch(
  () => props.item.id,
  () => {
    reset()
    showResult.value = false
    wasCorrect.value = false
  }
)
</script>

<template>
  <div class="minimal-pair-card">
    <TypingInput
      v-model="typedText"
      :disabled="showResult"
      @update:model-value="handleInput"
    />

    <!-- Letter focus -->
    <div class="minimal-pair-card__focus">
      <span class="minimal-pair-card__focus-letter">{{ item.focusLetter }}</span>
      <span class="minimal-pair-card__focus-vs">vs</span>
      <span class="minimal-pair-card__confused-letter">{{ item.confusedLetter }}</span>
    </div>

    <!-- Target word info -->
    <div class="minimal-pair-card__target">
      <span class="minimal-pair-card__translit">"{{ item.targetTranslit }}"</span>
      <span class="minimal-pair-card__english">{{ item.english }}</span>
    </div>

    <!-- Warning: confused word -->
    <div class="minimal-pair-card__warning">
      <span class="minimal-pair-card__warning-label">Not:</span>
      <span class="minimal-pair-card__warning-word">{{ item.confusedWith }}</span>
      <span class="minimal-pair-card__warning-info">({{ item.confusedTranslit }} - {{ item.confusedEnglish }})</span>
    </div>

    <!-- Hebrew typing area -->
    <div class="minimal-pair-card__hebrew">
      <!-- Practice mode: show answer with real-time feedback -->
      <template v-if="settingsStore.practiceMode || showResult">
        <Letter
          v-for="(state, i) in letterStates"
          :key="i"
          :char="state.char"
          :status="state.status"
        />
      </template>
      <!-- Test mode: show typed text without revealing answer -->
      <template v-else>
        <span v-if="typedText" class="minimal-pair-card__typed">{{ typedText }}</span>
        <span v-else class="minimal-pair-card__placeholder">???</span>
      </template>
    </div>

    <!-- Result feedback -->
    <div
      v-if="showResult"
      class="minimal-pair-card__result"
      :class="{
        'minimal-pair-card__result--correct': wasCorrect,
        'minimal-pair-card__result--incorrect': !wasCorrect
      }"
    >
      <span v-if="wasCorrect">{{ accuracy }}% - Excellent!</span>
      <span v-else>{{ accuracy }}% - Keep practicing!</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.minimal-pair-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 32px 48px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  min-width: 420px;

  &__focus {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 24px;
    background: #f0f9ff;
    border-radius: 8px;
  }

  &__focus-letter {
    font-size: 2em;
    font-family: 'Noto Sans Hebrew', sans-serif;
    font-weight: bold;
    color: #2e8f94;
  }

  &__focus-vs {
    font-size: 1em;
    color: #888;
    font-style: italic;
  }

  &__confused-letter {
    font-size: 2em;
    font-family: 'Noto Sans Hebrew', sans-serif;
    font-weight: bold;
    color: #dc2626;
  }

  &__target {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }

  &__translit {
    font-size: 1.5em;
    font-weight: bold;
    color: #333;
    direction: ltr;
  }

  &__english {
    font-size: 1.1em;
    color: #666;
    direction: ltr;
  }

  &__warning {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    background: #fef2f2;
    border-radius: 8px;
    border: 1px solid #fecaca;
  }

  &__warning-label {
    font-size: 0.9em;
    color: #dc2626;
    font-weight: bold;
    direction: ltr;
  }

  &__warning-word {
    font-size: 1.2em;
    font-family: 'Noto Sans Hebrew', sans-serif;
    color: #dc2626;
    direction: rtl;
  }

  &__warning-info {
    font-size: 0.85em;
    color: #991b1b;
    direction: ltr;
  }

  &__hebrew {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 4px;
    font-size: 2.2em;
    font-family: 'Noto Sans Hebrew', sans-serif;
    direction: rtl;
    padding: 20px 28px;
    background: #f8f9fa;
    border-radius: 12px;
    min-height: 80px;
    min-width: 150px;
    align-items: center;
    justify-content: center;
  }

  &__typed {
    color: #333;
  }

  &__placeholder {
    color: #aaa;
    font-style: italic;
  }

  &__result {
    font-size: 1.3em;
    font-weight: bold;
    padding: 12px 24px;
    border-radius: 8px;
    direction: ltr;
    animation: pop-in 0.3s ease-out;

    @keyframes pop-in {
      0% {
        transform: scale(0.9);
        opacity: 0;
      }
      100% {
        transform: scale(1);
        opacity: 1;
      }
    }

    &--correct {
      background: #dcfce7;
      color: #166534;
    }

    &--incorrect {
      background: #fef2f2;
      color: #991b1b;
    }
  }
}
</style>
