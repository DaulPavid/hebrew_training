<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { VerbExercise } from '@/data/verbs'
import { getTenseLabel } from '@/data/verbs'
import { useTypingEngine } from '@/composables/useTypingEngine'
import Letter from '@/components/typing/Letter.vue'
import TypingInput from '@/components/typing/TypingInput.vue'

const props = defineProps<{
  item: VerbExercise
}>()

const emit = defineEmits<{
  complete: [correct: boolean, accuracy: number]
}>()

// Target text is the conjugated form
const targetText = computed(() => props.item.conjugated)

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
  <div class="conjugation-card">
    <TypingInput
      v-model="typedText"
      :disabled="showResult"
      @update:model-value="handleInput"
    />

    <!-- Infinitive verb -->
    <div class="conjugation-card__infinitive">
      {{ item.infinitive }}
    </div>

    <!-- English and transliteration -->
    <div class="conjugation-card__info">
      <span class="conjugation-card__translit">{{ item.infinitiveTranslit }}</span>
      <span class="conjugation-card__english">{{ item.english }}</span>
    </div>

    <!-- Conjugation prompt -->
    <div class="conjugation-card__prompt">
      <span class="conjugation-card__person">{{ item.person }}</span>
      <span class="conjugation-card__tense">{{ getTenseLabel(item.tense) }}</span>
    </div>

    <!-- Conjugated form typing area -->
    <div class="conjugation-card__hebrew">
      <Letter
        v-for="(state, i) in letterStates"
        :key="i"
        :char="state.char"
        :status="state.status"
      />
    </div>

    <!-- Hint (before result) -->
    <div v-if="!showResult" class="conjugation-card__hint">
      {{ item.conjugatedTranslit }}
    </div>

    <!-- Result feedback -->
    <div
      v-if="showResult"
      class="conjugation-card__result"
      :class="{
        'conjugation-card__result--correct': wasCorrect,
        'conjugation-card__result--incorrect': !wasCorrect
      }"
    >
      <span v-if="wasCorrect">{{ accuracy }}% - Excellent!</span>
      <span v-else>{{ accuracy }}% - Keep practicing!</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.conjugation-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 32px 48px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  min-width: 400px;

  &__infinitive {
    font-size: 2.2em;
    font-family: 'Noto Sans Hebrew', sans-serif;
    font-weight: bold;
    color: #333;
    direction: rtl;
  }

  &__info {
    display: flex;
    gap: 16px;
    align-items: center;
  }

  &__translit {
    font-size: 1.1em;
    color: #888;
    font-style: italic;
    direction: ltr;
  }

  &__english {
    font-size: 1.1em;
    color: #666;
    direction: ltr;
  }

  &__prompt {
    display: flex;
    gap: 12px;
    align-items: center;
    padding: 10px 20px;
    background: #e8f4f5;
    border-radius: 8px;
    margin: 8px 0;
  }

  &__person {
    font-size: 1.3em;
    font-family: 'Noto Sans Hebrew', sans-serif;
    font-weight: bold;
    color: #2e8f94;
  }

  &__tense {
    font-size: 1.1em;
    font-family: 'Noto Sans Hebrew', sans-serif;
    color: #666;
    padding: 4px 12px;
    background: white;
    border-radius: 4px;
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
