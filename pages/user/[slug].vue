<template>
  <div v-if="contentUnavailable" class="unavailable">
    {{ contentUnavailable.message }}
  </div>
  <div v-else>


    <div v-show="!adding">

      <div class="whose-games-container">
        <div class="other-person-header" v-if="!itMe">
          <img :src="user.image" class="person-image" alt="avatar">
          <h1 style="display: inline;">{{ user.name }}'s Library</h1>
        </div>
        <div v-else>
          <h1>Your Library</h1>
          <Button id="btn-edit-games" :class="{ 'btn-editing': editingGames }" icon="pi pi-pencil"
            @click="clickedEditBtn" />
          <Button icon="pi pi-plus" v-show="editingGames" @click="adding = true" />
        </div>
      </div>

      <Checkbox v-model="itMe" :binary="true" />


      <IconField iconPosition="left">
        <InputIcon>
          <i class="pi pi-search" />
        </InputIcon>
        <InputText v-model="value1" placeholder="Search" />
      </IconField>


      <div v-if="status.gamesReady">

        <!--Filters-->
        <Fieldset :toggleable="true" :collapsed="false" id="filters-fieldset">
          <template #legend>
            <i class="pi pi-filter"></i>
          </template>

          <SelectButton v-model="filterStyle" :options="filterStyleOptions">
            <template #option="slotProps">
              <font-awesome-icon :icon="['fas', slotProps.option.icon]"/>
              {{ slotProps.option.label }}
            </template>
          </SelectButton>

          <FilterVisualBar />
          <FilterSimpleUI v-show="filterStyle.value == 'simple'" />
          <FilterAdvancedUI v-show="filterStyle.value == 'advanced'" />

        </Fieldset>

        <GamesTable />
      </div>
      <span v-else>Loading...</span>
      <span v-if="!hasGames">
        {{ user.isSelf ? "You have no games in your library yet" :
          user.name + " has no games in their library yet." }}
      </span>
    </div>

    <div v-if="adding">
      <div id="add-games-header">
        <Button icon="pi pi-arrow-left" @click="adding = false" />
        <span class="title">Add games to your library</span>
      </div>
      <GamesAdd />
    </div>

  </div>
</template>

<script setup>
import { user, setUser, status } from '~/composables/useGames'
import { useToast } from 'primevue/usetoast'
// import QrcodeVue from 'qrcode.vue'

// const value = ref('http://localhost:3000/user/colten-nye')
//   const level = ref('Q')
//   const renderAs = ref('svg')

const toast = useToast()

const route = useRoute()

const hasGames = computed(() => {
  return user.value.games.length > 0
})

const itMe = ref(true)
const editingGames = useState('editingGames', () => true)
const adding = ref(false)
const filtering = ref(true)

const filterStyleOptions = ref([
  { label: 'Simple', value: 'simple', icon: 'magnifying-glass' },
  { label: 'Advanced', value: 'advanced', icon: 'microscope' }
])
const filterStyle = ref(filterStyleOptions.value[0])

const clickedEditBtn = () => {
  editingGames.value = !editingGames.value
  adding.value = false
}

const contentUnavailable = computed(() => {
  if (user?.err_code) {
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

await setUser(route.params.slug)

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

#add-games-header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 0;
  border-bottom: 1px solid $w2p-pallette-3;
  .title {
    margin-left: 1rem;
  }
}
</style>