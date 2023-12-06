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
const props = defineProps(['values', '_label', 'min', 'max', 'step'])
const emit = defineEmits(['update:modelValue'])

const value = computed({
  get() {
    return [props.values[0].value, props.values[1].value]
  },
  set(value) {
    if(value[0] != props.values[0].value)
    emit('update:modelValue', value)
  }
})
</script>

<style scoped>
.slider-thing {
    margin: 0 1rem;
}
</style>