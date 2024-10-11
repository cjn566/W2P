<template>
  <transition name="modal">
    <div v-show="showingDetails" class="modal-overlay" @click.self="showingDetails = false">
      <div class="modal-content bg-surface-100 text-black rounded-md relative w-11/12 lg:w-2/3" @scroll="onScroll"
        @click.stop="" @touch.stop="">
        <span @click="showingDetails = false" class="float-btn top-3 right-1 ">
          <i class="pi pi-times text-xl" />
        </span>
        <span @click="nextGame(true)" class="float-btn top-1/3 right-1 ">
          <i class="pi pi-angle-right text-xl" />
        </span>
        <span @click="nextGame(false)" class="float-btn top-1/3 left-1 ">
          <i class="pi pi-angle-left text-xl" />
        </span>
        <span @click="randomGame" class="float-btn top-1/4 right-1 ">
          <font-awesome-icon :icon="['fas', 'dice']" />
        </span>
        <div ref="scroller" class="scroller m-8 pb-14 overflow-y-scroll lg:flex" @scroll="onScroll">
          <div class="w-full lg:h-full lg:items-center lg:w-1/3">
            <img v-show="!showFullImage" class="object-contain object-center" :src="_game.thumbnail"
              alt="Game Thumbnail" />
            <img v-show="showFullImage" @load="showFullImage = true" class="object-contain object-center"
              :src="_game.image" alt="Game Thumbnail" />
          </div>
          <div class="p-4 lg:basis-2/3">
            
        
            <GamesCard :game="_game" />
            <div class="text-sm p-3">
              {{ _game.description }}
            </div>
            <FilterTagList :tagList="_gameTags" />
          </div>
        </div>
        <div class="absolute bottom-0 left-0 z-20 w-full">
          <div class="bg-transparent h-10 flex justify-center items-center backdrop-blur-sm" @click="scrollToBottom"
            :style="{ 'visibility': canScrollDown ? 'visible' : 'hidden' }">
            <i class="pi pi-angle-down text-xl" />
          </div>
          <a :href="getGameURL(_game.bgg_game_id)" target="_blank" rel="noopener noreferrer"
            class="bgg-footer flex justify-center items-center bg-[--bgg-bg-color] text-[--bgg-font-color] text-sm underline rounded-b-md">
            <img src="~/assets/icons/bgg-logo.svg" alt="bgg logo" class=" mx-2" @load="detailImgLoaded">
            View this game on BoardGameGeek.com
          </a>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { filteredGames, tags } from '~/composables/useGames'
import { showingDetails } from '~/composables/useUI'

const showFullImage = ref(false)

const _game = computed(() => {
  let game = filteredGames.value.find(g => g.userGameId  == gameId.value)
  return game
})

const _gameTags = computed(() => {
  return tags.value.filter(t => _game.value.tags.hasOwnProperty(t.id))
})

const canScrollDown = ref(true)

function onScroll(e) {
  canScrollDown.value = (e.target.scrollTop + e.target.clientHeight < (e.target.scrollHeight - 10))
}

const scroller = ref(null)

function scrollToBottom() {
  scroller.value.scrollTo({
    top: scroller.value.scrollHeight,
    behavior: 'smooth'
  })
}

const gameId = ref(filteredGames.value[0].userGameId)

watch(() => gameId.value, (val) => {
  scroller.value.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
})


const showDetails = (id) => {
  gameId.value = id
  showFullImage.value = false
  showingDetails.value = true
}


const randomGame = () => {
  let newId
  do {
    newId = filteredGames.value[Math.floor(Math.random() * filteredGames.value.length)].userGameId
  } while (newId == gameId.value)
  showDetails(newId)
}

const nextGame = (forward) => {
  let gameIndex = filteredGames.value.findIndex(g => g.userGameId  == gameId.value)
  if (forward) {
    if (gameIndex + 1 < filteredGames.value.length) {
      showDetails(filteredGames.value[gameIndex + 1].userGameId)
    }
  } else {
    if (gameIndex - 1 >= 0) {
      showDetails(filteredGames.value[gameIndex - 1].userGameId)
    }
  }
}

defineExpose({
  showDetails,
  randomGame,
  nextGame
});


</script>

<style lang="scss" scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  /* Semi-transparent background */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  /* High z-index to ensure it's on top */
}

$content-full-height: 80vh;
$bgg-footer-height: 4rem;


.modal-content {
  height: $content-full-height;
}

.scroller {
  height: calc($content-full-height - $bgg-footer-height);
}

.bgg-footer {
  height: $bgg-footer-height;
}

.float-btn {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0.75rem;
  height: 3rem;
  width: 1.5rem;
  background-color: black;
  opacity: 60%;
  cursor: pointer;
  box-shadow: white 0 0 5px;
  color: white;
}
</style>