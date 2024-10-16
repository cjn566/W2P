<template>
    <div :class="{ 'border-green-300 border-4': g.selected }"
    class="bg-slate-900 text-slate-300 rounded-md p-2 cursor-pointer hover:ring-1 m-2 relative box-content">

        <div v-if="editingGames"
            class="absolute top-2 right-2 p-2 z-1000 w-6 h-6 bg-white rounded-full flex justify-center items-center"
            :class="{ 'bg-green-200': g.selected }">
            <i v-if="g.selected" class="pi pi-check-circle text-green-700 text-xl" />
        </div>

        <div class="flex h-40">
            <div class="w-40 ">
                <img class="m-auto h-full object-contain object-center shadow-slate-700" :src="g.thumbnail"
                    alt="Game Thumbnail" />
            </div>
            <GamesStats :game="g" :sort="sorting.active" class="w-3/5" />
        </div>

        <div v-for="expansion in g.ownedExpansions" class="flex h-24 ml-1 mt-2">
            <div class="flex items-center text-3xl text-surface-300">+</div>
            <div class="w-20 mx-2">
                <img class="m-auto h-full object-contain object-center shadow-slate-700" :src="expansion.thumbnail"
                    alt="Game Thumbnail" />
            </div>
            <div class="flex flex-col justify-center">
                <GamesTitleCluster :game="expansion" />
                <GamesStat class="pt-1" v-if="expansion.display.players !== g.display.players" stat="players"
                    :val="expansion.display.players" :verbose="false" :stacked="false" />
                <GamesStat class="pt-1" v-if="expansion.age !== g.age" stat="age" :val="expansion.age" :verbose="false"
                    :stacked="false" />
                <GamesStat class="pt-1" v-if="expansion.display.playtime !== g.display.playtime && expansion.pl"
                    stat="playtime" :val="expansion.playtime" :verbose="false" :stacked="false" />
                <GamesStat class="pt-1" v-if="expansion.complexity !== g.complexity && expansion.complexity > 0"
                    stat="complexity" :val="expansion.complexity" :verbose="false" :stacked="false" />
            </div>
        </div>

    </div>
</template>

<script setup>

import { sorting } from '~/composables/useGames'
const props = defineProps(['g'])

</script>


<style lang="scss" scoped>


.warn-border {
    border: 2px solid rgb(255, 255, 153);
}

</style>