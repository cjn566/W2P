<template>
  <pre>{{ userData }}</pre>
  <div v-if="contentUnavailable" class="unavailable">
    {{ contentUnavailable.message }}
  </div>
  <div v-else>
    <UserBio />
    <GamesTable v-if="hasGames" />
    <span v-else>This user has no games yet.</span>
  </div>
</template>

<script setup>
import bgg from '../../utils/boardgamegeek'

definePageMeta({ auth: false })

const userData = (await useFetch('/api/user/' + useRoute().params.slug)).data.value
let gameData = []
if (!userData.err_code && userData.games.length) {
  const gameIds = userData.games.map((game) => game.bgg_game_id)
  gameData = await bgg.getGameInfo(gameIds)
}
const games = useState('games', () => gameData)

const hasGames = computed(() => {
  return true //games.length > 0
})

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