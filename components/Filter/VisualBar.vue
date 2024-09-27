<template>
    <div class="text-center">Displaying {{ true ? filteredGames.length + " of " : 'all ' }} {{ games.length }} games
    </div>

    <div ref="graph" class="">
        <div  v-if="useGap" class="boxes mt-8 flex h-4 gap-px mx-1 items-center">
            <span v-for="box in set" class="grow box-content h-[4px] transition-all" :style="boxStyle(box)"></span>
        </div>

        <div v-else class="h-10 p-2 rounded-sm flex items-center">
            <div class="flex justify-center items-center w-full h-4 bg-slate-300 rounded">
                <div class="h-3 rounded transition-all border-surface-500 border-2 box-content" :style="center" />
            </div>
        </div>        

    </div>
</template>

<script setup>

import { games, filteredGames } from '~/composables/useGames'

const center = computed(() => {
    let width = (((filteredGames.value.length) / games.value.length)) * 100
    return {
        width: width + '%',
        backgroundColor: 'gold',
        opacity: 1 - ((filteredGames.value.length - 1) / games.value.length)/1.5
    }
})

const set = computed(() => {
    let numShown = filteredGames.value.length
    let startId = Math.round((games.value.length - 1) / 2) - Math.round((numShown - 1) / 2)
    return games.value.map((game, index) => {
        return index >= startId && index < startId + numShown
    })
})

const boxStyle = (active) => {
    return {
        backgroundColor: active ? activeColor.value : '#101010',
        height: active ? '12px' : '4px',
    }
}

const activeColor = computed(() => {
    // 0 is most filtered, 1 is least filtered
    let r = ((filteredGames.value.length - 1) / games.value.length)
    let hue = 60 + (r * 60)
    let lightness = 50 + (r * 50)
    return `hsl(${hue}, 100%, ${lightness}%)`
})

const graph = ref(null)
const useGap = computed(() => {
    return (graph.value?.clientWidth / games.value.length) > 4
})

</script>

<style lang="scss" scoped>
</style>
