<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  currentLetter?: string
}>()

// QWERTY to Hebrew mapping (Israeli keyboard layout)
const keyboardRows = [
  // Top row (number row - simplified)
  [
    { qwerty: '`', hebrew: ';' },
    { qwerty: '1', hebrew: '1' },
    { qwerty: '2', hebrew: '2' },
    { qwerty: '3', hebrew: '3' },
    { qwerty: '4', hebrew: '4' },
    { qwerty: '5', hebrew: '5' },
    { qwerty: '6', hebrew: '6' },
    { qwerty: '7', hebrew: '7' },
    { qwerty: '8', hebrew: '8' },
    { qwerty: '9', hebrew: '9' },
    { qwerty: '0', hebrew: '0' },
    { qwerty: '-', hebrew: '-' },
    { qwerty: '=', hebrew: '=' },
  ],
  // QWERTY row
  [
    { qwerty: 'Q', hebrew: '/' },
    { qwerty: 'W', hebrew: "'" },
    { qwerty: 'E', hebrew: 'ק' },
    { qwerty: 'R', hebrew: 'ר' },
    { qwerty: 'T', hebrew: 'א' },
    { qwerty: 'Y', hebrew: 'ט' },
    { qwerty: 'U', hebrew: 'ו' },
    { qwerty: 'I', hebrew: 'ן' },
    { qwerty: 'O', hebrew: 'ם' },
    { qwerty: 'P', hebrew: 'פ' },
    { qwerty: '[', hebrew: ']' },
    { qwerty: ']', hebrew: '[' },
    { qwerty: '\\', hebrew: '\\' },
  ],
  // Home row
  [
    { qwerty: 'A', hebrew: 'ש' },
    { qwerty: 'S', hebrew: 'ד' },
    { qwerty: 'D', hebrew: 'ג' },
    { qwerty: 'F', hebrew: 'כ' },
    { qwerty: 'G', hebrew: 'ע' },
    { qwerty: 'H', hebrew: 'י' },
    { qwerty: 'J', hebrew: 'ח' },
    { qwerty: 'K', hebrew: 'ל' },
    { qwerty: 'L', hebrew: 'ך' },
    { qwerty: ';', hebrew: 'ף' },
    { qwerty: "'", hebrew: ',' },
  ],
  // Bottom row
  [
    { qwerty: 'Z', hebrew: 'ז' },
    { qwerty: 'X', hebrew: 'ס' },
    { qwerty: 'C', hebrew: 'ב' },
    { qwerty: 'V', hebrew: 'ה' },
    { qwerty: 'B', hebrew: 'נ' },
    { qwerty: 'N', hebrew: 'מ' },
    { qwerty: 'M', hebrew: 'צ' },
    { qwerty: ',', hebrew: 'ת' },
    { qwerty: '.', hebrew: 'ץ' },
    { qwerty: '/', hebrew: '.' },
  ],
]

// Check if a key is the current one being typed
function isActive(hebrew: string): boolean {
  return props.currentLetter === hebrew
}

// Get finger color for a key based on position
function getFingerClass(rowIndex: number, keyIndex: number): string {
  // Map keys to fingers based on standard touch typing
  if (rowIndex === 0) {
    // Number row follows similar pattern
    if (keyIndex <= 1) return 'finger-pinky-left'
    if (keyIndex === 2) return 'finger-ring-left'
    if (keyIndex === 3) return 'finger-middle-left'
    if (keyIndex <= 5) return 'finger-index-left'
    if (keyIndex <= 7) return 'finger-index-right'
    if (keyIndex === 8) return 'finger-middle-right'
    if (keyIndex === 9) return 'finger-ring-right'
    return 'finger-pinky-right'
  }
  if (rowIndex === 1) {
    // QWERTY row
    if (keyIndex === 0) return 'finger-pinky-left'
    if (keyIndex === 1) return 'finger-ring-left'
    if (keyIndex === 2) return 'finger-middle-left'
    if (keyIndex <= 4) return 'finger-index-left'
    if (keyIndex <= 6) return 'finger-index-right'
    if (keyIndex === 7) return 'finger-middle-right'
    if (keyIndex === 8) return 'finger-ring-right'
    return 'finger-pinky-right'
  }
  if (rowIndex === 2) {
    // Home row
    if (keyIndex === 0) return 'finger-pinky-left'
    if (keyIndex === 1) return 'finger-ring-left'
    if (keyIndex === 2) return 'finger-middle-left'
    if (keyIndex <= 4) return 'finger-index-left'
    if (keyIndex <= 6) return 'finger-index-right'
    if (keyIndex === 7) return 'finger-middle-right'
    if (keyIndex === 8) return 'finger-ring-right'
    return 'finger-pinky-right'
  }
  // Bottom row
  if (keyIndex === 0) return 'finger-pinky-left'
  if (keyIndex === 1) return 'finger-ring-left'
  if (keyIndex === 2) return 'finger-middle-left'
  if (keyIndex <= 4) return 'finger-index-left'
  if (keyIndex <= 6) return 'finger-index-right'
  if (keyIndex === 7) return 'finger-middle-right'
  if (keyIndex === 8) return 'finger-ring-right'
  return 'finger-pinky-right'
}
</script>

<template>
  <div class="qwerty-reference">
    <div class="qwerty-reference__title">QWERTY Reference</div>
    <div class="qwerty-reference__keyboard">
      <div
        v-for="(row, rowIndex) in keyboardRows"
        :key="rowIndex"
        class="qwerty-reference__row"
        :class="`qwerty-reference__row--${rowIndex}`"
      >
        <div
          v-for="(key, keyIndex) in row"
          :key="key.qwerty"
          class="qwerty-reference__key"
          :class="[
            getFingerClass(rowIndex, keyIndex),
            { 'qwerty-reference__key--active': isActive(key.hebrew) }
          ]"
        >
          <span class="qwerty-reference__qwerty">{{ key.qwerty }}</span>
          <span class="qwerty-reference__hebrew">{{ key.hebrew }}</span>
        </div>
      </div>
      <!-- Spacebar -->
      <div class="qwerty-reference__row qwerty-reference__row--space">
        <div
          class="qwerty-reference__key qwerty-reference__key--space"
          :class="{ 'qwerty-reference__key--active': isActive(' ') }"
        >
          <span class="qwerty-reference__qwerty">Space</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.qwerty-reference {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-top: 16px;

  &__title {
    font-size: 0.9em;
    color: #666;
    font-weight: 500;
  }

  &__keyboard {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 12px;
    background: #e8e8e8;
    border-radius: 8px;
  }

  &__row {
    display: flex;
    gap: 4px;
    justify-content: center;

    &--1 {
      margin-left: 20px;
    }

    &--2 {
      margin-left: 30px;
    }

    &--3 {
      margin-left: 50px;
    }
  }

  &__key {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: 0 2px 0 #bbb;
    font-family: 'Noto Sans Hebrew', sans-serif;
    transition: all 0.15s;

    &--space {
      width: 200px;
    }

    &--active {
      background: rgba(0, 199, 209, 0.3);
      border-color: #00c7d1;
      box-shadow: 0 2px 0 #00a5ad;
    }
  }

  &__qwerty {
    font-size: 0.7em;
    color: #999;
    font-family: monospace;
  }

  &__hebrew {
    font-size: 0.95em;
    color: #333;
    font-weight: 500;
  }

  // Finger color coding (subtle background tints)
  .finger-pinky-left {
    background: linear-gradient(135deg, #fff 60%, #ffebee 100%);
  }
  .finger-ring-left {
    background: linear-gradient(135deg, #fff 60%, #fff3e0 100%);
  }
  .finger-middle-left {
    background: linear-gradient(135deg, #fff 60%, #fffde7 100%);
  }
  .finger-index-left {
    background: linear-gradient(135deg, #fff 60%, #e8f5e9 100%);
  }
  .finger-index-right {
    background: linear-gradient(135deg, #fff 60%, #e3f2fd 100%);
  }
  .finger-middle-right {
    background: linear-gradient(135deg, #fff 60%, #ede7f6 100%);
  }
  .finger-ring-right {
    background: linear-gradient(135deg, #fff 60%, #fce4ec 100%);
  }
  .finger-pinky-right {
    background: linear-gradient(135deg, #fff 60%, #efebe9 100%);
  }
}
</style>
