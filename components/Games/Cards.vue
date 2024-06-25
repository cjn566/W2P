<template>
       <div id="main-container" ref="scrollTarget">
              <div id="sort-container">
                     <GamesSortButton v-for="property in sortProperties" :sort="property.value" :label="property.name"
                            :icon="property.icon" @scroll="scroll" />
              </div>
              <div id="scrollTarget"></div>
              <GamesCard v-for="g in filteredGames" :game="g" :sort="sorting.active" :key="g.userGameId" />
       </div>
</template>

<script setup>
import { filteredGames, sorting } from '~/composables/useGames'
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

const scroll = () => {
       scrollTarget.value.scrollIntoView({ behavior: 'smooth' });
}


</script>

<style lang="scss" scoped>
#main-container {
       width: 100%;
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