
<!-- 
:filter="filter" 
:filter-function="filterGames" 
@filtered="onFilter"  
empty-filtered-text="There are no games to show."
-->

<template>
    <table class="table table-bordered table-striped">
        <thead>
            <tr>
                <th scope="col" v-for="(value, key) in headers" @click="">{{ value.label }}</th>
            </tr>
        </thead>
        <tbody class="accordian">
            <GamesRow @click="rowClicked(game.id)" v-for="game in displayGames" :game="game" />
        </tbody>
    </table>
</template>

<script setup>
const games = useState('games')
import headers from './headers'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import ColumnGroup from 'primevue/columngroup'   // optional
import Row from 'primevue/row'                   // optional

const displayGames = computed(()=>{
    return games.value.filter(g => !g.hide)
})

function rowClicked(gameId) {
    const openGame = games.value.find(game => game.expanded)
    if (openGame) {
        openGame.expanded = false
        if (openGame.id == gameId) return
    }
    games.value.find(game => game.id == gameId).expanded = true
}


</script>

<style scoped>
.table {
    font-size: xx-small;
    table-layout: fixed;
}

th {
    overflow: hidden;
    text-overflow: ellipsis;
    word-wrap: break-word;
}
</style>