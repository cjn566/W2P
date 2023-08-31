<template>
    <div class="modal fade" id="gameSearchModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <ul class="nav nav-tabs nav-justified">
                        <li class="nav-item">
                            <a class="nav-link" :class="{ active: tab == 'single' }" @click="tab = 'single'" href="#">Add
                                Games</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" :class="{ active: tab == 'import' }" @click="tab = 'import'" href="#">Import
                                Collection</a>
                        </li>
                    </ul>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">

                    <div v-if="tab == 'single'">

                        <div class="form-floating">
                            <input class="form-control" ref="search-box" v-on:input="debounce(gameSearch, 500)"
                                v-model="queryText" id="inputGameSearch" v-on:keyup.enter="gameSearch" type="search" />
                            <label for="inputGameSearch">Game</label>
                        </div>

                        <div class="accordion" id="accordionOptions">
                            <div class="accordion-item">
                                <h2 class="accordion-header">
                                    <button class="accordion-button" type="button" data-bs-toggle="collapse"
                                        data-bs-target="#moreOptions" aria-expanded="true">
                                        More Options
                                    </button>
                                </h2>
                                <div id="moreOptions" class="accordion-collapse collapse"
                                    data-bs-parent="#accordionOptions">
                                    <div class="accordion-body">
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" v-model="exact" id="cbExact">
                                            <label class="form-check-label" for="cbExact">
                                                Show only exact match
                                            </label>
                                        </div>

                                        <div class="form-check form-check-inline">
                                            <input class="form-check-input" type="radio" id="radioBasegames"
                                                value="basegames" v-model="baseVsExpansion" checked>
                                            <label class="form-check-label" for="radioBasegames">Boardgames</label>
                                        </div>
                                        <div class="form-check form-check-inline">
                                            <input class="form-check-input" type="radio" id="radioExpansions"
                                                value="expansions" v-model="baseVsExpansion">
                                            <label class="form-check-label" for="radioExpansions">Expansions</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <ModalSearchResult v-for="game in displayGames" key="game.bgg_game_id" :game="game" />

                    </div>
                    <div v-if="tab == 'import'">
                        Lets import some shit
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { debounce } from "debounce"
import bgg from '../../utils/boardgamegeek'

const results = ref([])
const exact = ref(false)
const baseVsExpansion = ref('basegames')
const queryText = ref('')
const ownedGames = useState('games')
const tab = ref('single')

const displayGames = computed(() => {
    return results.value.map(game => {
        game.owns = ownedGames.value.some(x => x.bgg_game_id == game.bgg_game_id)
        return game
    })
})


async function gameSearch() {
    // return if not at least 2chars in the search
    if (queryText.value.length < 2) {
        return
    }
    results.value = await bgg.gameSearch(queryText.value.trim(), exact.value)
}




</script>

<style scoped></style>