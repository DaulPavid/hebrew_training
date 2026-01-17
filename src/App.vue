<script setup lang="ts">
import { ref, watch } from 'vue'
import { useExerciseStore } from '@/stores/exerciseStore'
import AppLayout from '@/components/layout/AppLayout.vue'
import ExerciseView from '@/views/ExerciseView.vue'
import VocabDrillView from '@/views/VocabDrillView.vue'
import TranslationView from '@/views/TranslationView.vue'
import SentenceCompletionView from '@/views/SentenceCompletionView.vue'
import PhraseTypingView from '@/views/PhraseTypingView.vue'
import DictationView from '@/views/DictationView.vue'
import ConjugationView from '@/views/ConjugationView.vue'
import PluralView from '@/views/PluralView.vue'
import NumberView from '@/views/NumberView.vue'
import RootView from '@/views/RootView.vue'
import MinimalPairView from '@/views/MinimalPairView.vue'

const exerciseStore = useExerciseStore()

// Current mode
type AppMode = 'typing' | 'vocab' | 'translation' | 'sentence' | 'phrase' | 'dictation' | 'conjugation' | 'plural' | 'number' | 'root' | 'minimalPair'
const currentMode = ref<AppMode>('typing')

// Handle mode change from sidebar
function handleModeChange(mode: AppMode) {
  currentMode.value = mode
}

// Switch to typing mode when an exercise is selected
watch(
  () => exerciseStore.currentExercise,
  (exercise) => {
    if (exercise) {
      currentMode.value = 'typing'
    }
  }
)
</script>

<template>
  <AppLayout @mode-change="handleModeChange">
    <ExerciseView v-if="currentMode === 'typing'" />
    <VocabDrillView v-else-if="currentMode === 'vocab'" />
    <TranslationView v-else-if="currentMode === 'translation'" />
    <SentenceCompletionView v-else-if="currentMode === 'sentence'" />
    <PhraseTypingView v-else-if="currentMode === 'phrase'" />
    <DictationView v-else-if="currentMode === 'dictation'" />
    <ConjugationView v-else-if="currentMode === 'conjugation'" />
    <PluralView v-else-if="currentMode === 'plural'" />
    <NumberView v-else-if="currentMode === 'number'" />
    <RootView v-else-if="currentMode === 'root'" />
    <MinimalPairView v-else-if="currentMode === 'minimalPair'" />
  </AppLayout>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Hebrew:wght@400;700&display=swap');

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: 'Noto Sans Hebrew', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #f5f5f5;
}
</style>
