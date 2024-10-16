<template>
    <!-- <Button v-if="editingGames" @click="removeGames(game)" icon="pi pi-trash" /> -->

    <div class="flex flex-col ml-4">

        <GamesTitleCluster :game="game" />


        <div v-if="isMobile" class="flex flex-grow *:w-1/2 *:flex *:flex-col text-[1.125em]">
            <div class="border-right *:h-1/2">
                <GamesStat class="sm-cell border-bottom" stat="players" :val="game.display.players" :verbose="false"
                    :stacked="false" />
                <GamesStat class="sm-cell" stat="age" :val="game.display.age" :verbose="false" :stacked="false" />
            </div>
            <div class="*:h-1/2">
                <GamesStat class="sm-cell border-bottom" stat="playtime" :val="game.display.playtime" :verbose="false"
                    :stacked="false" />
                <GamesStat class="sm-cell" stat="complexity" :val="game.display.complexity" :verbose="false"
                    :stacked="false" />
            </div>
        </div>

        <div v-else class="flex flex-grow text-lg *:w-1/4 py-2">
            <GamesStat class="lg-cell border-right" stat="players" :val="game.display.players" :verbose="true"
                :stacked="true" />
            <GamesStat class="lg-cell border-right" stat="age" :val="game.display.age" :verbose="true"
                :stacked="true" />
            <GamesStat class="lg-cell border-right" stat="playtime" :val="game.display.playtime" :verbose="true"
                :stacked="true" />
            <GamesStat class="lg-cell" stat="complexity" :val="game.display.complexity" :verbose="true"
                :stacked="true" />
        </div>
    </div>
</template>

<script setup>
import { isMobile } from '~/composables/useMedia'
const props = defineProps(['game', 'sort'])


</script>

<style lang="scss" scoped>
.border-right {
    border-right: 1px solid var(--p-surface-500);
}

.border-bottom {
    border-bottom: 1px solid var(--p-surface-500);
}

.sm-cell {
    width: 100%;
    justify-content: space-between;
    padding: 1rem;
    font-size: small;
}

.lg-cell {
    flex-direction: column;
    justify-content: space-around;
    padding: 1rem;
}

</style>