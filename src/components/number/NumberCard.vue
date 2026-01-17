<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { NumberExercise } from '@/data/numbers'
import { getGenderLabel, getGenderContext } from '@/data/numbers'
import { useTypingEngine } from '@/composables/useTypingEngine'
import Letter from '@/components/typing/Letter.vue'
import TypingInput from '@/components/typing/TypingInput.vue'

const props = defineProps<{
  item: NumberExercise
}>()

const emit = defineEmits<{
  complete: [correct: boolean, accuracy: number]
}>()

// Target text is the Hebrew number
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
  <div class="number-card">
    <TypingInput
      v-model="typedText"
      :disabled="showResult"
      @update:model-value="handleInput"
    />

    <!-- Number value -->
    <div class="number-card__value">
      {{ item.value }}
    </div>

    <!-- Gender indicator -->
    <div class="number-card__gender" :class="`number-card__gender--${item.gender}`">
      <span class="number-card__gender-label">{{ getGenderLabel(item.gender) }}</span>
      <span class="number-card__gender-context">{{ getGenderContext(item.gender) }}</span>
    </div>

    <!-- Hebrew typing area -->
    <div class="number-card__hebrew">
      <Letter
        v-for="(state, i) in letterStates"
        :key="i"
        :char="state.char"
        :status="state.status"
      />
    </div>

    <!-- Hint (before result) -->
    <div v-if="!showResult" class="number-card__hint">
      {{ item.transliteration }}
    </div>

    <!-- Result feedback -->
    <div
      v-if="showResult"
      class="number-card__result"
      :class="{
        'number-card__result--correct': wasCorrect,
        'number-card__result--incorrect': !wasCorrect
      }"
    >
      <span v-if="wasCorrect">{{ accuracy }}% - Excellent!</span>
      <span v-else>{{ accuracy }}% - Keep practicing!</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.number-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 32px 48px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  min-width: 400px;

  &__value {
    font-size: 4em;
    font-weight: bold;
    color: #2e8f94;
    direction: ltr;
  }

  &__gender {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px 24px;
    border-radius: 8px;
    gap: 4px;

    &--masculine {
      background: #dbeafe;
      color: #1e40af;
    }

    &--feminine {
      background: #fce7f3;
      color: #9d174d;
    }
  }

  &__gender-label {
    font-size: 1.2em;
    font-family: 'Noto Sans Hebrew', sans-serif;
    font-weight: bold;
  }

  &__gender-context {
    font-size: 0.9em;
    opacity: 0.8;
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
    min-width: 200px;
    align-items: center;
    justify-content: center;
  }

  &__hint {
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
