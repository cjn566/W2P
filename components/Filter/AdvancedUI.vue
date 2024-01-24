<template>
    <GamesDoubleSlider :inValues="indices.complexity.current" _label="How Complex?" prop="complexity"
        :min="limits.complexity[0]" :max="limits.complexity[1]" :step="0.1" @set-value="debounceSliderUpdate" />

    <Divider />

    <GamesDoubleSlider :inValues="indices.players.current" _label="How many players?" prop="players"
        :min="limits.players[0]" :max="limits.players[1]" :step="1" @set-value="debounceSliderUpdate" />

    <Divider />

    <GamesDoubleSlider :inValues="indices.playtime.current" _label="Play for how long?" prop="playtime"
        :min="limits.playtime[0]" :max="limits.playtime[1]" :step="10" @set-value="debounceSliderUpdate" />

    <Divider />

    <GamesDoubleSlider :inValues="indices.age.current" _label="What minimum maturity level?" prop="age" :min="limits.age[0]"
        :max="limits.age[1]" :step="1" @set-value="debounceSliderUpdate" />

    <Divider />

    <GamesDoubleSlider :inValues="indices.year.current" _label="Older games or newer?" prop="year" :min="limits.year[0]"
        :max="limits.year[1]" :step="1" @set-value="debounceSliderUpdate" />

    <Divider />

    <FilterTagList />
</template>

<script setup>
import { debounce } from '~/utils/debounce'
import { commitSliderValues, indices, limits } from '~/composables/useGames'
import Divider from 'primevue/divider'
const debounceSliderUpdate = debounce((prop, values) => commitSliderValues(prop, values), 100)

</script>

<style scoped></style>