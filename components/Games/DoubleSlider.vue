<template>
  <div v-if="isMobile" class="prop-label prop-label-mobile">{{ _label }}</div>
  <div id="main-container">
    <span v-if="!isMobile" class="prop-label">{{ _label }}</span>
    <span class="value min-val">{{ displayValues[0] }}</span>
    <Slider class="slider-thing" v-model="value" range :min="min" :max="max" :step="step" :pt="{
      startHandler: inValues.values[0] !== null ? 'start-handle-active' : 'start-handle',
      endHandler: inValues.values[1] !== null ? 'end-handle-active' : 'end-handle',
      range: inValues.active ? 'active-range' : ''
      }" />
    <span class="value max-val">{{ displayValues[1] }}{{ suffix }}</span>
  </div>
</template>

<script setup>
import { setSlider } from '~/composables/useGames'
import { isMobile } from '~/composables/useMedia'
const props = defineProps(['inValues', '_label', 'prop', 'min', 'max', 'minLabel', 'maxLabel', 'step', 'suffix'])

// Want to immediately see the result of sliding the knob around, but defer to what prop says it should be.
const displayValues = ref([(props.minLabel || props.min), (props.maxLabel || props.max)])
const debounceLeft = debounce((nv) => setSlider(props.prop, 0, nv), 200)
const debounceRight = debounce((nv) => setSlider(props.prop, 1, nv), 200)
function setDisplayValues(nvs) {
  displayValues.value =
    [
      nvs[0] == null || (nvs[0] <= props.min) ? (props.minLabel || props.min) : nvs[0],
      nvs[1] == null || (nvs[1] >= props.max) ? (props.maxLabel || props.max) : nvs[1]
    ]
}
watch(() => props.inValues, (nvs) => {
  setDisplayValues(nvs.values)
  if (nvs.values[0] === null || nvs.values[0] <= props.min) {
    setvalues.value[0] = props.min
  } else {
    setvalues.value[0] = nvs.values[0]
  }
  if (nvs.values[1] === null || nvs.values[1] >= props.max) {
    setvalues.value[1] = props.max
  } else {
    setvalues.value[1] = nvs.values[1]
  }
})
const setvalues = ref([props.min, props.max])
const value = computed({
  get() {
    return setvalues.value
  },
  set(newVals) {
    if (newVals[0] != setvalues.value[0]) {
      // left side is changing
      if (newVals[0] > newVals[1]) {
        // collision moving right
        newVals[1] = newVals[0]
        debounceRight(newVals[0])
      }

      if (newVals[0] <= props.min) {
        // left side is at min
        newVals[0] = props.min
        debounceLeft(null)
      } else {
        debounceLeft(newVals[0])
      }
    }
    else if (newVals[1] != setvalues.value[1]) {
      // right side is changing
      if (newVals[1] < newVals[0]) {
        // collision moving right
        newVals[0] = newVals[1]
        debounceLeft(newVals[1])
      }

      if (newVals[1] >= props.max) {
        // right side is at max
        newVals[1] = props.max
        debounceRight(null)
      } else {
        debounceRight(newVals[1])
      }
    }

    setvalues.value = newVals
    setDisplayValues(newVals)
  }
})
</script>

<style lang="scss">

$color-active-filter: gold;

#main-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 1.5rem 0;
}

.prop-label {
  width: 8rem;
  display: flex;
  justify-content: end;
  padding-right: 1rem;
}

.prop-label-mobile {
  margin-top: 5rem;
  width: 100%;
  justify-content: center;
}

.value {
  width: 7rem;
  display: flex;
}

.min-val {
  justify-content: end;
  padding-right: 3rem;
}

.max-val {
  padding-left: 3rem;
  width: 10rem;
}

.slider-thing {
  flex-grow: 1;
}

.p-slider-range {
  background-color: gray;
}

.active-range {
  background-color: $color-active-filter;
}

.p-slider-handle {
  width: 2rem;
  height: 2rem;
  margin-top: -1rem;
}

.start-handle {
  margin-left: -2rem;
}

.start-handle-active {
  margin-left: -2rem;
  border-bottom-right-radius: 0;
  border-top-right-radius: 0;
  border-color: $color-active-filter;
}

.end-handle {
  margin-left: 0rem;
}

.end-handle-active {
  border-bottom-left-radius: 0;
  border-top-left-radius: 0;
  margin-left: 0rem;
  border-color: $color-active-filter;
}

.doop {
  margin: 0 1rem;
}
</style>