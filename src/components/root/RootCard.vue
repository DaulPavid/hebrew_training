<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { RootExercise } from '@/data/roots'
import { useTypingEngine } from '@/composables/useTypingEngine'
import Letter from '@/components/typing/Letter.vue'
import TypingInput from '@/components/typing/TypingInput.vue'

const props = defineProps<{
  item: RootExercise
}>()

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
  <div class="root-card">
    <TypingInput
      v-model="typedText"
      :disabled="showResult"
      @update:model-value="handleInput"
    />

    <!-- Root display -->
    <div class="root-card__root-label">שורש</div>
    <div class="root-card__root">
      {{ item.root }}
    </div>

    <!-- Hint -->
    <div class="root-card__meaning">
      <span class="root-card__english">{{ item.english }}</span>
      <span class="root-card__hint">({{ item.hint }})</span>
    </div>

    <!-- Related words (preview) -->
    <div class="root-card__related">
      <span class="root-card__related-label">Related:</span>
      <span class="root-card__related-words">{{ item.relatedWords.join(' • ') }}</span>
    </div>

    <!-- Hebrew typing area -->
    <div class="root-card__hebrew">
      <Letter
        v-for="(state, i) in letterStates"
        :key="i"
        :char="state.char"
        :status="state.status"
      />
    </div>

    <!-- Transliteration hint (before result) -->
    <div v-if="!showResult" class="root-card__translit">
      {{ item.targetTranslit }}
    </div>

    <!-- Result feedback -->
    <div
      v-if="showResult"
      class="root-card__result"
      :class="{
        'root-card__result--correct': wasCorrect,
        'root-card__result--incorrect': !wasCorrect
      }"
    >
      <span v-if="wasCorrect">{{ accuracy }}% - Excellent!</span>
      <span v-else>{{ accuracy }}% - Keep practicing!</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.root-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 32px 48px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  min-width: 400px;

  &__root-label {
    font-size: 0.9em;
    color: #888;
    font-family: 'Noto Sans Hebrew', sans-serif;
  }

  &__root {
    font-size: 2.5em;
    font-family: 'Noto Sans Hebrew', sans-serif;
    font-weight: bold;
    color: #2e8f94;
    direction: rtl;
    letter-spacing: 8px;
    padding: 12px 24px;
    background: #e8f4f5;
    border-radius: 12px;
  }

  &__meaning {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  &__english {
    font-size: 1.3em;
    font-weight: bold;
    color: #333;
    direction: ltr;
  }

  &__hint {
    font-size: 1em;
    color: #888;
    font-style: italic;
    direction: ltr;
  }

  &__related {
    display: flex;
    gap: 8px;
    align-items: center;
    padding: 8px 16px;
    background: #f8f9fa;
    border-radius: 6px;
  }

  &__related-label {
    font-size: 0.85em;
    color: #888;
    direction: ltr;
  }

  &__related-words {
    font-size: 1em;
    font-family: 'Noto Sans Hebrew', sans-serif;
    color: #666;
    direction: rtl;
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
    min-width: 180px;
    align-items: center;
    justify-content: center;
  }

  &__translit {
    font-size: 1em;
    color: #999;
    font-style: italic;
    direction: ltr;
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
