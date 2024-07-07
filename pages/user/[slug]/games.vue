<template>
  <div v-show="status.gamesReady">


    <div class="whose-games-container other-person-header" v-if="!user.isSelf">
      <img :src="user.image" class="person-image" alt="avatar">
      <h1 style="display: inline;">{{ user.name }}'s Games</h1>
    </div>

    <div v-else class="whose-games-container">
      <h1>Your Games</h1>
      <div id="header-buttons">
        <div id="btn-edit">
          <Button size="small" icon="pi pi-pencil" @click="editingGames = !editingGames" />
        </div>
        <div id="btn-add-games" :style="editingGames ? '' : 'visibility: hidden'">
          <Button size="small" icon="pi pi-plus" @click="goToAdd()" />
        </div>
      </div>
    </div>

    <!--Filters-->
    <Fieldset :toggleable="true" :collapsed="false" id="filters-fieldset"
      :pt="{ root: 'filter-container', legend: 'legend' }">
      <template #legend>
        Search and Filter
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
      <GamesActiveFilters />
      <Divider />
      <FilterSimpleUI v-if="filterStyle.value == 'simple'" />
      <FilterAdvancedUI v-else="filterStyle.value == 'advanced'" />

    </Fieldset>

    <div id="games-container">
      <span v-if="!filteredGames.length">There are no games that fit the search criteria.</span>
      <div v-else>

        <SelectButton v-model="showTable" :options="listStyleOptions" :pt="{ root: 'btn-list-style' }">
          <template #option="slotProps">
            <font-awesome-icon :icon="['fas', slotProps.option.icon]" />
          </template>
        </SelectButton>

        <GamesTable v-if="showTable.value" />
        <GamesCards v-else />
      </div>
    </div>

    <div class="bottom-spacer"></div>
  </div>
  <span v-show="!status.gamesReady">Loading...</span>
  <span v-if="!hasGames">
    {{ user.isSelf ? "You have no games in your library yet" :
    user.name + " has no games in their library yet." }}
  </span>
</template>

<script setup>
import { user, status, searchTerm, editingGames, clearAllSliders } from '~/composables/useGames'

definePageMeta({
  path: ''
})

const route = useRoute()
function goToAdd() {
  navigateTo(route.path.endsWith('/') ? `${route.path}add` : `${route.path}/add`)
}

const filterStyleOptions = ref([
  { label: 'Simple', value: 'simple', icon: 'magnifying-glass', tooltip: 'Search and filter games' },
  { label: 'Advanced', value: 'advanced', icon: 'microscope' }
])
const filterStyle = ref(filterStyleOptions.value[1])

const listStyleOptions = ref([
  { label: 'Cards', value: false, icon: 'bars-progress' },
  { label: 'Table', value: true, icon: 'bars' }
])

const showTable = ref(false)

const hasGames = computed(() => {
  return user.value.games.length > 0
})

const someSelected = computed(() => {
  return user.value.games.some(g => g.selected)
})

watch(filterStyle, () => {
  clearAllSliders()
})

const itMe = ref(true)

</script>

<style lang="scss" scoped>
#filterFlexContainer {
  display: flex;
  flex-direction: row;
}

#games-container {
  position: relative;
  margin-top: 2rem;
  padding-top: 1rem;
  background-color: $w2p-pallette-4;
  border-radius: 0.6rem;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.btn-list-style {
  position: absolute;
  right: 8%;
  top: -20px;
}

.btn-filter-style {
  position: absolute;
  right: 8%;
  top: -45px;
}

.filter-container {
  position: relative;
}



.whose-games-container {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: $w2p-pallette-4;
  width: 80%;
  margin: 0.5rem auto;
  border-radius: 0.5rem;
  position: relative;
}

#header-buttons {
  position: absolute;
  right: 1rem;
}

h1 {
  margin: 5px;
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

#btn-edit {
  margin-right: 1rem;
  display: inline-block;
}

#btn-add-games {
  display: inline-block;
}


#filters-fieldset {
  margin-top: 1rem;
}

.bottom-spacer {
  height: 4rem;
}
</style>