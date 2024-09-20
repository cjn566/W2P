<template>
    <div>
        <GamesDoubleSlider :inValues="filters.complexity" _label="Complexity:" prop="complexity"
            :min="limits.complexity[0]" :minLabel="limits.complexity[0]" :max="limits.complexity[1]"
            :maxLabel="limits.complexity[1]" :step="0.1" :suffix="' / 5'" />


        <GamesDoubleSlider :inValues="filters.players" _label="Player count:" prop="players" :min="limits.players[0]"
            :minLabel="limits.players[0]" :max="maxPlayers.val" :maxLabel="maxPlayers.label" :step="1"
            :suffix="' players'" />


        <GamesDoubleSlider :inValues="filters.playtime" _label="Duration:" prop="playtime" :min="limits.playtime[0]"
            :minLabel="limits.playtime[0]" :max="limits.playtime[1]" :maxLabel="limits.playtime[1]" :step="10"
            :suffix="' minutes'" />


        <GamesDoubleSlider :inValues="filters.age" _label="Maturity:" prop="age" :min="limits.age[0]"
            :minLabel="limits.age[0]" :max="limits.age[1]" :maxLabel="limits.age[1]" :step="1" :suffix="'y.o.'" />


        <GamesDoubleSlider :inValues="filters.year" _label="Publish Date:" prop="year" :min="minYear.val"
            :max="limits.year[1]" :maxLabel="limits.year[1]" :minLabel="minYear.label" :step="1" />


    </div>
</template>

<script setup>
import { filters, limits, tags } from '~/composables/useGames'
import Divider from 'primevue/divider'

const minYear = computed(() => {
    let foo = limits.year[1] - 25
    if (foo > limits.year[0]) {
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

const maxPlayers = computed(() => {
    if (limits.players[1] >= 12) {
        return {
            val: 12,
            label: '12+'
        }
    } else {
        return {
            val: limits.players[1],
            label: limits.players[1]
        }
    }
})

// TODO: Same but for maturity, if a game's maturity is ridiculous, we'll just cap it at 21


</script>


<style lang="scss" scoped></style>