<template>
    <div class="text-center">Displaying {{ isFiltering? filteredGames.length + " of " : 'all ' }} {{games.length}} games</div>
    <div class="flex gap-[1px] h-4 mx-1 items-center">
        <span v-show="isFiltering" v-for="box in set" class="grow box-content h-[4px] max-w-[4px]" :style="{backgroundColor: box? activeColor : '#101010'}"></span>
    </div>
</template>

<script setup>

import { games, filteredGames } from '~/composables/useGames'

const isFiltering = computed(() => {return filteredGames.value.length < games.value.length})

const set = computed(() => {
    let numShown = filteredGames.value.length
    let startId = Math.round((games.value.length - 1) / 2) - Math.round((numShown - 1) / 2)
    return games.value.map((game, index) => {
        return index >= startId && index < startId + numShown
    })
})

const activeColor = computed(() => {
    // 0 is most filtered, 1 is least filtered
    let r = ((filteredGames.value.length-1) / games.value.length)
    let hue = 60 + (r * 60)
    let lightness = 50 + (r * 50)
    return `hsl(${hue}, 100%, ${lightness}%)`
})

</script>

<style lang="scss" scoped>
</style>
