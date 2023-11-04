<template>
    <div>
        <div class="form-floating">
            <input class="form-control" ref="search-box" v-model="username" id="inputUserSearch"
                v-on:keyup.enter="loadCollection" type="search" />
            <label for="inputUserSearch">Username</label>
        </div>
        <div v-show="numCollectionGames">
            Found {{ numCollectionGames }} games in this BGG collection, of which {{ unOwnedGames?.length }} are
            not yet in your library.
        </div>
        <button v-show="numCollectionGames" @click="addGames(unOwnedGames)">Add all to library</button>
        <ModalSearchResult v-for="game in displayGames" key="game.bgg_game_id" :game="game" />
    </div>
</template>

<script setup>
// import {addGames, games} from '~/composables/useGames'
import { games, addGames } from '~/composables/useGames'
import { getCollection } from '../../utils/boardgamegeek'
import {useToast} from 'primevue/usetoast'
const toast = useToast()

const username = ref('')
const collectionGames = ref([])

const displayGames = computed(() => {
    return collectionGames.value.map(game => {
        game.owns = games.value.some(x => x.bgg_game_id == game.bgg_game_id)
        return game
    })
})

const numCollectionGames = computed(() => { return displayGames.value.length })
const unOwnedGames = computed(() => {
    return displayGames.value.filter(x => !x.owns)
})

async function loadCollection() {
    if (username.value.length <= 0) {
        return
    }
    try {
        collectionGames.value = await getCollection(username.value)
    } catch (e) {
        toast.add({ severity: 'error', summary: 'Import Failed', detail: 'Is the username correct?', life: 3000 });
    }
}


</script>

<style scoped></style>