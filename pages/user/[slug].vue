<template>
  <div v-if="contentUnavailable" class="unavailable">
    {{ contentUnavailable.message }}
  </div>
  <div v-else>

    <div class="whose-games-container">
      <div class="other-person-header" v-if="!itMe">
        <img :src="userData.user.image" class="person-image" alt="avatar">
        <h1 style="display: inline;">{{ userData.user.name }}'s Library</h1>
      </div>
      <div v-else>
        <h1>Your Library</h1>
        <Button id="btn-edit-games" :class="{ 'btn-editing': editingGames }" icon="pi pi-pencil" @click="btnEditGames" />
        <Button icon="pi pi-plus" v-show="editingGames" @click="navigateTo('/add')" />
      </div>

    </div>

    <Checkbox v-model="itMe" :binary="true" />

    <IconField iconPosition="left">
      <InputIcon>
        <i class="pi pi-search" />
      </InputIcon>
      <InputText v-model="value1" placeholder="Search" />
    </IconField>


    <div v-if="gamesReady">
      <Button @click="filtering = !filtering">
        <font-awesome-icon :icon="['fas', 'filter']" style="color: #ffffff;" size="2x" />
      </Button>
      <div v-if="filtering" id="filterFlexContainer">
        <div id="filterResultList" style="display:none">
          <p v-for="game in filteredGames">{{ game.name }}</p>
        </div>
        <div id="filters">
          <h2>Showing {{ filteredGames.length }} of {{ games.length }} games</h2>
          <FilterSimpleUI v-if="simple" />
          <FilterAdvancedUI v-else />
        </div>
      </div>
      <GamesTable :display-games="filteredGames" />
    </div>
    <span v-else>Loading...</span>
    <span v-if="!hasGames">
      {{ userData.isSelf ? "You have no games in your library yet" :
        userData.user.name + " has no games in their library yet." }}
    </span>

  </div>
</template>

<script setup>
import { fetchGames, gamesReady, games, filteredGames } from '~/composables/useGames'

const route = useRoute()

const userData = (await useFetch('/api/user/' + route.params.slug)).data.value

const hasGames = computed(() => {
  return userData?.games.length > 0
})

if (!userData?.err_code && hasGames.value) {
  fetchGames(userData.games)
}

const itMe = ref(true)

const filtering = ref(true)
const simple = ref(false)
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

<style lang="scss" scoped>
.unavailable {
  margin: 1rem;
  padding: 1rem;
  border-radius: 1rem;
  background-color: rgb(216, 215, 214);
}



#filterFlexContainer {
  display: flex;
  flex-direction: row;
}


.whose-games-container {
  display: flex;
  justify-content: center;
  background-color: $w2p-pallette-4;
  padding: 1rem;
}

.other-person-header {
  display: flex;
  align-items: center;
}

.person-image {
  height: 4rem;
  width: 4rem;
  border-radius: 50%;
  margin-right: 1rem;
}

.btn-editing {
  background-color: #28a745;
  border-color: #28a745;
}

#btn-edit-games {
  margin-left: 1rem;
}
</style>