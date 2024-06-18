<template>
       <div id="main-container" ref="scrollTarget">
              <div id="sort-container">
                     <GamesSortButton v-for="property in sortProperties"
                            :sort="property.value" :label="property.name" :icon="property.icon" @scroll="scroll"/>
              </div>
              <div id="scrollTarget"></div>
              <GamesCard v-for="g in filteredGames" :game="g" :sort="sorting.active" :key="g.userGameId" />
       </div>
</template>

<script setup>
import { filteredGames, sorting } from '~/composables/useGames'
const scrollTarget = ref(null)

const sortProperties = [
       { value: 'name', name: 'Name', icon: 'pi pi-sort-alpha-up'},
       { value: 'rating', name: 'Rating', icon: 'pi pi-star'},
       { value: 'complexity', name: 'Complexity', icon: 'pi pi-gear'},
       { value: 'players', name: 'Players', icon: 'pi pi-users'},
       { value: 'playtime', name: 'Play time', icon: 'pi pi-hourglass'},
       { value: 'age', name: 'Age', icon: 'pi pi-user'},
       { value: 'year', name: 'Year', icon: 'pi pi-calendar'}
]

const scroll = () => {
       scrollTarget.value.scrollIntoView({ behavior: 'smooth' });
}


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
       position: sticky;
       top: 0;
       z-index: 9;
}
</style>