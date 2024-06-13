<template>
       <div id="main-container">
              <div id="sort-container">
                     <GamesSortButton v-for="property in sortProperties" @click="console.log('yo')"
                            :sort="property.value" :label="property.name" />
              </div>
              <GamesCard v-for="g in filteredGames" :game="g" :sort="sorting.active" :key="g.userGameId" />
       </div>
</template>

<script setup>
import { filteredGames, sorting } from '~/composables/useGames'

const sortProperties = [
       { value: 'name', name: 'Name' },
       { value: 'rating', name: 'Rating' },
       { value: 'complexity', name: 'Complexity' },
       { value: 'players', name: 'Players' },
       { value: 'playtime', name: 'Play time' },
       { value: 'age', name: 'Age' },
       { value: 'year', name: 'Year' }
]

</script>

<style lang="scss" scoped>
#main-container {
       background-color: $w2p-pallette-4;
       border-radius: 0.6rem;
       padding: 0.5rem;
}

#sort-container {
       display: flex;
       flex-direction: row;
       flex-wrap: nowrap;
       justify-content: center;
       margin: 1rem;
}
</style>