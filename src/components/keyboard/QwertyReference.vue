<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { getFingerForLetter, FINGER_IDS } from './constants'

const props = defineProps<{
  currentLetter?: string
}>()

const svgRef = ref<SVGSVGElement | null>(null)

// QWERTY to Hebrew mapping (Israeli keyboard layout)
// Each row structured from left to right as on a physical QWERTY keyboard
const numberRow = [
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
]

const topRow = [
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
]

const homeRow = [
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
]

const bottomRow = [
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
]

// Check if a key is the current one being typed
function isActive(hebrew: string): boolean {
  return props.currentLetter === hebrew
}

// Get finger class for a key based on row and position
function getFingerClass(row: 'number' | 'top' | 'home' | 'bottom', keyIndex: number): string {
  // Number row finger assignments
  if (row === 'number') {
    if (keyIndex <= 1) return 'finger-pinky-left'
    if (keyIndex === 2) return 'finger-ring-left'
    if (keyIndex === 3) return 'finger-middle-left'
    if (keyIndex <= 5) return 'finger-index-left'
    if (keyIndex <= 7) return 'finger-index-right'
    if (keyIndex === 8) return 'finger-middle-right'
    if (keyIndex === 9) return 'finger-ring-right'
    return 'finger-pinky-right'
  }
  // Top row (QWERTY row)
  if (row === 'top') {
    if (keyIndex === 0) return 'finger-pinky-left'
    if (keyIndex === 1) return 'finger-ring-left'
    if (keyIndex === 2) return 'finger-middle-left'
    if (keyIndex <= 4) return 'finger-index-left'
    if (keyIndex <= 6) return 'finger-index-right'
    if (keyIndex === 7) return 'finger-middle-right'
    if (keyIndex === 8) return 'finger-ring-right'
    return 'finger-pinky-right'
  }
  // Home row
  if (row === 'home') {
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

function markAllInactive() {
  const svg = svgRef.value
  if (!svg) return

  for (const fingerId of FINGER_IDS) {
    const el = svg.querySelector(`#${fingerId}`)
    if (el) {
      el.classList.remove('current-finger')
      el.classList.add('inactive-finger')
    }
  }
}

function highlightCurrentLetter(letter: string | undefined) {
  const svg = svgRef.value
  if (!svg || !letter) {
    markAllInactive()
    return
  }

  markAllInactive()

  const fingerId = getFingerForLetter(letter)
  if (fingerId) {
    const fingerEl = svg.querySelector(`#${fingerId}`)
    if (fingerEl) {
      fingerEl.classList.remove('inactive-finger')
      fingerEl.classList.add('current-finger')
    }
  }
}

onMounted(() => {
  highlightCurrentLetter(props.currentLetter)
})

watch(() => props.currentLetter, (letter) => {
  highlightCurrentLetter(letter)
})
</script>

<template>
  <div class="qwerty-keyboard" dir="ltr">
    <!-- SVG Hands overlay -->
    <svg
      ref="svgRef"
      class="qwerty-keyboard__hands"
      viewBox="0 30 190 65"
      preserveAspectRatio="xMidYMin meet"
      xmlns="http://www.w3.org/2000/svg"
    >
      <!-- Left hand outline -->
      <g transform="translate(-10, -2)">
        <path d="m33.625 93.212c2.0742-3.3368 6.7327-10.171 7.1631-11.357 0.42333-1.1662 1.3654-2.6789 1.2691-4.0176-0.43096-5.9972-0.01421-13.275 0.09162-21.343-0.52874-2.9157-1.3591-6.0315-1.4874-8.5822-0.13849-2.7662 0.09353-5.809 0.84814-8.9464 1.2416-5.1604 5.8865-4.5518 5.0759 0.0324-0.28526 1.614-0.8878 3.3746-0.50668 7.0411 0.19809 1.9059 1.4265 4.3518 1.9062 7.7683 1.5868-7.5418 0.73892-8.953 1.8872-12.596 0.414-1.3124 3.0358-5.5807 3.5514-6.2993 1.8676-2.6003 6.6356-1.5074 6.1069 1.1169-0.18155 0.90146-2.7491 5.4427-2.8931 6.365-0.35313 2.2564-1.2859 6.167-1.5989 9.0107-0.11326 1.0272 0.0825 1.7372 0.4299 1.8261 0.34167 0.0871 1.1192-0.59967 1.5101-1.9026 0.37624-1.2559 2.5794-8.5335 4.0903-10.841 0.59936-0.91569 4.0309-5.2415 4.9412-6.2054 1.0335-1.0937 1.9667-1.6743 3.4908-1.381 1.4208 0.27294 2.5711 1.2066 2.3065 2.8163-0.34061 2.0704-3.0218 6.157-3.1593 6.5268-0.9756 2.6295-3.6142 9.7841-4.4176 11.45-0.4685 0.97106-0.33277 1.7078 0.09459 1.7928 0.46893 0.0936 1.1977-0.55074 1.9682-1.6308 1.1974-1.6797 4.5548-9.3905 5.5026-10.441 1.3385-1.4828 3.3052-5.2567 4.8859-6.637 0.99215-0.86676 2.123-1.6526 3.7296-1.0461 1.5871 0.59851 1.6223 2.026 1.4297 3.115-0.20509 1.1584-2.176 5.8156-2.9605 7.3868-1.2626 2.5282-3.1173 6.9928-4.0719 10.145-0.551 1.8193-1.7665 5.7983-1.7665 7.1912 0 1.8558 0.50477 5.1033 2.5234 3.4795 0.39173-0.69442 4.4933-4.5822 5.2994-4.6393 2.776-3.9437 5.5716-5.2435 7.8231-5.9938 1.7429-0.58077 3.7272-0.41837 5.2994 0.65836-0.83223 1.745-4.2335 4.0891-5.2653 6.535-0.53892 2.512-5.9296 5.5291-6.9166 9.1579-0.54061 1.1707-2.1304 2.38-3.1018 2.9808-5.587 6.9331-9.1541 7.6137-13.696 9.0057-1.9805 0.60669-5.2205 6.1352-8.755 12.993" fill="#ffe8d6" opacity=".55" />
      </g>
      <!-- Right hand outline -->
      <g transform="translate(-2, 0)">
        <path d="m158.26 92.894c-2.0742-3.3368-6.7329-10.171-7.1631-11.358-0.42333-1.166-1.3654-2.6787-1.2691-4.0174 0.43096-5.9972 0.0142-13.275-0.0914-21.343 0.52852-2.9159 1.3591-6.0317 1.4874-8.5822 0.13849-2.7662-0.0935-5.8092-0.84814-8.9464-1.2416-5.1604-5.8863-4.5516-5.0757 0.03256 0.28505 1.614 0.88738 3.3744 0.50647 7.0411-0.19831 1.9057-1.4267 4.3518-1.906 7.7679-1.5868-7.5416-0.73913-8.953-1.8872-12.595-0.41399-1.3126-3.0356-5.5807-3.5514-6.2993-1.8679-2.6003-6.6358-1.5072-6.1069 1.1169 0.18155 0.90146 2.7489 5.4429 2.8931 6.365 0.35334 2.2564 1.2857 6.1668 1.5991 9.0106 0.11283 1.0274-0.0829 1.7374-0.43011 1.8263-0.34147 0.0871-1.1192-0.59967-1.5099-1.9026-0.37645-1.2557-2.5794-8.5335-4.0903-10.841-0.59936-0.91569-4.0312-5.2415-4.9412-6.2054-1.0333-1.0937-1.9669-1.6743-3.491-1.381-1.4208 0.27313-2.5712 1.2066-2.3065 2.8163 0.34082 2.0704 3.0218 6.1572 3.1593 6.5268 0.97561 2.6295 3.6142 9.7839 4.4174 11.45 0.4685 0.97125 0.33277 1.708-0.0946 1.793-0.46893 0.0936-1.1977-0.55074-1.9682-1.6308-1.1972-1.6797-4.5548-9.3903-5.5024-10.441-1.3385-1.4828-3.3054-5.2567-4.8859-6.6368-0.99215-0.86657-2.123-1.6524-3.7296-1.0461-1.587 0.59851-1.6227 2.026-1.4297 3.115 0.20509 1.1584 2.176 5.8158 2.9605 7.3868 1.2626 2.5284 3.1171 6.993 4.0719 10.145 0.55101 1.8191 1.7665 5.7983 1.7665 7.191 0 1.856-0.50477 5.1033-2.5234 3.4797-0.39173-0.69442-3.6157-3.724-4.3872-3.9462-1.7402-4.4163-4.1459-6.2605-6.1561-7.4574-1.5565-0.92603-3.9313-0.99348-5.7264-0.26943 0.38388 1.8723 3.1243 4.8594 3.5315 7.456-0.0895 2.5592 5.5111 6.3064 6.4979 9.935 0.54083 1.1705 2.1306 2.38 3.1018 2.9808 5.587 6.9333 9.1539 7.6137 13.696 9.0055 1.9805 0.60688 5.2203 6.1354 8.755 12.993" fill="#ffe8d6" opacity="0.55" />
      </g>
      <!-- Finger paths -->
      <g fill="none" stroke="#00c5d1">
        <!-- Right hand fingers -->
        <g transform="translate(-2, 0)">
          <g stroke-width="1.0583">
            <path id="right-pinky" class="inactive-finger" d="m144.05 52.747s1.6734-5.6128 1.7431-6.3449c0.0697-0.73211 0.10459-5.1596-0.20918-6.7284-0.31376-1.5688-0.55779-3.4514 0.20918-4.0092 0.76697-0.5578 1.3248-0.80183 2.0569-0.62752 0.73211 0.17431 2.2312 1.8128 2.6147 3.033 0.38349 1.2202 0.80184 5.1596 0.8367 6.4147 0.0349 1.255-0.38349 7.7394-0.97615 9.622" />
            <path id="right-ring-finger" class="inactive-finger" d="m136.86 52.261s-0.44372-5.374-0.98606-7.1982c-0.54233-1.8242-0.49302-3.5991-1.134-4.6345-0.64094-1.0354-2.8596-4.4866-2.5637-5.2754 0.29581-0.78884 1.4791-2.2679 2.9582-2.0707 1.4791 0.19721 2.5638-0.0493 3.4019 1.3312 0.83815 1.3805 2.6624 4.24 3.0075 5.0782s1.4298 4.4866 1.4791 6.0642 0.83815 7.6912 0.83815 7.6912" />
            <path id="right-middle-finger" class="inactive-finger" d="m127.89 54.677s-1.134-4.388-2.12-6.2122c-0.98605-1.8242-2.4158-6.3601-2.4158-6.3601s-1.1833-2.0707-1.7256-2.8596c-0.54233-0.78884-1.8242-3.747-1.627-4.3879 0.19721-0.64093 0.49302-1.7749 1.4298-2.0214 0.93675-0.24651 0.78884-0.59163 1.9228-0.34512 1.134 0.24652 3.747 2.613 4.4372 3.747 0.69024 1.134 3.2047 3.9935 3.5991 4.8317 0.39442 0.83815 2.3172 5.7191 2.7116 7.0503 0.39443 1.3312 0.98606 4.4372 2.1693 4.9303" />
          </g>
          <path id="right-index-finger" class="inactive-finger" d="m117.74 67.052s2.593-1.8605-0.50499-10.382c-2.9985-8.2481-5.51-13.776-6.2988-16.241-0.78884-2.4651-1.5852-3.6266 0.40639-4.9472 3.1446-2.0852 7.6472 5.9362 9.6514 8.8914 1.9599 2.89 4.1414 10.255 5.4233 10.551" stroke-width="1.3229" />
        </g>
        <!-- Left hand fingers (shifted left) -->
        <g transform="translate(-10, -2)" stroke-width="1.0583">
          <path id="left-thumb" class="inactive-finger" d="m116.75 67.002s-1.8735-2.2186-2.9089-2.8596c-1.0354-0.64094-1.7749-0.73954-2.1693-1.7749-0.39443-1.0354-2.3172-5.4726-5.2754-6.6559-2.9582-1.1833-4.0921-1.2326-4.9796-1.0847-0.88745 0.14791-1.4791 0.44373-1.4791 0.44373s3.1554 5.374 3.5005 6.5573-0.0493 1.5777 0.59163 2.6624c0.64094 1.0847 4.2894 4.9303 4.2894 4.9303s1.4791 2.2679 1.7256 2.8103" />
          <path id="left-pinky" class="inactive-finger" d="m47.922 53.346s-1.8242-3.7963-1.9721-7.0996c-0.14791-3.3033 0.69024-7.2968 0.73954-7.9377 0.0493-0.64094 0.09861-2.5637-1.0354-2.8103-1.134-0.24652-2.0707-0.29582-3.0075 1.0847-0.93675 1.3805-2.1693 6.0149-2.0214 9.121 0.14791 3.1061 1.2326 9.3675 1.2819 10.255" />
          <path id="left-ring-finger" class="inactive-finger" d="m55.152 52.921s-0.90642-6.066 1.6037-11.156c2.5101-5.0899 4.044-5.5082 2.4404-7.6-1.6037-2.0917-4.6716-0.62752-5.2991 0.06972-0.62752 0.69725-4.044 5.9266-4.3927 7.6-0.34862 1.6734-1.3945 11.435-1.3945 11.435" />
          <path id="left-middle-finger" class="inactive-finger" d="m63.868 54.246 4.7413-11.644s2.8587-5.4385 3.1376-6.4844c0.2789-1.0459 0.06972-3.1376-3.2771-3.4165-3.3468-0.2789-7.6697 8.367-7.9486 9.0642-0.2789 0.69725-4.1138 9.5523-4.2532 11.226-0.13945 1.6734-0.76697 0.13945-0.76697 0.13945" />
          <path id="left-index-finger" class="inactive-finger" d="m73.42 66.448s-1.7431-3.8349 3.2771-15.2c5.0202-11.365 5.3688-11.365 5.2294-13.457-0.13945-2.0917-2.789-2.9284-3.9046-2.0917-1.1156 0.83669-4.3927 3.8349-7.3211 9.4128-2.9284 5.578-4.6716 10.25-5.9963 10.319" />
        </g>
      </g>
    </svg>

    <!-- Keyboard keys -->
    <div class="qwerty-keyboard__keys">
      <!-- Number row -->
      <div class="qwerty-keyboard__row qwerty-keyboard__row--number">
        <div
          v-for="(key, keyIndex) in numberRow"
          :key="key.qwerty"
          class="qwerty-keyboard__key"
          :class="[
            getFingerClass('number', keyIndex),
            { 'qwerty-keyboard__key--active': isActive(key.hebrew) }
          ]"
        >
          <span class="qwerty-keyboard__qwerty">{{ key.qwerty }}</span>
          <span class="qwerty-keyboard__hebrew">{{ key.hebrew }}</span>
        </div>
        <div class="qwerty-keyboard__key qwerty-keyboard__key--backspace finger-pinky-right">
          <span class="qwerty-keyboard__label">backspace</span>
        </div>
      </div>

      <!-- Top row (QWERTY) -->
      <div class="qwerty-keyboard__row qwerty-keyboard__row--top">
        <div class="qwerty-keyboard__key qwerty-keyboard__key--tab finger-pinky-left">
          <span class="qwerty-keyboard__label">tab</span>
        </div>
        <div
          v-for="(key, keyIndex) in topRow"
          :key="key.qwerty"
          class="qwerty-keyboard__key"
          :class="[
            getFingerClass('top', keyIndex),
            { 'qwerty-keyboard__key--active': isActive(key.hebrew) }
          ]"
        >
          <span class="qwerty-keyboard__qwerty">{{ key.qwerty }}</span>
          <span class="qwerty-keyboard__hebrew">{{ key.hebrew }}</span>
        </div>
      </div>

      <!-- Home row -->
      <div class="qwerty-keyboard__row qwerty-keyboard__row--home">
        <div class="qwerty-keyboard__key qwerty-keyboard__key--capslock finger-pinky-left">
          <span class="qwerty-keyboard__label">caps lock</span>
        </div>
        <div
          v-for="(key, keyIndex) in homeRow"
          :key="key.qwerty"
          class="qwerty-keyboard__key"
          :class="[
            getFingerClass('home', keyIndex),
            { 'qwerty-keyboard__key--active': isActive(key.hebrew) }
          ]"
        >
          <span class="qwerty-keyboard__qwerty">{{ key.qwerty }}</span>
          <span class="qwerty-keyboard__hebrew">{{ key.hebrew }}</span>
        </div>
        <div class="qwerty-keyboard__key qwerty-keyboard__key--enter finger-pinky-right">
          <span class="qwerty-keyboard__label">enter</span>
        </div>
      </div>

      <!-- Bottom row -->
      <div class="qwerty-keyboard__row qwerty-keyboard__row--bottom">
        <div class="qwerty-keyboard__key qwerty-keyboard__key--shift-left finger-pinky-left">
          <span class="qwerty-keyboard__label">shift</span>
        </div>
        <div
          v-for="(key, keyIndex) in bottomRow"
          :key="key.qwerty"
          class="qwerty-keyboard__key"
          :class="[
            getFingerClass('bottom', keyIndex),
            { 'qwerty-keyboard__key--active': isActive(key.hebrew) }
          ]"
        >
          <span class="qwerty-keyboard__qwerty">{{ key.qwerty }}</span>
          <span class="qwerty-keyboard__hebrew">{{ key.hebrew }}</span>
        </div>
        <div class="qwerty-keyboard__key qwerty-keyboard__key--shift-right finger-pinky-right">
          <span class="qwerty-keyboard__label">shift</span>
        </div>
      </div>

      <!-- Space row -->
      <div class="qwerty-keyboard__row qwerty-keyboard__row--space">
        <div class="qwerty-keyboard__key qwerty-keyboard__key--control finger-pinky-left">
          <span class="qwerty-keyboard__label">ctrl</span>
        </div>
        <div class="qwerty-keyboard__key qwerty-keyboard__key--alt finger-pinky-left">
          <span class="qwerty-keyboard__label">alt</span>
        </div>
        <div
          class="qwerty-keyboard__key qwerty-keyboard__key--spacebar"
          :class="{ 'qwerty-keyboard__key--active': isActive(' ') }"
        >
          <span class="qwerty-keyboard__label">space</span>
        </div>
        <div class="qwerty-keyboard__key qwerty-keyboard__key--alt finger-pinky-right">
          <span class="qwerty-keyboard__label">alt</span>
        </div>
        <div class="qwerty-keyboard__key qwerty-keyboard__key--control finger-pinky-right">
          <span class="qwerty-keyboard__label">ctrl</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.qwerty-keyboard {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  margin-top: 16px;
  padding-top: 120px;
  direction: ltr;

  &__hands {
    position: absolute;
    width: 680px;
    height: 240px;
    top: 230px;
    left: 50%;
    transform: translateX(-52%);
    pointer-events: none;
    z-index: 1;
  }

  &__keys {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 12px;
    background: #e8e8e8;
    border-radius: 8px;
    position: relative;
    z-index: 0;
  }

  &__row {
    display: flex;
    gap: 4px;
    justify-content: center;
  }

  &__key {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: 0 2px 0 #bbb;
    font-family: 'Noto Sans Hebrew', sans-serif;
    transition: all 0.15s;

    // Modifier keys
    &--backspace {
      width: 75px;
    }

    &--tab {
      width: 60px;
    }

    &--capslock {
      width: 70px;
    }

    &--enter {
      width: 85px;
    }

    &--shift-left {
      width: 90px;
    }

    &--shift-right {
      width: 110px;
    }

    &--control {
      width: 55px;
    }

    &--alt {
      width: 50px;
    }

    &--spacebar {
      width: 260px;
    }

    &--active {
      background: rgba(0, 199, 209, 0.3);
      border-color: #00c7d1;
      box-shadow: 0 2px 0 #00a5ad;
      transform: translateY(1px);
    }
  }

  &__qwerty {
    font-size: 0.7em;
    color: #888;
    font-family: monospace;
    font-weight: bold;
  }

  &__hebrew {
    font-size: 1em;
    color: #333;
    font-weight: 500;
  }

  &__label {
    font-size: 0.6em;
    color: #666;
    font-family: sans-serif;
    text-transform: lowercase;
  }

  // Finger color coding
  .finger-pinky-left {
    background: linear-gradient(135deg, #fff 60%, #ffebee 100%);
    &.qwerty-keyboard__key--active { background: rgba(0, 199, 209, 0.3); }
  }
  .finger-ring-left {
    background: linear-gradient(135deg, #fff 60%, #fff3e0 100%);
    &.qwerty-keyboard__key--active { background: rgba(0, 199, 209, 0.3); }
  }
  .finger-middle-left {
    background: linear-gradient(135deg, #fff 60%, #fffde7 100%);
    &.qwerty-keyboard__key--active { background: rgba(0, 199, 209, 0.3); }
  }
  .finger-index-left {
    background: linear-gradient(135deg, #fff 60%, #e8f5e9 100%);
    &.qwerty-keyboard__key--active { background: rgba(0, 199, 209, 0.3); }
  }
  .finger-index-right {
    background: linear-gradient(135deg, #fff 60%, #e3f2fd 100%);
    &.qwerty-keyboard__key--active { background: rgba(0, 199, 209, 0.3); }
  }
  .finger-middle-right {
    background: linear-gradient(135deg, #fff 60%, #ede7f6 100%);
    &.qwerty-keyboard__key--active { background: rgba(0, 199, 209, 0.3); }
  }
  .finger-ring-right {
    background: linear-gradient(135deg, #fff 60%, #fce4ec 100%);
    &.qwerty-keyboard__key--active { background: rgba(0, 199, 209, 0.3); }
  }
  .finger-pinky-right {
    background: linear-gradient(135deg, #fff 60%, #efebe9 100%);
    &.qwerty-keyboard__key--active { background: rgba(0, 199, 209, 0.3); }
  }
}

:deep(.inactive-finger) {
  stroke: transparent;
}

:deep(.current-finger) {
  stroke: rgba(0, 197, 209, 0.4);
  stroke-width: 1.5;
}
</style>
