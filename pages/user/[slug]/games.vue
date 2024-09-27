<template>

  <div v-if="status.userReady">
    <!-- Whose games are we seeing? -->
    <div class="flex bg-surface-700  rounded-tr-xl  rounded-tl-xl mt-1 p-2">
      <img :src="user.image" class="h-16 w-16 rounded-full mr-4" alt="avatar">
      <div>
        <span class="text-3xl">{{ user.name }}'s</span>
        <div>board games</div>
      </div>
      <div v-if="user.isSelf" class="absolute right-4">
        <div class="mr-4">
          <Button size="small" icon="pi pi-pencil" @click="editingGames = !editingGames" />
        </div>
        <div class="" :style="editingGames ? '' : 'visibility: hidden'">
          <Button size="small" icon="pi pi-plus" @click="goToAdd()" />
        </div>
      </div>
    </div>


    <div v-if="status.gamesReady">
      <span v-if="!hasGames">
        {{ user.isSelf ? "You have no games in your library yet" :
    user.name + " has no games in their library yet." }}
      </span>
      <div v-else>

        <!-- Sticky Stuff - Sort, Search, Filter -->
        <div ref="scrollTarget" />
        <div class="sticky-btns flex flex-col" :class="{ hide: hideSticky }">
          <!-- Search Bar -->
          <div class="flex">
            <IconField class="flex grow">
              <InputIcon class="pi pi-search" />
              <InputText class="grow rounded-none" v-model="searchTerm" placeholder="Find by name" />
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
                {{ filteredGames.length }}/{{ games.length }} games
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
                <SelectButton v-model="filterStyle" :options="filterStyleOptions" optionLabel="label" dataKey="value" />
              </div>

              <Divider />
              <FilterSimpleUI v-if="filterStyle.value == 'simple'" class="grow" />
              <FilterAdvancedUI v-else class="grow" />
              <Divider />

              <div class="flex justify-center mb-12">
                <Button id="btn-show-tags" label="Filter by Tags" severity="info" @click="showTags = true" />
              </div>

              <Dialog v-model:visible="showTags" modal dismissableMask header="Filter by Tags" class="h-3/4 mx-8">
                <FilterTagList :tagList="tags" />
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
        <div v-show="!filteredGames.length" class="flex mt-10 justify-center">
          <span>There are no games that fit the search criteria.</span>
        </div>
        <div v-show="filteredGames.length > 0" ref="gamesList">
          <!-- <Paginator :totalRecords="filteredGames.length" :rows="50"  v-model:first="firstGame"/> -->
          <ScrollTop />

          <!-- Show games as high density table -->
          <GamesTable v-if="showTable" />

          <!-- Show games as cards -->
          <TransitionGroup v-else name="fade">
            <div v-for="(g, idx) in filteredGames" :key="g.userGameId" @click="showDetails(idx)"
              class="bg-surface-800 text-white rounded-md flex p-2 h-40 m-1 pointer">
              <div class="w-2/5">
                <img class="m-auto h-full object-contain object-center" :src="g.thumbnail" alt="Game Thumbnail" />
              </div>
              <GamesCard :game="g" :sort="sorting.active" class="w-3/5" />
            </div>
          </TransitionGroup>

          <!-- Pick random game button -->
          <div class="flex justify-center mt-2">
            <Button v-if="filteredGames.length > 1" @click="randomGame" class="">
              <font-awesome-icon :icon="['fas', 'dice']" size="2xl" />
              <span class="mx-2">Choose a random game</span>
              <font-awesome-icon :icon="['fas', 'dice']" size="2xl" />
            </Button>
          </div>

          <!-- Game Details Dialog -->
          <GamesDetails ref="details" />

        </div>
      </div>
    </div>
    <ProgressSpinner name="GamesNotReadyYet" v-else class="w-full" />
  </div>
  <ProgressSpinner name="UserNotReadyYet" v-else class="w-full" />
</template>

<script setup>
import { user, status, searchTerm, editingGames, clearAllSliders, sorting } from '~/composables/useGames'
import { isMobile } from '~/composables/useMedia'
import { PrimeIcons } from '@primevue/core/api'
definePageMeta({
  path: ''
})

const firstGame = ref(0)

const showSort = ref(false)
const showFilter = ref(false)

const sortProperties = [
  { value: 'name', name: 'Name', icon: 'arrow-down-a-z', descLabel: 'A', ascLabel: 'Z' },
  { value: 'rating', name: 'Rating', icon: 'star', descLabel: 'highest', ascLabel: 'lowest' },
  { value: 'complexity', name: 'Complexity', icon: 'brain', descLabel: 'heaviest', ascLabel: 'easiest' },
  { value: 'players', name: 'Players', icon: 'people-group', descLabel: 'most', ascLabel: 'fewest' },
  { value: 'playtime', name: 'Play time', icon: 'hourglass-half', descLabel: 'longest', ascLabel: 'shortest' },
  { value: 'age', name: 'Age', icon: 'person-cane', descLabel: 'mature', ascLabel: 'young' },
  { value: 'year', name: 'Year', icon: 'calendar', descLabel: 'newest', ascLabel: 'oldest' }
]


const scrollTarget = ref(null)
const scrollToTop = (ccb) => {
  scrollTarget.value.scrollIntoView({ behavior: 'smooth' })
  hideSticky.value = true
  ccb()
}

const route = useRoute()
function goToAdd() {
  navigateTo(route.path.endsWith('/') ? `${route.path}add` : `${route.path}/add`)
}

const details = ref(null)
function showDetails(idx) {
  details.value.showDetails(idx)
}
function randomGame() {
  details.value.randomGame()
}


const filterStyleOptions = ref([
  { label: 'Quick Find', value: 'simple', icon: PrimeIcons.SEARCH },
  { label: 'Advanced Search', value: 'advanced', icon: PrimeIcons.FILTER }
])
const filterStyle = ref(filterStyleOptions.value[1])

const listStyleOptions = ref([
  { label: 'Cards', value: false, icon: PrimeIcons.TH_LARGE },
  { label: 'Table', value: true, icon: PrimeIcons.ALIGN_JUSTIFY }
])

const showTable = ref(false)

const hasGames = computed(() => {
  return user.value.games?.length > 0
})

const someSelected = computed(() => {
  return user.value.games?.some(g => g.selected)
})

watch(filterStyle, () => {
  clearAllSliders()
})


const showTags = ref(false)

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

const gamesList = ref(null)

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  window.addEventListener("touchstart", touchStart, false);
  window.addEventListener("touchend", touchEnd, false);

  //DEBUG
  showDetails(0)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener("touchstart", touchStart);
  window.removeEventListener("touchend", touchEnd);
})


// Detect swipe left / right
let touchStartX
const swipeDistance = 120
const touchStart = (e) => {
  touchStartX = e.changedTouches[0].clientX
}
const touchEnd = (e) => {
  if (e.changedTouches[0].clientX - touchStartX > swipeDistance) {
    // Swiped Right
    if (details.value.showingDetails) {
      details.value.nextGame(false)
    } else {
      if (!showFilter.value) {
        showSort.value = true
      }
      showFilter.value = false
    }
  } else if (touchStartX - e.changedTouches[0].clientX > swipeDistance) {
    // Swiped Left
    if (details.value.showingDetails) {
      details.value.nextGame(true)
    } else {
      if (!showSort.value) {
        showFilter.value = true
      }
      showSort.value = false
    }
  }
}

</script>

<style lang="scss" scoped>
.sticky-btns {
  position: sticky;
  top: 0;
  z-index: 50;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

.hide {
  top: -7rem;
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