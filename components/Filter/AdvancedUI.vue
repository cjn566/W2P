<template>
    <div>
        <GamesDoubleSlider :inValues="filters.complexity" _label="How Complex?" prop="complexity"
            :min="limits.complexity[0]" :max="limits.complexity[1]" :step="0.1"/>

        <Divider />

        <GamesDoubleSlider :inValues="filters.players" _label="How many players?" prop="players"
            :min="1" :max="12" maxLabel="12+" :step="1"/>

        <Divider />

        <GamesDoubleSlider :inValues="filters.playtime" _label="Play for how long?" prop="playtime"
            :min="limits.playtime[0]" :max="limits.playtime[1]" :step="10"/>

        <Divider />

        <GamesDoubleSlider :inValues="filters.age" _label="What minimum age?" prop="age"
            :min="limits.age[0]" :max="limits.age[1]" :step="1"/>

        <Divider />

        <GamesDoubleSlider :inValues="filters.year" _label="Older games or newer?" prop="year"
            :min="minYear.val" :max="limits.year[1]" :minLabel="minYear.label" :step="1"/>

        <Divider />

        <FilterTagList :tagList="tags"/>
    </div>
</template>

<script setup>
import { filters, limits, tags } from '~/composables/useGames'
import Divider from 'primevue/divider'

const minYear = computed(() => {
    let foo = limits.year[1] - 25
    if(foo > limits.year[0]){
        return {
            val: foo,
            label: '<' + foo
        }
    } else {
        return {
            val: limits.year[0],
            label: limits.year[0]
        }
    }
})

</script>


<style lang="scss" scoped>

</style>