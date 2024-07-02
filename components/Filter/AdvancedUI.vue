<template>
    <div>
        <GamesDoubleSlider :inValues="filters.complexity" _label="How Complex?" prop="complexity"
            :min="limits.complexity[0]" :max="limits.complexity[1]" :step="0.1"/>

        <Divider />

        <GamesDoubleSlider :inValues="filters.players" _label="How many players?" prop="players"
            :min="1" :max="9" maxLabel="9+" :step="1"/>

        <Divider />

        <GamesDoubleSlider :inValues="filters.playtime" _label="Play for how long?" prop="playtime"
            :min="limits.playtime[0]" :max="limits.playtime[1]" :step="10"/>

        <Divider />

        <GamesDoubleSlider :inValues="filters.age" _label="What minimum age?" prop="age"
            :min="limits.age[0]" :max="limits.age[1]" :step="1"/>

        <Divider />

        <GamesDoubleSlider :inValues="filters.year" _label="Older games or newer?" prop="year"
            :min="limits.year[1] - 25" :max="limits.year[1]" :minLabel="'<' + (limits.year[1] - 25)" :step="1"/>

        <Divider />

        <FilterTagList />
    </div>
</template>

<script setup>
import { filters, limits } from '~/composables/useGames'
import Divider from 'primevue/divider'


</script>


<style lang="scss" scoped>

</style>