<template>
  <div v-show="status.gamesReady">


    <div class="whose-games-container other-person-header" v-if="!itMe">
      <img :src="user.image" class="person-image" alt="avatar">
      <h1 style="display: inline;">{{ user.name }}'s Games</h1>
    </div>

    <div v-else class="whose-games-container">
      <h1>Your Games</h1>
      <div id="header-buttons">
        <div id="btn-edit">
          <Button size="small" icon="pi pi-pencil" @click="editingGames = !editingGames" />
        </div>
        <div id="btn-add-games" :style="editingGames? '':'visibility: hidden'">
          <Button size="small" icon="pi pi-plus" @click="navigateTo('./add')" />
        </div>
      </div>
    </div>

    <Checkbox v-model="itMe" :binary="true" />

    <!--Filters-->
    <Fieldset :toggleable="true" :collapsed="false" id="filters-fieldset" :pt="{ root: 'filter-container', legend: 'legend' }">
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
import { user, status, searchTerm, editingGames } from '~/composables/useGames'

definePageMeta({
  path: ''
})


const filterStyleOptions = ref([
  { label: 'Simple', value: 'simple', icon: 'magnifying-glass' },
  { label: 'Advanced', value: 'advanced', icon: 'microscope' }
])
const filterStyle = ref(filterStyleOptions.value[0])

const showTable = ref(false)

const hasGames = computed(() => {
  return user.value.games.length > 0
})

const someSelected = computed(() => {
  return user.value.games.some(g => g.selected)
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
  top: -45px;
}

.filter-container {
  position: relative
}

.whose-games-container {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #28a745;
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
</style>