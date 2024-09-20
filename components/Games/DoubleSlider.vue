<template>
  <div class="py-8 touch-none ">
    <div class="flex justify-center">{{ _label }}</div>
    <div class="flex items-center justify-center">
      <span class="basis-14 text-right mr-2">{{ minLabel }}</span>
      <div ref="baseBar" class="grow relative h-2 bg-slate-400">
        <span ref="minHandle" class="handle min-handle" :class="minHandleClass" :style="minHandleStyle"
          @touchstart.stop="handleStart(true)" @touchend.stop="handleEnd(true)" @touchmove.stop="handleMove(true)">
          <span v-show="curIncs[0] > 0"><span v-show="!isMerged"> {{ minDisplay }} </span></span>
          <span v-show="minGrabbed" class="popup">{{ minDisplay }}</span>
          <span v-show="isMerged" class="merged-value">{{ minDisplay }}</span>
        </span>
        <span ref="maxHandle" class="handle max-handle" :class="maxHandleClass" :style="maxHandleStyle"
          @touchstart.stop="handleStart(false)" @touchend.stop="handleEnd(false)" @touchmove.stop="handleMove(false)">
          <span v-show="curIncs[1] < maxInc"> <span v-show="!isMerged"> {{ maxDisplay }} </span></span>
          <span v-show="maxGrabbed" class="popup">{{ maxDisplay }}</span>
        </span>
      </div>
      <span class="basis-14 ml-2">{{ maxLabel }}</span>
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

const isMerged = computed(() => curIncs.value[0] === curIncs.value[1])

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

const minDisplay = computed(() => increments.value[curIncs.value[0]]?.value)

// Max Handle
const maxGrabbed = ref(false)
const maxHandleClass = computed(() => ({
  'grabbed': maxGrabbed.value,
  'active': curIncs.value[1] !== maxInc
}))

const maxHandleStyle = computed(() => ({
  left: increments.value[curIncs.value[1]]?.percent + '%',
  'background-color': curIncs.value[1] === maxInc ? 'transparent' : ''
}))

const maxDisplay = computed(() => increments.value[curIncs.value[1]]?.value)


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

function handleMove(isMin) {
  let side = isMin ? 0 : 1
  let numMoves = Math.trunc((event.changedTouches[0].clientX - lastTouchX) / widthPerIncrement)
  if (Math.abs(numMoves) >= 1) {
    lastTouchX += numMoves * widthPerIncrement
    if (numMoves > 0) {
      // move right
      if (curIncs.value[side] < maxInc) {
        curIncs.value[side] = Math.min(curIncs.value[side] + numMoves, maxInc)
        if (!isMin) {
          if (curIncs.value[1] === maxInc) {
            dbMax(null)
          } else {
            dbMax(increments.value[curIncs.value[1]].value)
          }
        } else {
          dbMin(increments.value[curIncs.value[0]].value)
          if (curIncs.value[0] > curIncs.value[1]) {
            curIncs.value[1] = curIncs.value[0]
            dbMax(increments.value[curIncs.value[1]].value)
          }
        }
      }
    } else {
      // move left
      if (curIncs.value[side] > 0) {
        curIncs.value[side] = Math.max(curIncs.value[side] + numMoves, 0)
        if (isMin) {
          if (curIncs.value[0] === 0) {
            dbMin(null)
          } else {
            dbMin(increments.value[curIncs.value[0]].value)
          }
        } else {
          dbMax(increments.value[curIncs.value[1]].value)
          if (curIncs.value[1] < curIncs.value[0]) {
            curIncs.value[0] = curIncs.value[1]
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
})


// Want to immediately see the result of sliding the knob around, but defer to what prop says it should be.

const dbMin = debounce((nv) => setSlider(props.prop, 0, nv), 200)
const dbMax = debounce((nv) => setSlider(props.prop, 1, nv), 200)

// function setDisplayValues(nvs) {
//   displayValues.value =
//     [
//       nvs[0] == null || (nvs[0] <= props.min) ? (props.minLabel || props.min) : nvs[0],
//       nvs[1] == null || (nvs[1] >= props.max) ? (props.maxLabel || props.max) : nvs[1]
//     ]
// }

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
$handle-width: 60px;
$handle-height: 24px;
$handle-active-color: var(--p-primary-600);

.handle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: $handle-width;
  height: $handle-height;
  top: calc((-1 * $handle-height + 0.35rem) / 2);
  position: absolute;
  background-color: transparent;
  border: 2px solid black;
  transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
  cursor: grab;
}

.active {
  background-color: $handle-active-color;
  border-color: var(--p-primary-900);
  color: white;
}

.merged-value {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  width: calc($handle-width * 4/3);
  z-index: 50;
  background-color: $handle-active-color;
  pointer-events: none;
  top: 2px;
  right: -43px;
}

.min-handle {
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
}

.max-handle {
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
}


.grabbed {}

.popup {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  width: 35px;
  height: 35px;
  z-index: 50;
  background-color: var(--p-primary-700);
  top: -60px;
  color: white;
  border-radius: 50%;
  box-shadow: 0 0 5px black;

}
</style>


<!-- 
   -->