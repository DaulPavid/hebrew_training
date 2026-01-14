<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getRandomPhrases, type Phrase } from '@/data/phrases'
import PhraseTypingCard from '@/components/phrase/PhraseTypingCard.vue'

// Session settings
const SESSION_SIZE = 10

// Session state
const queue = ref<Phrase[]>([])
const completedCount = ref(0)
const totalAccuracy = ref(0)

// Current phrase
const currentPhrase = computed(() => queue.value[0] ?? null)

// Is session complete?
const isSessionComplete = computed(() => {
  return completedCount.value > 0 && queue.value.length === 0
})

// Average accuracy
const averageAccuracy = computed(() => {
  if (completedCount.value === 0) return 0
  return Math.round(totalAccuracy.value / completedCount.value)
})

// Start a new session
function startSession() {
  queue.value = getRandomPhrases(SESSION_SIZE)
  completedCount.value = 0
  totalAccuracy.value = 0
}

// Handle phrase completion
function handleComplete(_correct: boolean, accuracy: number) {
  completedCount.value++
  totalAccuracy.value += accuracy
  // Remove completed phrase from queue
  queue.value = queue.value.slice(1)
}

// Start on mount
onMounted(() => {
  startSession()
})
</script>

<template>
  <div class="phrase-view">
    <!-- Header with stats -->
    <div class="phrase-view__header">
      <h1>הקלדת ביטויים</h1>
      <p class="phrase-view__subtitle">Type common Hebrew phrases</p>
      <div class="phrase-view__stats">
        <div class="phrase-view__stat">
          <span class="phrase-view__stat-value">{{ completedCount }}</span>
          <span class="phrase-view__stat-label">הושלמו</span>
        </div>
        <div class="phrase-view__stat">
          <span class="phrase-view__stat-value">{{ queue.length }}</span>
          <span class="phrase-view__stat-label">נותרו</span>
        </div>
        <div class="phrase-view__stat">
          <span class="phrase-view__stat-value">{{ averageAccuracy }}%</span>
          <span class="phrase-view__stat-label">דיוק</span>
        </div>
      </div>
    </div>

    <!-- Session complete -->
    <div v-if="isSessionComplete" class="phrase-view__complete">
      <svg class="phrase-view__trophy" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M32 8L38 24H54L41 34L47 50L32 40L17 50L23 34L10 24H26L32 8Z"
          fill="#fbbf24"
          stroke="#f59e0b"
          stroke-width="2"
        />
      </svg>
      <h2>מעולה!</h2>
      <p>סיימת את תרגול הביטויים</p>
      <div class="phrase-view__session-stats">
        <p>הקלדת: {{ completedCount }} ביטויים</p>
        <p>דיוק ממוצע: {{ averageAccuracy }}%</p>
      </div>
      <button class="phrase-view__btn" @click="startSession">
        התחל שוב
      </button>
    </div>

    <!-- No phrases (edge case) -->
    <div v-else-if="!currentPhrase" class="phrase-view__empty">
      <h2>אין ביטויים</h2>
      <button class="phrase-view__btn" @click="startSession">
        התחל תרגול
      </button>
    </div>

    <!-- Active phrase -->
    <PhraseTypingCard
      v-else
      :phrase="currentPhrase"
      @complete="handleComplete"
    />

    <!-- Progress bar -->
    <div v-if="currentPhrase" class="phrase-view__progress">
      <div class="phrase-view__progress-bar">
        <div
          class="phrase-view__progress-fill"
          :style="{ width: `${(completedCount / SESSION_SIZE) * 100}%` }"
        />
      </div>
      <span class="phrase-view__progress-text">
        {{ completedCount }} / {{ SESSION_SIZE }}
      </span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.phrase-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  width: 100%;
  max-width: 700px;
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
}
</style>
