<template>


  <div v-if="status.userReady">
    <div v-if="contentUnavailable" class="unavailable">
      {{ contentUnavailable.message }}
    </div>
    <div v-else>

      <div v-if="status.userReady">
        <!-- Whose games are we seeing? -->
        <div class="bg-surface-700 rounded-tr-xl  rounded-tl-xl  py-8">
          <div class="flex ml-4">
            <img :src="user.image" class="h-16 w-16 rounded-full mr-4" alt="avatar">
            <div>
              <div class="text-3xl">{{ user.name }}</div>
              <Select v-model="collectionChoice" :options="collectionOptions" optionLabel="collection_name"
                optionValue="id" dataKey="id" checkmark class="block">
                <template #option="slopProps">
                  <i v-if="slopProps.option.isDefault" class="pi pi-star text-yellow-500 mr-2" />
                  {{ slopProps.option.collection_name }}
                </template>
              </Select>
              <Button v-model="editingGames" v-if="user.isSelf" icon="pi pi-cog" label="Manage" class="ml-2"
                @click="toggleEditGames" />
            </div>
          </div>

          <div v-if="editingGames" class="pt-1 flex justify-center bg-surface-600 ">
            <Button class="m-1 text-lg" icon="pi pi-plus" label="Add Games" @click="goToAdd()" />
            <div class="flex flex-col">
              <Button v-if="currentCollection !== user.default_collection_id" class="m-1" icon="pi pi-star"
                severity="secondary" label="Make Default" size="small" @click="makeDefaultCollection" />
              <Button class="m-1" icon="pi pi-pencil" severity="secondary" label="Rename" size="small"
                @click="showCollectionNameDialog(false)" />
              <Button class="m-1" icon="pi pi-trash" severity="secondary" size="small" label="Delete"
                @click="confirmDelete" />
            </div>
          </div>
        </div>




        <div v-if="status.gamesReady">
          <div v-if="!hasGames" class="flex justify-center my-8">
            There are no games in this collection yet.
          </div>
          <div v-else>

            <!-- Sticky Stuff - Sort, Search, Filter -->
            <div ref="scrollTarget" />
            <div class="sticky-btns flex flex-col" :class="{ hide: hideSticky }">
              <!-- Search Bar -->
              <div class="flex">
                <IconField class="flex grow">
                  <InputIcon class="pi pi-search" />
                  <InputText class="grow rounded-none" v-model="searchTerm" placeholder="Find game by name" />
                </IconField>
                <Button class="rounded-none bg-primary-600 btn-clear-txt" icon="pi pi-times"
                  :disabled="searchTerm.length == 0" @click="searchTerm = ''" />
              </div>

              <div class="flex *:text-3xl *:w-1/2 h-[4.5rem]">
                <!-- Sort Button -->
                <Button @click="showSort = true" class="rounded-none rounded-bl-xl border-0 border-r-2 border-white">
                  Sort
                  <div class="text-sm absolute bottom-0">
                    {{ sorting.active }}
                    <i v-if="sorting.descending" class="pi pi-chevron-down" />
                    <i v-else class="pi pi-chevron-up" />
                  </div>
                </Button>
                <!-- Filter Button -->
                <Button @click="showFilter = true" class="rounded-none rounded-br-xl border-0">
                  Filter
                  <div class="text-sm absolute bottom-0">
                    {{ numActiveFilters || 'no' }} filter{{ pl(numActiveFilters) }},
                    {{ filteredGames.length }}/{{ gamesArray.length }} games
                  </div>
                </Button>
              </div>
            </div>

            <!-- Sort Drawer -->
            <Drawer v-model:visible="showSort">
              <template #container="{ closeCallback }">
                <div class="flex flex-col h-full w-max ">
                  <div class="flex items-center justify-between px-6 pt-4 shrink-0 text-2xl">
                    Sort By
                    <span class="">
                      <Button type="button" @click="closeCallback" icon="pi pi-times" rounded outlined></Button>
                    </span>
                  </div>
                  <div v-for="property in sortProperties">
                    <Divider />
                    <GamesSort :sort="property" @clicked="scrollToTop(closeCallback)" />
                  </div>
                  <Divider />
                </div>
              </template>
            </Drawer>

            <!-- Filter Drawer -->
            <Drawer v-model:visible="showFilter" position="right" class="!w-3/4">
              <template #container="{ closeCallback }">
                <div class="flex flex-col h-full px-2">
                  <div class="flex items-center justify-between px-6 pt-4 shrink-0 text-2xl mb-4">
                    Filter
                    <span class="">
                      <Button type="button" @click="closeCallback" icon="pi pi-times" rounded outlined></Button>
                    </span>
                  </div>


                  <FilterVisualBar />
                  <GamesActiveFilters />
                  <Divider />
                  <div class="flex justify-center w-full items-center">
                    <SelectButton v-model="filterStyle" :options="filterStyleOptions" optionLabel="label"
                      dataKey="value" />
                  </div>

                  <Divider />
                  <FilterSimpleUI v-if="filterStyle.value == 'simple'" class="grow" />
                  <FilterAdvancedUI v-else class="grow" />
                  <Divider />

                  <div class="flex justify-center mb-12">
                    <Button id="btn-show-tags" label="Filter by Tags" severity="info" @click="showTags = true" />
                  </div>

                  <Dialog v-model:visible="showTags" modal dismissableMask header="Filter by Tags" class="h-3/4 mx-8">
                    <FilterTagList :tagList="tagsArray" />
                  </Dialog>


                </div>
              </template>
            </Drawer>

            <!-- <SelectButton v-model="showTable" :options="listStyleOptions" optionLabel="label" dataKey="value"
            :pt="{ root: 'absolute right-[8%] -top-[20px]' }">
            <template #option="slotProps">
              <i :class="slotProps.option.icon"></i>
            </template>
          </SelectButton> -->



            <!-- The Games List -->
            <div v-show="!filteredNoExpansions.length" class="flex mt-10 justify-center">
              <span>There are no games that fit the search criteria.</span>
            </div>
            <div v-show="filteredNoExpansions.length > 0" ref="gamesList">
              <!-- <Paginator :totalRecords="filteredGames.length" :rows="50"  v-model:first="firstGame"/> -->
              <ScrollTop />

              <div v-if="editingGames" class="m-2 p-2 bg-surface-800 flex justify-between items-baseline sticky top-0">
                <Button @click="selectAll(true)" :disabled="filteredGames.every(g => g.selected)" class="text-xs"
                  :label="`Select All${numActiveFilters ? ' (filtered)' : ''}`" />
                <Button @click="showSelectionMenu" :disabled="!selectedCount" severity="secondary" class="text-sm">
                  {{ selectedCount }} game{{ pl(selectedCount) }} selected
                  <span v-if="selectedButFilteredOut.length"
                    class="font-bold bg-slate-600 px-1 ml-1 rounded-sm text-white">(<span class="text-green-300">{{
                      selectedCount - selectedButFilteredOut.length }}</span>/<span class="text-yellow-400">{{
                        selectedButFilteredOut.length }}</span>)</span>
                </Button>
                <TieredMenu ref="selectedMenu" :model="selectedOptions" :popup="true" />
                <Button @click="selectAll(false)" :disabled="gamesArray.every(g => !g.selected)"
                  class="text-xs">Unselect
                  All</Button>
              </div>

              <!-- Show games as high density table -->
              <GamesTable v-if="showTable" />

              <!-- Show games as cards -->
              <TransitionGroup v-else name="fade">
                <GamesCard v-for="g in filteredNoExpansions" :key="g.bgg_game_id" :g="g"
                  @click="editingGames ? selectGame(g) : details.showDetails(g.bgg_game_id)" />
              </TransitionGroup>

              <!-- Show games that are selected but no longer pass the filter -->
              <div v-if="editingGames && selectedButFilteredOut.length" class="bg-slate-800 pt-2">
                <div class="flex relative justify-center align-center">
                  <div class="absolute border-b-4 w-full top-1/2 z-0" />
                  <div class="bg-red-950 w-1/2 border-2 z-10 p-2 flex flex-col justify-center items-center">
                    <div class="text-center">
                      The following {{ selectedButFilteredOut.length }} games are still selected but no longer pass the
                      current
                      filter criteria:
                    </div>
                    <Button size="small" label="unselect" severity="secondary"
                      @click="selectedButFilteredOut.forEach(g => { g.selected = false })" />
                  </div>
                </div>

                <TransitionGroup name="fade">
                  <GamesCard v-for="g in selectedButFilteredOut" :key="g.bgg_game_id" :g="g" class="warn-border"
                    @click="selectGame(g)" />
                  <!-- TODO: expansions need to be selectable -->
                </TransitionGroup>
              </div>

              <!-- Pick random game button -->
              <div class="flex justify-center mt-2">
                <Button v-if="filteredNoExpansions.length > 1" @click="details.randomGame()" class="">
                  <font-awesome-icon :icon="['fas', 'dice']" size="2xl" />
                  <span class="mx-2">Choose a random game</span>
                  <font-awesome-icon :icon="['fas', 'dice']" size="2xl" />
                </Button>
              </div>

              <!-- Game Details Dialog -->
              <GamesDetails v-if="hasGames" ref="details" />

            </div>
          </div>
        </div>
        <ProgressSpinner name="GamesNotReadyYet" v-else class="w-full" />
      </div>
      <ProgressSpinner name="UserNotReadyYet" v-else class="w-full" />

      <Dialog v-model:visible="collectionNameDialog" modal
        :header="makingNewCollection ? 'New Collection' : 'Rename Collection'" :style="{ width: '25rem' }">
        <div class="flex items-center gap-4 mb-4">
          <label for="username" class="font-semibold w-24">Name</label>
          <InputText v-model="collectionName" class="flex-auto" autocomplete="off" ref="cNameInput" />
        </div>
        <div class="flex justify-end gap-2">
          <Button type="button" label="Cancel" severity="secondary" @click="collectionNameDialog = false"></Button>
          <Button type="button" label="Save" @click="saveCollection" @keydown.enter="saveCollection"></Button>
        </div>
      </Dialog>


    </div>
  </div>
  <div v-else>
    <p>Loading...</p>
  </div>
</template>

<script setup>
// Imports
import { user, status, searchTerm, editingGames, clearAllSliders, sorting, currentCollection, filteredGames, filteredNoExpansions, tagsArray, selectedButFilteredOut, numActiveFilters } from '~/composables/useGames'
import { showingDetails } from '~/composables/useUI';
import { isMobile } from '~/composables/useMedia'
import { PrimeIcons } from '@primevue/core/api'
import { useShepherd } from 'vue-shepherd'
// import QrcodeVue from 'qrcode.vue'

// const value = ref('http://localhost:3000/user/colten-nye')
//   const level = ref('Q')
//   const renderAs = ref('svg')

// Page Meta
definePageMeta({
  path: ''
})

// Constants and Reactive References
const toast = useToast()
const tour = useShepherd({ useModalOverlay: true })
const route = useRoute()

// Component Refs
const cNameInput = ref(null)
const scrollTarget = ref(null)
const details = ref(null)
const selectedMenu = ref(null)
const gamesList = ref(null)

// Stuff
const collectionNameDialog = ref(false)
const collectionName = ref('')
const makingNewCollection = ref(false)
const showSort = ref(false)
const showFilter = ref(false)
const showTable = ref(false)
const showTags = ref(false)
const hideSticky = ref(false)

const sortProperties = [
  { value: 'name', name: 'Name', icon: 'arrow-down-a-z', descLabel: 'A..', ascLabel: 'Z..' },
  { value: 'rating', name: 'Rating', icon: 'star', descLabel: 'highest', ascLabel: 'lowest' },
  { value: 'complexity', name: 'Complexity', icon: 'brain', descLabel: 'heaviest', ascLabel: 'easiest' },
  { value: 'players', name: 'Players', icon: 'people-group', descLabel: 'most', ascLabel: 'fewest' },
  { value: 'playtime', name: 'Play time', icon: 'hourglass-half', descLabel: 'longest', ascLabel: 'shortest' },
  { value: 'age', name: 'Maturity', icon: 'person-cane', descLabel: 'NSFW', ascLabel: 'for kids' },
  { value: 'year', name: 'Publish Date', icon: 'calendar', descLabel: 'newest', ascLabel: 'oldest' }
]


const filterStyleOptions = ref([
  { label: 'Quick Find', value: 'simple', icon: PrimeIcons.SEARCH },
  { label: 'Advanced Search', value: 'advanced', icon: PrimeIcons.FILTER }
])
const filterStyle = ref(filterStyleOptions.value[1])

const listStyleOptions = ref([
  { label: 'Cards', value: false, icon: PrimeIcons.TH_LARGE },
  { label: 'Table', value: true, icon: PrimeIcons.ALIGN_JUSTIFY }
])

// Computed Properties
const hasGames = computed(() => gamesArray.value.length > 0)

const selectedCount = computed(() => gamesArray.value.filter(g => g.selected).length)

const selectedOptions = computed(() => {
  let items = Object.values(user.value.collections).filter(c => c.id !== currentCollection.value).map(c => ({
    label: c.collection_name,
    icon: PrimeIcons.FOLDER,
    command: () => {
      addSelectedToCollection(c.id)
      selectAll(false)
    }
  }))
  return [
    {
      label: 'Copy to', icon: PrimeIcons.COPY, items: [
        { label: 'New Collection', icon: PrimeIcons.PLUS, command: copyToNewCollection },
        ...items
      ]
    },
    {
      label: 'Remove from this Collection', icon: PrimeIcons.TRASH, command: () => {
        if (confirm(`Are you sure you want to remove these ${selectedCount.value} games from "${user.value.collections[currentCollection.value].collection_name}"?`)) {
          removeSelectedGames()
          selectAll(false)
        }
      }
    },
  ]
})

function copyToNewCollection() {
  showCollectionNameDialog(true)
  selectAll(false)
}

const collectionChoice = ref(currentCollection.value)
const collectionOptions = computed(() => {
  let ret = [...Object.values(user.value.collections)].map(c => {
    c.isDefault = c.id === user.value.default_collection_id
    return c
  })
  if (user.value.isSelf) {
    ret.unshift({ id: -1, collection_name: '+ New Collection' })
  }
  return ret
})

// Watchers
watch(filterStyle, () => {
  clearAllSliders()
})

watch(() => currentCollection.value, (cId) => {
  if (cId !== collectionChoice.value) {
    collectionChoice.value = cId
  }
})

watch(() => collectionChoice.value, (choice) => {
  if (choice === -1) {
    showCollectionNameDialog(true)
  } else {
    setCurrentCollection(choice)
  }
})

// Collection Management Functions
function showCollectionNameDialog(isNew = false) {
  makingNewCollection.value = isNew
  collectionName.value = isNew ? '' : user.value.collections[currentCollection.value].collection_name
  collectionNameDialog.value = true
  nextTick(() => cNameInput.value.focus())
}

function saveCollection() {
  if (makingNewCollection.value) {
    addCollection(collectionName.value)
  } else {
    editCollection(collectionName.value, currentCollection.value)
  }
  collectionNameDialog.value = false
}

async function makeDefaultCollection() {
  const res = (await $fetch('/api/collection/set-default', { method: 'get', params: { cId: currentCollection.value } }))
  user.value.default_collection_id = currentCollection.value
  toast.add({ severity: 'success', summary: `'${user.value.collections[currentCollection.value].collection_name}' is now your default collection`, life: 3000 })
}

async function confirmDelete() {
  if (confirm(`Are you sure you want to delete collection "${user.value.collections[currentCollection.value].collection_name}"?`)) {
    removeCollection(currentCollection.value)
  }
}

// Game Selection Functions
function selectGame(game) {
  game.selected = !game.selected
}

function selectAll(select) {
  if (select) {
    filteredGames.value.forEach(g => g.selected = true)
  } else {
    gamesArray.value.forEach(g => g.selected = false)
  }
}

function showSelectionMenu(event) {
  selectedMenu.value.toggle(event)
}

function toggleEditGames() {
  if (editingGames.value) {
    gamesArray.value.forEach(g => g.selected = false)
    editingGames.value = false
  } else {
    editingGames.value = true
  }
}

// Navigation and Scroll Functions
function goToAdd() {
  navigateTo(route.path.endsWith('/') ? `${route.path}add` : `${route.path}/add`)
}

const scrollToTop = (ccb) => {
  scrollTarget.value.scrollIntoView({ behavior: 'smooth' })
  hideSticky.value = true
  ccb()
}

// Swipe Detection Functions
let touchStartX
const swipeDistance = 120

const touchStart = (e) => {
  touchStartX = e.changedTouches[0].clientX
}

const touchEnd = (e) => {
  if (e.changedTouches[0].clientX - touchStartX > swipeDistance) {
    if (showingDetails.value) {
      details.value.nextGame(false)
    } else {
      showSort.value = true
      showFilter.value = false
    }
  } else if (touchStartX - e.changedTouches[0].clientX > swipeDistance) {
    if (showingDetails.value) {
      details.value.nextGame(true)
    } else {
      showFilter.value = true
      showSort.value = false
    }
  }
}

// Lifecycle Hooks
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('touchstart', touchStart, false)
  window.addEventListener('touchend', touchEnd, false)

  tour.addStep({
    attachTo: { element: gamesList.value, on: 'bottom' },
    text: 'This is the games list. You can sort and filter the games here.',
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('touchstart', touchStart)
  window.removeEventListener('touchend', touchEnd)
})

// Sticky Scroll Handling
let lastScrollTop, lastScrollBottom, lastScrollY
const hideDistance = 50, showDistance = 10
const handleScroll = () => {
  const st = window.scrollY || document.documentElement.scrollTop
  if (st - lastScrollY > 0) {
    lastScrollBottom = st
    if (st - lastScrollTop > hideDistance) {
      hideSticky.value = true
    }
  } else {
    lastScrollTop = st
    if (lastScrollBottom - st > showDistance) {
      hideSticky.value = false
    }
  }
  lastScrollY = st <= 0 ? 0 : st
}


  if (user.value.slug == route.params.slug) return // Don't fetch the same user twice

  const res = (await $fetch(`/api/user/${slug}`))

  // TODO: handle errors
  if (res.err_code) {
    // toast.add({ severity: 'error', summary: 'Error', detail: 'Could not find that user', life: 3000 })
    return
  }

  user.value = res
  status.value.userReady = true
  setCurrentCollection(route.query.c)

</script>

<style lang="scss" scoped>
.sticky-btns {
  position: sticky;
  top: -1px;
  z-index: 50;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

.hide {
  top: -5.5rem;
}

/* 1. declare transition */
.fade-move,
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

/* 2. declare enter from and leave to state */
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scaleY(0.01);
}

/* 3. ensure leaving items are taken out of layout flow so that moving
      animations can be calculated correctly. */
.fade-leave-active {
  position: absolute;
}

.btn-clear-txt.p-disabled {
  opacity: 1 !important;
  /* Make disabled button fully opaque */
  pointer-events: none;
  /* Ensure it still cannot be clicked */
}
</style>