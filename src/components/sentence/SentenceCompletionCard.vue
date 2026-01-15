<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { SentenceExercise } from '@/data/sentences'
import { useTypingEngine } from '@/composables/useTypingEngine'
import Letter from '@/components/typing/Letter.vue'
import TypingInput from '@/components/typing/TypingInput.vue'

const props = defineProps<{
  sentence: SentenceExercise
}>()

const emit = defineEmits<{
  complete: [correct: boolean]
}>()

// Target text is the missing Hebrew word
const targetText = computed(() => props.sentence.answer)

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
      emit('complete', wasCorrect.value)
    }, 1500)
  }
})

// Reset when sentence changes
watch(
  () => props.sentence.id,
  () => {
    reset()
    showResult.value = false
    wasCorrect.value = false
  }
)

// Split the sentence around the blank
const sentenceParts = computed(() => {
  const parts = props.sentence.hebrewWithBlank.split('___')
  return {
    before: parts[0] || '',
    after: parts[1] || '',
  }
})
</script>

<template>
  <div class="sentence-card">
    <TypingInput
      v-model="typedText"
      :disabled="showResult"
      @update:model-value="handleInput"
    />

    <!-- English context -->
    <div class="sentence-card__context">
      <div class="sentence-card__english">{{ sentence.englishTranslation }}</div>
    </div>

    <!-- Hebrew sentence with blank -->
    <div class="sentence-card__sentence">
      <span class="sentence-card__text">{{ sentenceParts.after }}</span>
      <span class="sentence-card__blank">
        <Letter
          v-for="(state, i) in letterStates"
          :key="i"
          :char="state.char"
          :status="state.status"
        />
      </span>
      <span class="sentence-card__text">{{ sentenceParts.before }}</span>
    </div>

    <!-- Hint -->
    <div v-if="!showResult" class="sentence-card__hint">
      Fill in: <strong>{{ sentence.hint }}</strong>
      <span class="sentence-card__transliteration">({{ sentence.answerTransliteration }})</span>
    </div>

    <!-- Result feedback -->
    <div
      v-if="showResult"
      class="sentence-card__result"
      :class="{
        'sentence-card__result--correct': wasCorrect,
        'sentence-card__result--incorrect': !wasCorrect
      }"
    >
      <span v-if="wasCorrect">{{ accuracy }}% - Correct!</span>
      <span v-else>
        {{ accuracy }}% - The answer was: {{ sentence.answer }}
      </span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.sentence-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 32px 48px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  min-width: 500px;

  &__context {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }

  &__english {
    font-size: 1.4em;
    color: #555;
    text-align: center;
    direction: ltr;
  }

  &__sentence {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
    font-size: 2em;
    font-family: 'Noto Sans Hebrew', sans-serif;
    direction: rtl;
    padding: 20px 32px;
    background: #f8f9fa;
    border-radius: 12px;
  }

  &__text {
    color: #333;
  }

  &__blank {
    display: flex;
    flex-direction: row;
    gap: 2px;
    padding: 8px 16px;
    background: #e9ecef;
    border-radius: 8px;
    border-bottom: 3px solid #2e8f94;
    min-width: 100px;
    justify-content: center;
  }

  &__hint {
    font-size: 1.1em;
    color: #666;
    text-align: center;
    direction: ltr;
  }

  &__transliteration {
    font-style: italic;
    color: #888;
    margin-left: 8px;
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
