<template>
  <label for="slider">{{ _label }}</label>

  <InputGroup class="p-inputgroup flex-1 max-width" style="align-items: center; justify-content: center;" id="slider">

    <InputGroupAddon>{{ displayValues[0] }}</InputGroupAddon>

    <Slider class="slider-thing" v-model="value" range :min="min" :max="max" :step="step" :pt="{
    startHandler: inValues.values[0] !== null ? 'start-handle-active' : 'start-handle',
    endHandler: inValues.values[1] !== null ? 'end-handle-active' : 'end-handle',
    range: inValues.active ? 'active-range' : ''
  }" />

    <InputGroupAddon>{{ displayValues[1] }}</InputGroupAddon>
  </InputGroup>
</template>

<script setup>
import { commitSliderValues } from '~/composables/useGames'
const props = defineProps(['inValues', '_label', 'prop', 'min', 'max', 'minLabel', 'maxLabel', 'step'])

// Want to immediately see the result of sliding the knob around, but defer to what prop says it should be.


const displayValues = ref([(props.minLabel || props.min), (props.maxLabel || props.max)])

const debounceSliderUpdate = debounce((nv) => commitSliderValues(props.prop, nv), 100)

function setDisplayValues(nvs) {
  displayValues.value = [nvs[0] ?? (props.minLabel || props.min), nvs[1] ?? (props.maxLabel || props.max)]
}

watch(() => props.inValues, (nvs) => {
  setDisplayValues(nvs.values)
  if(nvs.values[0] === null || nvs.values[0] <= props.min){
    setvalues.value[0] = props.min
  } else {
    setvalues.value[0] = nvs.values[0]
  }
  if(nvs.values[1] === null || nvs.values[1] >= props.max){
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
    let filterVals = newVals
    if (newVals[0] != setvalues.value[0]) {
      // left side is changing
      if (newVals[0] > newVals[1]) {
        // collision moving right
        newVals[1] = newVals[0]
      }

      if(newVals[0] <= props.min) {
        // left side is at min
        newVals[0] = props.min
        filterVals[0] = null
      }
    }
    else if (newVals[1] != setvalues.value[1]) {
      // right side is changing
      if (newVals[1] < newVals[0]) {
        // collision moving right
        newVals[0] = newVals[1]
      }

      if(newVals[1] >= props.max) {
        // right side is at max
        newVals[1] = props.max
        filterVals[1] = null
      }
    } else return

    debounceSliderUpdate(filterVals)
    setvalues.value = newVals
    setDisplayValues(newVals)
  }
})
</script>

<style lang="scss">
.slider-thing {
  width: 100%;
  margin: 0 1rem;
}

.p-slider-range {
  background-color: gray;
}

.active-range {
  background-color: darkmagenta;
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
  border-color: darkmagenta;
}

.end-handle {
  margin-left: 0rem;
}
.end-handle-active {
  border-bottom-left-radius: 0;
  border-top-left-radius: 0;
  margin-left: 0rem;
  border-color: darkmagenta;
}
</style>