<template>
        <Button v-if="editingGames" @click="removeGames(game)" icon="pi pi-trash" />

        <div class="flex-grow flex flex-col ml-2">
            <div class="flex">
                <span class="flex items-center justify-center w-10 relative">
                    <span class="absolute text-green-600 text-6xl">&#x2B22;</span>
                    <span class="text-lg font-bold z-10 font-bold " :class="{ 'active-sort': sort == 'rating' }">
                        {{ game.display.rating }}
                    </span>
                </span>
                <div class="ml-2">
                    <div class="line-clamp-1" :class="{ 'active-sort': sort == 'name' }">{{ game.name }}</div>
                    <div class="text-sm" :class="{ 'active-sort': sort == 'year' }"> {{ game.display.year }}</div>
                </div>
            </div>


            <div class="flex flex-grow *:w-1/2 *:flex *:flex-col text-lg">
                <div class="border-right">
                    <div class="cell border-bottom"  :class="sort == 'complexity' ? 'active-sort' : ''">
                        <font-awesome-icon class="" size="sm" :icon="['fas', 'brain']" />
                        <div>
                            <span>{{ game.display.complexity }}</span>
                            <span class="text-xs"> / 5</span>
                        </div>
                    </div>
                    <div class=" cell" :class="sort == 'playtime' ? 'active-sort' : ''">
                        <font-awesome-icon class="" size="sm" :icon="['fas', 'hourglass-half']" />
                        {{ game.display.playtime }}{{ isMobile ? 'm' : ' Minutes' }}
                    </div>
                </div>
                <div>
                    <div class="cell  border-bottom" :class="sort == 'players' ? 'active-sort' : ''">
                        <font-awesome-icon class="" size="sm" :icon="['fas', 'people-group']" />
                        {{ game.display.players }}{{ isMobile ? 'p' : ' Players' }}
                    </div>
                    <div class="cell" :class="sort == 'age' ? 'active-sort' : ''">
                        <font-awesome-icon class="" size="sm" :icon="['fas', 'person-cane']" />
                        {{ isMobile ? `${game.display.age}y+` : `Age ${game.display.age} and up` }}
                    </div>
                </div>
            </div>
        </div>
</template>

<script setup>
import { editingGames, getGameURL, sorting } from '~/composables/useGames';
import { isMobile } from '~/composables/useMedia'
const props = defineProps(['game', 'sort'])


</script>

<style lang="scss" scoped>
.border-right {
    border-right: 1px solid var(--p-primary-500);
}

.border-bottom {
    border-bottom: 1px solid var(--p-primary-500);
}


.cell {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 50%;
    padding: .75rem;
}

.shadow {
    text-shadow: 0 0 5px black;
}

.active-sort {
    color: gold;
    text-decoration: underline;
    font-weight: bold;
}
</style>