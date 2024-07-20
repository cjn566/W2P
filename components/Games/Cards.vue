<template>
       <div id="cards-main-container" ref="scrollTarget">
              <div id="sort-container">
                     <GamesSortButton v-for="property in sortProperties" :sort="property.value" :label="property.name"
                            :icon="property.icon" @scroll="scroll" />
              </div>
              <div id="scrollTarget"></div>
              <GamesCard v-for="g in filteredGames" :game="g" :sort="sorting.active" :key="g.userGameId"
                     class="game-card-li" @show-details="showDetails(g)" />
       </div>

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
const scrollTarget = ref(null)
const sortProperties = [
       { value: 'name', name: 'Name', icon: 'arrow-down-a-z' },
       { value: 'rating', name: 'Rating', icon: 'star' },
       { value: 'complexity', name: 'Complexity', icon: 'brain' },
       { value: 'players', name: 'Players', icon: 'people-group' },
       { value: 'playtime', name: 'Play time', icon: 'hourglass-half' },
       { value: 'age', name: 'Age', icon: 'person-cane' },
       { value: 'year', name: 'Year', icon: 'calendar' }
]
const _game = ref({})
const _gameTags = computed(() => {
       return tags.value.filter(t => _game.value.tags.hasOwnProperty(t.id))
})
const showingDetails = ref(false)
const showDetails = (game) => {
       _game.value = game
       showingDetails.value = true
}

const scroll = () => {
       scrollTarget.value.scrollIntoView({ behavior: 'smooth' });
}
</script>
<style lang="scss">
#cards-main-container {
       width: 100%;
}

.game-card-li {
       margin: 0.5rem;
}

#game-dialog {
       max-width: 80%;
}

.popup-container {
       display: flex;
       flex-direction: column;
       align-items: center;
       gap: 1rem;
       background-color: $w2p-pallette-5;
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
}
</style>