<template>
  <div class="py-8 px-1 touch-none ">
    <div class="flex justify-center mb-2">{{ _label }}</div>
    <div class="flex items-center justify-center">
      <span class="flex justify-end end-label text-right mr-2">{{ minLabel }}</span>
      <div ref="baseBar" class="grow relative h-1 bg-slate-400">
        <div ref="activeBar" class="absolute h-1 active-bar z-1000" :style="activeBarStyle" />
        <span ref="minHandle" class="handle min-handle" :class="minHandleClass" :style="minHandleStyle"
          @touchstart.stop="handleStart(true)" @touchend.stop="handleEnd(true)" @touchmove.stop="handleMoveMin()">
          <span v-if="isMerged" class="merged-value z-50">{{ minDisplay }}</span>
          <span v-else> {{ minDisplay }} </span>
          <span v-show="minGrabbed" class="popup">{{ minDisplay }}</span>
        </span>
        <span ref="maxHandle" class="handle max-handle" :class="maxHandleClass" :style="maxHandleStyle"
          @touchstart.stop="handleStart(false)" @touchend.stop="handleEnd(false)" @touchmove.stop="handleMoveMax()">
          <span v-show="!isMerged"> {{ maxDisplay }}</span>
          <span v-show="maxGrabbed" class="popup">{{ maxDisplay }}</span>
        </span>
      </div>
      <span class="end-label ml-2 relative z-0">{{ maxLabel }}<span class="text-xs absolute top-full left-0 pt-1">{{
      suffix }}</span></span>
    </div>
  </div>
</template>

<script setup>
import { setSlider } from '~/composables/useGames'
import { isMobile } from '~/composables/useMedia'
const props = defineProps(['inValues', '_label', 'prop', 'min', 'max', 'minLabel', 'maxLabel', 'step', 'suffix'])

// Comoponents Refs
const minHandle = ref(null)
const maxHandle = ref(null)
const baseBar = ref(null)

const isMerged = computed(() => curIncs.value[0] === curIncs.value[1] && curIncs.value[0] !== 0 && curIncs.value[1] !== maxInc)

// Stylings
// Min Handle
const minGrabbed = ref(false)
const minHandleClass = computed(() => ({
  'grabbed': minGrabbed.value,
  'active': curIncs.value[0] !== 0
}))

const minHandleStyle = computed(() => ({
  right: (100 - increments.value[curIncs.value[0]]?.percent) + '%'
}))

const minDisplay = computed(() => (increments.value[curIncs.value[0]]?.value))

// Max Handle
const maxGrabbed = ref(false)
const maxHandleClass = computed(() => ({
  'grabbed': maxGrabbed.value,
  'active': curIncs.value[1] !== maxInc
}))

const maxHandleStyle = computed(() => ({
  left: increments.value[curIncs.value[1]]?.percent + '%',
}))

const maxDisplay = computed(() => (increments.value[curIncs.value[1]]?.value))

const activeBarStyle = computed(() => ({
  width: (increments.value[curIncs.value[1]]?.percent - increments.value[curIncs.value[0]]?.percent) + '%',
  left: increments.value[curIncs.value[0]]?.percent + '%',
  display: (curIncs.value[0] === 0 && curIncs.value[1] === maxInc) ? 'none' : 'block'
}))


// Track handle positions and values
const increments = ref([])
const curIncs = ref([0, 0])

var lastTouchX = null
function handleStart(isMin) {
  lastTouchX = event.changedTouches[0].clientX
  if (isMin) {
    minGrabbed.value = true
  } else {
    maxGrabbed.value = true
  }
  // pop up for cur value
}

function handleMoveMin() {
  let numMoves = Math.trunc((event.changedTouches[0].clientX - lastTouchX) / widthPerIncrement)
  if (Math.abs(numMoves) >= 1) {
    lastTouchX += numMoves * widthPerIncrement
    if (numMoves > 0) {
      // move right
      if (curIncs.value[0] < maxInc) {
        curIncs.value[0] = Math.min(curIncs.value[0] + numMoves, maxInc)
        dbMin(increments.value[curIncs.value[0]].value)
        if (curIncs.value[0] > curIncs.value[1]) {
          curIncs.value[1] = curIncs.value[0]
          if (curIncs.value[1] === maxInc) {
            dbMax(null)
          } else {
            dbMax(increments.value[curIncs.value[1]].value)
          }
        }
      }
    } else {
      // move left
      if (curIncs.value[0] > 0) {
        curIncs.value[0] = Math.max(curIncs.value[0] + numMoves, 0)
        if (curIncs.value[0] === 0) {
          dbMin(null)
        } else {
          dbMin(increments.value[curIncs.value[0]].value)
        }
      }
    }
  }
}

function handleMoveMax() {
  let numMoves = Math.trunc((event.changedTouches[0].clientX - lastTouchX) / widthPerIncrement)
  if (Math.abs(numMoves) >= 1) {
    lastTouchX += numMoves * widthPerIncrement
    if (numMoves > 0) {
      // move right
      if (curIncs.value[1] < maxInc) {
        curIncs.value[1] = Math.min(curIncs.value[1] + numMoves, maxInc)
        if (curIncs.value[1] === maxInc) {
          dbMax(null)
        } else {
          dbMax(increments.value[curIncs.value[1]].value)
        }
      }
    } else {
      // move left
      if (curIncs.value[1] > 0) {
        curIncs.value[1] = Math.max(curIncs.value[1] + numMoves, 0)
        dbMax(increments.value[curIncs.value[1]].value)
        if (curIncs.value[1] < curIncs.value[0]) {
          curIncs.value[0] = curIncs.value[1]
          if (curIncs.value[0] === 0) {
            dbMin(null)
          } else {
            dbMin(increments.value[curIncs.value[0]].value)
          }
        }
      }
    }
  }
}


function handleEnd(isMin) {
  // remove pop up
  if (isMin) {
    minGrabbed.value = false
  } else {
    maxGrabbed.value = false
  }
}

var maxInc = null
var widthPerIncrement = null
onMounted(() => {
  let numIncrements = (props.max - props.min) / props.step
  widthPerIncrement = baseBar.value.clientWidth / numIncrements

  for (let i = 0; i <= numIncrements; i++) {
    increments.value.push({
      value: parseFloat((props.min + (i * props.step)).toFixed(3)),
      percent: (i / numIncrements) * 100
    })
  }
  let incRem = numIncrements % 1
  if (incRem !== 0) {
    increments.value.push({
      value: props.max,
      percent: 100,
    })
  }
  maxInc = increments.value.length - 1
  curIncs.value[1] = maxInc

  // Set initial values
  if (props.inValues.values[0] !== null) {
    curIncs.value[0] = increments.value.findIndex((inc) => inc.value == props.inValues.values[0])
  }
  if (props.inValues.values[1] !== null) {
    curIncs.value[1] = increments.value.findIndex((inc) => inc.value == props.inValues.values[1])
  }
})

const dbMin = debounce((nv) => setSlider(props.prop, 0, nv), 200)
const dbMax = debounce((nv) => setSlider(props.prop, 1, nv), 200)

watch(() => props.inValues.values[0], (nv) => {
  if (nv === null || nv <= props.min) {
    curIncs.value[0] = 0
  } else {
    curIncs.value[0] = increments.value.findIndex((inc) => inc.value == nv)
    if (curIncs.value[0] === -1) {
      console.error('Min value not found in increments')
    }
  }
})
watch(() => props.inValues.values[1], (nv) => {
  if (nv === null || nv >= props.max) {
    curIncs.value[1] = maxInc
  } else {
    curIncs.value[1] = increments.value.findIndex((inc) => inc.value == nv)
    if (curIncs.value[1] === -1) {
      console.error('Max value not found in increments')
    }
  }
})
</script>

<style lang="scss">
$handle-width: 50px;
$handle-height: 20px;
$active-bg: var(--p-surface-400);
$active-bar: gold;
$active-border: var(--p-primary-800);

.handle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: $handle-width;
  height: $handle-height;
  box-sizing: content-box;
  z-index: 10;
  top: calc((-1 * $handle-height) / 2);
  position: absolute;
  background-color: transparent;
  color: transparent;
  border: 3px double var(--p-surface-300);
  transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
  cursor: grab;
}

.end-label {
  flex-basis: $handle-width;
}


.merged-value {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  height: $handle-height;
  width: calc($handle-width * 2);
  border-radius: 10px;
  background-color: $active-bg;
  pointer-events: none;
  right: calc(-1 * $handle-width);
  z-index: 1000;
}

.active {
  background-color: $active-bg;
  border: 3px double $active-border;
  color: white;
}

.min-handle {
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;  
  z-index: 50;
}

.min-handle.active {
  border-right: 3px double $active-bar;
}

.max-handle {
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  z-index: 10;
}

.max-handle.active {
  border-left: 3px double $active-bar;
}

.active-bar {
  background-color: $active-bar;
}

.popup {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  width: 35px;
  height: 35px;
  z-index: 50;
  background-color: $active-bg;
  top: -60px;
  color: white;
  border-radius: 50%;
  box-shadow: 0 0 5px black;

}
</style>


<!-- 
   -->