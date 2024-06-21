<template>
    <div id="count">Showing {{ isFiltering? filteredGames.length + " of " : 'all ' }} {{games.length}} games</div>
    <div class="visual-bar">
        <span v-show="isFiltering" v-for="box in set" class="mark" :class="{ active: box }" :style="{backgroundColor: box? activeColor : '#101010'}"></span>
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
$mark-height: 4px;

#count {
    margin-top: 1rem;
    text-align: center;
    margin-bottom: 2px;

    :first-child,
    :last-child {
        border-radius: 50%;
    }
}

.visual-bar {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1px;
    height: $mark-height + 2px;
}

.mark {
    flex-grow: 1;
    height: $mark-height;
    background-color: #ffffff;
    box-sizing: content-box;
}

.active {
    height: $mark-height + 2px;
}
</style>
