<template>


  <div class="whose-games-container other-person-header" v-if="!itMe">
    <img :src="user.image" class="person-image" alt="avatar">
    <h1 style="display: inline;">{{ user.name }}'s Games</h1>
  </div>

  <div v-else class="whose-games-container">
    <h1>Your Games</h1>
    <div >
      <Button icon="pi pi-plus" @click="navigateTo('./add')" />
    </div>
  </div>

  <Checkbox v-model="itMe" :binary="true" />




  <div v-show="status.gamesReady">

    <!--Filters-->
    <Fieldset :toggleable="true" :collapsed="false" id="filters-fieldset" :pt="{ legend: 'legend' }">
      <template #legend>
        <i class="pi pi-filter"></i>
      </template>

      <SelectButton v-model="filterStyle" :options="filterStyleOptions" :pt="{ root: 'btn-filter-style' }">
        <template #option="slotProps">
          <font-awesome-icon :icon="['fas', slotProps.option.icon]" />
        </template>
      </SelectButton>


      <InputGroup>
        <InputGroupAddon>
          <i class="pi pi-search" />
        </InputGroupAddon>
        <InputText v-model="searchTerm" placeholder="Find a game" />
        <Button icon="pi pi-times" :disabled="searchTerm.length == 0" @click="searchTerm = ''" />
      </InputGroup>

      <FilterVisualBar />
      <FilterSimpleUI v-show="filterStyle.value == 'simple'" />
      <FilterAdvancedUI v-show="filterStyle.value == 'advanced'" />

    </Fieldset>


    <Button @click="showTable = true">table</Button>
    <Button @click="showTable = false">cards</Button>

    <GamesTable v-if="showTable" />
    <GamesCards v-else />
  </div>
  <span v-show="!status.gamesReady">Loading...</span>
  <span v-if="!hasGames">
    {{ user.isSelf ? "You have no games in your library yet" :
    user.name + " has no games in their library yet." }}
  </span>

</template>

<script setup>
import { user, status, searchTerm } from '~/composables/useGames'

definePageMeta({
  path: ''
})

const editingGames = ref(false)

const filterStyleOptions = ref([
  { label: 'Simple', value: 'simple', icon: 'magnifying-glass' },
  { label: 'Advanced', value: 'advanced', icon: 'microscope' }
])
const filterStyle = ref(filterStyleOptions.value[0])

const showTable = ref(false)

const hasGames = computed(() => {
  return user.value.games.length > 0
})


const itMe = ref(true)

</script>

<style lang="scss" scoped>
#filterFlexContainer {
  display: flex;
  flex-direction: row;
}

.btn-filter-style {
  position: absolute;
  right: 8%;
  top: 265px;
}

.whose-games-container {
  display: flex;
  justify-content: center;
  align-items: center;
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


#filters-fieldset {
  margin-top: 1rem;
}
</style>