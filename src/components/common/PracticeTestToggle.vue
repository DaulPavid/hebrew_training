<script setup lang="ts">
import { useSettingsStore } from '@/stores/settingsStore'

const settingsStore = useSettingsStore()
</script>

<template>
  <div class="practice-test-toggle">
    <button
      class="practice-test-toggle__btn"
      :class="{ 'practice-test-toggle__btn--active': settingsStore.practiceMode }"
      @click="settingsStore.setPracticeMode(true)"
    >
      תרגול
    </button>
    <button
      class="practice-test-toggle__btn"
      :class="{ 'practice-test-toggle__btn--active': !settingsStore.practiceMode }"
      @click="settingsStore.setPracticeMode(false)"
    >
      מבחן
    </button>
  </div>
</template>

<style scoped lang="scss">
.practice-test-toggle {
  display: flex;
  gap: 4px;
  padding: 4px;
  background: #e9ecef;
  border-radius: 8px;

  &__btn {
    padding: 8px 16px;
    font-family: 'Noto Sans Hebrew', sans-serif;
    font-size: 0.9em;
    font-weight: 600;
    color: #666;
    background: transparent;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover:not(&--active) {
      background: rgba(255, 255, 255, 0.5);
      color: #333;
    }

    &--active {
      background: white;
      color: #2e8f94;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
  }
}
</style>
