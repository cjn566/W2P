<template>
  <div v-if="contentUnavailable" class="unavailable">
    {{ contentUnavailable.message }}
  </div>
  <div v-else>
    <!-- <UserBio :user="userData.user"/>
    <p v-if="userData.isSelf">This is your profile</p>
    <p v-else>This is not your profile</p> -->
    <pre>{{ tags }}</pre>
    <button @click="btnEditGames">Edit games</button>
    <button v-if="editingGames" type="button" class="btn btn-success" data-bs-toggle="modal"
      data-bs-target="#gameSearchModal">
      +
    </button>
    <GamesTestTable v-if="hasGames" />
    <span v-else>This user has no games yet.</span>
    <ModalAddGames />
  </div>
</template>

<script setup>
import bgg from '../../utils/boardgamegeek'
const { $toast } = useNuxtApp()

definePageMeta({ auth: false })

const userData = (await useFetch('/api/user/' + useRoute().params.slug)).data.value

// Load Game Library
let gameData = []
if (!userData.err_code && userData.games.length) {
  const gameIds = userData.games.map((game) => game.bgg_game_id)
  gameData = await bgg.getGameInfo(gameIds)
  gameData.map((game) => {
    let g = userData.games.find((x) => x.bgg_game_id == game.bgg_game_id)
    game.userGameId = g.id
    return game
  })
}
const games = useState('games', () => gameData)

function buildTags() {
  const tags = {}
  for (const key of bgg.validTagTypes) {
    tags[key] = {}
  }

  games.value.map((game) => {
    game.tags.map((t) => {
      if (tags[t.type].hasOwnProperty(t.id)) {
        tags[t.type][t.id].count++
      } else {
        tags[t.type][t.id] = {
          value: t.value,
          count: 1
        }
      }
    })
  })

  for(const type in tags){
    const arr = []
    for(const id in tags[type]){
      arr.push({
        id,
        value: tags[type][id].value,
        count: tags[type][id].count
      })
    }
    tags[type] = arr
    tags[type].sort((a,b)=>{
      return b.count - a.count
    })
  }

  return tags
}

function connectExpansions() {
  const exps = games.value.filter(g => g.type==="boardgameexpansion")
  exps.forEach((expansion) => {
    let basegameTags = expansion.tags.filter(t => t.type==="boardgameexpansion" && t.inbound)
    basegameTags.forEach((tag)=>{
      const baseGame = games.value.find(game => game.bgg_game_id===tag.id)
      if(baseGame){
        baseGame.expansions.push(expansion.bgg_game_id)
        expansion.isExpansionFor.push(baseGame.bgg_game_id)
      }
    })
  })
}
connectExpansions()

const expGames = games.value.filter((g) => {
  return g.expansions.length || g.isExpansionFor.length
})

const tags = ref(buildTags())

const editingGames = useState('editingGames', () => true)

const hasGames = computed(() => {
  return games.value.length > 0
})

function btnEditGames(event) {
  editingGames.value = editingGames.value ? false : true
}

const contentUnavailable = computed(() => {
  if (userData?.err_code) {
    switch (userData.err_code) {
      case "no_user":
        return {
          message: "That user doesn't exist. Please check the spelling and try again"
        }
      case "not_friends":
        return {
          message: "That user is only sharing their info with friends. Try sending them a friend request."
        }
      case "private_not_self":
        return {
          message: "That user's info is not available at this time."
        }
      case "friends_only_logged_out":
        return {
          message: "That user is only sharing their info with friends. If you are their friend, please log in first."
        }
      case "private_logged_out":
        return {
          message: "That user's info is not available. If you are this user, please log in to see your content."
        }

      default:
        break;
    }

  }
  return false
})

</script>

<style>
.unavailable {
  margin: 1rem;
  padding: 1rem;
  border-radius: 1rem;
  background-color: rgb(216, 215, 214);
}
</style>