<script setup lang="ts">
import { useExerciseStore } from '@/stores/exerciseStore'
import { useProgressStore } from '@/stores/progressStore'
import { useVocabStore } from '@/stores/vocabStore'
import ExerciseList from '@/components/exercises/ExerciseList.vue'

const exerciseStore = useExerciseStore()
const progressStore = useProgressStore()
const vocabStore = useVocabStore()

const emit = defineEmits<{
  'mode-change': [mode: 'typing' | 'vocab' | 'translation' | 'sentence' | 'phrase' | 'dictation' | 'conjugation' | 'plural' | 'number' | 'root' | 'minimalPair']
}>()

function selectTypingMode() {
  emit('mode-change', 'typing')
}

function selectVocabMode() {
  exerciseStore.clearExercise()
  emit('mode-change', 'vocab')
}

function selectTranslationMode() {
  exerciseStore.clearExercise()
  emit('mode-change', 'translation')
}

function selectSentenceMode() {
  exerciseStore.clearExercise()
  emit('mode-change', 'sentence')
}

function selectPhraseMode() {
  exerciseStore.clearExercise()
  emit('mode-change', 'phrase')
}

function selectConjugationMode() {
  exerciseStore.clearExercise()
  emit('mode-change', 'conjugation')
}

function selectPluralMode() {
  exerciseStore.clearExercise()
  emit('mode-change', 'plural')
}

function selectNumberMode() {
  exerciseStore.clearExercise()
  emit('mode-change', 'number')
}

function selectRootMode() {
  exerciseStore.clearExercise()
  emit('mode-change', 'root')
}

function selectMinimalPairMode() {
  exerciseStore.clearExercise()
  emit('mode-change', 'minimalPair')
}

function resetAllStats() {
  if (confirm('האם אתה בטוח? כל ההתקדמות תימחק.')) {
    progressStore.resetProgress()
    vocabStore.resetProgress()
  }
}
</script>

<template>
  <aside class="sidebar">
    <h1>אימון עברית</h1>

    <!-- Mode selector -->
    <div class="sidebar__modes">
      <button class="sidebar__mode-btn" @click="selectTypingMode">
        <span class="sidebar__mode-icon">⌨️</span>
        <span>הקלדה עיוורת</span>
      </button>
      <button class="sidebar__mode-btn" @click="selectVocabMode">
        <span class="sidebar__mode-icon">📚</span>
        <span>אוצר מילים</span>
        <span v-if="vocabStore.dueItems.length > 0" class="sidebar__badge">
          {{ vocabStore.dueItems.length }}
        </span>
      </button>
      <button class="sidebar__mode-btn" @click="selectTranslationMode">
        <span class="sidebar__mode-icon">🔄</span>
        <span>תרגום</span>
      </button>
      <button class="sidebar__mode-btn" @click="selectSentenceMode">
        <span class="sidebar__mode-icon">✏️</span>
        <span>השלמת משפטים</span>
      </button>
      <button class="sidebar__mode-btn" @click="selectPhraseMode">
        <span class="sidebar__mode-icon">💬</span>
        <span>ביטויים</span>
      </button>
      <button class="sidebar__mode-btn" @click="selectConjugationMode">
        <span class="sidebar__mode-icon">📝</span>
        <span>הטיית פעלים</span>
      </button>
      <button class="sidebar__mode-btn" @click="selectPluralMode">
        <span class="sidebar__mode-icon">📚</span>
        <span>יחיד ורבים</span>
      </button>
      <button class="sidebar__mode-btn" @click="selectNumberMode">
        <span class="sidebar__mode-icon">🔢</span>
        <span>מספרים</span>
      </button>
      <button class="sidebar__mode-btn" @click="selectRootMode">
        <span class="sidebar__mode-icon">🌱</span>
        <span>שורשים</span>
      </button>
      <button class="sidebar__mode-btn" @click="selectMinimalPairMode">
        <span class="sidebar__mode-icon">🔤</span>
        <span>אותיות דומות</span>
      </button>
    </div>

    <div class="sidebar__stats" v-if="progressStore.completedCount > 0 || vocabStore.learnedCount > 0">
      <div class="sidebar__stat" v-if="progressStore.streak > 0">
        <span class="sidebar__stat-value">{{ progressStore.streak }}</span>
        <span class="sidebar__stat-label">רצף</span>
      </div>
      <div class="sidebar__stat" v-if="progressStore.bestWPM > 0">
        <span class="sidebar__stat-value">{{ progressStore.bestWPM }}</span>
        <span class="sidebar__stat-label">WPM</span>
      </div>
      <div class="sidebar__stat" v-if="vocabStore.learnedCount > 0">
        <span class="sidebar__stat-value">{{ vocabStore.learnedCount }}/50</span>
        <span class="sidebar__stat-label">מילים</span>
      </div>
    </div>

    <ExerciseList
      class="sidebar__list"
      title="שיעורי אותיות"
      emoji="⌨️"
      :exercises="exerciseStore.letterExercises"
      @click="selectTypingMode"
    />

    <ExerciseList
      title="טקסטים"
      emoji="📖"
      :exercises="exerciseStore.textExercises"
      @click="selectTypingMode"
    />

    <button class="sidebar__reset-btn" @click="resetAllStats">
      איפוס התקדמות
    </button>
  </aside>
</template>

<style scoped lang="scss">
.sidebar {
  min-width: 360px;
  max-width: 20vw;
  height: 100vh;
  padding: 40px 36px;
  background: #ffe8d6;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  overflow-y: auto;
  direction: rtl;

  h1 {
    font-size: 36px;
    font-family: 'Noto Sans Hebrew', sans-serif;
    font-weight: bold;
    margin: 0 0 24px 0;
    color: #333;
    align-self: center;
  }

  &__modes {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
    margin-bottom: 24px;
    padding: 12px;
    background: rgba(255, 255, 255, 0.4);
    border-radius: 12px;
  }

  &__mode-btn {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 18px;
    background: white;
    border: 2px solid #e9d5c9;
    border-radius: 10px;
    cursor: pointer;
    font-family: 'Noto Sans Hebrew', sans-serif;
    font-size: 1.05em;
    font-weight: 600;
    color: #333;
    transition: all 0.2s;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

    &:hover {
      background: #fff8f3;
      border-color: #2e8f94;
      transform: translateX(-4px);
      box-shadow: 0 4px 8px rgba(46, 143, 148, 0.15);
    }
  }

  &__mode-icon {
    font-size: 1.3em;
  }

  &__badge {
    background: #ef4444;
    color: white;
    font-size: 0.75em;
    padding: 2px 8px;
    border-radius: 10px;
    margin-right: auto;
  }

  &__stats {
    display: flex;
    gap: 16px;
    margin-bottom: 24px;
    width: 100%;
    justify-content: flex-end;
    flex-wrap: wrap;
  }

  &__stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: rgba(255, 255, 255, 0.5);
    padding: 8px 16px;
    border-radius: 8px;
  }

  &__stat-value {
    font-size: 1.3em;
    font-weight: bold;
    color: #2e8f94;
  }

  &__stat-label {
    font-size: 0.75em;
    color: #666;
  }

  &__list {
    margin-bottom: 16px;
  }

  &__reset-btn {
    margin-top: 32px;
    padding: 10px 16px;
    background: transparent;
    border: 1px solid #c9a99a;
    border-radius: 8px;
    color: #8a7060;
    font-family: 'Noto Sans Hebrew', sans-serif;
    font-size: 0.9em;
    cursor: pointer;
    transition: all 0.2s;
    align-self: center;

    &:hover {
      background: rgba(255, 255, 255, 0.5);
      border-color: #a08070;
      color: #6a5040;
    }
  }
}
</style>
