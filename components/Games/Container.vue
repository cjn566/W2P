<template>
    <Button @click="filtering = !filtering">
        <font-awesome-icon :icon="['fas', 'filter']" style="color: #ffffff;" size="2x" />
    </Button>
    <div v-if="filtering" id="filterFlexContainer">
        <div id="filterResultList" style="display:none">
            <p v-for="game in filteredGames">{{ game.name }}</p>
        </div>
        <div id="filters">
            <h2>Showing {{ filteredGames.length }} of {{ games.length }} games</h2>
            <FilterSimpleUI v-if="simple" />
            <FilterAdvancedUI v-else/>
        </div>
    </div>
    <GamesTable :display-games="filteredGames" />
</template>

<script setup>
import { games, filteredGames } from '~/composables/useGames'
import { faListSquares } from '@fortawesome/free-solid-svg-icons'
import Divider from 'primevue/divider'

const filtering = ref(true)
const simple = ref(true)





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

