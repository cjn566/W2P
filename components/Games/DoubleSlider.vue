<template>
  <label for="slider">{{ _label }}</label>
  <div class="p-inputgroup flex-1 max-width" style="align-items: center; justify-content: center;" id="slider">
    <span class="p-inputgroup-addon">{{ value[0] }}</span>
    <Slider class="slider-thing" style="width: 6rem;" v-model="value" range :min="min" :max="max" :step="step" />
    <span class="p-inputgroup-addon">{{ value[1] }}</span>
  </div>
</template>

<script setup>
const props = defineProps(['inValues', '_label', 'prop', 'min', 'max', 'step'])
const emit = defineEmits(['setValue'])

// Want to immediately see the result of sliding the knob around, but defer to what prop says it should be.

watch(props.inValues, (nv, ov)=>{
  displayValues.value = [nv[0].value, nv[1].value]
})

const displayValues = ref([props.min, props.max])

const value = computed({
  get() {
    return displayValues.value
  },
  set(newVals) {
    if(newVals[0] != displayValues.value[0]){
      // left side is changing
      if (newVals[0] > newVals[1]) {
        newVal[1] = newVals[0]
      }
    }
    else if(newVals[1] != displayValues.value[1]){
      // right side is changing
      if (newVals[1] < newVals[0]) {
        newVal[0] = newVals[1]
      }
    }
    displayValues.value = newVals    
    emit('setValue', props.prop, displayValues.value)
  }
})
</script >

<style scoped> .slider-thing {
   margin: 0 1rem;
 }
</style>