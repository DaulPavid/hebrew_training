<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getRandomRoots, type RootExercise } from '@/data/roots'
import { useSettingsStore } from '@/stores/settingsStore'
import RootCard from '@/components/root/RootCard.vue'
import QwertyReference from '@/components/keyboard/QwertyReference.vue'

const settingsStore = useSettingsStore()

// Session settings
const SESSION_SIZE = 10

// Session state
const queue = ref<RootExercise[]>([])
const completedCount = ref(0)
const correctCount = ref(0)

// Current item
const currentItem = computed(() => queue.value[0] ?? null)

// Is session complete?
const isSessionComplete = computed(() => {
  return completedCount.value > 0 && queue.value.length === 0
})

// Accuracy percentage
const sessionAccuracy = computed(() => {
  if (completedCount.value === 0) return 0
  return Math.round((correctCount.value / completedCount.value) * 100)
})

// Start a new session
function startSession() {
  queue.value = getRandomRoots(SESSION_SIZE)
  completedCount.value = 0
  correctCount.value = 0
}

// Handle completion
function handleComplete(correct: boolean) {
  completedCount.value++
  if (correct) {
    correctCount.value++
  }
  queue.value = queue.value.slice(1)
}

// Start on mount
onMounted(() => {
  startSession()
})
</script>

<template>
  <div class="root-view">
    <!-- Header -->
    <div class="root-view__header">
      <h1>שורשים</h1>
      <p class="root-view__subtitle">Type a word from the root</p>
      <div class="root-view__stats">
        <div class="root-view__stat">
          <span class="root-view__stat-value">{{ completedCount }}</span>
          <span class="root-view__stat-label">הושלמו</span>
        </div>
        <div class="root-view__stat">
          <span class="root-view__stat-value">{{ queue.length }}</span>
          <span class="root-view__stat-label">נותרו</span>
        </div>
        <div class="root-view__stat">
          <span class="root-view__stat-value">{{ sessionAccuracy }}%</span>
          <span class="root-view__stat-label">דיוק</span>
        </div>
      </div>
    </div>

    <!-- Session complete -->
    <div v-if="isSessionComplete" class="root-view__complete">
      <svg class="root-view__trophy" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M32 8L38 24H54L41 34L47 50L32 40L17 50L23 34L10 24H26L32 8Z"
          fill="#fbbf24"
          stroke="#f59e0b"
          stroke-width="2"
        />
      </svg>
      <h2>כל הכבוד!</h2>
      <p>סיימת את תרגול השורשים</p>
      <div class="root-view__session-stats">
        <p>נכונים: {{ correctCount }} / {{ completedCount }}</p>
        <p>דיוק: {{ sessionAccuracy }}%</p>
      </div>
      <button class="root-view__btn" @click="startSession">
        התחל שוב
      </button>
    </div>

    <!-- No items -->
    <div v-else-if="!currentItem" class="root-view__empty">
      <h2>אין פריטים</h2>
      <button class="root-view__btn" @click="startSession">
        התחל תרגול
      </button>
    </div>

    <!-- Active card -->
    <RootCard
      v-else
      :key="currentItem.id"
      :item="currentItem"
      @complete="handleComplete"
    />

    <!-- Progress bar -->
    <div v-if="currentItem" class="root-view__progress">
      <div class="root-view__progress-bar">
        <div
          class="root-view__progress-fill"
          :style="{ width: `${(completedCount / SESSION_SIZE) * 100}%` }"
        />
      </div>
      <span class="root-view__progress-text">
        {{ completedCount }} / {{ SESSION_SIZE }}
      </span>
    </div>

    <!-- Keyboard display -->
    <QwertyReference
      v-if="settingsStore.showKeyboard"
      class="root-view__keyboard"
    />

    <!-- Fixed keyboard toggle button -->
    <button class="root-view__keyboard-toggle" @click="settingsStore.toggleKeyboard">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="2" y="4" width="20" height="14" rx="2" />
        <line x1="6" y1="8" x2="6" y2="8" />
        <line x1="10" y1="8" x2="10" y2="8" />
        <line x1="14" y1="8" x2="14" y2="8" />
        <line x1="18" y1="8" x2="18" y2="8" />
        <line x1="6" y1="12" x2="6" y2="12" />
        <line x1="18" y1="12" x2="18" y2="12" />
        <line x1="8" y1="16" x2="16" y2="16" />
      </svg>
    </button>
  </div>
</template>

<style scoped lang="scss">
.root-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  width: 100%;
  max-width: 600px;
  direction: rtl;

  &__header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    width: 100%;

    h1 {
      font-family: 'Noto Sans Hebrew', sans-serif;
      font-size: 2em;
      color: #333;
      margin: 0;
    }
  }

  &__subtitle {
    font-size: 1em;
    color: #666;
    margin: 0;
    direction: ltr;
  }

  &__stats {
    display: flex;
    gap: 24px;
    margin-top: 8px;
  }

  &__stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: white;
    padding: 12px 20px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  &__stat-value {
    font-size: 1.5em;
    font-weight: bold;
    color: #2e8f94;
  }

  &__stat-label {
    font-size: 0.85em;
    color: #666;
  }

  &__complete,
  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    padding: 48px;
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    text-align: center;

    h2 {
      font-family: 'Noto Sans Hebrew', sans-serif;
      margin: 0;
      color: #333;
    }

    p {
      color: #666;
      margin: 0;
    }
  }

  &__trophy {
    width: 80px;
    height: 80px;
    animation: bounce 0.5s ease-out;

    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
  }

  &__session-stats {
    display: flex;
    gap: 24px;
    font-size: 1.1em;
    color: #333;

    p {
      margin: 0;
    }
  }

  &__btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 14px 28px;
    font-size: 1.1em;
    font-family: 'Noto Sans Hebrew', sans-serif;
    font-weight: bold;
    color: white;
    background: linear-gradient(135deg, #2e8f94 0%, #1a5f63 100%);
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 4px 12px rgba(46, 143, 148, 0.3);
    margin-top: 8px;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(46, 143, 148, 0.4);
    }

    &:active {
      transform: translateY(0);
    }
  }

  &__progress {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    width: 100%;
    max-width: 400px;
  }

  &__progress-bar {
    width: 100%;
    height: 8px;
    background: #e9ecef;
    border-radius: 4px;
    overflow: hidden;
  }

  &__progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #2e8f94, #3db8bd);
    border-radius: 4px;
    transition: width 0.3s ease-out;
  }

  &__progress-text {
    font-size: 0.9em;
    color: #666;
    direction: ltr;
  }

  &__keyboard {
    width: 100%;
    max-width: 700px;
  }

  &__keyboard-toggle {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 48px;
    height: 48px;
    padding: 12px;
    background: white;
    border: 1px solid #ddd;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 100;

    svg {
      width: 100%;
      height: 100%;
      color: #666;
    }

    &:hover {
      background: #f5f5f5;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);

      svg {
        color: #2e8f94;
      }
    }
  }
}
</style>
