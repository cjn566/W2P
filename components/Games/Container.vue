<template>
    <Button @click="filtering = !filtering">Toggle Filter</Button>
    <div v-if="filtering" id="filterFlexContainer">
        <div id="filterResultList" style="display:none">
            <p v-for="game in filteredGames">{{ game.name }}</p>
        </div>
        <div id="filters">
            <h2>Showing {{ filteredGames.length }} of {{ games.length }} games</h2>
            
            <Divider />
            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="resetFilters()" />
            <Divider />

            <FilterAdvancedUI />
            <FilterSimpleUI />
                        
            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="resetFilters()" />
        </div>
    </div>
    <GamesTable :display-games="filteredGames" />
</template>

<script setup>
import { games, filteredGames } from '~/composables/useGames'
import { faListSquares } from '@fortawesome/free-solid-svg-icons'
import Divider from 'primevue/divider'

const filtering = ref(true)





</script>

<style scoped >
.slider-thing {
    margin: 0 1rem;
}

.tag {
    margin: 1px;
}

.active {
    background-color: orange;
}

.grayed {
    background-color: gray;
}

#filterFlexContainer {
    display: flex;
    flex-direction: row;
}

#filterResultList {
    width: 40%;
    margin: 5px;
}

#filters {
    flex-shrink: 1;
}

.tag-scroller {
    height: 200px;
}
</style>

