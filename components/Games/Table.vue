
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
                <th scope="col" v-for="(value, key) in headers">{{ value.label }}</th>
            </tr>
        </thead>
        <tbody class="accordian">
            <GamesRow @click="rowClicked(game.id)" v-for="game in games" :game="game" />
        </tbody>
    </table>

    <pre>{{ games }}</pre>
</template>

<script setup>
const games = useState('games')

function rowClicked(gameId) {
    const openGame = games.value.find(game => game.expanded)
    if (openGame) {
        openGame.expanded = false
        if (openGame.id == gameId) return
    }
    games.value.find(game => game.id == gameId).expanded = true
}

const headers = {
    thumbnail: {
        label: '',
        sortable: false
    },
    name: {
        label: 'Game',
    },
    rank: {
        label: 'Rank',
        tooltip: 'Boardgame rank on Boardgamegeek.com'
    },
    rating: {
        label: 'Rating',
        tooltip: 'Rating, out of 10, on Boardgamegeek.com'
    },
    complexity: {
        label: 'Weight',
        tooltip: 'Complexity of the game, out of 5 (with 5 being the most complex)'
    },
    players: {
        label: 'Players',
        sortable: false,
    },
    playtime: {
        label: 'Time',
        sortable: false,
    },
    minage: {
        label: 'Age',
    },
    publishyear: {
        label: 'Year',
    }
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