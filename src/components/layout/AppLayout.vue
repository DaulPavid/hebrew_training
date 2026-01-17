<script setup lang="ts">
import Sidebar from './Sidebar.vue'

type AppMode = 'typing' | 'vocab' | 'translation' | 'sentence' | 'phrase' | 'dictation' | 'conjugation' | 'plural' | 'number' | 'root' | 'minimalPair'

const emit = defineEmits<{
  'mode-change': [mode: AppMode]
}>()

function handleModeChange(mode: AppMode) {
  emit('mode-change', mode)
}
</script>

<template>
  <div class="app-layout">
    <Sidebar
      class="app-layout__sidebar"
      @mode-change="handleModeChange"
    />
    <main class="app-layout__main">
      <slot />
    </main>
  </div>
</template>

<style scoped lang="scss">
.app-layout {
  display: flex;
  min-height: 100vh;
  background: #f5f5f5;

  &__sidebar {
    position: fixed;
    top: 0;
    left: 0;
    width: 360px;
    height: 100vh;
    z-index: 100;
  }

  &__main {
    margin-left: 360px; // Offset for fixed sidebar
    flex: 1;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding: 40px;
    overflow-y: auto;
  }
}
</style>
