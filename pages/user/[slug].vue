<template>
  <div v-if="contentUnavailable" class="unavailable">
    {{ contentUnavailable.message }}
  </div>
  <div v-else>
    <UserBio :user="userData.user"/>
    <button @click="btnEditGames">Edit games</button>
    <button v-if="editingGames" type="button" class="btn btn-success" data-bs-toggle="modal"
      data-bs-target="#gameSearchModal">
      +
    </button>
    <GamesContainer v-if="gamesReady"  />
    <span v-else>Loading...</span>
    <span v-if="!hasGames">{{userData.isSelf ? "You have no games in your library yet" : userData.user.name + " has no games in their library yet."}}</span>
    <ModalAddGames />
  </div>
</template>

<script setup>
import {fetchGames, gamesReady} from '~/composables/useGames'



// definePageMeta({ auth: false })


const route = useRoute()

let userData = (await useFetch('/api/user/' + route.params.slug)).data.value

const hasGames = computed(() => {
  return userData?.games.length > 0
})

if (!userData?.err_code && hasGames.value) {
  fetchGames(userData.games)
}


const editingGames = useState('editingGames', () => true)



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