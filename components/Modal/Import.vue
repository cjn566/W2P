<template>
    <div>
        <div class="form-floating">
            <input class="form-control" ref="search-box" v-model="username" id="inputUserSearch"
                v-on:keyup.enter="getCollection" type="search" />
            <label for="inputUserSearch">Username</label>
        </div>
        <div v-show="numCollectionGames">
            Found {{ numCollectionGames }} games in this BGG collection, of which {{ unOwnedGames?.length }} are
            not yet in your library.
        </div>
        <button v-show="numCollectionGames" @click="addAllUnowned">Add all to library</button>
        <ModalSearchResult v-for="game in displayGames" key="game.bgg_game_id" :game="game" />
    </div>
</template>

<script setup>
import bgg from '../../utils/boardgamegeek'
import {useToast} from 'primevue/usetoast'
const toast = useToast()

const username = ref('')
const collectionGames = ref([])
const ownedGames = useState('games')

const displayGames = computed(() => {
    return collectionGames.value.map(game => {
        game.owns = ownedGames.value.some(x => x.bgg_game_id == game.bgg_game_id)
        return game
    })
})

const numCollectionGames = computed(() => { return displayGames.value.length })
const unOwnedGames = computed(() => {
    return displayGames.value.filter(x => !x.owns)
})

async function getCollection() {
    if (username.value.length <= 0) {
        return
    }
    try {
        collectionGames.value = await bgg.getCollection(username.value)
    } catch (e) {
        toast.add({ severity: 'error', summary: 'Import Failed', detail: 'Is the username correct?', life: 3000 });
    }
}

async function addAllUnowned() {
    const gameIDs = unOwnedGames.value.map(x => x.bgg_game_id)
    const allGames = useState('games')
    const res = (await useFetch('/api/collection/add',
        {
            method: 'post',
            body: gameIDs
        })).data.value
    res.forEach((r)=> {
        if (r.err && r. msg == "duplicate") {
            toast.add({ severity: 'error', summary: 'Cannot add that game', detail: 'That game was already in your library', life: 3000 })
        } else {
            let g = unOwnedGames.value.find(x => x.bgg_game_id == r.bgg_game_id)
            g.owns = true
            g.id = r.newID
            allGames.value.unshift(g)
            toast.add({ severity: 'success', summary: `${g.name} was added to your library.`, life: 3000 })
        }
    })
}

</script>

<style scoped></style>