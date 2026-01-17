<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { PluralExercise } from '@/data/plurals'
import { useTypingEngine } from '@/composables/useTypingEngine'
import Letter from '@/components/typing/Letter.vue'
import TypingInput from '@/components/typing/TypingInput.vue'

const props = defineProps<{
  item: PluralExercise
}>()

const emit = defineEmits<{
  complete: [correct: boolean, accuracy: number]
}>()

// Target text is the plural form
const targetText = computed(() => props.item.plural)

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
  <div class="plural-card">
    <TypingInput
      v-model="typedText"
      :disabled="showResult"
      @update:model-value="handleInput"
    />

    <!-- Prompt label -->
    <div class="plural-card__label">מה הרבים?</div>

    <!-- Singular word -->
    <div class="plural-card__singular">
      {{ item.singular }}
    </div>

    <!-- Transliteration and English -->
    <div class="plural-card__info">
      <span class="plural-card__translit">{{ item.singularTranslit }}</span>
      <span class="plural-card__english">{{ item.english }}</span>
    </div>

    <!-- Plural typing area -->
    <div class="plural-card__hebrew">
      <Letter
        v-for="(state, i) in letterStates"
        :key="i"
        :char="state.char"
        :status="state.status"
      />
    </div>

    <!-- Pattern hint (before result) -->
    <div v-if="!showResult" class="plural-card__hint">
      {{ item.pluralTranslit }}
    </div>

    <!-- Result feedback -->
    <div
      v-if="showResult"
      class="plural-card__result"
      :class="{
        'plural-card__result--correct': wasCorrect,
        'plural-card__result--incorrect': !wasCorrect
      }"
    >
      <span v-if="wasCorrect">{{ accuracy }}% - Excellent!</span>
      <span v-else>{{ accuracy }}% - Keep practicing!</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.plural-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 32px 48px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  min-width: 400px;

  &__label {
    font-size: 1em;
    color: #666;
    font-family: 'Noto Sans Hebrew', sans-serif;
  }

  &__singular {
    font-size: 2.5em;
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
    min-width: 250px;
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
