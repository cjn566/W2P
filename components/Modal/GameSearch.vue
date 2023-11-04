<template>
    <div>
        <div class="form-floating">
            <input class="form-control" ref="search-box" v-on:input="debounce(searchGames, 500)" v-model="queryText"
                id="inputGameSearch" v-on:keyup.enter="searchGames" type="search" />
            <label for="inputGameSearch">Game</label>
        </div>

        <div class="accordion" id="accordionOptions">
            <div class="accordion-item">
                <h2 class="accordion-header">
                    <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#moreOptions"
                        aria-expanded="true">
                        More Options
                    </button>
                </h2>
                <div id="moreOptions" class="accordion-collapse collapse" data-bs-parent="#accordionOptions">
                    <div class="accordion-body">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" v-model="exact" id="cbExact">
                            <label class="form-check-label" for="cbExact">
                                Show only exact match
                            </label>
                        </div>

                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" id="radioBoardgames" value="boardgame"
                                v-model="boardgameVsExpansion" checked>
                            <label class="form-check-label" for="radioBoardgames">Boardgames</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" id="radioExpansions" value="boardgameexpansion"
                                v-model="boardgameVsExpansion">
                            <label class="form-check-label" for="radioExpansions">Expansions</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <ModalSearchResult v-for="game in displayGames" key="game.bgg_game_id" :game="game" />
    </div>
</template>

<script setup>


import { games } from '~/composables/useGames'
import { debounce } from "debounce"
import { gameSearch } from '../../utils/boardgamegeek'

const results = ref([])
const exact = ref(false)
const boardgameVsExpansion = ref('boardgame')
const queryText = ref('')

const displayGames = computed(() => {
    return results.value.filter(game => game.type == boardgameVsExpansion.value)
})


async function searchGames() {
    // return if not at least 2chars in the search
    if (queryText.value.length < 2) {
        return
    }
    const res = await gameSearch(queryText.value.trim(), exact.value)
    results.value = res.map(game => {
        game.owns = games.value.some(x => x.bgg_game_id == game.bgg_game_id)
        return game
    })
}




</script>

<style scoped></style>