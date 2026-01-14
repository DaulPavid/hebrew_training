<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { VocabItem } from '@/types'
import { useTypingEngine } from '@/composables/useTypingEngine'
import Letter from '@/components/typing/Letter.vue'
import TypingInput from '@/components/typing/TypingInput.vue'

const props = defineProps<{
  item: VocabItem
}>()

const emit = defineEmits<{
  complete: [correct: boolean, accuracy: number]
}>()

// Target text is the Hebrew word
const targetText = computed(() => props.item.hebrew)

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
  <div class="translation-card">
    <TypingInput
      v-model="typedText"
      :disabled="showResult"
      @update:model-value="handleInput"
    />

    <!-- English prompt (what to translate) -->
    <div class="translation-card__prompt">
      <div class="translation-card__label">Translate to Hebrew:</div>
      <div class="translation-card__english">{{ item.english }}</div>
    </div>

    <!-- Hebrew answer area -->
    <div class="translation-card__answer">
      <div class="translation-card__hebrew">
        <Letter
          v-for="(state, i) in letterStates"
          :key="i"
          :char="state.char"
          :status="state.status"
        />
      </div>
      <div v-if="!showResult" class="translation-card__hint">
        ({{ item.transliteration }})
      </div>
    </div>

    <!-- Result feedback -->
    <div
      v-if="showResult"
      class="translation-card__result"
      :class="{
        'translation-card__result--correct': wasCorrect,
        'translation-card__result--incorrect': !wasCorrect
      }"
    >
      <span v-if="wasCorrect">{{ accuracy }}% - Correct!</span>
      <span v-else>
        {{ accuracy }}% - The answer was: {{ item.hebrew }}
      </span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.translation-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 32px 48px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  min-width: 400px;

  &__prompt {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  &__label {
    font-size: 0.9em;
    color: #666;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  &__english {
    font-size: 2.2em;
    font-weight: bold;
    color: #333;
    direction: ltr;
  }

  &__answer {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  &__hebrew {
    display: flex;
    flex-direction: row;
    gap: 4px;
    font-size: 2.5em;
    font-family: 'Noto Sans Hebrew', sans-serif;
    direction: rtl;
    padding: 16px 24px;
    background: #f8f9fa;
    border-radius: 12px;
    min-height: 80px;
    min-width: 200px;
    align-items: center;
    justify-content: center;
  }

  &__hint {
    font-size: 1em;
    color: #888;
    font-style: italic;
    direction: ltr;
  }

  &__result {
    font-size: 1.3em;
    font-weight: bold;
    padding: 12px 24px;
    border-radius: 8px;
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
