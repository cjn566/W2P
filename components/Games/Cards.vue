<template>

       <TransitionGroup name="fade">
              <GamesCard v-for="g in filteredGames" :game="g" :sort="sorting.active" :key="g.userGameId"
                     @show-details="showDetails(g)" />
       </TransitionGroup>

       <Dialog v-model:visible="showingDetails" modal dismissableMask :header="_game.name" id="game-dialog">
              <template #container>
                     <div class="popup-container">
                            <GamesCard :game="_game" />
                            <div class="description">
                                   {{ _game.description }}
                            </div>
                            <FilterTagList :tagList="_gameTags" />
                     </div>
              </template>
       </Dialog>
</template>

<script setup>
import { filteredGames, sorting, tags } from '~/composables/useGames'

const _game = ref({})
const _gameTags = computed(() => {
       return tags.value.filter(t => _game.value.tags.hasOwnProperty(t.id))
})
const showingDetails = ref(false)
const showDetails = (game) => {
       _game.value = game
       showingDetails.value = true
}

</script>
<style lang="scss">

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




#game-dialog {
       max-width: 80%;
}

.popup-container {
       display: flex;
       flex-direction: column;
       align-items: center;
       gap: 1rem;
}

.description {
       width: 50%;
}

#sort-container {
       display: flex;
       flex-direction: row;
       flex-wrap: nowrap;
       justify-content: center;
       margin: 1rem;
       position: sticky;
       top: 0;
       z-index: 9;
       height: 4rem;
}
</style>