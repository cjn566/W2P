<template>
    <div>
        <div class="form-floating">
            <input class="form-control" ref="search-box" v-model="username" id="inputUserSearch"
                v-on:keyup.enter="getCollection" type="search" />
            <label for="inputUserSearch">Username</label>
        </div>
        <div v-show="numCollectionGames">
            Found {{ numCollectionGames }} games in this BGG collection, {{ numOwned ? numOwned : 'none' }} of which are
            already in your library.
        </div>
        <ModalSearchResult v-for="game in displayGames" key="game.bgg_game_id" :game="game" />
    </div>
</template>

<script setup>
import bgg from '../../utils/boardgamegeek'

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
    collectionGames.value = await bgg.getCollection(username.value)
}

async function addAllUnowned() {
    const gameIDs = unOwnedGames.map(x=>x.bgg_game_id)
    const res = (await useFetch('/api/collection/add', 
    {
      method: 'post',
      body: gameIDs
    })).data.value
    if(res.err) {
      console.error(res.msg)
    } else {
      const newGame = props.game
      props.game.owns = true
      newGame.id = res.newID
      const allGames = useState('games')
      allGames.value.push(newGame)
      $toast.open('Game added.')
    }
}

</script>

<style scoped></style>