<template>
       <div>
              <div id="sort-container">
                     <Button @click="sortBy('name')">Name</Button>
                     <Button @click="sortBy('rating')">Rating</Button>
                     <Button @click="sortBy('complexity')">Complexity</Button>
                     <Button @click="sortBy('players')">Players</Button>
                     <Button @click="sortBy('playtime')">Play time</Button>
                     <Button @click="sortBy('age')">Age</Button>
                     <Button @click="sortBy('year')">Year</Button>
              </div>
              <GamesCard v-for="g in filteredGames" :game="g" :sort="sorting.active" :key="g.userGameId" />
       </div>
</template>

<script setup>
import { filteredGames, sortBy, sorting } from '~/composables/useGames'


  // name
  // rating
  // complexity
  // players
  // playtime
  // age
  // year

</script>

<style lang="scss" scoped></style>