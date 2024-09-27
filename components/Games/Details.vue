<template>
  <Dialog v-model:visible="showingDetails" modal dismissableMask class="m-4">
    <template #container="{ closeCallback }">
      <div class="bg-surface-100 text-black rounded-md !h-[85vh] relative -mb-2 "
        @scroll="onScroll">
        <span @click="closeCallback" class="float-btn top-3 right-1 ">
          <i class="pi pi-times text-xl" />
        </span>
        <span @click="nextGame(true)" class="float-btn top-1/3 right-1 ">
          <i class="pi pi-angle-right text-xl" />
        </span>
        <span @click="nextGame(false)" class="float-btn top-1/3 left-1 ">
          <i class="pi pi-angle-left text-xl" />
        </span>        
        <span @click="randomGame" class="float-btn top-1/4 right-1 ">
          <font-awesome-icon :icon="['fas', 'dice']"/>
        </span>
        <div  ref="scroller" class="m-8 overflow-y-scroll">
          <img v-show="!showFullImage" class="w-full h-full object-contain object-center mb-2" :src="_game.thumbnail"
            alt="Game Thumbnail" />
          <img v-show="showFullImage" @load="showFullImage = true"
            class="w-full h-auto object-contain object-center mb-2" :src="_game.image" alt="Game Thumbnail" />
          <GamesCard :game="_game" />
          <div class="text-sm p-3">
            {{ _game.description }}
          </div>
            <FilterTagList :tagList="_gameTags" />
        </div>
        <div class="sticky bottom-0">
          <div class="bg-transparent h-10 flex justify-center items-center backdrop-blur-sm" @click="scrollToBottom"
            :style="{ 'visibility': canScrollDown ? 'visible' : 'hidden' }">
            <i class="pi pi-angle-down text-xl" />
          </div>
          <a :href="getGameURL(_game.bgg_game_id)" target="_blank" rel="noopener noreferrer"
            class="flex justify-center items-center py-2 bg-[--bgg-bg-color] text-[--bgg-font-color] underline -mb-1  rounded-b-md">
            <img src="~/assets/icons/bgg-logo.svg" alt="bgg logo" class="self-start mx-2" @load="detailImgLoaded">
            View this game on BoardGameGeek.com
          </a>
        </div>
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import { filteredGames, tags } from '~/composables/useGames'

const showingDetails = ref(false)

const showFullImage = ref(false)

const _game = computed(() => {
  return filteredGames.value[gameIdx.value]
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

const gameIdx = ref(0)

const showDetails = (idx) => {
  gameIdx.value = idx
  showFullImage.value = false
  showingDetails.value = true
}


const randomGame = () => {
  showDetails(Math.floor(Math.random() * filteredGames.value.length))
}

const nextGame = (forward) => {
  let idx = gameIdx.value
  if (forward) {
    if (idx + 1 < filteredGames.value.length) {
      showDetails(idx+1)
    }
  } else {
    if(idx - 1 >= 0) {
      showDetails(idx-1)
    }
  }
}

defineExpose({
  showDetails,
  showingDetails,
  randomGame,
  nextGame
});


</script>

<style lang="scss" scoped>
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