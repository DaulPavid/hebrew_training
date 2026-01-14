<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useTypingEngine } from '@/composables/useTypingEngine'
import { useTextToSpeech, type SpeechSpeed } from '@/composables/useTextToSpeech'
import Letter from '@/components/typing/Letter.vue'
import TypingInput from '@/components/typing/TypingInput.vue'

const props = defineProps<{
  itemId: string
  hebrew: string
  english: string
  transliteration: string
}>()

const emit = defineEmits<{
  complete: [correct: boolean]
}>()

// TTS
const { isSupported, isSpeaking, speakItem, currentSpeed, setSpeed } = useTextToSpeech()

// Target text
const targetText = computed(() => props.hebrew)

// Typing engine
const {
  typedText,
  letterStates,
  isComplete,
  accuracy,
  handleInput,
  reset,
} = useTypingEngine(targetText)

// State
const showResult = ref(false)
const wasCorrect = ref(false)
const hasPlayed = ref(false)

// Play the audio
async function playAudio() {
  if (!isSupported.value) return
  hasPlayed.value = true
  await speakItem(props.itemId, props.hebrew)
}

// Change speed
function cycleSpeed() {
  const speeds: SpeechSpeed[] = ['slow', 'normal']
  const currentIndex = speeds.indexOf(currentSpeed.value)
  const nextIndex = (currentIndex + 1) % speeds.length
  setSpeed(speeds[nextIndex]!)
}

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

// Reset when item changes
watch(
  () => props.hebrew,
  () => {
    reset()
    showResult.value = false
    wasCorrect.value = false
    hasPlayed.value = false
  }
)
</script>

<template>
  <div class="dictation-card">
    <TypingInput
      v-model="typedText"
      :disabled="showResult"
      @update:model-value="handleInput"
    />

    <!-- Audio controls -->
    <div class="dictation-card__audio">
      <button
        class="dictation-card__play-btn"
        :class="{ 'dictation-card__play-btn--playing': isSpeaking }"
        :disabled="!isSupported || isSpeaking"
        @click="playAudio"
      >
        <svg v-if="!isSpeaking" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z"/>
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="3">
            <animate attributeName="r" values="3;6;3" dur="1s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="1;0.5;1" dur="1s" repeatCount="indefinite"/>
          </circle>
        </svg>
        <span>{{ isSpeaking ? 'Playing...' : 'Play Audio' }}</span>
      </button>

      <button class="dictation-card__speed-btn" @click="cycleSpeed">
        {{ currentSpeed === 'slow' ? '0.6x' : '1x' }}
      </button>
    </div>

    <!-- Prompt -->
    <div v-if="!hasPlayed" class="dictation-card__prompt">
      Click play to hear the Hebrew word
    </div>

    <!-- Answer area (shown after first play) -->
    <div v-if="hasPlayed" class="dictation-card__answer">
      <div class="dictation-card__hebrew">
        <Letter
          v-for="(state, i) in letterStates"
          :key="i"
          :char="state.char"
          :status="state.status"
        />
      </div>
    </div>

    <!-- Result feedback -->
    <div
      v-if="showResult"
      class="dictation-card__result"
      :class="{
        'dictation-card__result--correct': wasCorrect,
        'dictation-card__result--incorrect': !wasCorrect
      }"
    >
      <span v-if="wasCorrect">{{ accuracy }}% - Correct!</span>
      <span v-else>
        {{ accuracy }}% - The answer was: {{ hebrew }}
      </span>
      <div class="dictation-card__translation">
        {{ english }} ({{ transliteration }})
      </div>
    </div>

    <!-- Not supported warning -->
    <div v-if="!isSupported" class="dictation-card__warning">
      Text-to-speech is not supported in your browser
    </div>
  </div>
</template>

<style scoped lang="scss">
.dictation-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 32px 48px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  min-width: 400px;

  &__audio {
    display: flex;
    gap: 12px;
    align-items: center;
  }

  &__play-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 16px 28px;
    font-size: 1.1em;
    font-weight: bold;
    color: white;
    background: linear-gradient(135deg, #2e8f94 0%, #1a5f63 100%);
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 4px 12px rgba(46, 143, 148, 0.3);

    svg {
      width: 24px;
      height: 24px;
    }

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(46, 143, 148, 0.4);
    }

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    &--playing {
      background: linear-gradient(135deg, #3db8bd 0%, #2e8f94 100%);
    }
  }

  &__speed-btn {
    padding: 12px 16px;
    font-size: 0.95em;
    font-weight: bold;
    color: #2e8f94;
    background: #e6f7f8;
    border: 2px solid #2e8f94;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: #d0f0f2;
    }
  }

  &__prompt {
    font-size: 1.2em;
    color: #666;
    padding: 24px;
    background: #f8f9fa;
    border-radius: 12px;
    text-align: center;
  }

  &__answer {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  &__hebrew {
    display: flex;
    flex-direction: row;
    gap: 4px;
    font-size: 2.5em;
    font-family: 'Noto Sans Hebrew', sans-serif;
    direction: rtl;
    padding: 16px 24px;
    background: #f8f9fa;
    border-radius: 12px;
    min-height: 80px;
    min-width: 200px;
    align-items: center;
    justify-content: center;
  }

  &__result {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    font-size: 1.3em;
    font-weight: bold;
    padding: 16px 24px;
    border-radius: 8px;
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

  &__translation {
    font-size: 0.8em;
    font-weight: normal;
    color: #666;
    direction: ltr;
  }

  &__warning {
    color: #dc2626;
    font-size: 0.9em;
    padding: 12px;
    background: #fef2f2;
    border-radius: 8px;
  }
}
</style>
