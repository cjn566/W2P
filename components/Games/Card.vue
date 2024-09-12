<template>
    <div class="bg-surface-600 rounded-md flex p-2 h-40 my-1 pointer" @click="emit('show-details')">
        <Button v-if="editingGames" @click="removeGames(game)" icon="pi pi-trash" />
        <div class="img-container">
            <img class="m-auto h-full object-contain object-center" :src="game.thumbnail" alt="Game Thumbnail" />
        </div>

        <div class="flex-grow flex flex-col ml-2">
            <div class="flex">
                <span class="flex items-center justify-center w-10">
                    <span class="absolute text-green-800 text-6xl">&#x2B22;</span>
                    <span class="text-lg font-bold z-10 shadow" :class="{ active: sort == 'rating' }">
                        {{ game.display.rating }}
                    </span>
                </span>

                <a class="ml-2" :href="getGameURL(game.bgg_game_id)" target="_blank" rel="noopener noreferrer">
                    <div class="shadow line-clamp-1" :class="{ active: sort == 'name' }">{{ game.name }}</div>
                    <div class="shadow text-sm" :class="{ active: sort == 'year' }"> {{ game.display.year }}</div>
                </a>
            </div>


            <div class="flex flex-grow *:w-1/2 *:flex *:flex-col text-lg">
                <div class="border-right">
                    <div class="cell  border-bottom" :class="sort == 'players' ? 'active' : ''">
                        {{ game.display.players }}{{ isMobile ? 'p' : ' Players' }}
                    </div>
                    <div class="cell">
                        <div>
                            <span :class="sort == 'complexity' ? 'active' : ''"> {{ game.display.complexity }}</span>
                            <span class="text-xs"> / 5</span>
                        </div>
                    </div>
                </div>
                <div>
                    <div class=" cell border-bottom" :class="sort == 'playtime' ? 'active' : ''">
                        {{ game.display.playtime }}{{ isMobile ? 'm' : ' Minutes' }}
                    </div>
                    <div class="cell" :class="sort == 'age' ? 'active' : ''">
                        {{ isMobile ? `${game.display.age}y+` : `Age ${game.display.age} and up` }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { editingGames, getGameURL, sorting } from '~/composables/useGames';
import { isMobile } from '~/composables/useMedia'
const props = defineProps(['game', 'sort'])
const emit = defineEmits(['show-details'])


</script>

<style lang="scss" scoped>
.border-right {
    border-right: 1px solid blue;
}

.border-bottom {
    border-bottom: 1px solid blue;
}

.img-container {
    flex: 0 0 40%;
}

.cell {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50%;
}

.shadow {
    text-shadow: 0 0 5px black;
}

.active {
    color: #d4ff00;
}
</style>