<template>
    <label for="slider">{{ _label }}</label>
    <div class="p-inputgroup flex-1 max-width" style="align-items: center; justify-content: center;"
        id="slider">
        <span class="p-inputgroup-addon">{{ value[0] }}</span>
        <Slider class="slider-thing" style="width: 6rem;" v-model="value" range :min="min" :max="max"
            :step="step" />
        <span class="p-inputgroup-addon">{{ value[1] }}</span>
    </div>
</template>

<script setup>
const props = defineProps(['values', '_label', 'prop', 'min', 'max', 'step'])
const emit = defineEmits(['setValue'])
let left = ref(props.values[0].value)
let right = ref(props.values[1].value)

const value = computed({
  get() {
    return [left.value, right.value]
  },
  set(newVal) {
    if(newVal[0] != props.values[0].value){
      left.value = newVal[0]
      emit('setValue', props.prop, newVal[0], 0)
      if(newVal[0] > newVal[1]){
        right.value = newVal[0]
        emit('setValue', props.prop, newVal[0], 1)
      }
    } else {
      right.value = newVal[1]
      emit('setValue', props.prop, newVal[1], 1)
      if(newVal[1] < newVal[0]){
        left.value = newVal[1]
        emit('setValue', props.prop, newVal[1], 0)
      }
    }
  }
})
</script >

<style scoped> 
.slider-thing {
    margin: 0 1rem;
}
</style>