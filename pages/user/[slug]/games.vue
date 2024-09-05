<template>
  <div v-show="status.gamesReady">

    {{ isMobile }}
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
    <!-- <Fieldset :toggleable="true" :collapsed="false" id="filters-fieldset"
      :pt="{ root: 'filter-container', legend: 'legend' }">
      <template #legend>
        Search and Filter
      </template>

<SelectButton v-model="filterStyle" :options="filterStyleOptions" optionLabel="label" dataKey="value">
  <template #option="slotProps">
          <i :class="slotProps.option.icon"></i>
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

</Fieldset> -->



    <div class="relative flex flex-col items-center">
      <span v-if="!filteredGames.length">There are no games that fit the search criteria.</span>
      <div v-else>



        <div class="sticky-btns flex *:w-1/2 *:rounded-none *:border-blue-900 *:text-3xl"
          :class="{ hide: hideSticky }">
          <Button class="border-r-2" @click="showSort = true">
            <div>
              <div>Sort </div>
              <div class="text-sm">({{ sorting.active }} {{ sorting.descending? 'desc' : 'asc' }})</div>
            </div>
          </Button>
          <Button @click="showFilter = true">Filter</Button>
        </div>

        <Drawer v-model:visible="showSort" header="Sort By" class="bg-green-900 ">
          <GamesSortBtnSidePanel v-for="property in sortProperties" :sort="property.value" :label="property.name"
            :icon="property.icon" @scroll="closeCallback" />
        </Drawer>

        <Drawer v-model:visible="showFilter" header="Filter" position="right">
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore
            magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
            commodo
            consequat.</p>
        </Drawer>

        <!-- <SelectButton v-model="showTable" :options="listStyleOptions" optionLabel="label" dataKey="value"
          :pt="{ root: 'btn-list-style' }">
          <template #option="slotProps">
            <i :class="slotProps.option.icon"></i>
          </template>
        </SelectButton> -->

        <ScrollTop />

        <GamesTable v-if="showTable" />
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
import { user, status, searchTerm, editingGames, clearAllSliders, sorting } from '~/composables/useGames'
import { isMobile } from '~/composables/useMedia'
import { PrimeIcons } from '@primevue/core/api'
definePageMeta({
  path: ''
})

const showSort = ref(false)
const showFilter = ref(false)

const sortProperties = [
  { value: 'name', name: 'Name', icon: 'arrow-down-a-z' },
  { value: 'rating', name: 'Rating', icon: 'star' },
  { value: 'complexity', name: 'Complexity', icon: 'brain' },
  { value: 'players', name: 'Players', icon: 'people-group' },
  { value: 'playtime', name: 'Play time', icon: 'hourglass-half' },
  { value: 'age', name: 'Age', icon: 'person-cane' },
  { value: 'year', name: 'Year', icon: 'calendar' }
]

const route = useRoute()
function goToAdd() {
  navigateTo(route.path.endsWith('/') ? `${route.path}add` : `${route.path}/add`)
}

const filterStyleOptions = ref([
  { label: 'Quick Search', value: 'simple', icon: PrimeIcons.SEARCH },
  { label: 'Advanced Filter', value: 'advanced', icon: PrimeIcons.FILTER }
])
const filterStyle = ref(filterStyleOptions.value[0])

const listStyleOptions = ref([
  { label: 'Cards', value: false, icon: PrimeIcons.TH_LARGE },
  { label: 'Table', value: true, icon: PrimeIcons.ALIGN_JUSTIFY }
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

// STICKY SCROLL
const hideDistance = 50, showDistance = 50
let lastScrollTop, lastScrollBottom, lastScrollY
const hideSticky = ref(false)
const handleScroll = () => {
  const st = window.scrollY || document.documentElement.scrollTop
  if (st - lastScrollY > 0) {
    // Scrolling Down
    lastScrollBottom = st
    if (st - lastScrollTop > hideDistance) {
      hideSticky.value = true
    }
  } else {
    // Scrolling Up
    lastScrollTop = st
    if (lastScrollBottom - st > showDistance) {
      hideSticky.value = false
    }
  }
  lastScrollY = st <= 0 ? 0 : st
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})

</script>

<style lang="scss" scoped>
.sticky-btns {
  position: sticky;
  top: 0;
  height: 4rem;
  z-index: 50;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

.hide {
  top: -4.1rem;
}



#filterFlexContainer {
  display: flex;
  flex-direction: row;
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