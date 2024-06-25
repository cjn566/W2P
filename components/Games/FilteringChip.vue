


<template>
    <Chip v-if="index[0].index || index[1].index" :label="label" removable class="chip" @click="commitSliderValues(field, null)" />
</template>

<script setup>

import { commitSliderValues } from '~/composables/useGames'
const props = defineProps(['index', 'field'])

const label = computed(() => {
    return (props.index[0].index? props.index[0].value + ' < ' : '') + props.field + (props.index[1].index? ' < ' + props.index[1].value : '')
})

    
</script>

<style lang="scss" scoped>
</style>